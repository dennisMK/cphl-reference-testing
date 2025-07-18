import { z } from "zod";
import { eq, and, desc, count, like, or, isNull, isNotNull } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { batches, dbs_samples } from "@/server/db/schemas/eid";
import { getEidDb } from "@/server/db";

// Input validation schemas
const createEIDRequestSchema = z.object({
  // Requesting clinician
  infant_entryPoint: z.string().optional(),
  senders_name: z.string().min(1, "Requested by is required"),
  senders_telephone: z.string().min(1, "Telephone number is required"),
  
  // Infant information
  infant_name: z.string().min(1, "Infant name is required"),
  infant_exp_id: z.string().min(1, "EXP No is required"),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).default("NOT_RECORDED"),
  infant_age: z.string().min(1, "Age is required"),
  infant_age_units: z.enum(["months", "days", "weeks", "years"]),
  infant_contact_phone: z.string().optional(),
  given_contri: z.enum(["BLANK", "Y", "N"]).default("BLANK"),
  delivered_at_hc: z.enum(["BLANK", "Y", "N"]).default("BLANK"),
  infant_arvs: z.string().optional(),
  env_num1: z.string().optional(),
  
  // Other section
  infant_feeding: z.string().min(1, "Infant feeding is required"),
  test_type: z.enum(["P", "S", "B"]).optional(),
  pcr: z.enum(["UNKNOWN", "FIRST", "SECOND", "THIRD"]).default("UNKNOWN"),
  non_routine: z.enum(["NONE", "R1", "R2", "R3"]).optional(),
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  mother_antenatal_prophylaxis: z.string().optional(),
  mother_delivery_prophylaxis: z.string().optional(),
  mother_postnatal_prophylaxis: z.string().optional(),
  
  // Hidden SCD fields
  sample_type: z.enum(["DBS", "Whole blood"]).optional(),
  first_symptom_age: z.enum(["BLANK", "1", "2"]).optional(),
  diagnosis_age: z.enum(["BLANK", "1", "2"]).optional(),
  test_reason: z.string().optional(),
  fam_history: z.string().optional(),
  screening_program: z.string().optional(),
});

