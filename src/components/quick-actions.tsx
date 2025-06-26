"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconPlus,
  IconSearch,
  IconPackage,
  IconFileText,
  IconChartBar,
  IconTestPipe,
  IconBabyCarriage,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QuickAction {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  variant?: "default" | "secondary" | "outline";
  className?: string;
  theme?: "red" | "blue";
}

export function QuickActions() {
  const pathname = usePathname();

  // Define quick actions based on current section
  const getQuickActions = (): QuickAction[] => {
    if (pathname.startsWith("/viral-load")) {
      return [
        {
          label: "New Request",
          href: "/viral-load/new-request",
          icon: IconPlus,
          description: "Create a new viral load test request",
          variant: "default",
          className: "bg-red-600 hover:bg-red-700 text-white border-red-600",
          theme: "red",
        },
        {
          label: "Pending Collection",
          href: "/viral-load/pending-collection",
          icon: IconSearch,
          description: "View samples waiting for collection",
          variant: "outline",
          className: "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
          theme: "red",
        },
        {
          label: "Package Samples",
          href: "/viral-load/package-samples",
          icon: IconPackage,
          description: "Package collected samples for transport",
          variant: "outline",
          className: "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
          theme: "red",
        },
        {
          label: "View Results",
          href: "/viral-load/results",
          icon: IconFileText,
          description: "Check viral load test results",
          variant: "outline",
          className: "border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300",
          theme: "red",
        },
      ];
    }

    if (pathname.startsWith("/eid")) {
      return [
        {
          label: "New Request",
          href: "/eid/new-request",
          icon: IconPlus,
          description: "Create a new EID test request",
          variant: "default",
          className: "bg-blue-600 hover:bg-blue-700 text-white border-blue-600",
          theme: "blue",
        },
        {
          label: "Collect Sample",
          href: "/eid/collect-sample",
          icon: IconSearch,
          description: "Collect DBS samples for testing",
          variant: "outline",
          className: "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300",
          theme: "blue",
        },
        {
          label: "View Results",
          href: "/eid/results",
          icon: IconFileText,
          description: "Check EID test results",
          variant: "outline",
          className: "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300",
          theme: "blue",
        },
      ];
    }

    if (pathname === "/dashboard") {
      return [
        {
          label: "Viral Load",
          href: "/viral-load",
          icon: IconTestPipe,
          description: "HIV viral load testing management",
          variant: "outline",
          className: "border-red-200 hover:bg-red-50 hover:border-red-300 group",
          theme: "red",
        },
        {
          label: "EID Testing",
          href: "/eid",
          icon: IconBabyCarriage,
          description: "Early infant diagnosis management",
          variant: "outline",
          className: "border-blue-200 hover:bg-blue-50 hover:border-blue-300 group",
          theme: "blue",
        },
      ];
    }

    return [];
  };

  const quickActions = getQuickActions();

  // Don't render if no actions available
  if (quickActions.length === 0) {
    return null;
  }

  // For dashboard, show as cards
  if (pathname === "/dashboard") {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Access</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <Link key={action.href} href={action.href}>
                <Card className={`hover:shadow-md transition-all duration-200 cursor-pointer ${action.className}`}>
                  <CardHeader className="pb-2">
                    <CardTitle className={`flex items-center space-x-2 text-lg ${
                      action.theme === "red" ? "text-red-700 group-hover:text-red-800" :
                      action.theme === "blue" ? "text-blue-700 group-hover:text-blue-800" :
                      "text-gray-700"
                    }`}>
                      <IconComponent className={`h-5 w-5 ${
                        action.theme === "red" ? "text-red-600" :
                        action.theme === "blue" ? "text-blue-600" :
                        "text-gray-600"
                      }`} />
                      <span>{action.label}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className={
                      action.theme === "red" ? "text-red-600 group-hover:text-red-700" :
                      action.theme === "blue" ? "text-blue-600 group-hover:text-blue-700" :
                      "text-gray-600"
                    }>
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // For other sections, show as button group
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-3">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          const isCurrentPath = pathname === action.href;
          
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant={isCurrentPath ? "default" : action.variant}
                className={`flex items-center space-x-2 transition-all duration-200 ${
                  isCurrentPath 
                    ? action.theme === "red" 
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                    : action.className
                } ${isCurrentPath ? "pointer-events-none shadow-md" : ""}`}
                disabled={isCurrentPath}
              >
                <IconComponent className="h-4 w-4" />
                <span>{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 