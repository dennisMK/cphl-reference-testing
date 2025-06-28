import {
  mysqlTable,
  varchar,
  timestamp,
  int,
  text,
  tinyint,
  date,
  datetime,
  longtext,
  smallint,
  index,
  unique,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// ============ AUTO-GENERATED TABLES FROM MYSQL DATABASE ============

export const backendDistricts = mysqlTable("backend_districts", {
  id: int().autoincrement().notNull(),
  district: varchar({ length: 32 }).notNull(),
  mapCode: varchar("map_code", { length: 64 }),
  regionId: int("region_id"),
  dhis2Uid: varchar("dhis2_uid", { length: 128 }),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const backendHubs = mysqlTable("backend_hubs", {
  id: int().autoincrement().notNull(),
  hub: varchar({ length: 32 }).notNull(),
  hubEmail: varchar("hub_email", { length: 128 }),
  coordinatorName: varchar("coordinator_name", { length: 64 }),
  coordinatorContact: varchar("coordinator_contact", { length: 64 }),
  coordinatorEmail: varchar("coordinator_email", { length: 128 }),
  active: tinyint().notNull(),
  ipId: int("ip_id"),
  createdAt: timestamp("created_at", { mode: "string" }),
  updatedAt: timestamp("updated_at", { mode: "string" }),
});

export const backendFacilities = mysqlTable(
  "backend_facilities",
  {
    id: int().autoincrement().notNull(),
    facility: varchar({ length: 128 }).notNull(),
    hubFacility: tinyint("hub_facility").notNull(),
    facilityContact: varchar("facility_contact", { length: 64 }),
    facilityEmail: varchar("facility_email", { length: 128 }),
    physicalAddress: varchar("physical_address", { length: 128 }),
    returnAddress: varchar("return_address", { length: 128 }),
    coordinatorName: varchar("coordinator_name", { length: 64 }),
    coordinatorContact: varchar("coordinator_contact", { length: 64 }),
    coordinatorEmail: varchar("coordinator_email", { length: 128 }),
    active: tinyint().notNull(),
    districtId: int("district_id").references(() => backendDistricts.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    hubId: int("hub_id").references(() => backendHubs.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
    ipId: int("ip_id"),
    dhis2Name: varchar("dhis2_name", { length: 128 }),
    dhis2Uid: varchar("dhis2_uid", { length: 128 }),
    isCleaned: tinyint("is_cleaned").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }),
    updatedAt: timestamp("updated_at", { mode: "string" }),
    hiePartially: tinyint("hie_partially").default(0),
    hieFully: tinyint("hie_fully").default(0),
  },
  (table) => [
    index("backend_facilities_97469368").on(table.hubId),
    index("backend_facilities_dhis2_uid").on(table.dhis2Uid),
    unique("backend_facilities_facility_4fe8b8cb_uniq").on(table.facility),
  ]
);

export const vlClinicians = mysqlTable(
  "vl_clinicians",
  {
    id: int().autoincrement().notNull(),
    cname: varchar({ length: 128 }).notNull(),
    cphone: varchar({ length: 64 }),
    facilityId: int("facility_id")
      .notNull()
      .references(() => backendFacilities.id, {
        onDelete: "restrict",
        onUpdate: "restrict",
      }),
    createdAt: datetime("created_at", { mode: "string" }),
    updatedAt: datetime("updated_at", { mode: "string" }),
  },
  (table) => [
    unique("vl_clinicians_facility_id_0aba4c74_uniq").on(
      table.facilityId,
      table.cname
    ),
  ]
);

export const vlPatients = mysqlTable("vl_patients", {
  id: int().autoincrement().notNull(),
  uniqueId: varchar("unique_id", { length: 128 }),
  artNumber: varchar("art_number", { length: 64 }),
  otherId: varchar("other_id", { length: 64 }),
  gender: varchar({ length: 1 }),
  dob: date({ mode: "string" }),
  createdAt: datetime("created_at", { mode: "string", fsp: 6 }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 6 }).notNull(),
  createdById: int("created_by_id").notNull(),
  facilityId: int("facility_id").notNull(),
  treatmentInitiationDate: date("treatment_initiation_date", {
    mode: "string",
  }),
  currentRegimenInitiationDate: date("current_regimen_initiation_date", {
    mode: "string",
  }),
  treatmentDuration: smallint("treatment_duration"),
  previousResults: longtext("previous_results"),
  parentId: int("parent_id").default(0),
  isVerified: tinyint("is_verified").default(1),
  isTheCleanPatient: int("is_the_clean_patient").default(0).notNull(),
  facilityPatientId: int("facility_patient_id"),
  sanitizedArtNumber: varchar("sanitized_art_number", { length: 64 }),
  isCleaned: tinyint("is_cleaned").default(0),
});

export const vlSamples = mysqlTable("vl_samples", {
  id: int().autoincrement().notNull(),
  patientUniqueId: varchar("patient_unique_id", { length: 128 }),
  locatorCategory: varchar("locator_category", { length: 1 }),
  locatorPosition: varchar("locator_position", { length: 4 }),
  vlSampleId: varchar("vl_sample_id", { length: 128 }),
  formNumber: varchar("form_number", { length: 64 }),
  pregnant: varchar({ length: 1 }),
  ancNumber: varchar("anc_number", { length: 64 }),
  breastFeeding: varchar("breast_feeding", { length: 1 }),
  consentedSampleKeeping: varchar("consented_sample_keeping", { length: 1 }),
  activeTbStatus: varchar("active_tb_status", { length: 1 }),
  dateCollected: date("date_collected", { mode: "string" }),
  dateReceived: datetime("date_received", { mode: "string" }),
  treatmentInitiationDate: date("treatment_initiation_date", {
    mode: "string",
  }),
  sampleType: varchar("sample_type", { length: 1 }),
  treatmentIndicationOther: varchar("treatment_indication_other", {
    length: 64,
  }),
  lastTestDate: date("last_test_date", { mode: "string" }),
  lastValue: varchar("last_value", { length: 64 }),
  lastSampleType: varchar("last_sample_type", { length: 1 }),
  verified: tinyint().default(1).notNull(),
  inWorksheet: tinyint("in_worksheet"),
  dataEnteredById: int("data_entered_by_id"),
  dataEnteredAt: datetime("data_entered_at", { mode: "string", fsp: 6 }),
  createdAt: datetime("created_at", { mode: "string", fsp: 6 }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 6 }).notNull(),
  arvAdherenceId: int("arv_adherence_id"),
  createdById: int("created_by_id"),
  currentRegimenId: int("current_regimen_id"),
  facilityId: int("facility_id"),
  dataFacilityId: int("data_facility_id"),
  facilityPatientId: int("facility_patient_id"),
  failureReasonId: int("failure_reason_id"),
  patientId: int("patient_id"),
  tbTreatmentPhaseId: int("tb_treatment_phase_id"),
  treatmentIndicationId: int("treatment_indication_id"),
  treatmentLineId: int("treatment_line_id"),
  updatedById: int("updated_by_id"),
  verifierId: int("verifier_id"),
  verifiedAt: datetime("verified_at", { mode: "string" }),
  viralLoadTestingId: int("viral_load_testing_id"),
  envelopeId: int("envelope_id"),
  otherRegimen: varchar("other_regimen", { length: 128 }),
  clinicianId: int("clinician_id"),
  labTechId: int("lab_tech_id"),
  treatmentDuration: smallint("treatment_duration"),
  treatmentCareApproach: smallint("treatment_care_approach"),
  currentWhoStage: smallint("current_who_stage"),
  isStudySample: tinyint("is_study_sample").default(0).notNull(),
  barcode: varchar({ length: 250 }),
  originalPatientId: int("original_patient_id").default(0),
  barcode2: varchar({ length: 250 }),
  barcode3: varchar({ length: 250 }),
  barcode4: varchar({ length: 250 }),
  barcode5: varchar({ length: 250 }),
  sampleReceptionId: int("sample_reception_id"),
  trackingCodeId: int("tracking_code_id"),
  isDataEntered: tinyint("is_data_entered").default(0).notNull(),
  facilityReference: varchar("facility_reference", { length: 128 }),
  receptionArtNumber: varchar("reception_art_number", { length: 40 }),
  dataArtNumber: varchar("data_art_number", { length: 40 }),
  stage: tinyint(),
  requiredVerification: tinyint("required_verification").notNull(),
  currentRegimenInitiationDate: date("current_regimen_initiation_date", {
    mode: "string",
  }),
  hieDataCreatedAt: datetime("hie_data_created_at", { mode: "string" }),
  studyId: int("study_id"),
  receivedById: int("received_by_id"),
  studyParticipantId: int("study_participant_id"),
  sourceSystem: int("source_system"),
  durationOnCurrentTxt: tinyint("duration_on_current_txt"),
  dateCentrifuged: datetime("date_centrifuged", { mode: "string" }),
  patientPhoneNumber: varchar("patient_phone_number", { length: 20 }),
  requestedOn: date("requested_on", { mode: "string" }),
  onlySampleReceived: tinyint("only_sample_received"),
  agentId: varchar("agent_id", { length: 255 }),
});

// ============ CUSTOM EID TABLES FOR EARLY INFANT DIAGNOSIS ============

export const eidPatients = mysqlTable("eid_patients", {
  id: int().autoincrement().notNull(),

  // Requesting clinician fields (from HTML form)
  infantEntryPoint: varchar("infant_entryPoint", { length: 10 }),
  sendersName: varchar("senders_name", { length: 128 }).notNull(),
  sendersTelephone: varchar("senders_telephone", { length: 64 }).notNull(),

  // Patient information fields (from HTML form)
  infantName: varchar("infant_name", { length: 128 }).notNull(),
  infantExpId: varchar("infant_exp_id", { length: 64 }).notNull(),
  infantGender: varchar("infant_gender", { length: 12 }).notNull(), // MALE, FEMALE, NOT_RECORDED
  infantAge: varchar("infant_age", { length: 10 }).notNull(),
  infantAgeUnits: varchar("infant_age_units", { length: 10 }).notNull(), // months, days, weeks, years
  infantContactPhone: varchar("infant_contact_phone", { length: 64 }),
  givenContri: varchar("given_contri", { length: 5 }).notNull(), // BLANK, Y, N
  deliveredAtHc: varchar("delivered_at_hc", { length: 5 }).notNull(), // BLANK, Y, N
  infantArvs: varchar("infant_arvs", { length: 1 }),
  envNum1: varchar("env_num1", { length: 128 }),

  // Other section fields (from HTML form)
  infantFeeding: varchar("infant_feeding", { length: 3 }).notNull(), // EBF, MF, W, RF, CF, NLB
  testType: varchar("test_type", { length: 1 }), // P, S, B
  pcr: varchar("pcr", { length: 7 }).notNull(), // UNKNOWN, FIRST, SECOND, THIRD
  nonRoutine: varchar("non_routine", { length: 4 }), // NONE, R1, R2, R3
  motherHtsnr: varchar("mother_htsnr", { length: 64 }),
  motherArtnr: varchar("mother_artnr", { length: 64 }),
  motherNin: varchar("mother_nin", { length: 64 }),
  motherAntenatalProphylaxis: varchar("mother_antenatal_prophylaxis", {
    length: 2,
  }), // 80, 81, 82
  motherDeliveryProphylaxis: varchar("mother_delivery_prophylaxis", {
    length: 2,
  }), // 80, 81, 82
  motherPostnatalProphylaxis: varchar("mother_postnatal_prophylaxis", {
    length: 2,
  }), // 80, 81, 82

  // Hidden SCD fields (from HTML form)
  sampleType: varchar("sample_type", { length: 11 }), // DBS, Whole blood
  firstSymptomAge: varchar("first_symptom_age", { length: 5 }), // BLANK, 1, 2
  diagnosisAge: varchar("diagnosis_age", { length: 5 }), // BLANK, 1, 2
  testReason: varchar("test_reason", { length: 64 }),
  famHistory: varchar("fam_history", { length: 64 }),
  screeningProgram: varchar("screening_program", { length: 64 }),

  // System fields
  facilityId: int("facility_id")
    .notNull()
    .references(() => backendFacilities.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  createdById: int("created_by_id"),
  createdAt: datetime("created_at", { mode: "string", fsp: 6 }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 6 }).notNull(),
  isVerified: tinyint("is_verified").default(1),
});

export const eidSamples = mysqlTable("eid_samples", {
  id: int().autoincrement().notNull(),
  eidPatientId: int("eid_patient_id")
    .notNull()
    .references(() => eidPatients.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  sampleId: varchar("sample_id", { length: 128 }),
  barcode: varchar("barcode", { length: 250 }),
  dateCollected: date("date_collected", { mode: "string" }),
  dateReceived: datetime("date_received", { mode: "string" }),
  sampleType: varchar("sample_type", { length: 20 }), // DBS, Whole blood
  testRequested: varchar("test_requested", { length: 10 }), // PCR, SCD, Both
  resultValue: varchar("result_value", { length: 64 }),
  resultStatus: varchar("result_status", { length: 20 }), // POSITIVE, NEGATIVE, PENDING, INVALID
  testedBy: int("tested_by"),
  testedAt: datetime("tested_at", { mode: "string" }),
  verified: tinyint().default(0),
  verifiedBy: int("verified_by"),
  verifiedAt: datetime("verified_at", { mode: "string" }),
  facilityId: int("facility_id")
    .notNull()
    .references(() => backendFacilities.id, {
      onDelete: "restrict",
      onUpdate: "restrict",
    }),
  createdAt: datetime("created_at", { mode: "string", fsp: 6 }).notNull(),
  updatedAt: datetime("updated_at", { mode: "string", fsp: 6 }).notNull(),
});

// ============ RELATIONS (AUTO-GENERATED + CUSTOM) ============

export const backendFacilitiesRelations = relations(
  backendFacilities,
  ({ one, many }) => ({
    backendDistrict: one(backendDistricts, {
      fields: [backendFacilities.districtId],
      references: [backendDistricts.id],
    }),
    backendHub: one(backendHubs, {
      fields: [backendFacilities.hubId],
      references: [backendHubs.id],
    }),
    vlClinicians: many(vlClinicians),
    vlPatients: many(vlPatients),
    vlSamples: many(vlSamples),
    eidPatients: many(eidPatients),
    eidSamples: many(eidSamples),
  })
);

export const backendDistrictsRelations = relations(
  backendDistricts,
  ({ many }) => ({
    backendFacilities: many(backendFacilities),
  })
);

export const backendHubsRelations = relations(backendHubs, ({ many }) => ({
  backendFacilities: many(backendFacilities),
}));

export const vlCliniciansRelations = relations(vlClinicians, ({ one }) => ({
  backendFacility: one(backendFacilities, {
    fields: [vlClinicians.facilityId],
    references: [backendFacilities.id],
  }),
}));

export const vlPatientsRelations = relations(vlPatients, ({ one, many }) => ({
  facility: one(backendFacilities, {
    fields: [vlPatients.facilityId],
    references: [backendFacilities.id],
  }),
  samples: many(vlSamples),
}));

export const vlSamplesRelations = relations(vlSamples, ({ one }) => ({
  patient: one(vlPatients, {
    fields: [vlSamples.patientId],
    references: [vlPatients.id],
  }),
  facility: one(backendFacilities, {
    fields: [vlSamples.facilityId],
    references: [backendFacilities.id],
  }),
  clinician: one(vlClinicians, {
    fields: [vlSamples.clinicianId],
    references: [vlClinicians.id],
  }),
}));

export const eidPatientsRelations = relations(eidPatients, ({ one, many }) => ({
  facility: one(backendFacilities, {
    fields: [eidPatients.facilityId],
    references: [backendFacilities.id],
  }),
  samples: many(eidSamples),
}));

export const eidSamplesRelations = relations(eidSamples, ({ one }) => ({
  eidPatient: one(eidPatients, {
    fields: [eidSamples.eidPatientId],
    references: [eidPatients.id],
  }),
  facility: one(backendFacilities, {
    fields: [eidSamples.facilityId],
    references: [backendFacilities.id],
  }),
}));

// ============ TYPESCRIPT TYPES ============

// Auto-generated table types
export type BackendDistrict = typeof backendDistricts.$inferSelect;
export type NewBackendDistrict = typeof backendDistricts.$inferInsert;

export type BackendHub = typeof backendHubs.$inferSelect;
export type NewBackendHub = typeof backendHubs.$inferInsert;

export type BackendFacility = typeof backendFacilities.$inferSelect;
export type NewBackendFacility = typeof backendFacilities.$inferInsert;

export type VlClinician = typeof vlClinicians.$inferSelect;
export type NewVlClinician = typeof vlClinicians.$inferInsert;

export type VlPatient = typeof vlPatients.$inferSelect;
export type NewVlPatient = typeof vlPatients.$inferInsert;

export type VlSample = typeof vlSamples.$inferSelect;
export type NewVlSample = typeof vlSamples.$inferInsert;

// Custom EID table types
export type EidPatient = typeof eidPatients.$inferSelect;
export type NewEidPatient = typeof eidPatients.$inferInsert;

export type EidSample = typeof eidSamples.$inferSelect;
export type NewEidSample = typeof eidSamples.$inferInsert;
