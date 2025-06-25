"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TestTube } from "lucide-react";
import Link from "next/link";

export default function page() {
  const actions = [
    { 
      title: "New Test Request", 
      icon: Plus, 
      href: "/eid/create-request", 
      action: "create",
      description: "Create a new EID test request for infant HIV diagnosis"
    },
    { 
      title: "Collect Sample", 
      icon: TestTube, 
      href: "/eid/collect-sample", 
      action: "view",
      description: "Collect and register biological samples for testing"
    }
  ];

  return (
    <main className="md:container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Early Infant Diagnosis (EID)</h1>
        <p className="text-muted-foreground">Request for EID testing and access results electronically for infant HIV diagnosis.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                <Link href={action.href}>
                  <Button
                  size={"lg"}
                    variant={action.action === "create" ? "default" : "outline"}
                    className={`cursor-pointer rounded-xl w-full ${action.action === "create" ? "bg-blue-600 hover:bg-blue-700" : ""}`}>
                    {action.action === "create" ? "Create" : "View"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
