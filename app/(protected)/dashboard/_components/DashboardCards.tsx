"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Shield,  Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import { IconBabyCarriage, IconVirus } from "@tabler/icons-react";
import { toast } from "sonner";

export default function DashboardCards() {
  const actions = [
    {
      title: "HIV Viral Load",
      description: "Monitor and track HIV viral load test request",
      href: "/viral-load",
      icon: Activity,
      theme: "red",
      available: true,
    },
    {
      title: "HIV-Positive Mothers", 
      description: "Monitor and track EID test request for infants born to HIV Positive Mothers",
      href: "/eid",
      icon: IconBabyCarriage,
      theme: "blue",
      available: true,
    },
    {
      title: "Hep B",
      description: "Monitor and track Hepatitis B test request and management",
      href: "#",
      icon: Shield,
      theme: "green",
      available: false,
    },
    {
      title: "Hep C",
      description: "Monitor and track Hepatitis C test request and management",
      href: "#",
      icon: Shield,
      theme: "orange",
      available: false,
    },
    {
      title: "Advanced HIV Disease (AHD)",
      description: "Monitor and track Advanced HIV Disease management and care",
      href: "#",
      icon: Heart,
      theme: "purple",
      available: false,
    },
    {
      title: "Human Papillomavirus (HPV)",
      description: "Monitor and track HPV screening and vaccination programs",
      href: "#",
      icon: IconVirus,
      theme: "pink",
      available: false,
    },
  ];

  const getThemeColors = (theme: string) => {
    switch (theme) {
      case "red":
        return "text-red-600 bg-red-600 hover:bg-red-700";
      case "blue":
        return "text-blue-600 bg-blue-600 hover:bg-blue-700";
      case "green":
        return "text-green-600 bg-green-600 hover:bg-green-700";
      case "orange":
        return "text-orange-600 bg-orange-600 hover:bg-orange-700";
      case "purple":
        return "text-purple-600 bg-purple-600 hover:bg-purple-700";
      case "pink":
        return "text-pink-600 bg-pink-600 hover:bg-pink-700";
      default:
        return "text-gray-600 bg-gray-600 hover:bg-gray-700";
    }
  };

  const handleUnavailableClick = (title: string) => {
    toast.error(`${title} is not available yet`, {
      description: "This feature is coming soon. Please check back later.",
    });
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {actions.map((action, index) => {
        const IconComponent = action.icon;
        const colors = getThemeColors(action.theme);
        const [textColor, bgColor, hoverColor] = colors.split(" ");
        
        return (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className={`h-5 w-5 ${textColor}`} />
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-6">{action.description}</p>
              
              {action.available ? (
                <Link href={action.href}>
                  <Button
                    size={"lg"}
                    variant={"default"}
                    className={`cursor-pointer rounded-xl w-full ${bgColor} ${hoverColor}`}>
                    Enter
                  </Button>
                </Link>
              ) : (
                <Button
                  size={"lg"}
                  variant={"default"}
                  onClick={() => handleUnavailableClick(action.title)}
                  className={`cursor-pointer rounded-xl w-full ${bgColor} ${hoverColor} opacity-70`}>
                  Enter
                </Button>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
