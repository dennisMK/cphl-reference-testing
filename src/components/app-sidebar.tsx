"use client"

import * as React from "react"
import {
  IconActivity,
  IconBabyCarriage,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconHelp,
  IconTestPipe,
  IconMedicalCross,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconInnerShadowTop,
} from "@tabler/icons-react"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const data = {
    user: {
      name: session?.user?.name || "User",
      email: session?.user?.email || "user@ugandavlm.org",
      avatar: "/uganda.png",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
      },
      {
        title: "Viral Load",
        url: "/viral-load",
        icon: IconTestPipe,
      },
             {
         title: "Early Infant Diagnosis",
         url: "/eid", 
         icon: IconBabyCarriage,
       },
      {
        title: "Analytics",
        url: "/analytics",
        icon: IconChartBar,
      },
      {
        title: "Activity",
        url: "/activity",
        icon: IconActivity,
      },
    ],
    navClouds: [
      {
        title: "Viral Load Testing",
        icon: IconTestPipe,
        isActive: true,
        url: "/viral-load",
        items: [
          {
            title: "New Request",
            url: "/viral-load/new-request",
          },
          {
            title: "Pending Collection",
            url: "/viral-load/pending-collection",
          },
          {
            title: "Collect Sample",
            url: "/viral-load/collect-sample",
          },
          {
            title: "View Results",
            url: "/viral-load/view",
          },
        ],
      },
             {
         title: "EID Testing",
         icon: IconBabyCarriage,
         url: "/eid",
        items: [
          {
            title: "New EID Request",
            url: "/eid/new-request",
          },
          {
            title: "Track Infants",
            url: "/eid/track",
          },
          {
            title: "Results & Reports",
            url: "/eid/results",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
      },
      {
        title: "Help & Support",
        url: "/help",
        icon: IconHelp,
      },
      {
        title: "Search",
        url: "/search",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Lab Reports",
        url: "/reports",
        icon: IconReport,
      },
      {
        name: "Patient Database",
        url: "/database",
        icon: IconDatabase,
      },
      {
        name: "System Users",
        url: "/users",
        icon: IconUsers,
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconMedicalCross className="!size-5 text-red-600" />
                <span className="text-base font-semibold">Uganda VLM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} onSignOut={handleSignOut} />
      </SidebarFooter>
    </Sidebar>
  )
}
