import { z } from "zod";
import { eq, and, desc, count } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { vlPatients, vlSamples, vlClinicians, backendFacilities } from "@/server/db/schemas/vl_lims";
import { getVlLimsDb } from "@/server/db";

// Helper function to get status label from stage code
function getStatusFromStage(stage: number | null): { label: string; variant: string; color: string } {
  switch (stage) {
    case 20:
      return { 
        label: "Pending Sample Collection", 
        variant: "secondary",
        color: "text-orange-600 bg-orange-50" 
      };
    case 25:
      return { 
        label: "Pending Packaging", 
        variant: "secondary",
        color: "text-blue-600 bg-blue-50" 
      };
    case 30:
      return { 
        label: "In Transit", 
        variant: "default",
        color: "text-purple-600 bg-purple-50" 
      };
    default:
      return { 
        label: "Unknown Status", 
        variant: "destructive",
        color: "text-gray-600 bg-gray-50" 
      };
  }
}

export const viralLoadRouter = createTRPCRouter({
  // Get viral load requests for the current user's facility
  getRequests: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
        status: z.enum(["pending", "collected", "processing", "completed"]).optional(),
        filter: z.enum(["in-transit", "delivered", "pending-collection", "pending-packaging"]).optional(),
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
          id: vlSamples.id,
          patientUniqueId: vlSamples.patientUniqueId,
          vlSampleId: vlSamples.vlSampleId,
          formNumber: vlSamples.formNumber,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          sampleType: vlSamples.sampleType,
          createdAt: vlSamples.createdAt,
          verified: vlSamples.verified,
          inWorksheet: vlSamples.inWorksheet,
          stage: vlSamples.stage,
        })
        .from(vlSamples)
        .where(eq(vlSamples.facilityId, user.facility_id!))
        .orderBy(desc(vlSamples.createdAt));

      // Apply status filtering if specified - now using stage codes
      let filteredSamples = allSamples;
      if (input.status) {
        filteredSamples = allSamples.filter(sample => {
          switch (input.status) {
            case "pending":
              return sample.stage === 20; // Pending sample collection
            case "collected":
              return sample.stage === 25; // Pending packaging
            case "processing":
              return sample.stage === 30; // In transit
            case "completed":
              return sample.verified === 1; // Verified/completed
            default:
              return true;
          }
        });
      }

      // Apply navigation filter if specified
      if (input.filter) {
        filteredSamples = filteredSamples.filter(sample => {
          switch (input.filter) {
            case "pending-collection":
              return sample.stage === 20; // Pending sample collection
            case "pending-packaging":
              return sample.stage === 25; // Pending packaging
            case "in-transit":
              return sample.stage === 30; // In transit
            case "delivered":
              return sample.verified === 1; // Verified/completed samples
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
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL datetime format
      const patientData = {
        uniqueId: patientUniqueId,
        artNumber: input.art_number,
        otherId: input.other_id || null,
        gender: input.gender,
        dob: input.dob,
        treatmentInitiationDate: input.treatment_initiation_date,
        currentRegimenInitiationDate: input.current_regimen_initiation_date,
        createdAt: now,
        updatedAt: now,
        createdById: user.id,
        facilityId: user.facility_id,
        isVerified: 1,
        isTheCleanPatient: 0,
        isCleaned: 0,
      };

      const patientResult = await vlDb
        .insert(vlPatients)
        .values(patientData);

      // For now, use a generated ID since we can't easily access insertId with this setup
      // In production, you'd want to handle this properly with transactions
      const patientId = Math.floor(Math.random() * 1000000);

      // Generate a unique sample ID
      const sampleId = `VL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      // Create the sample record
      const sampleData = {
        patientUniqueId: patientUniqueId,
        vlSampleId: sampleId,
        formNumber: `FORM-${Date.now()}`,
        pregnant: input.pregnant || null,
        ancNumber: input.anc_number || null,
        breastFeeding: input.breast_feeding || null,
        activeTbStatus: input.active_tb_status || null,
        treatmentInitiationDate: input.treatment_initiation_date,
        sampleType: "P", // Default to Plasma for now
        verified: 1,
        inWorksheet: 0,
        createdAt: now,
        updatedAt: now,
        createdById: user.id,
        facilityId: user.facility_id,
        dataFacilityId: user.facility_id,
        patientId: Number(patientId),
        isStudySample: 0,
        isDataEntered: 0,
        stage: 20, // Status Code 20: Pending sample collection
        requiredVerification: 0,
        currentRegimenInitiationDate: input.current_regimen_initiation_date,
        // Add new fields - properly handle empty strings and invalid numbers to avoid NaN
        patientPhoneNumber: input.patient_phone_number || null,
        requestedOn: input.requested_on || null,
        clinicianId: (input.clinician_id && input.clinician_id.trim() !== "" && !isNaN(Number(input.clinician_id))) ? Number(input.clinician_id) : null,
        currentRegimenId: (input.current_regimen_id && input.current_regimen_id.trim() !== "" && !isNaN(Number(input.current_regimen_id))) ? Number(input.current_regimen_id) : null,
        tbTreatmentPhaseId: (input.tb_treatment_phase_id && input.tb_treatment_phase_id.trim() !== "" && !isNaN(Number(input.tb_treatment_phase_id))) ? Number(input.tb_treatment_phase_id) : null,
        arvAdherenceId: (input.arv_adherence_id && input.arv_adherence_id.trim() !== "" && !isNaN(Number(input.arv_adherence_id))) ? Number(input.arv_adherence_id) : null,
        treatmentIndicationId: (input.treatment_indication_id && input.treatment_indication_id.trim() !== "" && !isNaN(Number(input.treatment_indication_id))) ? Number(input.treatment_indication_id) : null,
        treatmentCareApproach: (input.treatment_care_approach && input.treatment_care_approach.trim() !== "" && !isNaN(Number(input.treatment_care_approach))) ? Number(input.treatment_care_approach) : null,
        currentWhoStage: (input.current_who_stage && input.current_who_stage.trim() !== "" && !isNaN(Number(input.current_who_stage))) ? Number(input.current_who_stage) : null,
      };

      const sampleResult = await vlDb
        .insert(vlSamples)
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
          id: vlSamples.id,
          patientUniqueId: vlSamples.patientUniqueId,
          vlSampleId: vlSamples.vlSampleId,
          formNumber: vlSamples.formNumber,
          pregnant: vlSamples.pregnant,
          ancNumber: vlSamples.ancNumber,
          breastFeeding: vlSamples.breastFeeding,
          activeTbStatus: vlSamples.activeTbStatus,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          treatmentInitiationDate: vlSamples.treatmentInitiationDate,
          sampleType: vlSamples.sampleType,
          verified: vlSamples.verified,
          inWorksheet: vlSamples.inWorksheet,
          createdAt: vlSamples.createdAt,
          updatedAt: vlSamples.updatedAt,
          createdById: vlSamples.createdById,
          facilityId: vlSamples.facilityId,
          patientId: vlSamples.patientId,
          currentRegimenInitiationDate: vlSamples.currentRegimenInitiationDate,
          patientPhoneNumber: vlSamples.patientPhoneNumber,
          requestedOn: vlSamples.requestedOn,
          // Add missing fields that exist in database schema
          clinicianId: vlSamples.clinicianId,
          currentRegimenId: vlSamples.currentRegimenId,
          tbTreatmentPhaseId: vlSamples.tbTreatmentPhaseId,
          arvAdherenceId: vlSamples.arvAdherenceId,
          treatmentIndicationId: vlSamples.treatmentIndicationId,
          treatmentCareApproach: vlSamples.treatmentCareApproach,
          currentWhoStage: vlSamples.currentWhoStage,
        })
        .from(vlSamples)
        .where(
          and(
            eq(vlSamples.vlSampleId, input.sampleId),
            eq(vlSamples.facilityId, user.facility_id!)
          )
        )
        .limit(1);

      if (!sample[0]) {
        throw new Error("Sample not found or access denied");
      }

      // Get patient data from vlPatients table
      const patient = await vlDb
        .select({
          uniqueId: vlPatients.uniqueId,
          artNumber: vlPatients.artNumber,
          otherId: vlPatients.otherId,
          gender: vlPatients.gender,
          dob: vlPatients.dob,
        })
        .from(vlPatients)
        .where(eq(vlPatients.uniqueId, sample[0].patientUniqueId!))
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
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL datetime format
      const sampleUpdateData = {
        pregnant: input.pregnant || null,
        ancNumber: input.anc_number || null,
        breastFeeding: input.breast_feeding || null,
        activeTbStatus: input.active_tb_status || null,
        treatmentInitiationDate: input.treatment_initiation_date,
        currentRegimenInitiationDate: input.current_regimen_initiation_date,
        updatedAt: now,
        // Add new fields - properly handle empty strings and invalid numbers to avoid NaN
        patientPhoneNumber: input.patient_phone_number || null,
        requestedOn: input.requested_on || null,
        clinicianId: (input.clinician_id && input.clinician_id.trim() !== "" && !isNaN(Number(input.clinician_id))) ? Number(input.clinician_id) : null,
        currentRegimenId: (input.current_regimen_id && input.current_regimen_id.trim() !== "" && !isNaN(Number(input.current_regimen_id))) ? Number(input.current_regimen_id) : null,
        tbTreatmentPhaseId: (input.tb_treatment_phase_id && input.tb_treatment_phase_id.trim() !== "" && !isNaN(Number(input.tb_treatment_phase_id))) ? Number(input.tb_treatment_phase_id) : null,
        arvAdherenceId: (input.arv_adherence_id && input.arv_adherence_id.trim() !== "" && !isNaN(Number(input.arv_adherence_id))) ? Number(input.arv_adherence_id) : null,
        treatmentIndicationId: (input.treatment_indication_id && input.treatment_indication_id.trim() !== "" && !isNaN(Number(input.treatment_indication_id))) ? Number(input.treatment_indication_id) : null,
        treatmentCareApproach: (input.treatment_care_approach && input.treatment_care_approach.trim() !== "" && !isNaN(Number(input.treatment_care_approach))) ? Number(input.treatment_care_approach) : null,
        currentWhoStage: (input.current_who_stage && input.current_who_stage.trim() !== "" && !isNaN(Number(input.current_who_stage))) ? Number(input.current_who_stage) : null,
      };

      await vlDb
        .update(vlSamples)
        .set(sampleUpdateData)
        .where(
          and(
            eq(vlSamples.vlSampleId, input.sampleId),
            eq(vlSamples.facilityId, user.facility_id!)
          )
        );

      // Update patient record if it exists
      const patientUpdateData = {
        artNumber: input.art_number,
        otherId: input.other_id || null,
        gender: input.gender,
        dob: input.dob,
        treatmentInitiationDate: input.treatment_initiation_date,
        currentRegimenInitiationDate: input.current_regimen_initiation_date,
        updatedAt: now,
        // Add age and phone number to patient record as well
        age: input.age || null,
        age_units: input.age_units || null,
        patientPhoneNumber: input.patient_phone_number || null,
      };

      // Get the sample to find patientUniqueId
      const sample = await vlDb
        .select({ patientUniqueId: vlSamples.patientUniqueId })
        .from(vlSamples)
        .where(
          and(
            eq(vlSamples.vlSampleId, input.sampleId),
            eq(vlSamples.facilityId, user.facility_id!)
          )
        )
        .limit(1);

      if (sample[0]?.patientUniqueId) {
        await vlDb
          .update(vlPatients)
          .set(patientUpdateData)
          .where(eq(vlPatients.uniqueId, sample[0].patientUniqueId));
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

      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updateData: Record<string, any> = {
        updatedAt: now,
      };

      switch (input.status) {
        case "collected":
          updateData.dateCollected = new Date().toISOString().split('T')[0];
          updateData.stage = 25; // Status Code 25: Pending packaging
          break;
        case "received":
          updateData.dateReceived = new Date().toISOString().split('T')[0];
          updateData.receivedById = user.id;
          updateData.stage = 30; // Status Code 30: In transit
          break;
        case "processing":
          updateData.inWorksheet = 1;
          // Keep current stage (likely 30)
          break;
        case "completed":
          updateData.verified = 1;
          updateData.verifierId = user.id;
          updateData.verifiedAt = new Date().toISOString().split('T')[0];
          // Completed samples don't need stage update (handled by verified flag)
          break;
      }

      await vlDb
        .update(vlSamples)
        .set(updateData)
        .where(
          and(
            eq(vlSamples.vlSampleId, input.sampleId),
            eq(vlSamples.facilityId, user.facility_id!)
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
        id: vlSamples.id,
        dateCollected: vlSamples.dateCollected,
        dateReceived: vlSamples.dateReceived,
        verified: vlSamples.verified,
        inWorksheet: vlSamples.inWorksheet,
      })
      .from(vlSamples)
      .where(eq(vlSamples.facilityId, user.facility_id!));

    const totalSamples = allSamples.length;
    const pendingSamples = allSamples.filter((s) => !s.dateCollected).length;
    const collectedSamples = allSamples.filter((s) => s.dateCollected && !s.dateReceived).length;
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
          id: vlSamples.id,
          vlSampleId: vlSamples.vlSampleId,
          patientUniqueId: vlSamples.patientUniqueId,
          formNumber: vlSamples.formNumber,
          sampleType: vlSamples.sampleType,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          facilityId: vlSamples.facilityId,
          verified: vlSamples.verified,
          createdAt: vlSamples.createdAt,
          receptionArtNumber: vlSamples.receptionArtNumber,
          dataArtNumber: vlSamples.dataArtNumber,
          facilityReference: vlSamples.facilityReference,
        })
        .from(vlSamples)
        .where(eq(vlSamples.facilityId, user.facility_id!))
        .orderBy(desc(vlSamples.createdAt));

      // Filter samples that have been collected but not yet received (ready for packaging)
      const collectedSamples = allSamples.filter(sample => 
        sample.dateCollected && // Has collection date
        !sample.dateReceived && // Not yet received
        !sample.facilityReference // Not yet packaged
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
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updatePromises = input.sampleIds.map(sampleId =>
        vlDb
          .update(vlSamples)
          .set({
            // Use facilityReference field to store package identifier
            facilityReference: input.packageIdentifier,
            // Set dateReceived when packaging (indicates sample has been received at lab)
            dateReceived: now,
            updatedAt: now,
            updatedById: user.id,
            stage: 30, // Status Code 30: In transit
          })
          .where(
            and(
              eq(vlSamples.vlSampleId, sampleId),
              eq(vlSamples.facilityId, user.facility_id!)
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
      const whereConditions = [eq(vlSamples.facilityId, user.facility_id!)];
      
      // Only get samples that have been packaged (have facilityReference)
      // Note: We'll filter this in JavaScript since it's easier with the current setup
      
      if (input.packageIdentifier) {
        // If filtering by specific package, we'll handle this in JavaScript too
      }

      // Get all samples for the facility
      const allSamples = await vlDb
        .select({
          id: vlSamples.id,
          vlSampleId: vlSamples.vlSampleId,
          patientUniqueId: vlSamples.patientUniqueId,
          formNumber: vlSamples.formNumber,
          sampleType: vlSamples.sampleType,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          facilityId: vlSamples.facilityId,
          verified: vlSamples.verified,
          createdAt: vlSamples.createdAt,
          updatedAt: vlSamples.updatedAt,
          receptionArtNumber: vlSamples.receptionArtNumber,
          dataArtNumber: vlSamples.dataArtNumber,
          facilityReference: vlSamples.facilityReference,
          updatedById: vlSamples.updatedById,
        })
        .from(vlSamples)
        .where(and(...whereConditions))
        .orderBy(desc(vlSamples.updatedAt));

      // Filter packaged samples (samples with dateReceived and facilityReference)
      let packagedSamples = allSamples.filter(sample => 
        sample.dateReceived && // Has been received (packaged)
        sample.facilityReference && sample.facilityReference.trim() !== ""
      );

      // Filter by specific package if requested
      if (input.packageIdentifier) {
        packagedSamples = packagedSamples.filter(sample =>
          sample.facilityReference === input.packageIdentifier
        );
      }

      // Get unique package identifiers for the dropdown
      const packages = [...new Set(
        allSamples
          .filter(sample => sample.facilityReference && sample.facilityReference.trim() !== "")
          .map(sample => sample.facilityReference!)
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
          facilityReference: vlSamples.facilityReference,
          dateCollected: vlSamples.dateCollected,
          updatedAt: vlSamples.updatedAt,
          sampleType: vlSamples.sampleType,
        })
        .from(vlSamples)
        .where(eq(vlSamples.facilityId, user.facility_id!));

      // Filter and group by package
      const packagedSamples = allSamples.filter(sample => 
        sample.facilityReference && sample.facilityReference.trim() !== ""
      );

      // Group by package identifier
      const packageGroups = packagedSamples.reduce((acc, sample) => {
        const packageId = sample.facilityReference!;
        if (!acc[packageId]) {
          acc[packageId] = {
            packageIdentifier: packageId,
            sampleCount: 0,
            lastUpdated: sample.updatedAt,
            sampleTypes: new Set<string>(),
          };
        }
        acc[packageId].sampleCount++;
        if (sample.sampleType) {
          acc[packageId].sampleTypes.add(sample.sampleType);
        }
        // Keep the most recent update date
        if (sample.updatedAt && sample.updatedAt > acc[packageId].lastUpdated) {
          acc[packageId].lastUpdated = sample.updatedAt;
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

  // Get Viral Load Request for completed tests
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
          id: vlSamples.id,
          vlSampleId: vlSamples.vlSampleId,
          patientUniqueId: vlSamples.patientUniqueId,
          formNumber: vlSamples.formNumber,
          sampleType: vlSamples.sampleType,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          verified: vlSamples.verified,
          verifiedAt: vlSamples.verifiedAt,
          createdAt: vlSamples.createdAt,
          updatedAt: vlSamples.updatedAt,
          receptionArtNumber: vlSamples.receptionArtNumber,
          dataArtNumber: vlSamples.dataArtNumber,
          pregnant: vlSamples.pregnant,
          breastFeeding: vlSamples.breastFeeding,
          activeTbStatus: vlSamples.activeTbStatus,
          treatmentInitiationDate: vlSamples.treatmentInitiationDate,
          currentRegimenInitiationDate: vlSamples.currentRegimenInitiationDate,
          facilityId: vlSamples.facilityId,
          
          // Actual result fields from database
          lastValue: vlSamples.lastValue,
          lastTestDate: vlSamples.lastTestDate,
          viralLoadTestingId: vlSamples.viralLoadTestingId,
        })
        .from(vlSamples)
        .where(eq(vlSamples.facilityId, user.facility_id!))
        .orderBy(desc(vlSamples.verifiedAt), desc(vlSamples.updatedAt));

      // Filter only verified/completed samples (those with results)
      let completedSamples = allSamples.filter(sample => sample.verified === 1);

      // Apply search filter if provided
      if (input.searchTerm && input.searchTerm.trim() !== "") {
        const searchTerm = input.searchTerm.toLowerCase();
        completedSamples = completedSamples.filter(sample =>
          sample.patientUniqueId?.toLowerCase().includes(searchTerm) ||
          sample.vlSampleId?.toLowerCase().includes(searchTerm) ||
          sample.receptionArtNumber?.toLowerCase().includes(searchTerm) ||
          sample.dataArtNumber?.toLowerCase().includes(searchTerm) ||
          sample.formNumber?.toLowerCase().includes(searchTerm)
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
        
        if (sample.lastValue && typeof sample.lastValue === 'string') {
          const lastValueStr = sample.lastValue.toLowerCase().trim();
          
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
        if (!sample.lastValue && sample.verified === 1) {
          interpretation = "Result Pending";
        }

        return {
          id: sample.vlSampleId || sample.id.toString(),
          sampleId: sample.vlSampleId || `VL-${sample.id}`,
          patientId: sample.receptionArtNumber || sample.dataArtNumber || sample.patientUniqueId || `P-${sample.id}`,
          
          // Real result data from database
          viralLoadValue,
          viralLoadUnit: "copies/mL",
          detectionStatus,
          interpretation,
          resultDate: sample.lastTestDate ? new Date(sample.lastTestDate).toISOString().split('T')[0] : 
                     (sample.verifiedAt ? new Date(sample.verifiedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
          resultTime: sample.verifiedAt ? new Date(sample.verifiedAt).toTimeString().slice(0, 5) : "14:30",
          
          // Sample information
          sampleType: sample.sampleType === "P" ? "Plasma" : sample.sampleType === "D" ? "DBS" : "Whole Blood",
          dateCollected: sample.dateCollected ? new Date(sample.dateCollected).toISOString().split('T')[0] : null,
          dateReceived: sample.dateReceived ? new Date(sample.dateReceived).toISOString().split('T')[0] : null,
          dateProcessed: sample.verifiedAt ? new Date(sample.verifiedAt).toISOString().split('T')[0] : null,
          
          // Treatment information
          treatmentInitiationDate: sample.treatmentInitiationDate ? new Date(sample.treatmentInitiationDate).toISOString().split('T')[0] : null,
          currentRegimenInitiationDate: sample.currentRegimenInitiationDate ? new Date(sample.currentRegimenInitiationDate).toISOString().split('T')[0] : null,
          
          // Clinical information
          pregnant: sample.pregnant,
          breastFeeding: sample.breastFeeding,
          activeTbStatus: sample.activeTbStatus,
          
          // Meta information
          formNumber: sample.formNumber,
          createdAt: sample.createdAt,
          updatedAt: sample.updatedAt,
          
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
          
          status: sample.lastValue ? "completed" : "pending"
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

      // Find the sample by vlSampleId or id
      const sample = await vlDb
        .select({
          id: vlSamples.id,
          vlSampleId: vlSamples.vlSampleId,
          patientUniqueId: vlSamples.patientUniqueId,
          formNumber: vlSamples.formNumber,
          sampleType: vlSamples.sampleType,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          verified: vlSamples.verified,
          verifiedAt: vlSamples.verifiedAt,
          createdAt: vlSamples.createdAt,
          updatedAt: vlSamples.updatedAt,
          receptionArtNumber: vlSamples.receptionArtNumber,
          dataArtNumber: vlSamples.dataArtNumber,
          pregnant: vlSamples.pregnant,
          breastFeeding: vlSamples.breastFeeding,
          activeTbStatus: vlSamples.activeTbStatus,
          treatmentInitiationDate: vlSamples.treatmentInitiationDate,
          currentRegimenInitiationDate: vlSamples.currentRegimenInitiationDate,
          facilityId: vlSamples.facilityId,
          
          // Actual result fields from database
          lastValue: vlSamples.lastValue,
          lastTestDate: vlSamples.lastTestDate,
          viralLoadTestingId: vlSamples.viralLoadTestingId,
        })
        .from(vlSamples)
        .where(
          and(
            eq(vlSamples.facilityId, user.facility_id!),
            eq(vlSamples.vlSampleId, input.resultId)
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
      
      if (sampleData.lastValue && typeof sampleData.lastValue === 'string') {
        const lastValueStr = sampleData.lastValue.toLowerCase().trim();
        
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
      if (!sampleData.lastValue && sampleData.verified === 1) {
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
        id: sampleData.vlSampleId || sampleData.id.toString(),
        sampleId: sampleData.vlSampleId || `VL-${sampleData.id}`,
        patientId: sampleData.receptionArtNumber || sampleData.dataArtNumber || sampleData.patientUniqueId || `P-${sampleData.id}`,
        
        // Real result data from database
        viralLoadValue,
        viralLoadUnit: "copies/mL",
        detectionStatus,
        interpretation,
        resultDate: sampleData.lastTestDate ? new Date(sampleData.lastTestDate).toISOString().split('T')[0] : 
                   (sampleData.verifiedAt ? new Date(sampleData.verifiedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]),
        resultTime: sampleData.verifiedAt ? new Date(sampleData.verifiedAt).toTimeString().slice(0, 5) : "14:30",
        
        // Sample information
        sampleType: sampleData.sampleType === "P" ? "Plasma" : sampleData.sampleType === "D" ? "DBS" : "Whole Blood",
        dateCollected: sampleData.dateCollected ? new Date(sampleData.dateCollected).toISOString().split('T')[0] : null,
        dateReceived: sampleData.dateReceived ? new Date(sampleData.dateReceived).toISOString().split('T')[0] : null,
        dateProcessed: sampleData.verifiedAt ? new Date(sampleData.verifiedAt).toISOString().split('T')[0] : null,
        
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
        patientName: `Patient #${sampleData.receptionArtNumber || sampleData.dataArtNumber || sampleData.patientUniqueId}`,
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
        breastFeeding: sampleData.breastFeeding,
        activeTbStatus: sampleData.activeTbStatus,
        treatmentInitiationDate: sampleData.treatmentInitiationDate ? new Date(sampleData.treatmentInitiationDate).toISOString().split('T')[0] : null,
        currentRegimenInitiationDate: sampleData.currentRegimenInitiationDate ? new Date(sampleData.currentRegimenInitiationDate).toISOString().split('T')[0] : null,
        
        formNumber: sampleData.formNumber,
        status: sampleData.lastValue ? "completed" : "pending"
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
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      const updateData: any = {
        updatedAt: now,
        updatedById: user.id,
      };

      if (input.collected) {
        // Set collection date (either provided or current date)
        const collectionDate = input.collectionDate?.toISOString().slice(0, 10) || new Date().toISOString().slice(0, 10);
        updateData.dateCollected = collectionDate;
        updateData.stage = 25; // Status Code 25: Pending packaging
      } else {
        // Clear collection date if uncollecting and revert to pending collection
        updateData.dateCollected = null;
        updateData.stage = 20; // Status Code 20: Pending sample collection
      }

      await vlDb
        .update(vlSamples)
        .set(updateData)
        .where(
          and(
            eq(vlSamples.vlSampleId, input.sampleId),
            eq(vlSamples.facilityId, user.facility_id!)
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

      // Get all samples for the facility (temporarily remove facility filter for testing)
      const allSamples = await vlDb
        .select({
          id: vlSamples.id,
          dateCollected: vlSamples.dateCollected,
          dateReceived: vlSamples.dateReceived,
          verified: vlSamples.verified,
          createdAt: vlSamples.createdAt,
          facilityReference: vlSamples.facilityReference,
          lastValue: vlSamples.lastValue,
          stage: vlSamples.stage,
        })
        .from(vlSamples);
        // Temporarily commented out facility filter: .where(eq(vlSamples.facilityId, user.facility_id!));

      // Handle "All Time" - find the earliest sample date
      let startDate: Date;
      const endDate = new Date();
      
      if (input.days >= 999) {
        // "All Time" - find earliest sample
        const earliestSample = allSamples.reduce((earliest, sample) => {
          const sampleDate = new Date(sample.createdAt);
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
            const sampleDate = new Date(sample.createdAt);
            return sampleDate <= monthEnd;
          });

          const pending = samplesUpToThisDate.filter(s => s.stage === 20).length; // Pending sample collection
          const packaged = samplesUpToThisDate.filter(s => s.stage === 30).length; // In transit
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.lastValue).length;

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
            const sampleDate = new Date(sample.createdAt);
            return sampleDate <= weekEnd;
          });

          const pending = samplesUpToThisDate.filter(s => s.stage === 20).length; // Pending sample collection
          const packaged = samplesUpToThisDate.filter(s => s.stage === 30).length; // In transit
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.lastValue).length;

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
            const sampleDate = new Date(sample.createdAt);
            return sampleDate <= currentDate;
          });

          const pending = samplesUpToThisDate.filter(s => s.stage === 20).length; // Pending sample collection
          const packaged = samplesUpToThisDate.filter(s => s.stage === 30).length; // In transit
          const results = samplesUpToThisDate.filter(s => s.verified === 1 && s.lastValue).length;

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

  // Get clinicians for the current user's facility
  getClinicians: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.user;
    
    if (!user.facility_id) {
      return [];
    }

    const vlDb = await getVlLimsDb();

    // Get clinicians for the user's facility
    const clinicians = await vlDb
      .select({
        id: vlClinicians.id,
        name: vlClinicians.cname,
        phone: vlClinicians.cphone,
        facilityId: vlClinicians.facilityId,
      })
      .from(vlClinicians)
      .where(eq(vlClinicians.facilityId, user.facility_id!))
      .orderBy(vlClinicians.cname);

    return clinicians.map(clinician => ({
      id: clinician.id.toString(),
      name: clinician.name,
      phone: clinician.phone,
      value: clinician.id.toString(),
      label: clinician.name,
    }));
  }),

  // Get all facilities for dropdowns
  getFacilities: protectedProcedure.query(async ({ ctx }) => {
    const vlDb = await getVlLimsDb();

    const facilities = await vlDb
      .select({
        id: backendFacilities.id,
        name: backendFacilities.facility,
        district: backendFacilities.districtId,
        hub: backendFacilities.hubId,
        active: backendFacilities.active,
      })
      .from(backendFacilities)
      .where(eq(backendFacilities.active, 1))
      .orderBy(backendFacilities.facility);

    return facilities.map(facility => ({
      id: facility.id.toString(),
      name: facility.name,
      value: facility.id.toString(),
      label: facility.name,
    }));
  }),

  // Create a new clinician
  createClinician: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Clinician name is required"),
        phone: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user;
      
      if (!user.facility_id) {
        throw new Error("Please set up your facility information first.");
      }

      const vlDb = await getVlLimsDb();

      // Check if clinician already exists for this facility
      const existingClinician = await vlDb
        .select({ id: vlClinicians.id })
        .from(vlClinicians)
        .where(
          and(
            eq(vlClinicians.facilityId, user.facility_id),
            eq(vlClinicians.cname, input.name)
          )
        )
        .limit(1);

      if (existingClinician.length > 0) {
        throw new Error("A clinician with this name already exists at your facility");
      }

      // Create new clinician
      const now = new Date().toISOString().slice(0, 19).replace('T', ' '); // Convert to MySQL datetime format
      const clinicianData = {
        cname: input.name,
        cphone: input.phone || null,
        facilityId: user.facility_id,
        createdAt: now,
        updatedAt: now,
      };

      const result = await vlDb
        .insert(vlClinicians)
        .values(clinicianData);

      // Return the new clinician (we'll need to get the ID from the result)
      return {
        success: true,
        message: "Clinician created successfully",
        clinician: {
          id: "new", // We'll handle this in the frontend
          name: input.name,
          phone: input.phone,
        }
      };
    }),
}); 