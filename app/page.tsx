"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (isLoaded) {
      if (!user) {
        router.push("/sign-in");
      } else if (currentUser) {
        if (currentUser.program === "solo") {
          router.push("/solo");
        } else if (currentUser.program === "keyholder") {
          router.push("/keyholder");
        } else {
          router.push("/dashboard");
        }
      }
    }
  }, [isLoaded, user, currentUser, router]);

  if (!isLoaded || currentUser === undefined) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">DisciplineForge</h1>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">DisciplineForge</h1>
        <p className="text-slate-400 text-lg mb-8">
          Building self-discipline through structured challenges and tracking
        </p>
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-emerald-500 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}