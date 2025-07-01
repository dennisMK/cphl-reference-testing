"use client";

import { useAuth } from "@/lib/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { IconEdit, IconKey, IconBuilding, IconMail, IconUser } from "@tabler/icons-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          View and manage your personal information
        </p>
      </div>
      <Separator />

      <div className="grid gap-6">
        {/* Profile Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={`https://vercel.com/api/www/avatar/${encodeURIComponent(
                    user?.email || user?.username || "user@ugandavlm.org"
                  )}?s=80`}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="text-lg">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <CardTitle className="text-2xl">{user.name || "User"}</CardTitle>
                <CardDescription className="text-base">
                  {user.email || user.username}
                </CardDescription>
                {user.username === "admin" && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Administrator
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconUser className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm text-muted-foreground">
                      {user.name || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <IconMail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {user.email || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconUser className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Username</p>
                    <p className="text-sm text-muted-foreground">
                      {user.username || "Not provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <IconBuilding className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Facility</p>
                    <p className="text-sm text-muted-foreground">
                      {user.facility_name || "Not assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your account settings and preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/settings/edit-profile">
                  <IconEdit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/settings/change-password">
                  <IconKey className="mr-2 h-4 w-4" />
                  Change Password
                </Link>
              </Button>
              {user.username === "admin" && (
                <Button asChild variant="outline" className="justify-start">
                  <Link href="/settings/edit-facility">
                    <IconBuilding className="mr-2 h-4 w-4" />
                    Edit Facility
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Additional details about your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconUser className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Account Type</p>
                    <p className="text-sm text-muted-foreground">
                      {user.username === "admin" ? "Administrator" : "Standard User"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <IconBuilding className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Facility Access</p>
                    <p className="text-sm text-muted-foreground">
                      {user.facility_name || "No facility assigned"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 