"use client"

import * as React from "react"
import {
  IconBabyCarriage,
  IconChartBar,
  IconDashboard,
  IconHelp,
  IconTestPipe,
  IconMedicalCross,
  IconPlus,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { useSession, signOut } from "@/lib/auth-client"
import { useRouter } from "next/navigation"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { TestTypeModal } from "@/components/test-type-modal"
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
  const [isTestModalOpen, setIsTestModalOpen] = React.useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push("/auth/login")
  }

  const handleNewRequest = () => {
    setIsTestModalOpen(true)
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
        title: "New Request",
        url: "#",
        icon: IconPlus,
        onClick: handleNewRequest,
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
    
    ],
    navClouds: [
      {
        title: "Testing Workflows",
        icon: IconTestPipe,
        isActive: true,
        url: "/testing",
        items: [
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
          {
            title: "EID Results",
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
     
    ],
  }

  return (
    <>
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
          {/* <NavDocuments items={data.documents} /> */}
          <NavSecondary items={data.navSecondary} className="mt-auto" />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} onSignOut={handleSignOut} />
        </SidebarFooter>
      </Sidebar>
      
      <TestTypeModal 
        isOpen={isTestModalOpen} 
        onClose={() => setIsTestModalOpen(false)} 
      />
    </>
  )
}