const updateEIDRequestSchema = z.object({
  id: z.number(),
  // Patient information
  infant_name: z.string().optional(),
  infant_exp_id: z.string().optional(),
  infant_gender: z.enum(["MALE", "FEMALE", "NOT_RECORDED"]).optional(),
  infant_age: z.string().optional(),
  infant_age_units: z.string().optional(),
  infant_contact_phone: z.string().optional(),
  given_contri: z.enum(["BLANK", "Y", "N"]).optional(),
  delivered_at_hc: z.enum(["BLANK", "Y", "N"]).optional(),

  // Other section
  infant_feeding: z.string().optional(),
  test_type: z.enum(["P", "S", "B"]).optional(),
  pcr: z.enum(["FIRST", "SECOND", "THIRD", "NON_ROUTINE", "UNKNOWN"]).optional(),
  non_routine: z.enum(["NONE", "R1", "R2", "R3"]).optional(),
  mother_htsnr: z.string().optional(),
  mother_artnr: z.string().optional(),
  mother_nin: z.string().optional(),
  mother_antenatal_prophylaxis: z.string().optional(),
  mother_delivery_prophylaxis: z.string().optional(),
  mother_postnatal_prophylaxis: z.string().optional(),

  // Hidden SCD fields that exist in database
  first_symptom_age: z.enum(["BLANK", "1", "2"]).optional(),
  diagnosis_age: z.enum(["BLANK", "1", "2"]).optional(),
  test_reason: z.string().optional(),
  fam_history: z.string().optional(),
  screening_program: z.string().optional(),

  // Legacy fields for backward compatibility
  infant_dob: z.string().optional(),
  infant_is_breast_feeding: z.enum(["YES", "NO", "UNKNOWN"]).optional(),
  date_dbs_taken: z.string().optional(),
  testing_completed: z.enum(["YES", "NO"]).optional(),
  accepted_result: z.enum(["POSITIVE", "NEGATIVE", "INVALID", "SAMPLE_WAS_REJECTED"]).optional(),
  PCR_test_requested: z.enum(["YES", "NO"]).optional(),
  SCD_test_requested: z.enum(["YES", "NO"]).optional(),
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

    return {
      totalSamples,
      pendingSamples,
      collectedSamples,
    };
  }),

  // Get analytics data for charts
  getAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(999).default(15),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return [];
      }

      const eidDb = await getEidDb();

      // Get all samples for the facility
      const allSamples = await eidDb
        .select({
          id: dbs_samples.id,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          date_rcvd_by_cphl: batches.date_rcvd_by_cphl,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          created_at: dbs_samples.created_at,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(eq(batches.facility_id, user.facility_id!));

      // Handle "All Time" - find the earliest sample date
      let startDate: Date;
      const endDate = new Date();
      
      if (input.days >= 999) {
        // "All Time" - find earliest sample
        const earliestSample = allSamples.reduce((earliest, sample) => {
          const sampleDate = new Date(sample.created_at);
          return !earliest || sampleDate < earliest ? sampleDate : earliest;
        }, null as Date | null);
        
        if (earliestSample) {
          startDate = new Date(earliestSample);
        } else {
          // No samples, default to 30 days ago
          startDate = new Date();
          startDate.setDate(endDate.getDate() - 30);
        }
      } else {
        // Regular time range
        startDate = new Date();
        startDate.setDate(endDate.getDate() - input.days + 1);
      }

      const analyticsData = [];

      // For longer periods, group by weeks or months for performance
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const shouldGroupByWeeks = totalDays > 90;
      const shouldGroupByMonths = totalDays > 365;

      if (shouldGroupByMonths) {
        // Group by months for very long periods
        const currentDate = new Date(startDate);
        currentDate.setDate(1); // Start of month
        
        while (currentDate <= endDate) {
          const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
          const dateStr = currentDate.toISOString().split('T')[0];
          
          const samplesUpToThisDate = allSamples.filter(sample => {
            const sampleDate = new Date(sample.created_at);
            return sampleDate <= monthEnd;
          });

          const pending = samplesUpToThisDate.filter(s => !s.date_dbs_taken).length;
          const collected = samplesUpToThisDate.filter(s => s.date_dbs_taken).length;

          analyticsData.push({
            date: dateStr,
            pending,
            collected,
          });

          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      } else if (shouldGroupByWeeks) {
        // Group by weeks for medium periods
        const currentDate = new Date(startDate);
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentDate.setDate(currentDate.getDate() + mondayOffset);
        
        while (currentDate <= endDate) {
          const weekEnd = new Date(currentDate);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const dateStr = currentDate.toISOString().split('T')[0];
          
          const samplesUpToThisDate = allSamples.filter(sample => {
            const sampleDate = new Date(sample.created_at);
            return sampleDate <= weekEnd;
          });

          const pending = samplesUpToThisDate.filter(s => !s.date_dbs_taken).length;
          const collected = samplesUpToThisDate.filter(s => s.date_dbs_taken).length;

          analyticsData.push({
            date: dateStr,
            pending,
            collected,
          });

          currentDate.setDate(currentDate.getDate() + 7);
        }
      } else {
        // Daily data for short periods (≤ 90 days)
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          const currentDate = new Date(d);
          const dateStr = currentDate.toISOString().split('T')[0];
          
          const samplesUpToThisDate = allSamples.filter(sample => {
            const sampleDate = new Date(sample.created_at);
            return sampleDate <= currentDate;
          });

          const pending = samplesUpToThisDate.filter(s => !s.date_dbs_taken).length;
          const collected = samplesUpToThisDate.filter(s => s.date_dbs_taken).length;

          analyticsData.push({
            date: dateStr,
            pending,
            collected,
          });
        }
      }

      return analyticsData;
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

      // Build where conditions
      const whereConditions = [eq(batches.facility_id, user.facility_id!)];
      
      if (input.search) {
        const searchCondition = or(
          like(dbs_samples.infant_name, `%${input.search}%`),
          like(dbs_samples.infant_exp_id, `%${input.search}%`),
          like(dbs_samples.mother_htsnr, `%${input.search}%`),
          like(dbs_samples.mother_artnr, `%${input.search}%`)
        );
        if (searchCondition) {
          whereConditions.push(searchCondition);
        }
      }

      // Build query with combined conditions
      const query = eidDb
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
        .where(whereConditions.length > 1 ? and(...whereConditions) : whereConditions[0]);

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
          infant_entryPoint: dbs_samples.infant_entryPoint,
          infant_contact_phone: dbs_samples.infant_contact_phone,
          given_contri: dbs_samples.given_contri,
          delivered_at_hc: dbs_samples.delivered_at_hc,
          infant_feeding: dbs_samples.infant_feeding,
          mother_htsnr: dbs_samples.mother_htsnr,
          mother_artnr: dbs_samples.mother_artnr,
          mother_nin: dbs_samples.mother_nin,
          mother_antenatal_prophylaxis: dbs_samples.mother_antenatal_prophylaxis,
          mother_delivery_prophylaxis: dbs_samples.mother_delivery_prophylaxis,
          mother_postnatal_prophylaxis: dbs_samples.mother_postnatal_prophylaxis,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          created_at: dbs_samples.created_at,
          updated_at: dbs_samples.updated_at,
          batch_id: dbs_samples.batch_id,
          pcr: dbs_samples.pcr,
          non_routine: dbs_samples.non_routine,
          test_type: dbs_samples.test_type,
          PCR_test_requested: dbs_samples.PCR_test_requested,
          SCD_test_requested: dbs_samples.SCD_test_requested,
          first_symptom_age: dbs_samples.first_symptom_age,
          diagnosis_age: dbs_samples.diagnosis_age,
          test_reason: dbs_samples.test_reason,
          fam_history: dbs_samples.fam_history,
          screening_program: dbs_samples.screening_program,
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
          const newBatchResult = await eidDb.insert(batches).values({
            facility_id: user.facility_id!,
            facility_name: user.facility_name || "Unknown Facility",
            facility_district: (user as any).facility_district || "Unknown District",
            entered_by: user.id,
            senders_name: input.senders_name,
            senders_telephone: input.senders_telephone,
            senders_comments: "EID batch created via electronic system",
            results_return_address: user.facility_name || "Facility Address",
            results_transport_method: "COLLECTED_FROM_LAB",
            tests_requested: input.test_type === "S" ? "SCD" : (input.test_type === "B" ? "BOTH_PCR_AND_SCD" : "PCR"),
            requesting_unit: "EID Unit",
            // Set required date fields
            date_entered_in_DB: new Date().toISOString().split('T')[0],
            is_single_form: 0,
          });
          
          // Get the inserted batch ID properly
          const insertedBatch = await eidDb
            .select({ id: batches.id })
            .from(batches)
            .where(eq(batches.entered_by, user.id))
            .orderBy(desc(batches.id))
            .limit(1);
          
          if (!insertedBatch[0]) {
            throw new Error("Failed to create batch");
          }
          
          batchId = insertedBatch[0].id;
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
          is_single_form: 0,
          infant_name: input.infant_name,
          infant_exp_id: input.infant_exp_id,
          infant_gender: input.infant_gender || "NOT_RECORDED",
          infant_age: input.infant_age,
          infant_age_units: input.infant_age_units,
          infant_entryPoint: input.infant_entryPoint ? parseInt(input.infant_entryPoint) : null,
          infant_contact_phone: input.infant_contact_phone || null,
          given_contri: input.given_contri || "BLANK",
          delivered_at_hc: input.delivered_at_hc || "BLANK",
          infant_feeding: input.infant_feeding,
          mother_htsnr: input.mother_htsnr || null,
          mother_artnr: input.mother_artnr || null,
          mother_nin: input.mother_nin || null,
          test_type: input.test_type || null,
          pcr: input.pcr || "UNKNOWN",
          non_routine: input.non_routine === "NONE" ? null : input.non_routine,
          mother_antenatal_prophylaxis: input.mother_antenatal_prophylaxis ? parseInt(input.mother_antenatal_prophylaxis) : null,
          mother_delivery_prophylaxis: input.mother_delivery_prophylaxis ? parseInt(input.mother_delivery_prophylaxis) : null,
          mother_postnatal_prophylaxis: input.mother_postnatal_prophylaxis ? parseInt(input.mother_postnatal_prophylaxis) : null,
          // Determine test requests based on test_type
          PCR_test_requested: (input.test_type === "P" || input.test_type === "B") ? "YES" : "NO",
          SCD_test_requested: (input.test_type === "S" || input.test_type === "B") ? "YES" : "NO",
          // Set the required date field to today instead of the default
          date_data_entered: new Date().toISOString().split('T')[0],
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
      
      // Patient information
      if (input.infant_name !== undefined) updateData.infant_name = input.infant_name;
      if (input.infant_exp_id !== undefined) updateData.infant_exp_id = input.infant_exp_id;
      if (input.infant_gender !== undefined) updateData.infant_gender = input.infant_gender;
      if (input.infant_age !== undefined) updateData.infant_age = input.infant_age;
      if (input.infant_age_units !== undefined) updateData.infant_age_units = input.infant_age_units;
      if (input.infant_contact_phone !== undefined) updateData.infant_contact_phone = input.infant_contact_phone;
      if (input.given_contri !== undefined) updateData.given_contri = input.given_contri;
      if (input.delivered_at_hc !== undefined) updateData.delivered_at_hc = input.delivered_at_hc;

      // Other section
      if (input.infant_feeding !== undefined) updateData.infant_feeding = input.infant_feeding;
      if (input.test_type !== undefined) updateData.test_type = input.test_type;
      if (input.pcr !== undefined) updateData.pcr = input.pcr;
      if (input.non_routine !== undefined) updateData.non_routine = input.non_routine === "NONE" ? null : input.non_routine;
      if (input.mother_htsnr !== undefined) updateData.mother_htsnr = input.mother_htsnr;
      if (input.mother_artnr !== undefined) updateData.mother_artnr = input.mother_artnr;
      if (input.mother_nin !== undefined) updateData.mother_nin = input.mother_nin;
      if (input.mother_antenatal_prophylaxis !== undefined) updateData.mother_antenatal_prophylaxis = input.mother_antenatal_prophylaxis ? parseInt(input.mother_antenatal_prophylaxis) : null;
      if (input.mother_delivery_prophylaxis !== undefined) updateData.mother_delivery_prophylaxis = input.mother_delivery_prophylaxis ? parseInt(input.mother_delivery_prophylaxis) : null;
      if (input.mother_postnatal_prophylaxis !== undefined) updateData.mother_postnatal_prophylaxis = input.mother_postnatal_prophylaxis ? parseInt(input.mother_postnatal_prophylaxis) : null;

      // Hidden SCD fields
      if (input.first_symptom_age !== undefined) updateData.first_symptom_age = input.first_symptom_age;
      if (input.diagnosis_age !== undefined) updateData.diagnosis_age = input.diagnosis_age;
      if (input.test_reason !== undefined) updateData.test_reason = input.test_reason;
      if (input.fam_history !== undefined) updateData.fam_history = input.fam_history;
      if (input.screening_program !== undefined) updateData.screening_program = input.screening_program;

      // Legacy fields for backward compatibility
      if (input.infant_dob !== undefined) updateData.infant_dob = input.infant_dob ? new Date(input.infant_dob) : null;
      if (input.infant_is_breast_feeding !== undefined) updateData.infant_is_breast_feeding = input.infant_is_breast_feeding;
      if (input.date_dbs_taken !== undefined) updateData.date_dbs_taken = input.date_dbs_taken ? new Date(input.date_dbs_taken) : null;
      if (input.testing_completed !== undefined) updateData.testing_completed = input.testing_completed;
      if (input.accepted_result !== undefined) updateData.accepted_result = input.accepted_result;
      if (input.PCR_test_requested !== undefined) updateData.PCR_test_requested = input.PCR_test_requested;
      if (input.SCD_test_requested !== undefined) updateData.SCD_test_requested = input.SCD_test_requested;

      // Update test requests based on test_type if provided
      if (input.test_type !== undefined) {
        updateData.PCR_test_requested = (input.test_type === "P" || input.test_type === "B") ? "YES" : "NO";
        updateData.SCD_test_requested = (input.test_type === "S" || input.test_type === "B") ? "YES" : "NO";
      }

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

  // Collect a sample (mark as collected)
  collectSample: protectedProcedure
    .input(z.object({ 
      id: z.number(),
      date_dbs_taken: z.string().optional(),
      barcode_number: z.string().optional(),
      requested_by: z.string().optional(),
      dispatch_date: z.string().optional(),
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

      // Prepare update data
      const updateData: any = {
        date_dbs_taken: input.date_dbs_taken ? new Date(input.date_dbs_taken) : new Date(),
      };

      // Add barcode number to infant_exp_id if provided
      if (input.barcode_number) {
        updateData.infant_exp_id = input.barcode_number;
      }

      // Mark sample as collected with additional information
      await eidDb
        .update(dbs_samples)
        .set(updateData)
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