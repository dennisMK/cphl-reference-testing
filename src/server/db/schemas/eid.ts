import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  tinyint,
  date,
  datetime,
  mediumint,
  mysqlEnum,
  smallint,
  char,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Batches table from etest_eid database
export const batches = mysqlTable("batches", {
  id: int("id").primaryKey().autoincrement(),
  lab: varchar("lab", { length: 16 }).notNull().default("CPHL"),
  batch_number: varchar("batch_number", { length: 32 }),
  envelope_number: varchar("envelope_number", { length: 32 }),
  envelope_created_by: int("envelope_created_by"),
  entered_by: int("entered_by"),
  facility_id: mediumint("facility_id").notNull(),
  facility_name: varchar("facility_name", { length: 255 }),
  facility_district: varchar("facility_district", { length: 255 }),
  requesting_unit: varchar("requesting_unit", { length: 250 }),
  is_single_form: smallint("is_single_form").notNull(),
  senders_name: varchar("senders_name", { length: 75 }),
  senders_telephone: varchar("senders_telephone", { length: 50 }),
  senders_comments: varchar("senders_comments", { length: 512 }).notNull(),
  results_return_address: varchar("results_return_address", {
    length: 128,
  }).notNull(),
  results_transport_method: mysqlEnum("results_transport_method", [
    "POSTA_UGANDA",
    "COLLECTED_FROM_LAB",
  ]).notNull(),
  date_dispatched_from_facility: date("date_dispatched_from_facility", {
    mode: "string",
  }),
  date_rcvd_by_cphl: date("date_rcvd_by_cphl", { mode: "string" }),
  envelope_created_at: datetime("envelope_created_at", { mode: "string" }),
  date_entered_in_DB: date("date_entered_in_DB", { mode: "string" }),
  all_samples_rejected: mysqlEnum("all_samples_rejected", ["YES", "NO"])
    .notNull()
    .default("NO"),
  date_PCR_testing_completed: date("date_PCR_testing_completed", {
    mode: "string",
  }),
  date_SCD_testing_completed: date("date_SCD_testing_completed", {
    mode: "string",
  }),
  PCR_results_released: mysqlEnum("PCR_results_released", ["YES", "NO"])
    .notNull()
    .default("NO"),
  SCD_results_released: mysqlEnum("SCD_results_released", ["YES", "NO"])
    .notNull()
    .default("NO"),
  printed_PCR_results: varchar("printed_PCR_results", { length: 510 }),
  printed_SCD_results: varchar("printed_SCD_results", { length: 510 }),
  date_dispatched_to_facility: date("date_dispatched_to_facility", {
    mode: "string",
  }),
  date_rcvd_at_facility: date("date_rcvd_at_facility", { mode: "string" }),
  qc_done: mysqlEnum("qc_done", ["YES", "NO"]).notNull().default("NO"),
  scd_qc_done: mysqlEnum("scd_qc_done", ["YES", "NO"]).notNull().default("NO"),
  rejects_qc_done: mysqlEnum("rejects_qc_done", ["YES", "NO"])
    .notNull()
    .default("NO"),
  f_senders_name: varchar("f_senders_name", { length: 75 }),
  f_senders_telephone: varchar("f_senders_telephone", { length: 50 }),
  f_date_dispatched_from_facility: date("f_date_dispatched_from_facility", {
    mode: "string",
  }),
  f_date_rcvd_by_cphl: date("f_date_rcvd_by_cphl", { mode: "string" }),
  f_paediatricART_available: mysqlEnum("f_paediatricART_available", [
    "YES",
    "NO",
    "LEFT_BLANK",
  ])
    .notNull()
    .default("NO"),
  date_PCR_printed: datetime("date_PCR_printed", { mode: "string" }),
  date_SCD_printed: datetime("date_SCD_printed", { mode: "string" }),
  tests_requested: mysqlEnum("tests_requested", [
    "PCR",
    "SCD",
    "BOTH_PCR_AND_SCD",
    "UNKNOWN",
  ])
    .notNull()
    .default("UNKNOWN"),
  f_date_SCD_printed: datetime("f_date_SCD_printed", { mode: "string" }),
  f_date_PCR_printed: datetime("f_date_PCR_printed", { mode: "string" }),
  updated_at: timestamp("updated_at", { mode: "string" })
    .default("current_timestamp()")
    .notNull(),
  created_at: timestamp("created_at", { mode: "string" })
    .default("current_timestamp()")
    .notNull(),
  source_system: int("source_system").notNull().default(1),
});

