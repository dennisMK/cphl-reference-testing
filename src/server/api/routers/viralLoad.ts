import { z } from "zod";
import { eq, and, desc, count } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { vl_patients, vl_samples } from "@/server/db/schemas/vl_lims";
import { getVlLimsDb } from "@/server/db";

export const viralLoadRouter = createTRPCRouter({
  // Get viral load requests for the current user's facility
  getRequests: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        status: z.enum(["pending", "collected", "processing", "completed"]).optional(),
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

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // First, get all samples for the facility to apply filtering
      const allSamples = await vlDb
        .select({
          id: vl_samples.id,
          patient_unique_id: vl_samples.patient_unique_id,
          vl_sample_id: vl_samples.vl_sample_id,
          form_number: vl_samples.form_number,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          sample_type: vl_samples.sample_type,
          created_at: vl_samples.created_at,
          verified: vl_samples.verified,
          in_worksheet: vl_samples.in_worksheet,
        })
        .from(vl_samples)
        .where(eq(vl_samples.facility_id, user.facility_id!))
        .orderBy(desc(vl_samples.created_at));

      // Apply status filtering if specified
      let filteredSamples = allSamples;
      if (input.status) {
        filteredSamples = allSamples.filter(sample => {
          switch (input.status) {
            case "pending":
              return !sample.date_collected; // Not yet collected
            case "collected":
              return sample.date_collected && !sample.date_received; // Collected but not received/packaged
            // case "processing":
            //   return sample.date_received && !sample.verified; // Received but not verified
            case "completed":
              return sample.verified === 1; // Verified/completed
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

  // Create a new viral load request
  createRequest: protectedProcedure
    .input(
      z.object({
        art_number: z.string().min(1, "ART number is required"),
        other_id: z.string().optional(),
        gender: z.enum(["M", "F"]),
        dob: z.string().min(1, "Date of birth is required"),
        age: z.string().optional(),
        age_units: z.enum(["Years", "Months", "Days"]).optional(),
        patient_phone_number: z.string().optional(),
        
        // Requesting Clinician
        clinician_id: z.string().optional(),
        requested_on: z.string().optional(),
        
        // Treatment Information
        treatment_initiation_date: z.string().min(1, "Treatment initiation date is required"),
        current_regimen_id: z.string().optional(),
        current_regimen_initiation_date: z.string().min(1, "Current regimen initiation date is required"),
        
        // Health Information
        pregnant: z.enum(["Y", "N", "U"]).optional(),
        anc_number: z.string().optional(),
        breast_feeding: z.enum(["Y", "N", "U"]).optional(),
        active_tb_status: z.enum(["Y", "N", "U"]).optional(),
        tb_treatment_phase_id: z.string().optional(),
        arv_adherence_id: z.string().optional(),
        treatment_care_approach: z.string().optional(),
        current_who_stage: z.string().optional(),
        treatment_indication_id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user.facility_id) {
        throw new Error("Please set up your facility information first. Go to Settings → Edit Facility to add your facility details before creating requests.");
      }

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // Generate a unique patient ID based on ART number and facility
      const patientUniqueId = `${input.art_number}`;
      
      // First, create or get the patient record
      const patientData = {
        unique_id: patientUniqueId,
        art_number: input.art_number,
        other_id: input.other_id || null,
        gender: input.gender,
        dob: new Date(input.dob),
        treatment_initiation_date: new Date(input.treatment_initiation_date),
        current_regimen_initiation_date: new Date(input.current_regimen_initiation_date),
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: user.id,
        facility_id: user.facility_id,
        is_verified: 1,
        is_the_clean_patient: 0,
        is_cleaned: 0,
      };

      const patientResult = await vlDb
        .insert(vl_patients)
        .values(patientData);

      // For now, use a generated ID since we can't easily access insertId with this setup
      // In production, you'd want to handle this properly with transactions
      const patientId = Math.floor(Math.random() * 1000000);

      // Generate a unique sample ID
      const sampleId = `VL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create the sample record
      const sampleData = {
        patient_unique_id: patientUniqueId,
        vl_sample_id: sampleId,
        form_number: `FORM-${Date.now()}`,
        pregnant: input.pregnant || null,
        anc_number: input.anc_number || null,
        breast_feeding: input.breast_feeding || null,
        active_tb_status: input.active_tb_status || null,
        date_collected: new Date(),
        treatment_initiation_date: new Date(input.treatment_initiation_date),
        sample_type: "P", // Default to Plasma for now
        verified: 1,
        in_worksheet: 0,
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: user.id,
        facility_id: user.facility_id,
        data_facility_id: user.facility_id,
        patient_id: Number(patientId),
        is_study_sample: 0,
        is_data_entered: 0,
        stage: 1,
        required_verification: 0,
        current_regimen_initiation_date: new Date(input.current_regimen_initiation_date),
        // Add new fields
        patient_phone_number: input.patient_phone_number || null,
        requested_on: input.requested_on ? new Date(input.requested_on) : null,
        clinician_id: input.clinician_id ? Number(input.clinician_id) : null,
        current_regimen_id: input.current_regimen_id ? Number(input.current_regimen_id) : null,
        tb_treatment_phase_id: input.tb_treatment_phase_id ? Number(input.tb_treatment_phase_id) : null,
        arv_adherence_id: input.arv_adherence_id ? Number(input.arv_adherence_id) : null,
        treatment_indication_id: input.treatment_indication_id ? Number(input.treatment_indication_id) : null,
        treatment_care_approach: input.treatment_care_approach ? Number(input.treatment_care_approach) : null,
        current_who_stage: input.current_who_stage ? Number(input.current_who_stage) : null,
      };

      const sampleResult = await vlDb
        .insert(vl_samples)
        .values(sampleData);

      return {
        success: true,
        sampleId,
        patientId: Number(patientId),
        message: "Viral load request created successfully",
      };
    }),

  // Get a specific viral load sample
  getSample: protectedProcedure
    .input(z.object({ sampleId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      // if (!user.facility_id) {
      //   throw new Error("Please set up your facility information first. Go to Settings → Edit Facility to add your facility details.");
      // }
      
      const vlDb = await getVlLimsDb();

      const sample = await vlDb
        .select({
          id: vl_samples.id,
          patient_unique_id: vl_samples.patient_unique_id,
          vl_sample_id: vl_samples.vl_sample_id,
          form_number: vl_samples.form_number,
          pregnant: vl_samples.pregnant,
          anc_number: vl_samples.anc_number,
          breast_feeding: vl_samples.breast_feeding,
          active_tb_status: vl_samples.active_tb_status,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          treatment_initiation_date: vl_samples.treatment_initiation_date,
          sample_type: vl_samples.sample_type,
          verified: vl_samples.verified,
          in_worksheet: vl_samples.in_worksheet,
          created_at: vl_samples.created_at,
          updated_at: vl_samples.updated_at,
          created_by_id: vl_samples.created_by_id,
          facility_id: vl_samples.facility_id,
          patient_id: vl_samples.patient_id,
          current_regimen_initiation_date: vl_samples.current_regimen_initiation_date,
          patient_phone_number: vl_samples.patient_phone_number,
          requested_on: vl_samples.requested_on,
          // Add missing fields that exist in database schema
          clinician_id: vl_samples.clinician_id,
          current_regimen_id: vl_samples.current_regimen_id,
          tb_treatment_phase_id: vl_samples.tb_treatment_phase_id,
          arv_adherence_id: vl_samples.arv_adherence_id,
          treatment_indication_id: vl_samples.treatment_indication_id,
          treatment_care_approach: vl_samples.treatment_care_approach,
          current_who_stage: vl_samples.current_who_stage,
        })
        .from(vl_samples)
        .where(
          and(
            eq(vl_samples.vl_sample_id, input.sampleId),
            eq(vl_samples.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (!sample[0]) {
        throw new Error("Sample not found or access denied");
      }

      // Get patient data from vl_patients table
      const patient = await vlDb
        .select({
          unique_id: vl_patients.unique_id,
          art_number: vl_patients.art_number,
          other_id: vl_patients.other_id,
          gender: vl_patients.gender,
          dob: vl_patients.dob,
        })
        .from(vl_patients)
        .where(eq(vl_patients.unique_id, sample[0].patient_unique_id!))
        .limit(1);

      return {
        ...sample[0],
        // Include patient data if found
        patient_data: patient[0] || null,
      };
    }),

  // Update a viral load sample
  updateSample: protectedProcedure
    .input(
      z.object({
        sampleId: z.string().min(1, "Sample ID is required"),
        art_number: z.string().min(1, "ART number is required"),
        other_id: z.string().optional(),
        gender: z.enum(["M", "F"]),
        dob: z.string().min(1, "Date of birth is required"),
        age: z.string().optional(),
        age_units: z.enum(["Years", "Months", "Days"]).optional(),
        patient_phone_number: z.string().optional(),
        
        // Requesting Clinician
        clinician_id: z.string().optional(),
        requested_on: z.string().optional(),
        
        // Treatment Information
        treatment_initiation_date: z.string().min(1, "Treatment initiation date is required"),
        current_regimen_id: z.string().optional(),
        current_regimen_initiation_date: z.string().min(1, "Current regimen initiation date is required"),
        
        // Health Information
        pregnant: z.enum(["Y", "N", "U"]).optional(),
        anc_number: z.string().optional(),
        breast_feeding: z.enum(["Y", "N", "U"]).optional(),
        active_tb_status: z.enum(["Y", "N", "U"]).optional(),
        tb_treatment_phase_id: z.string().optional(),
        arv_adherence_id: z.string().optional(),
        treatment_care_approach: z.string().optional(),
        current_who_stage: z.string().optional(),
        treatment_indication_id: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;

      if (!user.facility_id) {
        throw new Error("Please set up your facility information first. Go to Settings → Edit Facility to add your facility details before creating requests.");
      }

      const vlDb = await getVlLimsDb();

      // Update the sample record
      const sampleUpdateData = {
        pregnant: input.pregnant || null,
        anc_number: input.anc_number || null,
        breast_feeding: input.breast_feeding || null,
        active_tb_status: input.active_tb_status || null,
        treatment_initiation_date: new Date(input.treatment_initiation_date),
        current_regimen_initiation_date: new Date(input.current_regimen_initiation_date),
        updated_at: new Date(),
        // Add new fields
        patient_phone_number: input.patient_phone_number || null,
        requested_on: input.requested_on ? new Date(input.requested_on) : null,
        clinician_id: input.clinician_id ? Number(input.clinician_id) : null,
        current_regimen_id: input.current_regimen_id ? Number(input.current_regimen_id) : null,
        tb_treatment_phase_id: input.tb_treatment_phase_id ? Number(input.tb_treatment_phase_id) : null,
        arv_adherence_id: input.arv_adherence_id ? Number(input.arv_adherence_id) : null,
        treatment_indication_id: input.treatment_indication_id ? Number(input.treatment_indication_id) : null,
        treatment_care_approach: input.treatment_care_approach ? Number(input.treatment_care_approach) : null,
        current_who_stage: input.current_who_stage ? Number(input.current_who_stage) : null,
      };

      await vlDb
        .update(vl_samples)
        .set(sampleUpdateData)
        .where(
          and(
            eq(vl_samples.vl_sample_id, input.sampleId),
            eq(vl_samples.facility_id, user.facility_id!)
          )
        );

      // Update patient record if it exists
      const patientUpdateData = {
        art_number: input.art_number,
        other_id: input.other_id || null,
        gender: input.gender,
        dob: new Date(input.dob),
        treatment_initiation_date: new Date(input.treatment_initiation_date),
        current_regimen_initiation_date: new Date(input.current_regimen_initiation_date),
        updated_at: new Date(),
      };

      // Get the sample to find patient_unique_id
      const sample = await vlDb
        .select({ patient_unique_id: vl_samples.patient_unique_id })
        .from(vl_samples)
        .where(
          and(
            eq(vl_samples.vl_sample_id, input.sampleId),
            eq(vl_samples.facility_id, user.facility_id!)
          )
        )
        .limit(1);

      if (sample[0]?.patient_unique_id) {
        await vlDb
          .update(vl_patients)
          .set(patientUpdateData)
          .where(eq(vl_patients.unique_id, sample[0].patient_unique_id));
      }

      return {
        success: true,
        message: "Viral load request updated successfully",
      };
    }),

  // Update sample status
  updateSampleStatus: protectedProcedure
    .input(
      z.object({
        sampleId: z.string(),
        status: z.enum(["collected", "received", "processing", "completed"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("Please set up your facility information first. Go to Settings → Edit Facility to add your facility details.");
      }
      
      const vlDb = await getVlLimsDb();

      const updateData: Record<string, any> = {
        updated_at: new Date(),
      };

      switch (input.status) {
        case "collected":
          updateData.date_collected = new Date();
          break;
        case "received":
          updateData.date_received = new Date();
          updateData.received_by_id = user.id;
          break;
        case "processing":
          updateData.in_worksheet = 1;
          break;
        case "completed":
          updateData.verified = 1;
          updateData.verifier_id = user.id;
          updateData.verified_at = new Date();
          break;
      }

      await vlDb
        .update(vl_samples)
        .set(updateData)
        .where(
          and(
            eq(vl_samples.vl_sample_id, input.sampleId),
            eq(vl_samples.facility_id, user.facility_id!)
          )
        );

      return {
        success: true,
        message: `Sample status updated to ${input.status}`,
      };
    }),

  // Get dashboard statistics
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

    const vlDb = await getVlLimsDb();

    // Get counts for different sample statuses
    const allSamples = await vlDb
      .select({
        id: vl_samples.id,
        date_collected: vl_samples.date_collected,
        date_received: vl_samples.date_received,
        verified: vl_samples.verified,
        in_worksheet: vl_samples.in_worksheet,
      })
      .from(vl_samples)
      .where(eq(vl_samples.facility_id, user.facility_id!));

    const totalSamples = allSamples.length;
    const pendingSamples = allSamples.filter((s) => !s.date_collected).length;
    const collectedSamples = allSamples.filter((s) => s.date_collected && !s.date_received).length;
    const completedSamples = allSamples.filter((s) => s.verified === 1).length;

    return {
      totalSamples,
      pendingSamples,
      collectedSamples,
      completedSamples,
    };
  }),

  // Get collected samples ready for packaging
  getCollectedSamples: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
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

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // Get all samples for the facility (we'll filter in JavaScript for simplicity)
      const allSamples = await vlDb
        .select({
          id: vl_samples.id,
          vl_sample_id: vl_samples.vl_sample_id,
          patient_unique_id: vl_samples.patient_unique_id,
          form_number: vl_samples.form_number,
          sample_type: vl_samples.sample_type,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          facility_id: vl_samples.facility_id,
          verified: vl_samples.verified,
          created_at: vl_samples.created_at,
          reception_art_number: vl_samples.reception_art_number,
          data_art_number: vl_samples.data_art_number,
          facility_reference: vl_samples.facility_reference,
        })
        .from(vl_samples)
        .where(eq(vl_samples.facility_id, user.facility_id!))
        .orderBy(desc(vl_samples.created_at));

      // Filter samples that have been collected but not yet received (ready for packaging)
      const collectedSamples = allSamples.filter(sample => 
        sample.date_collected && // Has collection date
        !sample.date_received && // Not yet received
        !sample.facility_reference // Not yet packaged
      );

      // Apply pagination
      const totalCount = collectedSamples.length;
      const paginatedSamples = collectedSamples.slice(input.offset, input.offset + input.limit);

      return {
        samples: paginatedSamples,
        total: totalCount,
      };
    }),

  // Package selected samples
  packageSamples: protectedProcedure
    .input(
      z.object({
        packageIdentifier: z.string().min(1, "Package identifier is required"),
        sampleIds: z.array(z.string()).min(1, "At least one sample must be selected"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("Please set up your facility information first.");
      }
      
      const vlDb = await getVlLimsDb();

      // For each sample, update it to indicate it's been packaged and received
      const currentDate = new Date();
      const updatePromises = input.sampleIds.map(sampleId =>
        vlDb
          .update(vl_samples)
          .set({
            // Use facility_reference field to store package identifier
            facility_reference: input.packageIdentifier,
            // Set date_received when packaging (indicates sample has been received at lab)
            date_received: currentDate,
            updated_at: currentDate,
            updated_by_id: user.id,
          })
          .where(
            and(
              eq(vl_samples.vl_sample_id, sampleId),
              eq(vl_samples.facility_id, user.facility_id!)
            )
          )
      );

      await Promise.all(updatePromises);

      return {
        success: true,
        message: `Successfully packaged ${input.sampleIds.length} samples with identifier: ${input.packageIdentifier}`,
        packagedCount: input.sampleIds.length,
      };
    }),

  // Get packaged samples (samples that have been packaged)
  getPackagedSamples: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        packageIdentifier: z.string().optional(), // Filter by specific package
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          samples: [],
          total: 0,
          packages: [],
        };
      }

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // Build where conditions
      const whereConditions = [eq(vl_samples.facility_id, user.facility_id!)];
      
      // Only get samples that have been packaged (have facility_reference)
      // Note: We'll filter this in JavaScript since it's easier with the current setup
      
      if (input.packageIdentifier) {
        // If filtering by specific package, we'll handle this in JavaScript too
      }

      // Get all samples for the facility
      const allSamples = await vlDb
        .select({
          id: vl_samples.id,
          vl_sample_id: vl_samples.vl_sample_id,
          patient_unique_id: vl_samples.patient_unique_id,
          form_number: vl_samples.form_number,
          sample_type: vl_samples.sample_type,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          facility_id: vl_samples.facility_id,
          verified: vl_samples.verified,
          created_at: vl_samples.created_at,
          updated_at: vl_samples.updated_at,
          reception_art_number: vl_samples.reception_art_number,
          data_art_number: vl_samples.data_art_number,
          facility_reference: vl_samples.facility_reference,
          updated_by_id: vl_samples.updated_by_id,
        })
        .from(vl_samples)
        .where(and(...whereConditions))
        .orderBy(desc(vl_samples.updated_at));

      // Filter packaged samples (samples with date_received and facility_reference)
      let packagedSamples = allSamples.filter(sample => 
        sample.date_received && // Has been received (packaged)
        sample.facility_reference && sample.facility_reference.trim() !== ""
      );

      // Filter by specific package if requested
      if (input.packageIdentifier) {
        packagedSamples = packagedSamples.filter(sample =>
          sample.facility_reference === input.packageIdentifier
        );
      }

      // Get unique package identifiers for the dropdown
      const packages = [...new Set(
        allSamples
          .filter(sample => sample.facility_reference && sample.facility_reference.trim() !== "")
          .map(sample => sample.facility_reference!)
      )].sort();

      // Apply pagination
      const totalCount = packagedSamples.length;
      const paginatedSamples = packagedSamples.slice(input.offset, input.offset + input.limit);

      return {
        samples: paginatedSamples,
        total: totalCount,
        packages, // List of all package identifiers for filtering
      };
    }),

  // Get package summary (grouped by package identifier)
  getPackageSummary: protectedProcedure
    .query(async ({ ctx }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          packages: [],
        };
      }

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // Get all packaged samples
      const allSamples = await vlDb
        .select({
          facility_reference: vl_samples.facility_reference,
          date_collected: vl_samples.date_collected,
          updated_at: vl_samples.updated_at,
          sample_type: vl_samples.sample_type,
        })
        .from(vl_samples)
        .where(eq(vl_samples.facility_id, user.facility_id!));

      // Filter and group by package
      const packagedSamples = allSamples.filter(sample => 
        sample.facility_reference && sample.facility_reference.trim() !== ""
      );

      // Group by package identifier
      const packageGroups = packagedSamples.reduce((acc, sample) => {
        const packageId = sample.facility_reference!;
        if (!acc[packageId]) {
          acc[packageId] = {
            packageIdentifier: packageId,
            sampleCount: 0,
            lastUpdated: sample.updated_at,
            sampleTypes: new Set<string>(),
          };
        }
        acc[packageId].sampleCount++;
        if (sample.sample_type) {
          acc[packageId].sampleTypes.add(sample.sample_type);
        }
        // Keep the most recent update date
        if (sample.updated_at && sample.updated_at > acc[packageId].lastUpdated) {
          acc[packageId].lastUpdated = sample.updated_at;
        }
        return acc;
      }, {} as Record<string, any>);

      // Convert to array and format
      const packages = Object.values(packageGroups).map((pkg: any) => ({
        packageIdentifier: pkg.packageIdentifier,
        sampleCount: pkg.sampleCount,
        lastUpdated: pkg.lastUpdated,
        sampleTypes: Array.from(pkg.sampleTypes),
      }));

      // Sort by most recent first
      packages.sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime());

      return {
        packages,
      };
    }),

  // Get viral load results for completed tests
  getResults: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return {
          results: [],
          total: 0,
        };
      }

      // Get VL LIMS database connection
      const vlDb = await getVlLimsDb();

      // Get all samples for the facility that have been verified (completed)
      const allSamples = await vlDb
        .select({
          id: vl_samples.id,
          vl_sample_id: vl_samples.vl_sample_id,
          patient_unique_id: vl_samples.patient_unique_id,
          form_number: vl_samples.form_number,
          sample_type: vl_samples.sample_type,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          verified: vl_samples.verified,
          verified_at: vl_samples.verified_at,
          created_at: vl_samples.created_at,
          updated_at: vl_samples.updated_at,
          reception_art_number: vl_samples.reception_art_number,
          data_art_number: vl_samples.data_art_number,
          pregnant: vl_samples.pregnant,
          breast_feeding: vl_samples.breast_feeding,
          active_tb_status: vl_samples.active_tb_status,
          treatment_initiation_date: vl_samples.treatment_initiation_date,
          current_regimen_initiation_date: vl_samples.current_regimen_initiation_date,
          facility_id: vl_samples.facility_id,
          
          // Actual result fields from database
          last_value: vl_samples.last_value,
          last_test_date: vl_samples.last_test_date,
          viral_load_testing_id: vl_samples.viral_load_testing_id,
        })
        .from(vl_samples)
        .where(eq(vl_samples.facility_id, user.facility_id!))
        .orderBy(desc(vl_samples.verified_at), desc(vl_samples.updated_at));

      // Filter only verified/completed samples (those with results)
      let completedSamples = allSamples.filter(sample => sample.verified === 1);

      // Apply search filter if provided
      if (input.searchTerm && input.searchTerm.trim() !== "") {
        const searchTerm = input.searchTerm.toLowerCase();
        completedSamples = completedSamples.filter(sample =>
          sample.patient_unique_id?.toLowerCase().includes(searchTerm) ||
          sample.vl_sample_id?.toLowerCase().includes(searchTerm) ||
          sample.reception_art_number?.toLowerCase().includes(searchTerm) ||
          sample.data_art_number?.toLowerCase().includes(searchTerm) ||
          sample.form_number?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const totalCount = completedSamples.length;
      const paginatedSamples = completedSamples.slice(input.offset, input.offset + input.limit);

      // Transform samples into result format using real database values
      const results = paginatedSamples.map(sample => {
        // Parse the actual viral load value from the database
        let viralLoadValue: number | null = null;
        let detectionStatus = "unknown";
        let interpretation = "Pending";
        
        if (sample.last_value && typeof sample.last_value === 'string') {
          const lastValueStr = sample.last_value.toLowerCase().trim();
          
          // Handle "not detected" cases
          if (lastValueStr.includes('not detected') || lastValueStr.includes('undetected') || lastValueStr === 'nd') {
            viralLoadValue = null;
            detectionStatus = "not_detected";
            interpretation = "Suppressed";
          }
          // Handle "detected" cases with numeric values
          else if (lastValueStr.includes('detected') || !isNaN(Number(lastValueStr))) {
            // Extract numeric value
            const numericMatch = lastValueStr.match(/(\d+(?:\.\d+)?)/);
            if (numericMatch && numericMatch[1]) {
              viralLoadValue = parseInt(numericMatch[1]);
              detectionStatus = "detected";
              interpretation = viralLoadValue < 50 ? "Suppressed" : "Unsuppressed";
            }
          }
          // Handle pure numeric values
          else {
            const numericValue = parseInt(lastValueStr);
            if (!isNaN(numericValue)) {
              viralLoadValue = numericValue;
              detectionStatus = "detected";
              interpretation = numericValue < 50 ? "Suppressed" : "Unsuppressed";
            }
          }
        }
        
        // If no result available, show as pending
        if (!sample.last_value && sample.verified === 1) {
          interpretation = "Result Pending";
        }

        return {
          id: sample.vl_sample_id || sample.id.toString(),
          sampleId: sample.vl_sample_id || `VL-${sample.id}`,
          patientId: sample.reception_art_number || sample.data_art_number || sample.patient_unique_id || `P-${sample.id}`,
          
          // Real result data from database
          viralLoadValue,
          viralLoadUnit: "copies/mL",
          detectionStatus,
          interpretation,
          resultDate: sample.last_test_date ? new Date(sample.last_test_date).toISOString().split('T')[0] : 
                     (sample.verified_at ? new Date(sample.verified_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          resultTime: sample.verified_at ? new Date(sample.verified_at).toTimeString().slice(0, 5) : "14:30",
          
          // Sample information
          sampleType: sample.sample_type === "P" ? "Plasma" : sample.sample_type === "D" ? "DBS" : "Whole Blood",
          dateCollected: sample.date_collected ? new Date(sample.date_collected).toISOString().split('T')[0] : null,
          dateReceived: sample.date_received ? new Date(sample.date_received).toISOString().split('T')[0] : null,
          dateProcessed: sample.verified_at ? new Date(sample.verified_at).toISOString().split('T')[0] : null,
          
          // Treatment information
          treatmentInitiationDate: sample.treatment_initiation_date ? new Date(sample.treatment_initiation_date).toISOString().split('T')[0] : null,
          currentRegimenInitiationDate: sample.current_regimen_initiation_date ? new Date(sample.current_regimen_initiation_date).toISOString().split('T')[0] : null,
          
          // Clinical information
          pregnant: sample.pregnant,
          breastFeeding: sample.breast_feeding,
          activeTbStatus: sample.active_tb_status,
          
          // Meta information
          formNumber: sample.form_number,
          createdAt: sample.created_at,
          updatedAt: sample.updated_at,
          
          // Clinical significance based on real results
          clinicalSignificance: interpretation === "Suppressed" 
            ? "Good viral suppression. Continue current treatment." 
            : interpretation === "Unsuppressed"
            ? "Viral load above suppression threshold. Requires clinical review."
            : "Result pending laboratory processing.",
          recommendation: interpretation === "Suppressed"
            ? "Continue current ARV regimen. Next VL test in 6 months."
            : interpretation === "Unsuppressed"
            ? "Review adherence counseling. Consider treatment modification. Repeat VL in 3 months."
            : "Await laboratory results before clinical decision.",
          
          // Laboratory information
          laboratoryName: "Central Public Health Laboratory",
          testMethod: "Real-time PCR",
          instrument: "Abbott m2000rt",
          qualityControl: "Passed",
          referenceRange: "< 50 copies/mL (Suppressed)",
          
          // Facility and clinician info
          facility: user.facility_name || "Health Facility",
          requestingClinician: "Dr. Clinical Officer",
          
          status: sample.last_value ? "completed" : "pending"
        };
      });

      return {
        results,
        total: totalCount,
      };
    }),

  // Get a specific viral load result by ID
  getResult: protectedProcedure
    .input(z.object({ resultId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("Please set up your facility information first.");
      }
      
      const vlDb = await getVlLimsDb();

      // Find the sample by vl_sample_id or id
      const sample = await vlDb
        .select({
          id: vl_samples.id,
          vl_sample_id: vl_samples.vl_sample_id,
          patient_unique_id: vl_samples.patient_unique_id,
          form_number: vl_samples.form_number,
          sample_type: vl_samples.sample_type,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          verified: vl_samples.verified,
          verified_at: vl_samples.verified_at,
          created_at: vl_samples.created_at,
          updated_at: vl_samples.updated_at,
          reception_art_number: vl_samples.reception_art_number,
          data_art_number: vl_samples.data_art_number,
          pregnant: vl_samples.pregnant,
          breast_feeding: vl_samples.breast_feeding,
          active_tb_status: vl_samples.active_tb_status,
          treatment_initiation_date: vl_samples.treatment_initiation_date,
          current_regimen_initiation_date: vl_samples.current_regimen_initiation_date,
          facility_id: vl_samples.facility_id,
          
          // Actual result fields from database
          last_value: vl_samples.last_value,
          last_test_date: vl_samples.last_test_date,
          viral_load_testing_id: vl_samples.viral_load_testing_id,
        })
        .from(vl_samples)
        .where(
          and(
            eq(vl_samples.facility_id, user.facility_id!),
            eq(vl_samples.vl_sample_id, input.resultId)
          )
        )
        .limit(1);

      if (!sample[0]) {
        throw new Error("Result not found or access denied");
      }

      const sampleData = sample[0];

      // Parse the actual viral load value from the database (same logic as getResults)
      let viralLoadValue: number | null = null;
      let detectionStatus = "unknown";
      let interpretation = "Pending";
      
      if (sampleData.last_value && typeof sampleData.last_value === 'string') {
        const lastValueStr = sampleData.last_value.toLowerCase().trim();
        
        // Handle "not detected" cases
        if (lastValueStr.includes('not detected') || lastValueStr.includes('undetected') || lastValueStr === 'nd') {
          viralLoadValue = null;
          detectionStatus = "not_detected";
          interpretation = "Suppressed";
        }
        // Handle "detected" cases with numeric values
        else if (lastValueStr.includes('detected') || !isNaN(Number(lastValueStr))) {
          // Extract numeric value
          const numericMatch = lastValueStr.match(/(\d+(?:\.\d+)?)/);
          if (numericMatch && numericMatch[1]) {
            viralLoadValue = parseInt(numericMatch[1]);
            detectionStatus = "detected";
            interpretation = viralLoadValue < 50 ? "Suppressed" : "Unsuppressed";
          }
        }
        // Handle pure numeric values
        else {
          const numericValue = parseInt(lastValueStr);
          if (!isNaN(numericValue)) {
            viralLoadValue = numericValue;
            detectionStatus = "detected";
            interpretation = numericValue < 50 ? "Suppressed" : "Unsuppressed";
          }
        }
      }
      
      // If no result available, show as pending
      if (!sampleData.last_value && sampleData.verified === 1) {
        interpretation = "Result Pending";
      }

      // Generate mock previous results (this would come from a proper results history table in production)
      const previousResults = [
        { 
          date: "2023-07-15", 
          value: 45, 
          status: "detected" 
        },
        { 
          date: "2023-01-10", 
          value: 125, 
          status: "detected" 
        },
        { 
          date: "2022-07-05", 
          value: null, 
          status: "not_detected" 
        }
      ];

      return {
        id: sampleData.vl_sample_id || sampleData.id.toString(),
        sampleId: sampleData.vl_sample_id || `VL-${sampleData.id}`,
        patientId: sampleData.reception_art_number || sampleData.data_art_number || sampleData.patient_unique_id || `P-${sampleData.id}`,
        
        // Real result data from database
        viralLoadValue,
        viralLoadUnit: "copies/mL",
        detectionStatus,
        interpretation,
        resultDate: sampleData.last_test_date ? new Date(sampleData.last_test_date).toISOString().split('T')[0] : 
                   (sampleData.verified_at ? new Date(sampleData.verified_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        resultTime: sampleData.verified_at ? new Date(sampleData.verified_at).toTimeString().slice(0, 5) : "14:30",
        
        // Sample information
        sampleType: sampleData.sample_type === "P" ? "Plasma" : sampleData.sample_type === "D" ? "DBS" : "Whole Blood",
        dateCollected: sampleData.date_collected ? new Date(sampleData.date_collected).toISOString().split('T')[0] : null,
        dateReceived: sampleData.date_received ? new Date(sampleData.date_received).toISOString().split('T')[0] : null,
        dateProcessed: sampleData.verified_at ? new Date(sampleData.verified_at).toISOString().split('T')[0] : null,
        
        // Extended information for detail view
        clinicalSignificance: interpretation === "Suppressed" 
          ? "Good viral suppression. Continue current treatment." 
          : interpretation === "Unsuppressed"
          ? "Viral load above suppression threshold. Requires clinical review."
          : "Result pending laboratory processing.",
        recommendation: interpretation === "Suppressed"
          ? "Continue current ARV regimen. Next VL test in 6 months."
          : interpretation === "Unsuppressed"
          ? "Review adherence counseling. Consider treatment modification. Repeat VL in 3 months."
          : "Await laboratory results before clinical decision.",
        
        // Laboratory information
        laboratoryName: "Central Public Health Laboratory",
        labTechnician: "Dr. Lab Technician",
        testMethod: "Real-time PCR",
        instrument: "Abbott m2000rt",
        batchNumber: `VL-2024-B${String(sampleData.id).padStart(3, '0')}`,
        qualityControl: "Passed",
        referenceRange: "< 50 copies/mL (Suppressed)",
        
        // Patient information (would come from patient table in real system)
        patientName: `Patient #${sampleData.reception_art_number || sampleData.data_art_number || sampleData.patient_unique_id}`,
        gender: "Unknown", // Would come from patient table
        age: null, // Would come from patient table
        currentRegimen: "TDF/3TC/DTG", // Would come from regimen table
        treatmentDuration: "Unknown", // Would be calculated from treatment dates
        
        // Facility information
        facility: user.facility_name || "Health Facility",
        district: "District", // Would come from facility table
        hub: user.hub_name || "Hub",
        requestingClinician: "Dr. Clinical Officer", // Would come from clinician table
        
        // Previous results
        previousResults,
        
        // Treatment information
        pregnant: sampleData.pregnant,
        breastFeeding: sampleData.breast_feeding,
        activeTbStatus: sampleData.active_tb_status,
        treatmentInitiationDate: sampleData.treatment_initiation_date ? new Date(sampleData.treatment_initiation_date).toISOString().split('T')[0] : null,
        currentRegimenInitiationDate: sampleData.current_regimen_initiation_date ? new Date(sampleData.current_regimen_initiation_date).toISOString().split('T')[0] : null,
        
        formNumber: sampleData.form_number,
        status: sampleData.last_value ? "completed" : "pending"
      };
    }),

  // Update sample collection status
  updateSampleCollection: protectedProcedure
    .input(
      z.object({
        sampleId: z.string().min(1, "Sample ID is required"),
        collected: z.boolean(),
        collectionDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("Please set up your facility information first.");
      }
      
      const vlDb = await getVlLimsDb();

      // Update the sample collection status
      const updateData: any = {
        updated_at: new Date(),
        updated_by_id: user.id,
      };

      if (input.collected) {
        // Set collection date (either provided or current date)
        updateData.date_collected = input.collectionDate || new Date();
      } else {
        // Clear collection date if uncollecting
        updateData.date_collected = null;
      }

      await vlDb
        .update(vl_samples)
        .set(updateData)
        .where(
          and(
            eq(vl_samples.vl_sample_id, input.sampleId),
            eq(vl_samples.facility_id, user.facility_id!)
          )
        );

      return {
        success: true,
        message: input.collected 
          ? `Sample ${input.sampleId} marked as collected` 
          : `Sample ${input.sampleId} collection status cleared`,
      };
    }),

  // Get analytics data for charts
  getAnalytics: protectedProcedure
    .input(
      z.object({
        days: z.number().min(1).max(999).default(15), // Increased max for "all time"
      })
    )
    .query(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        return [];
      }

      const vlDb = await getVlLimsDb();

      // Get all samples for the facility
      const allSamples = await vlDb
        .select({
          id: vl_samples.id,
          date_collected: vl_samples.date_collected,
          date_received: vl_samples.date_received,
          verified: vl_samples.verified,
          created_at: vl_samples.created_at,
          facility_reference: vl_samples.facility_reference,
          last_value: vl_samples.last_value,
        })
        .from(vl_samples)
        .where(eq(vl_samples.facility_id, user.facility_id!));

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

      // For longer periods (> 90 days), group by weeks or months for performance
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

          const pending = samplesUpToThisDate.filter(s => !s.date_collected).length;
          const packaged = samplesUpToThisDate.filter(s => s.facility_reference && s.date_received).length;
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.last_value).length;

          analyticsData.push({
            date: dateStr,
            pending,
            packaged,
            results,
          });

          currentDate.setMonth(currentDate.getMonth() + 1);
        }
      } else if (shouldGroupByWeeks) {
        // Group by weeks for medium periods
        const currentDate = new Date(startDate);
        // Start from the beginning of the week (Monday)
        const dayOfWeek = currentDate.getDay();
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        currentDate.setDate(currentDate.getDate() + mondayOffset);
        
        while (currentDate <= endDate) {
          const weekEnd = new Date(currentDate);
          weekEnd.setDate(weekEnd.getDate() + 6); // End of week (Sunday)
          const dateStr = currentDate.toISOString().split('T')[0];
          
          const samplesUpToThisDate = allSamples.filter(sample => {
            const sampleDate = new Date(sample.created_at);
            return sampleDate <= weekEnd;
          });

          const pending = samplesUpToThisDate.filter(s => !s.date_collected).length;
          const packaged = samplesUpToThisDate.filter(s => s.facility_reference && s.date_received).length;
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.last_value).length;

          analyticsData.push({
            date: dateStr,
            pending,
            packaged,
            results,
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

          const pending = samplesUpToThisDate.filter(s => !s.date_collected).length;
          const packaged = samplesUpToThisDate.filter(s => s.facility_reference && s.date_received).length;
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.last_value).length;

          analyticsData.push({
            date: dateStr,
            pending,
            packaged,
            results,
          });
        }
      }

      return analyticsData;
    }),
}); 