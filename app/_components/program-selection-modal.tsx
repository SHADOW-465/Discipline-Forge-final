"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Lock, User } from "lucide-react";

interface ProgramSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgramSelectionModal({ isOpen, onClose }: ProgramSelectionModalProps) {
  const [selectedProgram, setSelectedProgram] = useState<"solo" | "keyholder" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const updateUserProgram = useMutation(api.users.updateUserProgram);

  const handleProgramSelect = async (program: "solo" | "keyholder") => {
    setIsLoading(true);
    try {
      await updateUserProgram({
        program,
        currentPhase: program === "solo" ? "self_discipline" : "keyholder_setup",
        commitmentDuration: program === "solo" ? 7 : 14,
      });
      onClose();
    } catch (error) {
      console.error("Error updating user program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Choose Your Program</DialogTitle>
          <DialogDescription className="text-center">
            Select the program that best fits your self-discipline journey
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedProgram === "solo"
                ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950" 
                : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => setSelectedProgram("solo")}
            >
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-emerald-100 dark:bg-emerald-900 w-fit">
                <User className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <CardTitle className="text-xl">Solo Chastity</CardTitle>
              <CardDescription>
                Self-discipline focused program for personal growth and habit building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Personal challenge tracking</li>
                <li>• Daily compliance logging</li>
                <li>• Progress analytics</li>
                <li>• Achievement system</li>
              </ul>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedProgram === "keyholder"
                ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950" 
                : "hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => setSelectedProgram("keyholder")}
            >
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 p-3 rounded-full bg-teal-100 dark:bg-teal-900 w-fit">
                <Lock className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>
              <CardTitle className="text-xl">Keyholder Chastity</CardTitle>
              <CardDescription>
                Advanced program with session management and keyholder controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-300">
                <li>• Session management</li>
                <li>• Keyholder controls</li>
                <li>• Advanced tracking</li>
                <li>• Enhanced security</li>
              </ul>
            </CardContent>
          </Card>
          </div>

            <div className="flex justify-center">
          <Button
            onClick={() => selectedProgram && handleProgramSelect(selectedProgram)}
            disabled={!selectedProgram || isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
}