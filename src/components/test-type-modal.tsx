"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconTestPipe, IconBabyCarriage, IconX } from "@tabler/icons-react";

interface TestTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestTypeModal({ isOpen, onClose }: TestTypeModalProps) {
  const router = useRouter();

  const handleTestTypeSelect = (type: "viral-load" | "eid") => {
    onClose();
    if (type === "viral-load") {
      router.push("/viral-load/new-request");
    } else {
      router.push("/eid/new-request");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Select Test Type
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <IconX className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Choose the type of test request you'd like to create
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          {/* Viral Load Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-red-500"
            onClick={() => handleTestTypeSelect("viral-load")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                  <IconTestPipe className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Viral Load Testing</h3>
                  <p className="text-sm text-gray-600">
                    Monitor HIV viral load for treatment efficacy
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* EID Card */}
          <Card 
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-blue-500"
            onClick={() => handleTestTypeSelect("eid")}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <IconBabyCarriage className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Early Infant Diagnosis</h3>
                  <p className="text-sm text-gray-600">
                    HIV testing for infants and young children
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 