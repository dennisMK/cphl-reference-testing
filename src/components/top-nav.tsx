"use client"

import * as React from "react"
import {
  IconBabyCarriage,
  IconDashboard,
  IconHelp,
  IconTestPipe,
  IconMedicalCross,
  IconPlus,
  IconSearch,
  IconSettings,
  IconChevronDown,
  IconDatabase,
  IconFileText,
  IconChartBar,
} from "@tabler/icons-react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

import { TestTypeModal } from "@/components/test-type-modal"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"

export function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false)
  const { user, isLoading, logout } = useAuth()

  const handleSignOut = async () => {
    await logout()
  }

  const handleNewRequest = () => {
    setIsTestModalOpen(true)
  }

  const projects = [
    { name: "Viral Load Management", value: "vlm" },
    { name: "Early Infant Diagnosis", value: "eid" },
    { name: "TB Testing Program", value: "tb" },
  ]

  const currentProject = "Viral Load Management"

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: IconChartBar,
    },
    {
      name: "Viral Load",
      href: "/viral-load",
      icon: IconTestPipe,
      dropdownItems: [
        { name: "VL Test Requests", href: "/viral-load/new-request" },
        { name: "VL Results", href: "/viral-load/results" },
        { name: "VL Packages", href: "/viral-load/package-samples" },
      ]
    },
    {
      name: "Early Infant Diagnosis",
      href: "/eid",
      icon: IconBabyCarriage,
      dropdownItems: [
        { name: "EID Test Requests", href: "/eid/new-request" },
        { name: "EID Results", href: "/eid/results" },
        { name: "EID Packages", href: "/eid/package-samples" },
      ]
    },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  // Show loading state if user data is still being fetched
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-3">
            <img src="/uganda-flag.png" alt="Uganda Flag" className="h-8 w-12 object-cover rounded-sm" />
            <span className="text-lg font-semibold text-gray-900">Uganda Lab e-Test Requests</span>
          </div>
          <div className="animate-pulse h-7 w-7 bg-gray-200 rounded-full"></div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Left Section: Brand + Project + Navigation */}
          <div className="flex items-center space-x-8">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <img src="/uganda-flag.png" alt="Uganda Flag" className="h-8 w-12 object-cover rounded-sm" />
              <span className="text-lg font-semibold text-gray-900">Uganda Lab e-Test Requests</span>
              <div className="h-6 w-px bg-gray-300" />
            </div>


            {/* Main Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const active = isActive(item.href)
                
                if (item.dropdownItems) {
                  return (
                    <DropdownMenu key={item.href}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className={`flex items-center rounded-full space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                            active
                              ? "bg-black text-white hover:bg-black hover:text-white"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{item.name}</span>
                          <IconChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>{item.name}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {item.dropdownItems.map((dropdownItem) => (
                          <DropdownMenuItem key={dropdownItem.href} asChild>
                            <Link href={dropdownItem.href}>
                              {dropdownItem.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                }
                
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`flex items-center rounded-full space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-black text-white hover:bg-black hover:text-white"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right Section: Actions */}
          <div className="flex items-center space-x-1">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full ml-2">
                  <Avatar className="h-7 w-7">
                    <AvatarImage 
                      src={`https://vercel.com/api/www/avatar/${encodeURIComponent(user?.email || user?.username || 'user@ugandavlm.org')}?s=64`} 
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
                      {user?.email || user?.username || "No email"}
                    </p>
                    {user?.facility_name && (
                      <p className="text-xs leading-none text-muted-foreground">
                        📍 {user.facility_name}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center">
                    <IconDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <IconSettings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help" className="flex items-center">
                    <IconHelp className="mr-2 h-4 w-4" />
                    Help & Support
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation - Only show on small screens */}
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="flex overflow-x-auto p-2 space-x-2">
            {navItems.map((item) => {
              const IconComponent = item.icon
              const active = isActive(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`flex items-center rounded-full space-x-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                      active
                        ? "bg-black text-white hover:bg-black hover:text-white"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              )
            })}
          </div>
        </div>
      </header>

      <TestTypeModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </>
      )
  } 