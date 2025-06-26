"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconHome,
  IconChevronRight,
  IconTestPipe,
  IconBabyCarriage,
  IconDashboard,
  IconPlus,
  IconSearch,
  IconPackage,
  IconFileText,
  IconSettings,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MdHomeFilled } from "react-icons/md";

interface BreadcrumbItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function BreadcrumbNavigation() {
  const pathname = usePathname();

  // Get current section for color theming
  const getCurrentSection = () => {
    if (pathname.startsWith("/viral-load")) return "viral-load";
    if (pathname.startsWith("/eid")) return "eid";
    return "dashboard";
  };

  const currentSection = getCurrentSection();

  // Define section-specific colors for breadcrumbs
  const getSectionBreadcrumbColors = () => {
    switch (currentSection) {
      case "viral-load":
        return {
          active: "text-red-700",
          inactive: "text-red-600/70 hover:text-red-700",
          chevron: "text-red-400",
        };
      case "eid":
        return {
          active: "text-blue-700",
          inactive: "text-blue-600/70 hover:text-blue-700",
          chevron: "text-blue-400",
        };
      default:
        return {
          active: "text-gray-900",
          inactive: "text-muted-foreground hover:text-foreground",
          chevron: "text-gray-400",
        };
    }
  };

  const colors = getSectionBreadcrumbColors();

  // Define route mappings
  const routeMap: Record<string, BreadcrumbItem[]> = {
    "/dashboard": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
    ],
    "/viral-load": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
    ],
    "/viral-load/new-request": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
      { label: "New Request", href: "/viral-load/new-request", icon: IconPlus },
    ],
    "/viral-load/pending-collection": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
      { label: "Pending Collection", href: "/viral-load/pending-collection", icon: IconSearch },
    ],
    "/viral-load/package-samples": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
      { label: "Package Samples", href: "/viral-load/package-samples", icon: IconPackage },
    ],
    "/viral-load/results": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
      { label: "Results", href: "/viral-load/results", icon: IconFileText },
    ],
    "/eid": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "EID", href: "/eid", icon: IconBabyCarriage },
    ],
    "/eid/new-request": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "EID", href: "/eid", icon: IconBabyCarriage },
      { label: "New Request", href: "/eid/new-request", icon: IconPlus },
    ],
    "/eid/collect-sample": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "EID", href: "/eid", icon: IconBabyCarriage },
      { label: "Collect Sample", href: "/eid/collect-sample", icon: IconSearch },
    ],
    "/eid/results": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "EID", href: "/eid", icon: IconBabyCarriage },
      { label: "Results", href: "/eid/results", icon: IconFileText },
    ],
    "/settings": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Settings", href: "/settings", icon: IconSettings },
    ],
    "/settings/edit-profile": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Settings", href: "/settings", icon: IconSettings },
      { label: "Edit Profile", href: "/settings/edit-profile" },
    ],
    "/settings/edit-facility": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Settings", href: "/settings", icon: IconSettings },
      { label: "Edit Facility", href: "/settings/edit-facility" },
    ],
    "/settings/change-password": [
      { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
      { label: "Settings", href: "/settings", icon: IconSettings },
      { label: "Change Password", href: "/settings/change-password" },
    ],
  };

  // Get breadcrumb items for current path
  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    // Try exact match first
    if (routeMap[pathname]) {
      return routeMap[pathname];
    }

    // Handle dynamic routes (e.g., /viral-load/[id]/edit)
    const pathSegments = pathname.split("/").filter(Boolean);
    
    if (pathSegments.length >= 2) {
      const baseRoute = `/${pathSegments[0]}/${pathSegments[1]}`;
      if (routeMap[baseRoute]) {
        const baseItems = [...routeMap[baseRoute]];
        
        // Add dynamic segments
        for (let i = 2; i < pathSegments.length; i++) {
          const segment = pathSegments[i];
          const segmentPath = `/${pathSegments.slice(0, i + 1).join("/")}`;
          
          // Capitalize and format segment names
          const formattedLabel = segment
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          
          baseItems.push({
            label: formattedLabel,
            href: segmentPath,
          });
        }
        
        return baseItems;
      }
    }

    // Fallback to base section
    if (pathSegments.length >= 1) {
      const section = pathSegments[0];
      if (section === "viral-load") {
        return [
          { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
          { label: "Viral Load", href: "/viral-load", icon: IconTestPipe },
        ];
      } else if (section === "eid") {
        return [
          { label: "Dashboard", href: "/dashboard", icon: MdHomeFilled },
          { label: "EID", href: "/eid", icon: IconBabyCarriage },
        ];
      }
    }

    // Default fallback
    return [{ label: "Dashboard", href: "/dashboard", icon: IconDashboard }];
  };

  const breadcrumbItems = getBreadcrumbItems();

  // Don't show breadcrumbs on dashboard
  if (pathname === "/dashboard") {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm md:px-0 px-4 md:mx-auto">
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        const IconComponent = item.icon;

        return (
          <React.Fragment key={item.href}>
            {index > 0 && (
              <IconChevronRight className={cn("h-4 w-4", colors.chevron)} />
            )}
            
            {isLast ? (
              <span className={cn("flex items-center space-x-1 font-medium", colors.active)}>
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{item.label}</span>
              </span>
            ) : (
              <Link href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-auto p-1 transition-colors",
                    colors.inactive
                  )}
                >
                  <span className="flex items-center space-x-1">
                    {IconComponent && <IconComponent className="h-4 w-4" />}
                    <span>{item.label}</span>
                  </span>
                </Button>
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
} 