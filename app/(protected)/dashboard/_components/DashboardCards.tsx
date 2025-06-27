"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconBabyCarriage } from "@tabler/icons-react";

export default function DashboardCards() {
  const actions = [
    {
      title: "HIV Viral Load",
      description: "Monitor and track HIV viral load testing for patients",
      href: "/viral-load",
      icon: Activity,
      theme: "red",
    },
    {
      title: "HIV-Positive Mothers", 
      description: "Manage EID testing for infants born to HIV Positive Mothers",
      href: "/eid",
      icon: IconBabyCarriage,
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
              <p className="text-sm text-muted-foreground mb-6">{action.description}</p>
              
              <Link href={action.href}>
                <Button
                  size={"lg"}
                  variant={"default"}
                  className={`cursor-pointer rounded-xl w-full ${action.theme === "red" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
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
