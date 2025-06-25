"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Package, FileText } from "lucide-react";
import Link from "next/link";

export default function page() {
  const actions = [
    { 
      title: "New Test Request", 
      icon: Plus, 
      href: "/viral-load/new-request", 
      action: "create",
      description: "Create a new HIV viral load test request for a patient"
    },
    { 
      title: "Pending Sample Collection", 
      icon: Clock, 
      href: "/viral-load/pending-collection", 
      action: "view",
      description: "View and manage test requests waiting for sample collection"
    },
    { 
      title: "Package Samples", 
      icon: Package, 
      href: "/viral-load/package-samples", 
      action: "view",
      description: "Prepare and package collected samples for laboratory shipment"
    },
    { 
      title: "VL Results", 
      icon: FileText, 
      href: "/viral-load/view", 
      action: "view",
      description: "View and manage HIV viral load test results from the laboratory"
    }
  ];

  return (
    <main className="md:container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">HIV Viral Load</h1>
        <p className="text-muted-foreground">Manage HIV viral load test requests, sample collection, and packaging for laboratory processing.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    className={`cursor-pointer rounded-xl w-full ${action.action === "create" ? "bg-red-600 hover:bg-red-700" : ""}`}>
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
