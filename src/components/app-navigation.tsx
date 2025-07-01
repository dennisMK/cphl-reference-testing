"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  IconSettings,
  IconTestPipe,
  IconBabyCarriage,
  IconPhone,
  IconMail,
  IconChevronDown,
  IconPlus,
  IconSearch,
  IconFileText,
  IconPackage,
  IconChartBar,
  IconEdit,
  IconTruck,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { MdHomeFilled } from "react-icons/md";

export function AppNavigation() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleSignOut = async () => {
    await logout();
  };

  // Get current section for color theming
  const getCurrentSection = () => {
    if (pathname.startsWith("/viral-load")) return "viral-load";
    if (pathname.startsWith("/eid")) return "eid";
    return "dashboard";
  };

  const currentSection = getCurrentSection();

  // Define section-specific colors
  const getSectionColors = () => {
    switch (currentSection) {
      case "viral-load":
        return {
          bg: "bg-red-600",
          bgHover: "hover:bg-red-700",
          bgGradient: "bg-gradient-to-r from-red-600 to-red-700",
          border: "border-red-700",
          text: "text-white",
          textHover: "hover:text-red-100",
        };
      case "eid":
        return {
          bg: "bg-blue-600",
          bgHover: "hover:bg-blue-700",
          bgGradient: "bg-gradient-to-r from-blue-600 to-blue-700",
          border: "border-blue-700",
          text: "text-white",
          textHover: "hover:text-blue-100",
        };
      default:
        return {
          bg: "bg-white",
          bgHover: "hover:bg-gray-50",
          bgGradient: "bg-white",
          border: "border-gray-200",
          text: "text-gray-900",
          textHover: "hover:text-gray-700",
        };
    }
  };

  const colors = getSectionColors();

  // Define main navigation sections
  const navigationSections = [
    {
      name: "Home",
      href: "/dashboard",
      icon: MdHomeFilled,
      description: "Overview and analytics",
    },
    {
      name: "Viral Load",
      href: "/viral-load",
      icon: IconTestPipe,
      description: "HIV viral load testing",
      theme: "red",
      subItems: [
        {
          category: "Test Requests",
          items: [
            {
              name: "Pending Sample Collection",
              href: "/viral-load/pending-collection",
              icon: IconSearch,
              description: "Edit, collect samples",
            },
            {
              name: "Pending Packaging",
              href: "/viral-load/package-samples",
              icon: IconPackage,
              description: "Edit, collect samples",
            },
            {
              name: "Completed",
              href: "/viral-load/results",
              icon: IconCheck,
              description: "No action",
            },
          ],
        },
        {
          category: "Packages",
          items: [
            {
              name: "In Transit",
              href: "/viral-load/pending-collection?filter=in-transit",
              icon: IconTruck,
              description: "Packages currently in transit",
            },
            {
              name: "Delivered",
              href: "/viral-load/pending-collection?filter=delivered",
              icon: IconCheck,
              description: "Packages that have been delivered",
            },
          ],
        },
        {
          category: "Other",
          items: [
            {
              name: "Results",
              href: "/viral-load/results",
              icon: IconFileText,
            },
            {
              name: "VL Dashboard",
              href: "/viral-load",
              icon: IconExternalLink,
              external: true,
              description: "Opens in new tab",
            },
          ],
        },
      ],
    },
    {
      name: "HIV-Positive Mothers",
      href: "/eid",
      icon: IconBabyCarriage,
      description: "HIV-Positive Mothers",
      theme: "blue",
      subItems: [
        { name: "New Request", href: "/eid/new-request", icon: IconPlus },
      ],
    },
  ];

  // Helper function to check if a path is active
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-200",
        colors.bgGradient,
        colors.border,
        currentSection !== "dashboard" ? "shadow-lg" : "shadow-sm"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section: Brand + Main Navigation */}
        <div className="flex items-center space-x-6">
          {/* Brand */}
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/uganda-flag.png"
              alt="Uganda Flag"
              className="h-auto w-12 object-cover rounded-sm"
            />
            <div className="hidden sm:block">
              <span className={cn("text-lg font-semibold", colors.text)}>
                Uganda Lab
              </span>
              <div
                className={cn(
                  "text-xs",
                  currentSection === "dashboard"
                    ? "text-gray-500"
                    : "text-white/80"
                )}
              >
                e-Test Requests
              </div>
            </div>
          </Link>

          <Separator
            orientation="vertical"
            className={cn(
              "h-6",
              currentSection === "dashboard" ? "bg-gray-300" : "bg-white/30"
            )}
          />

                    {/* Main Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationSections.map((section) => {
              const IconComponent = section.icon;
              const active = isActive(section.href);
              const isCurrent = currentSection === section.href.split("/")[1];

              // Hide EID when in viral-load section, and hide viral-load when in EID section
              if (currentSection === "viral-load" && section.href === "/eid")
                return null;
              if (currentSection === "eid" && section.href === "/viral-load")
                return null;

              if (section.subItems && currentSection === section.href.split("/")[1]) {
                return (
                  <DropdownMenu key={section.href}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                          active || isCurrent
                            ? currentSection === "dashboard"
                              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                              : "bg-white/20 text-white hover:bg-white/30 hover:text-white backdrop-blur-sm"
                            : currentSection === "dashboard"
                              ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{section.name}</span>
                        <IconChevronDown className="h-4 w-4" />
                        {(active || isCurrent) && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-1 h-5 px-1.5 text-xs",
                              section.theme === "red"
                                ? "bg-red-100 text-red-800"
                                : section.theme === "blue"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            )}
                          >
                            Active
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-80">
                      <DropdownMenuLabel className="flex items-center space-x-2">
                        <IconComponent
                          className={cn(
                            "h-4 w-4",
                            section.theme === "red"
                              ? "text-red-600"
                              : section.theme === "blue"
                                ? "text-blue-600"
                                : "text-gray-600"
                          )}
                        />
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {section.description}
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      
                      {section.subItems.map((category: any, categoryIndex: number) => (
                        <div key={categoryIndex}>
                          {category.category && (
                            <>
                              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {category.category}
                              </div>
                              {category.items?.map((subItem: any) => {
                                const SubIconComponent = subItem.icon;
                                return (
                                  <DropdownMenuItem key={subItem.href} asChild>
                                    <Link
                                      href={subItem.href}
                                      target={subItem.external ? "_blank" : undefined}
                                      rel={subItem.external ? "noopener noreferrer" : undefined}
                                      className="flex items-center space-x-2 px-2 py-2"
                                    >
                                      <SubIconComponent className="h-4 w-4" />
                                      <div className="flex-1">
                                        <div className="text-sm font-medium">{subItem.name}</div>
                                        {subItem.description && (
                                          <div className="text-xs text-muted-foreground">
                                            {subItem.description}
                                          </div>
                                        )}
                                      </div>
                                      {subItem.external && (
                                        <IconExternalLink className="h-3 w-3 text-muted-foreground" />
                                      )}
                                    </Link>
                                  </DropdownMenuItem>
                                );
                              })}
                              {categoryIndex < section.subItems.length - 1 && <DropdownMenuSeparator />}
                            </>
                          )}
                          
                          {!category.category && (
                            <DropdownMenuItem key={category.href} asChild>
                              <Link
                                href={category.href}
                                className="flex items-center space-x-2"
                              >
                                <category.icon className="h-4 w-4" />
                                <span>{category.name}</span>
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <Link key={section.href} href={section.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                      active || isCurrent
                        ? currentSection === "dashboard"
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                          : "bg-white/20 text-white hover:bg-white/30 hover:text-white backdrop-blur-sm"
                        : currentSection === "dashboard"
                          ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{section.name}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Contact Info & User Menu */}
        <div className="flex items-center space-x-4">
          {/* Contact Information */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <IconMail className={cn(
                "h-4 w-4",
                currentSection === "dashboard" 
                  ? "text-gray-600" 
                  : "text-white/80"
              )} />
              <a 
                href="mailto:customercare@cphl.go.ug"
                className={cn(
                  "text-sm font-medium hover:underline transition-colors",
                  currentSection === "dashboard"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/80 hover:text-white"
                )}
              >
                customercare@cphl.go.ug
              </a>
            </div>
            <Separator
              orientation="vertical"
              className={cn(
                "h-4",
                currentSection === "dashboard" ? "bg-gray-300" : "bg-white/30"
              )}
            />
            <div className="flex items-center space-x-2">
              <IconPhone className={cn(
                "h-4 w-4",
                currentSection === "dashboard" 
                  ? "text-gray-600" 
                  : "text-white/80"
              )} />
              <a 
                href="tel:0800221100"
                className={cn(
                  "text-sm font-medium hover:underline transition-colors",
                  currentSection === "dashboard"
                    ? "text-gray-600 hover:text-gray-900"
                    : "text-white/80 hover:text-white"
                )}
              >
                0800-221100
              </a>
            </div>
          </div>

          {/* Mobile Contact - Compact */}
          <div className="lg:hidden flex items-center space-x-2">
            <a 
              href="tel:0800221100"
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded transition-colors",
                currentSection === "dashboard"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <IconPhone className="h-4 w-4" />
              <span className="text-xs font-medium">Call</span>
            </a>
            <a 
              href="mailto:customercare@cphl.go.ug"
              className={cn(
                "flex items-center space-x-1 px-2 py-1 rounded transition-colors",
                currentSection === "dashboard"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <IconMail className="h-4 w-4" />
              <span className="text-xs font-medium">Email</span>
            </a>
          </div>

          <Separator
            orientation="vertical"
            className={cn(
              "h-6",
              currentSection === "dashboard" ? "bg-gray-300" : "bg-white/30"
            )}
          />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-8 w-8 rounded-full transition-colors",
                  currentSection === "dashboard"
                    ? "hover:bg-gray-100"
                    : "hover:bg-white/10"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={`https://vercel.com/api/www/avatar/${encodeURIComponent(
                      user?.email || user?.username || "user@ugandavlm.org"
                    )}?s=64`}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="text-xs">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || user?.username}
                  </p>
                  {user?.facility_name && (
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.facility_name}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {user?.username === "admin" && (
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <IconSettings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <IconSettings className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Navigation - Quick Access */}
      <div
        className={cn(
          "md:hidden border-t px-2 py-3",
          currentSection === "dashboard"
            ? "border-gray-200 bg-white"
            : "border-white/20"
        )}
      >
        <div className="flex items-center justify-between space-x-1">
          {navigationSections.map((section) => {
            const IconComponent = section.icon;
            const active = isActive(section.href);

            // Hide EID when in viral-load section, and hide viral-load when in EID section
            if (currentSection === "viral-load" && section.href === "/eid")
              return null;
            if (currentSection === "eid" && section.href === "/viral-load")
              return null;

            return (
              <Link key={section.href} href={section.href} className="flex-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center justify-center space-y-1.5 px-2 py-3 h-auto w-full min-h-[60px] rounded-lg transition-all duration-200",
                    active
                      ? currentSection === "dashboard"
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-white/20 text-white backdrop-blur-sm shadow-sm"
                      : currentSection === "dashboard"
                        ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-xs font-medium leading-tight text-center">
                    {section.name}
                  </span>
                  {active && (
                    <div
                      className={cn(
                        "h-1 w-8 rounded-full",
                        currentSection === "dashboard"
                          ? "bg-primary-foreground/30"
                          : "bg-white/40"
                      )}
                    />
                  )}
                </Button>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
