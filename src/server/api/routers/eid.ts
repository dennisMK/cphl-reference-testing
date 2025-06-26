import { z } from "zod";
import { eq, and, desc, count, like, or, isNull, isNotNull } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { batches, dbs_samples } from "@/server/db/schemas/eid";
import { getEidDb } from "@/server/db";

// Input validation schemas
const createEIDRequestSchema = z.object({
  // Infant information
  infant_name: z.string().min(1, "Infant name is required"),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).default("NOT_RECORDED"),
  infant_age: z.string().optional(),
  infant_age_units: z.string().optional(),
  infant_dob: z.string().optional(),
  infant_is_breast_feeding: z.enum(["YES", "NO", "UNKNOWN"]).default("UNKNOWN"),
  infant_contact_phone: z.string().optional(),
  infant_feeding: z.string().optional(),
  
  // Mother information
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  
  // Test information
  test_type: z.string().optional(),
  pcr: z.enum(["FIRST", "SECOND", "NON_ROUTINE", "UNKNOWN", "THIRD"]).default("FIRST"),
  PCR_test_requested: z.enum(["NO", "YES"]).default("YES"),
  SCD_test_requested: z.enum(["NO", "YES"]).default("NO"),
  
  // Batch/facility information will be auto-filled from user context
});

const updateEIDRequestSchema = z.object({
  id: z.number(),
  infant_name: z.string().optional(),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).optional(),
  infant_age: z.string().optional(),
  infant_age_units: z.string().optional(),
  infant_dob: z.string().optional(),
  infant_is_breast_feeding: z.enum(["YES", "NO", "UNKNOWN"]).optional(),
  date_dbs_taken: z.string().optional(),
  testing_completed: z.enum(["YES", "NO"]).optional(),
  accepted_result: z.enum(["POSITIVE", "NEGATIVE", "INVALID", "SAMPLE_WAS_REJECTED"]).optional(),
});

