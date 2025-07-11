"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Baby, Heart } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { toast } from "sonner";

// Custom icon components using PNG files
const HIVIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <Image
    src="/icons/hiv.png"
    alt="HIV"
    width={32}
    height={32}
    className={className}
  />
);

const HepatitisBIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <Image
    src="/icons/hepatitis_b.png"
    alt="Hepatitis B"
    width={32}
    height={32}
    className={className}
  />
);

const HepatitisCIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <Image
    src="/icons/hepatitis_c.png"
    alt="Hepatitis C"
    width={32}
    height={32}
    className={className}
  />
);

const HPVIcon = ({ className = "h-8 w-8" }: { className?: string }) => (
  <Image
    src="/icons/human_papillomavirus.png"
    alt="Human Papillomavirus"
    width={32}
    height={32}
    className={className}
  />
);

export default function DashboardCards() {
  const actions = [
    {
      title: "HIV Viral Load",
      description: "Monitor and track HIV viral load test request",
      href: "/viral-load",
      icon: HIVIcon,
      theme: "red",
      available: true,
    },
    {
      title: "Early Infant Diagnosis",
      description:
        "Monitor and track EID test request for infants born to HIV Positive Mothers",
      href: "/eid",
      icon: Baby,
      theme: "blue",
      available: true,
    },
    {
      title: "Hepatitis C",
      description: "Monitor and track Hepatitis C test request and management",
      href: "#",
      icon: HepatitisCIcon,
      theme: "orange",
      available: false,
    },
    {
      title: "Hepatitis B",
      description: "Monitor and track Hepatitis B test request and management",
      href: "#",
      icon: HepatitisBIcon,
      theme: "yellow",
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
      title: "Human Papillomavirus",
      description: "Monitor and track HPV screening and vaccination programs",
      href: "#",
      icon: HPVIcon,
      theme: "pink",
      available: false,
    },
  ];

  const handleUnavailableClick = (title: string) => {
    toast.info(`${title} module is coming soon!`, {
      description: "This feature is currently under development.",
    });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action) => {
        const IconComponent = action.icon;

        return (
          <Card
            key={action.title}
            className="group hover:shadow-lg transition-all duration-200 flex flex-col h-full"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    action.theme === "red"
                      ? "bg-red-100 text-red-600"
                      : action.theme === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : action.theme === "yellow"
                          ? "bg-yellow-100 text-yellow-600"
                          : action.theme === "purple"
                            ? "bg-purple-100 text-purple-600"
                            : action.theme === "orange"
                              ? "bg-orange-100 text-orange-600"
                              : action.theme === "pink"
                                ? "bg-pink-100 text-pink-600"
                                : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {action.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 flex flex-col flex-grow">
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed flex-grow">
                {action.description}
              </p>

              {action.available ? (
                <Button
                  asChild
                  size={"lg"}
                  className={`w-full mt-auto rounded-xl ${
                    action.theme === "red"
                      ? "bg-red-600 hover:bg-red-700"
                      : action.theme === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  <Link href={action.href}>Enter</Link>
                </Button>
              ) : (
                <Button
                  size={"lg"}
                  // disabled={!action.available}
                  variant="outline"
                  className="w-full mt-auto rounded-xl cursor-pointer"
                  onClick={() => handleUnavailableClick(action.title)}
                >
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