// DBS Samples table from etest_eid database
export const dbs_samples = mysqlTable("dbs_samples", {
  id: int("id").primaryKey().autoincrement(),
  batch_id: int("batch_id").notNull(),
  pos_in_batch: tinyint("pos_in_batch").notNull(),
  sample_verified_by: int("sample_verified_by"),
  sample_verified_on: date("sample_verified_on", { mode: "string" }),
  nSpots: tinyint("nSpots"),
  sample_rejected: mysqlEnum("sample_rejected", [
    "YES",
    "NO",
    "NOT_YET_CHECKED",
    "REJECTED_FOR_EID",
  ])
    .notNull()
    .default("NOT_YET_CHECKED"),
  rejection_reason_id: tinyint("rejection_reason_id"),
  rejection_comments: varchar("rejection_comments", { length: 256 }),
  sickle_cell_release_code: varchar("sickle_cell_release_code", { length: 10 }),
  infant_name: varchar("infant_name", { length: 255 }).notNull(),
  infant_exp_id: varchar("infant_exp_id", { length: 30 }),
  infant_gender: mysqlEnum("infant_gender", ["MALE", "FEMALE", "NOT_RECORDED"])
    .notNull()
    .default("NOT_RECORDED"),
  infant_age: varchar("infant_age", { length: 30 }),
  infant_dob: date("infant_dob", { mode: "string" }),
  infant_is_breast_feeding: mysqlEnum("infant_is_breast_feeding", [
    "YES",
    "NO",
    "UNKNOWN",
  ])
    .notNull()
    .default("UNKNOWN"),
  infant_entryPoint: tinyint("infant_entryPoint"),
  infant_contact_phone: varchar("infant_contact_phone", { length: 20 }),
  given_contri: mysqlEnum("given_contri", ["Y", "N", "BLANK"]).default("BLANK"),
  delivered_at_hc: mysqlEnum("delivered_at_hc", ["Y", "N", "BLANK"]).default(
    "BLANK"
  ),
  infant_feeding: varchar("infant_feeding", { length: 32 }),
  mother_htsnr: varchar("mother_htsnr", { length: 32 }),
  mother_artnr: varchar("mother_artnr", { length: 32 }),
  mother_nin: varchar("mother_nin", { length: 32 }),
  is_single_form: smallint("is_single_form").notNull(),
  test_type: char("test_type", { length: 2 }),
  infant_age_units: varchar("infant_age_units", { length: 10 }),
  poc_device: char("poc_device", { length: 2 }),
  poc_results: char("poc_results", { length: 2 }),
  poc_sample_id: varchar("poc_sample_id", { length: 250 }),
  poc_invalid_comments: varchar("poc_invalid_comments", { length: 250 }),
  poc_tested_by: varchar("poc_tested_by", { length: 250 }),
  poc_telephone: varchar("poc_telephone", { length: 250 }),
  poc_test_date: date("poc_test_date", { mode: "string" }),
  poc_reviewed_by: varchar("poc_reviewed_by", { length: 250 }),
  poc_dispatch_date: date("poc_dispatch_date", { mode: "string" }),
  mother_antenatal_prophylaxis: tinyint("mother_antenatal_prophylaxis"),
  mother_delivery_prophylaxis: tinyint("mother_delivery_prophylaxis"),
  mother_postnatal_prophylaxis: tinyint("mother_postnatal_prophylaxis"),
  infant_prophylaxis: tinyint("infant_prophylaxis"),
  date_dbs_taken: date("date_dbs_taken", { mode: "string" }),
  date_data_entered: date("date_data_entered", { mode: "string" })
    .notNull()
    .default("2015-09-21"),
  date_dbs_tested: date("date_dbs_tested", { mode: "string" }),
  date_results_entered: date("date_results_entered", { mode: "string" }),
  date_results_printed: date("date_results_printed", { mode: "string" }),
  PCR_test_requested: mysqlEnum("PCR_test_requested", ["NO", "YES"])
    .notNull()
    .default("YES"),
  SCD_test_requested: mysqlEnum("SCD_test_requested", ["NO", "YES"])
    .notNull()
    .default("NO"),
  pcr: mysqlEnum("pcr", ["FIRST", "SECOND", "NON_ROUTINE", "UNKNOWN", "THIRD"])
    .notNull()
    .default("UNKNOWN"),
  non_routine: mysqlEnum("non_routine", ["R1", "R2", "R3"]),
  migrated_to_old_schema: mysqlEnum("migrated_to_old_schema", ["YES", "NO"])
    .notNull()
    .default("NO"),
  lab_comment: varchar("lab_comment", { length: 125 }),
  in_workSheet: mysqlEnum("in_workSheet", ["YES", "NO"])
    .notNull()
    .default("NO"),
  in_scworksheet: mysqlEnum("in_scworksheet", ["NO", "YES"]),
  pos_in_workSheet: tinyint("pos_in_workSheet").notNull().default(0),
  physical_location: varchar("physical_location", { length: 45 }),
  ready_for_SCD_test: mysqlEnum("ready_for_SCD_test", [
    "YES",
    "NO",
    "TEST_NOT_NEEDED",
    "TEST_ALREADY_DONE",
  ])
    .notNull()
    .default("NO"),
  worksheet_1: mediumint("worksheet_1"),
  worksheet_2: mediumint("worksheet_2"),
  worksheet_3: mediumint("worksheet_3"),
  worksheet_4: mediumint("worksheet_4"),
  worksheet_5: mediumint("worksheet_5"),
  test_1_result: mysqlEnum("test_1_result", [
    "POSITIVE",
    "HIGH_POSITIVE",
    "LOW_POSITIVE",
    "NEGATIVE",
    "FAIL",
  ]),
  test_2_result: mysqlEnum("test_2_result", [
    "POSITIVE",
    "HIGH_POSITIVE",
    "LOW_POSITIVE",
    "NEGATIVE",
    "FAIL",
  ]),
  test_3_result: mysqlEnum("test_3_result", [
    "POSITIVE",
    "HIGH_POSITIVE",
    "LOW_POSITIVE",
    "NEGATIVE",
    "FAIL",
  ]),
  test_4_result: mysqlEnum("test_4_result", [
    "POSITIVE",
    "HIGH_POSITIVE",
    "LOW_POSITIVE",
    "NEGATIVE",
    "FAIL",
  ]),
  test_5_result: mysqlEnum("test_5_result", [
    "POSITIVE",
    "HIGH_POSITIVE",
    "LOW_POSITIVE",
    "NEGATIVE",
    "FAIL",
  ]),
  testing_completed: mysqlEnum("testing_completed", ["YES", "NO"])
    .notNull()
    .default("NO"),
  accepted_result: mysqlEnum("accepted_result", [
    "POSITIVE",
    "NEGATIVE",
    "INVALID",
    "SAMPLE_WAS_REJECTED",
  ]),
  SCD_test_result: mysqlEnum("SCD_test_result", [
    "NORMAL",
    "VARIANT",
    "CARRIER",
    "SICKLER",
    "FAILED",
    "SAMPLE_WAS_REJECTED",
  ]),
  PCR_results_ReleasedBy: int("PCR_results_ReleasedBy"),
  SCD_results_ReleasedBy: int("SCD_results_ReleasedBy"),
  f_results_rcvd_at_facility: mysqlEnum("f_results_rcvd_at_facility", [
    "YES",
    "NO",
    "LEFT_BLANK",
  ]),
  f_results_collected_by_caregiver: mysqlEnum(
    "f_results_collected_by_caregiver",
    ["YES", "NO", "LEFT_BLANK"]
  ),
  f_date_results_collected: date("f_date_results_collected", {
    mode: "string",
  }),
  f_ART_initiated: mysqlEnum("f_ART_initiated", ["YES", "NO", "LEFT_BLANK"]),
  f_date_ART_initiated: date("f_date_ART_initiated", { mode: "string" }),
  f_reason_ART_not_initated: tinyint("f_reason_ART_not_initated"),
  f_ART_number: varchar("f_ART_number", { length: 12 }),
  f_infant_referred: mysqlEnum("f_infant_referred", ["YES", "NO"]),
  f_facility_referred_to: mediumint("f_facility_referred_to"),
  repeated_SC_test: mysqlEnum("repeated_SC_test", ["YES", "NO"])
    .notNull()
    .default("NO"),
  pcr2: tinyint("pcr2"),
  pcr3: tinyint("pcr3"),
  rdt: tinyint("rdt"),
  sender_id: int("sender_id"),
  first_symptom_age: varchar("first_symptom_age", { length: 250 }),
  diagnosis_age: varchar("diagnosis_age", { length: 250 }),
  test_reason: varchar("test_reason", { length: 250 }),
  fam_history: varchar("fam_history", { length: 250 }),
  screening_program: varchar("screening_program", { length: 250 }),
  is_active: int("is_active").notNull().default(0),
  created_at: timestamp("created_at", { mode: "string" })
    .default("current_timestamp()")
    .notNull(),
  updated_at: timestamp("updated_at", { mode: "string" })
    .default("current_timestamp()")
    .notNull(),
  test_1_ct_value: varchar("test_1_ct_value", { length: 5 }),
  test_2_ct_value: varchar("test_2_ct_value", { length: 5 }),
  test_3_ct_value: varchar("test_3_ct_value", { length: 5 }),
  test_4_ct_value: varchar("test_4_ct_value", { length: 5 }),
  test_5_ct_value: varchar("test_5_ct_value", { length: 5 }),
});

// ============ RELATIONS ============

export const batchesRelations = relations(batches, ({ many }) => ({
  dbsSamples: many(dbs_samples),
}));

export const dbsSamplesRelations = relations(dbs_samples, ({ one }) => ({
  batch: one(batches, {
    fields: [dbs_samples.batch_id],
    references: [batches.id],
  }),
}));

// ============ TYPESCRIPT TYPES ============

export type Batch = typeof batches.$inferSelect;
export type NewBatch = typeof batches.$inferInsert;

export type DbsSample = typeof dbs_samples.$inferSelect;
export type NewDbsSample = typeof dbs_samples.$inferInsert;