export const eidRouter = createTRPCRouter({
  // Get EID dashboard statistics
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;

    if (!user.facility_id) {
      return {
        totalSamples: 0,
        pendingSamples: 0,
        collectedSamples: 0,
        completedSamples: 0,
      };
    }

    const eidDb = await getEidDb();

    // Get counts for different sample statuses
    const allSamples = await eidDb
      .select({
        id: dbs_samples.id,
        date_dbs_taken: dbs_samples.date_dbs_taken,
        date_rcvd_by_cphl: batches.date_rcvd_by_cphl,
        testing_completed: dbs_samples.testing_completed,
        accepted_result: dbs_samples.accepted_result,
        batch_id: dbs_samples.batch_id,
      })
      .from(dbs_samples)
      .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
      .where(eq(batches.facility_id, user.facility_id!));

    const totalSamples = allSamples.length;
    const pendingSamples = allSamples.filter((s) => !s.date_dbs_taken).length;
    const collectedSamples = allSamples.filter((s) => s.date_dbs_taken && !s.date_rcvd_by_cphl).length;
    const completedSamples = allSamples.filter((s) => s.testing_completed === "YES" && s.accepted_result).length;

    return {
      totalSamples,
      pendingSamples,
      collectedSamples,
      completedSamples,
    };
  }),

  // Get EID requests for the current user's facility
  getRequests: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        status: z.enum(["pending", "collected", "processing", "completed"]).optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          samples: [],
          total: 0,
        };
      }

      // Get EID database connection
      const eidDb = await getEidDb();

      // Build base query
      let query = eidDb
        .select({
          id: dbs_samples.id,
          infant_name: dbs_samples.infant_name,
          infant_exp_id: dbs_samples.infant_exp_id,
          infant_gender: dbs_samples.infant_gender,
          infant_age: dbs_samples.infant_age,
          infant_age_units: dbs_samples.infant_age_units,
          infant_dob: dbs_samples.infant_dob,
          infant_is_breast_feeding: dbs_samples.infant_is_breast_feeding,
          infant_contact_phone: dbs_samples.infant_contact_phone,
          mother_htsnr: dbs_samples.mother_htsnr,
          mother_artnr: dbs_samples.mother_artnr,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          created_at: dbs_samples.created_at,
          batch_id: dbs_samples.batch_id,
          pcr: dbs_samples.pcr,
          test_type: dbs_samples.test_type,
          // Batch information
          date_rcvd_by_cphl: batches.date_rcvd_by_cphl,
          facility_name: batches.facility_name,
          facility_district: batches.facility_district,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(eq(batches.facility_id, user.facility_id!));

      // Apply search filter if provided
      if (input.search) {
        query = query.where(
          or(
            like(dbs_samples.infant_name, `%${input.search}%`),
            like(dbs_samples.infant_exp_id, `%${input.search}%`),
            like(dbs_samples.mother_htsnr, `%${input.search}%`),
            like(dbs_samples.mother_artnr, `%${input.search}%`)
          )
        );
      }

      // Get all matching samples
      const allSamples = await query.orderBy(desc(dbs_samples.created_at));

      // Apply status filtering if specified
      let filteredSamples = allSamples;
      if (input.status) {
        filteredSamples = allSamples.filter(sample => {
          switch (input.status) {
            case "pending":
              return !sample.date_dbs_taken; // Not yet collected
            case "collected":
              return sample.date_dbs_taken && !sample.date_rcvd_by_cphl; // Collected but not received
            case "processing":
              return sample.date_rcvd_by_cphl && sample.testing_completed === "NO"; // Received but not completed
            case "completed":
              return sample.testing_completed === "YES"; // Testing completed
            default:
              return true;
          }
        });
      }

      // Apply pagination
      const totalCount = filteredSamples.length;
      const paginatedSamples = filteredSamples.slice(input.offset, input.offset + input.limit);

      return {
        samples: paginatedSamples,
        total: totalCount,
      };
    }),

  // Get a single EID request by ID
  getRequest: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("User facility not found");
      }

      const eidDb = await getEidDb();

      const sample = await eidDb
        .select({
          id: dbs_samples.id,
          infant_name: dbs_samples.infant_name,
          infant_exp_id: dbs_samples.infant_exp_id,
          infant_gender: dbs_samples.infant_gender,
          infant_age: dbs_samples.infant_age,
          infant_age_units: dbs_samples.infant_age_units,
          infant_dob: dbs_samples.infant_dob,
          infant_is_breast_feeding: dbs_samples.infant_is_breast_feeding,
          infant_contact_phone: dbs_samples.infant_contact_phone,
          mother_htsnr: dbs_samples.mother_htsnr,
          mother_artnr: dbs_samples.mother_artnr,
          mother_nin: dbs_samples.mother_nin,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          created_at: dbs_samples.created_at,
          updated_at: dbs_samples.updated_at,
          batch_id: dbs_samples.batch_id,
          pcr: dbs_samples.pcr,
          test_type: dbs_samples.test_type,
          PCR_test_requested: dbs_samples.PCR_test_requested,
          SCD_test_requested: dbs_samples.SCD_test_requested,
          // Batch information
          date_rcvd_by_cphl: batches.date_rcvd_by_cphl,
          facility_name: batches.facility_name,
          facility_district: batches.facility_district,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(dbs_samples.id, input.id),
            eq(batches.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (!sample[0]) {
        throw new Error("EID request not found");
      }

      return sample[0];
    }),

  // Create a new EID request
  createRequest: protectedProcedure
    .input(createEIDRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("User facility not found");
      }

      const eidDb = await getEidDb();

      try {
        // First, we need to create or get a batch for this facility
        const batch = await eidDb
          .select()
          .from(batches)
          .where(
            and(
              eq(batches.facility_id, user.facility_id!),
              isNull(batches.date_dispatched_from_facility) // Not yet dispatched
            )
          )
          .limit(1);

        let batchId: number;

        if (!batch[0]) {
          // Create a new batch with all required fields
          const newBatch = await eidDb.insert(batches).values({
            facility_id: user.facility_id!,
            facility_name: user.facility_name || "Unknown Facility",
            facility_district: (user as any).facility_district || "Unknown District",
            entered_by: user.id,
            senders_name: user.name || user.username || "Unknown",
            senders_telephone: (user as any).phone || "",
            senders_comments: "EID batch created via electronic system",
            results_return_address: user.facility_name || "Facility Address",
            results_transport_method: "COLLECTED_FROM_LAB",
            tests_requested: input.SCD_test_requested === "YES" ? "BOTH_PCR_AND_SCD" : "PCR",
            requesting_unit: "EID Unit",
            // Set required date fields
            date_entered_in_DB: new Date(),
          });
          batchId = (newBatch as any).insertId;
        } else {
          batchId = batch[0].id;
        }

        // Get the next position in batch
        const samplesInBatch = await eidDb
          .select({ count: count() })
          .from(dbs_samples)
          .where(eq(dbs_samples.batch_id, batchId));

        const nextPosition = (samplesInBatch[0]?.count || 0) + 1;

        // Ensure position is within valid range (tinyint is 0-255)
        if (nextPosition > 255) {
          throw new Error("Batch is full. Please contact administrator.");
        }

        // Create the EID sample with all required fields
        const result = await eidDb.insert(dbs_samples).values({
          batch_id: batchId,
          pos_in_batch: nextPosition,
          infant_name: input.infant_name,
          infant_gender: input.infant_gender || "NOT_RECORDED",
          infant_age: input.infant_age || null,
          infant_age_units: input.infant_age_units || null,
          infant_dob: input.infant_dob ? new Date(input.infant_dob) : null,
          infant_is_breast_feeding: input.infant_is_breast_feeding || "UNKNOWN",
          infant_contact_phone: input.infant_contact_phone || null,
          infant_feeding: input.infant_feeding || null,
          mother_htsnr: input.mother_htsnr || null,
          mother_artnr: input.mother_artnr || null,
          mother_nin: input.mother_nin || null,
          test_type: input.test_type || null,
          pcr: input.pcr || "UNKNOWN",
          PCR_test_requested: input.PCR_test_requested || "YES",
          SCD_test_requested: input.SCD_test_requested || "NO",
          // Set the required date field to today instead of the default
          date_data_entered: new Date(),
        });

        return {
          id: (result as any).insertId,
          batchId,
          message: "EID request created successfully",
        };
      } catch (error: any) {
        console.error("Error creating EID request:", error);
        
        // Handle specific database errors
        if (error.message?.includes("batch_id")) {
          throw new Error("Failed to create batch. Please try again.");
        }
        if (error.message?.includes("facility_id")) {
          throw new Error("Invalid facility. Please contact administrator.");
        }
        if (error.message?.includes("doesn't have a default value")) {
          throw new Error("Missing required field. Please check all form data.");
        }
        
        throw new Error(error.message || "Failed to create EID request");
      }
    }),

  // Update an EID request
  updateRequest: protectedProcedure
    .input(updateEIDRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("User facility not found");
      }

      const eidDb = await getEidDb();

      // Verify the request belongs to this facility
      const existingSample = await eidDb
        .select({ id: dbs_samples.id })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(dbs_samples.id, input.id),
            eq(batches.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (!existingSample[0]) {
        throw new Error("EID request not found or access denied");
      }

      // Prepare update data
      const updateData: any = {};
      
      if (input.infant_name !== undefined) updateData.infant_name = input.infant_name;
      if (input.infant_gender !== undefined) updateData.infant_gender = input.infant_gender;
      if (input.infant_age !== undefined) updateData.infant_age = input.infant_age;
      if (input.infant_age_units !== undefined) updateData.infant_age_units = input.infant_age_units;
      if (input.infant_dob !== undefined) updateData.infant_dob = input.infant_dob ? new Date(input.infant_dob) : null;
      if (input.infant_is_breast_feeding !== undefined) updateData.infant_is_breast_feeding = input.infant_is_breast_feeding;
      if (input.date_dbs_taken !== undefined) updateData.date_dbs_taken = input.date_dbs_taken ? new Date(input.date_dbs_taken) : null;
      if (input.testing_completed !== undefined) updateData.testing_completed = input.testing_completed;
      if (input.accepted_result !== undefined) updateData.accepted_result = input.accepted_result;

      // Update the sample
      await eidDb
        .update(dbs_samples)
        .set(updateData)
        .where(eq(dbs_samples.id, input.id));

      return {
        id: input.id,
        message: "EID request updated successfully",
      };
    }),

  // Collect sample (mark as collected)
  collectSample: protectedProcedure
    .input(z.object({ 
      id: z.number(),
      date_dbs_taken: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("User facility not found");
      }

      const eidDb = await getEidDb();

      // Verify the request belongs to this facility
      const existingSample = await eidDb
        .select({ id: dbs_samples.id })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(dbs_samples.id, input.id),
            eq(batches.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (!existingSample[0]) {
        throw new Error("EID request not found or access denied");
      }

      // Mark sample as collected
      await eidDb
        .update(dbs_samples)
        .set({
          date_dbs_taken: input.date_dbs_taken ? new Date(input.date_dbs_taken) : new Date(),
        })
        .where(eq(dbs_samples.id, input.id));

      return {
        id: input.id,
        message: "Sample collected successfully",
      };
    }),

  // Delete an EID request
  deleteRequest: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("User facility not found");
      }

      const eidDb = await getEidDb();

      // Verify the request belongs to this facility and hasn't been processed
      const existingSample = await eidDb
        .select({ 
          id: dbs_samples.id,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          testing_completed: dbs_samples.testing_completed,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(dbs_samples.id, input.id),
            eq(batches.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (!existingSample[0]) {
        throw new Error("EID request not found or access denied");
      }

      // Prevent deletion if sample has been collected or tested
      if (existingSample[0].date_dbs_taken || existingSample[0].testing_completed === "YES") {
        throw new Error("Cannot delete EID request that has been collected or tested");
      }

      // Delete the sample
      await eidDb
        .delete(dbs_samples)
        .where(eq(dbs_samples.id, input.id));

      return {
        id: input.id,
        message: "EID request deleted successfully",
      };
    }),

  // Get pending collections (samples ready for collection)
  getPendingCollections: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          samples: [],
          total: 0,
        };
      }

      const eidDb = await getEidDb();

      // Get samples that need collection (no collection date)
      const allSamples = await eidDb
        .select({
          id: dbs_samples.id,
          infant_name: dbs_samples.infant_name,
          infant_exp_id: dbs_samples.infant_exp_id,
          infant_gender: dbs_samples.infant_gender,
          infant_age: dbs_samples.infant_age,
          infant_age_units: dbs_samples.infant_age_units,
          mother_htsnr: dbs_samples.mother_htsnr,
          mother_artnr: dbs_samples.mother_artnr,
          pcr: dbs_samples.pcr,
          test_type: dbs_samples.test_type,
          created_at: dbs_samples.created_at,
          facility_name: batches.facility_name,
          facility_district: batches.facility_district,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(batches.facility_id, user.facility_id!),
            isNull(dbs_samples.date_dbs_taken) // Not yet collected
          )
        )
        .orderBy(desc(dbs_samples.created_at));

      // Apply pagination
      const totalCount = allSamples.length;
      const paginatedSamples = allSamples.slice(input.offset, input.offset + input.limit);

      return {
        samples: paginatedSamples,
        total: totalCount,
      };
    }),

  // Get results (completed tests)
  getResults: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          samples: [],
          total: 0,
        };
      }

      const eidDb = await getEidDb();

      // Get samples with completed testing
      const allSamples = await eidDb
        .select({
          id: dbs_samples.id,
          infant_name: dbs_samples.infant_name,
          infant_exp_id: dbs_samples.infant_exp_id,
          infant_gender: dbs_samples.infant_gender,
          infant_age: dbs_samples.infant_age,
          mother_htsnr: dbs_samples.mother_htsnr,
          mother_artnr: dbs_samples.mother_artnr,
          pcr: dbs_samples.pcr,
          test_type: dbs_samples.test_type,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          date_dbs_tested: dbs_samples.date_dbs_tested,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          SCD_test_result: dbs_samples.SCD_test_result,
          created_at: dbs_samples.created_at,
          facility_name: batches.facility_name,
          facility_district: batches.facility_district,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(
          and(
            eq(batches.facility_id, user.facility_id!),
            eq(dbs_samples.testing_completed, "YES") // Testing completed
          )
        )
        .orderBy(desc(dbs_samples.date_dbs_tested));

      // Apply pagination
      const totalCount = allSamples.length;
      const paginatedSamples = allSamples.slice(input.offset, input.offset + input.limit);

      return {
        samples: paginatedSamples,
        total: totalCount,
      };
    }),
}); 