import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Baby } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardCards() {
  const actions = [
    {
      title: "HIV Viral Load",
      description: "Monitor and track HIV viral load testing for patients",
      href: "/viral-load",
      icon: Activity,
      action: "View",
      count: 145,
      requests: 23,
      collections: 18,
      theme: "red",
    },
    {
      title: "HIV-Positive Mothers", 
      description: "Manage EID testing for infants born to HIV Positive Mothers",
      href: "/eid",
      icon: Baby,
      action: "View",
      count: 67,
      requests: 12,
      collections: 8,
      theme: "blue",
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
              
              <div className="text-2xl font-bold mb-4">{action.count}</div>
              
              {/* Analytics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Requests</p>
                    <p className="text-lg font-semibold">{action.requests}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-lg font-semibold">{action.collections}</p>
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
