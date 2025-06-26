import { z } from "zod";
import { eq, and, desc, count } from "drizzle-orm";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { batches, dbs_samples } from "@/server/db/schemas/eid";
import { getEidDb } from "@/server/db";

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

      // Get all samples for the facility
      const allSamples = await eidDb
        .select({
          id: dbs_samples.id,
          infant_name: dbs_samples.infant_name,
          infant_exp_id: dbs_samples.infant_exp_id,
          infant_gender: dbs_samples.infant_gender,
          infant_age: dbs_samples.infant_age,
          date_dbs_taken: dbs_samples.date_dbs_taken,
          testing_completed: dbs_samples.testing_completed,
          accepted_result: dbs_samples.accepted_result,
          created_at: dbs_samples.created_at,
          batch_id: dbs_samples.batch_id,
          pcr: dbs_samples.pcr,
          // Batch information
          date_rcvd_by_cphl: batches.date_rcvd_by_cphl,
          facility_name: batches.facility_name,
        })
        .from(dbs_samples)
        .leftJoin(batches, eq(dbs_samples.batch_id, batches.id))
        .where(eq(batches.facility_id, user.facility_id!))
        .orderBy(desc(dbs_samples.created_at));

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
}); 