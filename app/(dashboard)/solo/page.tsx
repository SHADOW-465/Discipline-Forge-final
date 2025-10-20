"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  CheckCircle,
  Flame,
  BarChart3,
  Activity
} from "lucide-react";
import Link from "next/link";

export default function SoloDashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const userStats = useQuery(api.statistics.getUserStatistics);
  const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);
  const todaysLog = useQuery(api.logs.getTodaysLog);
  const weeklyProgress = useQuery(api.statistics.getWeeklyProgress);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Solo Program Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
    <div>
            <h1 className="text-3xl font-bold mb-2">Solo Discipline Program</h1>
            <p className="text-emerald-100">
              Build self-discipline through personal challenges and daily tracking
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              Day {userStats?.currentStreak || 0}
            </div>
            <div className="text-emerald-100">Current Streak</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/logs">
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900 rounded-full">
                  <Calendar className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Daily Log</h3>
                  <p className="text-sm text-slate-400">
                    {todaysLog ? "Update today's log" : "Create today's log"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/challenges">
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Challenges</h3>
                  <p className="text-sm text-slate-400">
                    {activeChallenges?.length || 0} active challenges
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/progress">
          <Card className="bg-slate-800 border-slate-700 hover:bg-slate-750 transition-colors cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Progress</h3>
                  <p className="text-sm text-slate-400">View your analytics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats?.currentStreak || 0} days
            </div>
            <p className="text-xs text-slate-400">
              Best: {userStats?.longestStreak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Compliance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats?.averageCompliance?.toFixed(1) || "0.0"}/5
            </div>
            <p className="text-xs text-slate-400">
              Average rating
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Challenges</CardTitle>
            <Target className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats?.totalChallengesCompleted || 0}
            </div>
            <p className="text-xs text-slate-400">
              Completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {userStats?.totalLogs || 0}
            </div>
            <p className="text-xs text-slate-400">
              Days tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-emerald-500" />
              Today&apos;s Focus
            </CardTitle>
            <CardDescription className="text-slate-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Compliance Rating:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 rounded-full ${
                          star <= todaysLog.complianceRating
                            ? "bg-emerald-500"
                            : "bg-slate-600"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Mood:</span>
                  <Badge 
                    variant={todaysLog.mood === "great" ? "default" : 
                            todaysLog.mood === "okay" ? "secondary" : "destructive"}
                  >
                    {todaysLog.mood || "Not set"}
                  </Badge>
                </div>
                {todaysLog.journalEntry && (
                  <div>
                    <span className="text-slate-300 block mb-2">Reflection:</span>
                    <p className="text-slate-400 text-sm bg-slate-700 p-3 rounded">
                      {todaysLog.journalEntry}
                    </p>
                  </div>
                )}
                <Link href="/logs">
                  <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                    Update Today&apos;s Log
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No log entry for today</p>
                <Link href="/logs">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Create Today&apos;s Log
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Active Challenges */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Target className="h-5 w-5 mr-2 text-emerald-500" />
              Active Challenges
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your current self-discipline challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeChallenges && activeChallenges.length > 0 ? (
              <div className="space-y-4">
                {activeChallenges.slice(0, 3).map((userChallenge) => (
                  <div
                    key={userChallenge._id}
                    className="bg-slate-700 p-4 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-white">
                        {userChallenge.challenge?.title}
                      </h3>
                      <Badge 
                        variant={
                          userChallenge.challenge?.difficulty === "easy" ? "secondary" :
                          userChallenge.challenge?.difficulty === "medium" ? "default" :
                          userChallenge.challenge?.difficulty === "hard" ? "destructive" : "outline"
                        }
                      >
                        {userChallenge.challenge?.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">
                      {userChallenge.challenge?.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{userChallenge.challenge?.durationDays} days</span>
                      <span>
                        Started {new Date(userChallenge.startedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                {activeChallenges.length > 3 && (
                  <div className="text-center">
                    <Link href="/challenges">
                      <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                        View All Challenges
                      </Button>
                    </Link>
                  </div>
                )}
        </div>
      ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No active challenges</p>
                <Link href="/challenges">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Browse Challenges
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      {weeklyProgress && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Weekly Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your compliance over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Days Logged:</span>
                <span className="text-white font-semibold">
                  {weeklyProgress.daysLogged}/7
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Average Compliance:</span>
                <span className="text-white font-semibold">
                  {weeklyProgress.averageCompliance}/5
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.daysLogged / 7) * 100}%` }}
                />
              </div>
              <div className="text-center">
                <Link href="/progress">
                  <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                    View Detailed Analytics
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}