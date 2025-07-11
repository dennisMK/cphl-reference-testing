"use client";

import React from "react";
import { useAuth } from "@/lib/auth-context";
import FacilityForm from "./_components/FacilityForm";

export default function EditFacilityPage() {
  const { user, isLoading, refreshUser } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="bg-gray-200 rounded-lg h-64"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">User not found</h2>
          <p className="text-gray-600 mt-2">Please try refreshing the page or logging in again.</p>
        </div>
      </div>
    );
  }

  return <FacilityForm user={user} onSuccess={refreshUser} />;
} 