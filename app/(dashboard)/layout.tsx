"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ProgramSelectionModal } from "../_components/program-selection-modal";
import { useState, useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import { BarChart3, Calendar, Target, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [showProgramModal, setShowProgramModal] = useState(false);
  const router = useRouter();
  
  const currentUser = useQuery(api.users.getCurrentUser);
  const isLoading = !isLoaded || currentUser === undefined;

  useEffect(() => {
    if (isLoaded && currentUser && !currentUser.program) {
      setShowProgramModal(true);
    }
  }, [isLoaded, currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Challenges", href: "/challenges", icon: Target },
    { name: "Logs", href: "/logs", icon: Calendar },
    { name: "Progress", href: "/progress", icon: BarChart3 },
  ];

  if (currentUser?.program === "keyholder") {
    navigation.splice(1, 0, { name: "Sessions", href: "/sessions", icon: Lock });
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">DisciplineForge</h1>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center space-x-4">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "h-8 w-8",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-slate-800 border-b border-slate-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Program Selection Modal */}
      <ProgramSelectionModal
        isOpen={showProgramModal}
        onClose={() => setShowProgramModal(false)}
      />
    </div>
  );
}