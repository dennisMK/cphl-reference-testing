"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Baby } from "lucide-react";
import Link from "next/link";
import React from "react";
import { api } from "@/trpc/react";

export default function DashboardCards() {
  // Fetch real data from APIs
  const { data: viralLoadStats, isLoading: vlLoading } = api.viralLoad.getDashboardStats.useQuery();
  const { data: eidStats, isLoading: eidLoading } = api.eid.getDashboardStats.useQuery();

  const actions = [
    {
      title: "HIV Viral Load",
      description: "Monitor and track HIV viral load testing for patients",
      href: "/viral-load",
      icon: Activity,
      action: "View",
      count: viralLoadStats?.totalSamples || 0,
      requests: viralLoadStats?.pendingSamples || 0,
      collections: viralLoadStats?.collectedSamples || 0,
      theme: "red",
      isLoading: vlLoading,
    },
    {
      title: "HIV-Positive Mothers", 
      description: "Manage EID testing for infants born to HIV Positive Mothers",
      href: "/eid",
      icon: Baby,
      action: "View",
      count: eidStats?.totalSamples || 0,
      requests: eidStats?.pendingSamples || 0,
      collections: eidStats?.collectedSamples || 0,
      theme: "blue",
      isLoading: eidLoading,
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className={`h-5 w-5 ${action.theme === "red" ? "text-red-600" : "text-blue-600"}`} />
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
              
              <div className="text-2xl font-bold mb-4">
                {action.isLoading ? (
                  <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
                ) : (
                  action.count
                )}
              </div>
              
              {/* Analytics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Requests</p>
                    <p className="text-lg font-semibold">
                      {action.isLoading ? (
                        <div className="h-6 w-8 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        action.requests
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-lg font-semibold">
                      {action.isLoading ? (
                        <div className="h-6 w-8 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        action.collections
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <Link href={action.href}>
                <Button
                  size={"lg"}
                  variant={"default"}
                  className={`cursor-pointer rounded-xl w-full ${action.action === "View" ? `bg-${action.theme}-600 hover:bg-${action.theme}-700` : `border-${action.theme}-600 text-${action.theme}-600 hover:bg-${action.theme}-50`}`}>
                  View
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
