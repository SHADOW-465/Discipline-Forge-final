"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Target, 
  Plus, 
  Clock, 
  Flame,
  CheckCircle,
  X,
  Filter,
  Search,
  Trophy,
  Calendar
} from "lucide-react";

export default function ChallengesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  const allChallenges = useQuery(api.challenges.getAllChallenges);
  const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);
  const completedChallenges = useQuery(api.challenges.getUserCompletedChallenges);

  const startChallenge = useMutation(api.challenges.startChallenge);
  const completeChallenge = useMutation(api.challenges.completeChallenge);
  const abandonChallenge = useMutation(api.challenges.abandonChallenge);

  // Initialize system challenges on first load
  const initializeChallenges = useMutation(api.challenges.initializeSystemChallenges);
  
  useEffect(() => {
    if (allChallenges && allChallenges.length === 0) {
      initializeChallenges({});
    }
  }, [allChallenges, initializeChallenges]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "physical", label: "Physical" },
    { value: "mental", label: "Mental" },
    { value: "social", label: "Social" },
    { value: "productivity", label: "Productivity" },
    { value: "wellness", label: "Wellness" },
  ];

  const difficulties = [
    { value: "all", label: "All Difficulties" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
    { value: "extreme", label: "Extreme" },
  ];


  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "secondary";
      case "medium":
        return "default";
      case "hard":
        return "destructive";
      case "extreme":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredChallenges = allChallenges?.filter((challenge) => {
    const matchesCategory = selectedCategory === "all" || challenge.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty;
    const matchesSearch = challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showActiveOnly) {
      const isActive = activeChallenges?.some(ac => ac.challengeId === challenge._id);
      return matchesCategory && matchesDifficulty && matchesSearch && isActive;
    }
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  }) || [];

  const handleStartChallenge = async (challengeId: string) => {
    try {
      await startChallenge({ challengeId: challengeId as Id<"challenges"> });
    } catch (error) {
      console.error("Error starting challenge:", error);
    }
  };

  const handleCompleteChallenge = async (userChallengeId: string) => {
    try {
      await completeChallenge({ userChallengeId: userChallengeId as Id<"userChallenges"> });
    } catch (error) {
      console.error("Error completing challenge:", error);
    }
  };

  const handleAbandonChallenge = async (userChallengeId: string) => {
    try {
      await abandonChallenge({ userChallengeId: userChallengeId as Id<"userChallenges"> });
    } catch (error) {
      console.error("Error abandoning challenge:", error);
    }
  };

  const isChallengeActive = (challengeId: string) => {
    return activeChallenges?.some(ac => ac.challengeId === challengeId) || false;
  };

  const isChallengeCompleted = (challengeId: string) => {
    return completedChallenges?.some(cc => cc.challengeId === challengeId) || false;
  };

  const getActiveChallenge = (challengeId: string) => {
    return activeChallenges?.find(ac => ac.challengeId === challengeId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Challenges</h1>
          <p className="text-slate-400">Build self-discipline through structured challenges</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
            <Target className="h-3 w-3 mr-1" />
            {activeChallenges?.length || 0} Active
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            <Trophy className="h-3 w-3 mr-1" />
            {completedChallenges?.length || 0} Completed
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty.value} value={difficulty.value}>
                  {difficulty.label}
                </option>
              ))}
            </select>

            {/* Active Only Toggle */}
            <Button
              onClick={() => setShowActiveOnly(!showActiveOnly)}
              variant={showActiveOnly ? "default" : "outline"}
              className={showActiveOnly ? "bg-emerald-600" : "border-slate-600 text-slate-300 hover:bg-slate-700"}
            >
              <Filter className="h-4 w-4 mr-2" />
              Active Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Active Challenges */}
      {activeChallenges && activeChallenges.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-500" />
              Active Challenges
            </CardTitle>
            <CardDescription className="text-slate-400">
              Challenges you&apos;re currently working on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeChallenges.map((userChallenge) => {
                const challenge = userChallenge.challenge;
                if (!challenge) return null;

                const daysRemaining = Math.ceil(
                  (userChallenge.targetCompletion! - Date.now()) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div
                    key={userChallenge._id}
                    className="bg-slate-700 p-4 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{challenge.title}</h3>
                      <Badge variant={getDifficultyBadgeVariant(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysRemaining} days left
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        Started {new Date(userChallenge.startedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleCompleteChallenge(userChallenge._id)}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 flex-1"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Complete
                      </Button>
                      <Button
                        onClick={() => handleAbandonChallenge(userChallenge._id)}
                        size="sm"
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Challenges */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="h-5 w-5 mr-2 text-emerald-500" />
            Available Challenges
          </CardTitle>
          <CardDescription className="text-slate-400">
            {showActiveOnly ? "Your active challenges" : "Browse and start new challenges"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredChallenges.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((challenge) => {
                const isActive = isChallengeActive(challenge._id);
                const isCompleted = isChallengeCompleted(challenge._id);
                const activeChallenge = getActiveChallenge(challenge._id);

                return (
                  <div
                    key={challenge._id}
                    className="bg-slate-700 p-4 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-white">{challenge.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getDifficultyBadgeVariant(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                        {isActive && (
                          <Badge variant="secondary" className="bg-orange-500/20 text-orange-400">
                            <Flame className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {isCompleted && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                            <Trophy className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-slate-400 mb-3">
                      {challenge.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                      <span className="capitalize">{challenge.category}</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {challenge.durationDays} days
                      </span>
                    </div>

                    {isActive && activeChallenge ? (
                      <div className="text-xs text-slate-400 mb-3">
                        Started {new Date(activeChallenge.startedAt).toLocaleDateString()}
                      </div>
                    ) : !isCompleted ? (
                      <Button
                        onClick={() => handleStartChallenge(challenge._id)}
                        size="sm"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        disabled={isActive}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {isActive ? "Already Active" : "Start Challenge"}
                      </Button>
                    ) : (
                      <div className="text-center text-green-400 text-sm">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">No challenges found</p>
              <p className="text-slate-500 text-sm">
                {showActiveOnly 
                  ? "You don't have any active challenges" 
                  : "Try adjusting your filters"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
