import { relations } from "drizzle-orm/relations";
import { backendDistricts, backendFacilities, backendHubs, vlClinicians } from "./schema";

export const backendFacilitiesRelations = relations(backendFacilities, ({one, many}) => ({
	backendDistrict: one(backendDistricts, {
		fields: [backendFacilities.districtId],
		references: [backendDistricts.id]
	}),
	backendHub: one(backendHubs, {
		fields: [backendFacilities.hubId],
		references: [backendHubs.id]
	}),
	vlClinicians: many(vlClinicians),
}));

export const backendDistrictsRelations = relations(backendDistricts, ({many}) => ({
	backendFacilities: many(backendFacilities),
}));

export const backendHubsRelations = relations(backendHubs, ({many}) => ({
	backendFacilities: many(backendFacilities),
}));

export const vlCliniciansRelations = relations(vlClinicians, ({one}) => ({
	backendFacility: one(backendFacilities, {
		fields: [vlClinicians.facilityId],
		references: [backendFacilities.id]
	}),
}));