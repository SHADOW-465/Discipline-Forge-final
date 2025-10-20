"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Lock, 
  Clock, 
  Shield, 
  Settings,
  Play,
  Square,
  Key,
  Calendar,
  BarChart3,
  Activity
} from "lucide-react";
import { useState } from "react";

export default function KeyholderDashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const activeSession = useQuery(api.sessions.getActiveSession);
  const userStats = useQuery(api.statistics.getUserStatistics);
  const todaysLog = useQuery(api.logs.getTodaysLog);
  const weeklyProgress = useQuery(api.statistics.getWeeklyProgress);

  const [isStartingSession, setIsStartingSession] = useState(false);
  const [isEndingSession, setIsEndingSession] = useState(false);

  const startSession = useMutation(api.sessions.startSession);
  const endSession = useMutation(api.sessions.endSession);

  const handleStartSession = async () => {
    setIsStartingSession(true);
    try {
      await startSession({ goalHours: 24 }); // Default 24 hours
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSession) return;
    
    setIsEndingSession(true);
    try {
      await endSession({ sessionId: activeSession._id });
    } catch (error) {
      console.error("Error ending session:", error);
    } finally {
      setIsEndingSession(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const sessionDuration = activeSession 
    ? Math.floor((Date.now() - activeSession.startDate) / (1000 * 60 * 60))
    : 0;

  return (
    <div className="space-y-6">
      {/* Keyholder Program Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
    <div>
            <h1 className="text-3xl font-bold mb-2">Keyholder Program</h1>
            <p className="text-teal-100">
              Advanced session management with enhanced security controls
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {activeSession ? "Session Active" : "No Active Session"}
            </div>
            <div className="text-teal-100">
              {activeSession ? `${sessionDuration}h elapsed` : "Ready to start"}
            </div>
          </div>
        </div>
      </div>

      {/* Session Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Lock className="h-5 w-5 mr-2 text-teal-500" />
              Session Control
            </CardTitle>
            <CardDescription className="text-slate-400">
              Manage your chastity sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeSession ? (
              <div className="space-y-4">
                <div className="bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Session Duration:</span>
                    <span className="text-white font-semibold">
                      {sessionDuration}h {Math.floor(((Date.now() - activeSession.startDate) % (1000 * 60 * 60)) / (1000 * 60))}m
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Goal:</span>
                    <span className="text-white font-semibold">
                      {activeSession.goalHours || "No goal set"}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300">Started:</span>
                    <span className="text-white font-semibold">
                      {new Date(activeSession.startDate).toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={handleEndSession}
                    disabled={isEndingSession}
                    variant="destructive"
                    className="flex-1"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {isEndingSession ? "Ending..." : "End Session"}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Lock className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No active session</p>
                <Button
                  onClick={handleStartSession}
                  disabled={isStartingSession}
                  className="bg-teal-600 hover:bg-teal-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isStartingSession ? "Starting..." : "Start New Session"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keyholder Settings */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-blue-500" />
              Keyholder Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Configure session parameters and security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="font-semibold text-white mb-2">Session Defaults</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Default Duration:</span>
                    <span className="text-white">24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Security Level:</span>
                    <Badge variant="secondary">High</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Auto-lock:</span>
                    <span className="text-white">Enabled</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Key className="h-4 w-4 mr-2" />
                  Manage Keyholder Access
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
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
            <BarChart3 className="h-4 w-4 text-blue-500" />
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
            <CardTitle className="text-sm font-medium text-slate-300">Sessions</CardTitle>
            <Lock className="h-4 w-4 text-teal-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {activeSession ? "1" : "0"}
            </div>
            <p className="text-xs text-slate-400">
              Active sessions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Logs</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
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

      {/* Today's Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Clock className="h-5 w-5 mr-2 text-teal-500" />
              Today&apos;s Status
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
                            ? "bg-teal-500"
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
                    <span className="text-slate-300 block mb-2">Journal Entry:</span>
                    <p className="text-slate-400 text-sm bg-slate-700 p-3 rounded">
                      {todaysLog.journalEntry}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">No log entry for today</p>
                <Button className="bg-teal-600 hover:bg-teal-700">
                  Create Today&apos;s Log
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Weekly Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Last 7 days performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {weeklyProgress ? (
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
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(weeklyProgress.daysLogged / 7) * 100}%` }}
                  />
                </div>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  View Detailed Progress
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">No data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}