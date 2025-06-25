import { eq, and, desc } from 'drizzle-orm';
import { getUsersDb, getEidDb, getVlLimsDb } from './index';
import { users } from './schemas/users';
import { batches, dbs_samples } from './schemas/eid';
import { vl_patients, vl_samples } from './schemas/vl_lims';

// Example functions showing how to use each database

/**
 * Users Database (etest_users) Examples
 */
export async function getUserByFacility(facilityId: number) {
  const db = await getUsersDb();
  return await db
    .select()
    .from(users)
    .where(and(eq(users.facility_id, facilityId), eq(users.deactivated, 0)));
}

export async function getUserById(userId: number) {
  const db = await getUsersDb();
  const result = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return result[0] || null;
}

/**
 * EID Database (etest_eid) Examples
 */
export async function getBatchesByFacility(facilityId: number) {
  const db = await getEidDb();
  return await db
    .select()
    .from(batches)
    .where(eq(batches.facility_id, facilityId))
    .orderBy(desc(batches.created_at));
}

export async function getSamplesByBatch(batchId: number) {
  const db = await getEidDb();
  return await db
    .select()
    .from(dbs_samples)
    .where(eq(dbs_samples.batch_id, batchId));
}

export async function createBatch(batchData: typeof batches.$inferInsert) {
  const db = await getEidDb();
  return await db.insert(batches).values(batchData);
}

export async function createDbsSample(sampleData: typeof dbs_samples.$inferInsert) {
  const db = await getEidDb();
  return await db.insert(dbs_samples).values(sampleData);
}

/**
 * Viral Load LIMS Database (etest_vl_lims) Examples
 */
export async function getVlPatientsByFacility(facilityId: number) {
  const db = await getVlLimsDb();
  return await db
    .select()
    .from(vl_patients)
    .where(eq(vl_patients.facility_id, facilityId))
    .orderBy(desc(vl_patients.created_at));
}

export async function getVlSamplesByPatient(patientId: number) {
  const db = await getVlLimsDb();
  return await db
    .select()
    .from(vl_samples)
    .where(eq(vl_samples.patient_id, patientId))
    .orderBy(desc(vl_samples.created_at));
}

export async function createVlPatient(patientData: typeof vl_patients.$inferInsert) {
  const db = await getVlLimsDb();
  return await db.insert(vl_patients).values(patientData);
}

export async function createVlSample(sampleData: typeof vl_samples.$inferInsert) {
  const db = await getVlLimsDb();
  return await db.insert(vl_samples).values(sampleData);
}

/**
 * Cross-database queries
 * These functions demonstrate how to get data from multiple databases
 */
export async function getUserWithBatches(userId: number) {
  // Get user from etest_users
  const user = await getUserById(userId);
  if (!user || !user.facility_id) return null;

  // Get batches from etest_eid for this user's facility
  const userBatches = await getBatchesByFacility(user.facility_id);

  return {
    user,
    batches: userBatches,
  };
}

export async function getFacilityOverview(facilityId: number) {
  // Get all users from this facility
  const facilityUsers = await getUserByFacility(facilityId);
  
  // Get EID batches for this facility
  const eidBatches = await getBatchesByFacility(facilityId);
  
  // Get VL patients for this facility
  const vlPatients = await getVlPatientsByFacility(facilityId);

  return {
    users: facilityUsers,
    eidBatches,
    vlPatients,
  };
}

// Type exports for inference
export type UserType = typeof users.$inferSelect;
export type BatchType = typeof batches.$inferSelect;
export type DbsSampleType = typeof dbs_samples.$inferSelect;
export type VlPatientType = typeof vl_patients.$inferSelect;
export type VlSampleType = typeof vl_samples.$inferSelect; 