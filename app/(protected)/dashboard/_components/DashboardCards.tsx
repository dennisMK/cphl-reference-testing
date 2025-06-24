import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Baby, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DashboardCards() {
  const cards = [
    {
      title: "HIV Viral Load",
      count: 100,
      requests: 150,
      collections: 85,
      href: "/viral-load",
      icon: Activity,
      buttonColor: "bg-red-600 hover:bg-red-700",
      borderColor: "border-red-200 hover:border-red-300",
    },
    {
      title: "Early Infant Diagnosis",
      count: 100,
      requests: 120,
      collections: 95,
      href: "/eid",
      icon: Baby,
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      borderColor: "border-blue-200 hover:border-blue-300",
    },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <Card key={index} className={`hover:shadow-md transition-shadow ${card.borderColor}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
              <IconComponent className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-4">{card.count}</div>
              
              {/* Analytics */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Requests</p>
                    <p className="text-lg font-semibold">{card.requests}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-lg font-semibold">{card.collections}</p>
                  </div>
                </div>
              </div>

              <Link href={card.href}>
                <Button className={`w-full group ${card.buttonColor}`}>
                  Manage
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
