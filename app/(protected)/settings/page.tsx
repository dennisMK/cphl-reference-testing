"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, User, Building, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function SettingsPage() {
  const { user, isLoading } = useAuth();

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

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* User Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>Your account details and contact information</CardDescription>
            </div>
            <Link href="/settings/edit-profile">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{user?.name || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Username</label>
                <p className="text-gray-900">{user?.username || "Not specified"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{user?.email || "Not specified"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and password</CardDescription>
            </div>
            <Link href="/settings/change-password">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Change Password
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Keep your account secure by regularly updating your password and using strong, unique passwords.
            </p>
          </CardContent>
        </Card>

        {/* Facility Information Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Facility Information
              </CardTitle>
              <CardDescription>Your facility and hub assignment details</CardDescription>
            </div>
            <Link href="/settings/edit-facility">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit Facility
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Facility</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{user?.facility_name || "Not specified"}</p>
                  {user?.facility_id && (
                    <Badge variant="outline" className="text-xs">
                      ID: {user.facility_id}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Hub</label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">{user?.hub_name || "Not specified"}</p>
                  {user?.hub_id && (
                    <Badge variant="outline" className="text-xs">
                      ID: {user.hub_id}
                    </Badge>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">District</label>
                <p className="text-gray-900">
                  {user?.hub_name ? user.hub_name.split(' ')[0] : "Not specified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 