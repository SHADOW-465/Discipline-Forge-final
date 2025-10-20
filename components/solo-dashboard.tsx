"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { 
  Target, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Award,
  Play,
  Pause,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

interface SoloDashboardProps {
  userId: Id<"users">;
}

export function SoloDashboard({ }: SoloDashboardProps) {
  const [isStartingSession, setIsStartingSession] = useState(false);
  
  const userStats = useQuery(api.statistics.getUserStatistics);
  const activeSession = useQuery(api.sessions.getActiveSession);
  const userChallenges = useQuery(api.challenges.getUserActiveChallenges);
  const recentLogs = useQuery(api.logs.getUserDailyLogs, { limit: 5 });
  
  const startSession = useMutation(api.sessions.startSession);
  const endSession = useMutation(api.sessions.endSession);

  const handleStartSession = async () => {
    setIsStartingSession(true);
    try {
      await startSession({ goalHours: 24 });
    } catch (error) {
      console.error("Error starting session:", error);
    } finally {
      setIsStartingSession(false);
    }
  };

  const handleEndSession = async () => {
    if (activeSession) {
      try {
        await endSession({ sessionId: activeSession._id as Id<"sessions"> });
      } catch (error) {
        console.error("Error ending session:", error);
      }
    }
  };

  const getSessionDuration = () => {
    if (!activeSession) return 0;
    const now = Date.now();
    const duration = now - activeSession.startDate;
    return Math.floor(duration / (1000 * 60 * 60)); // Hours
  };

  const activeChallenges = userChallenges?.filter(c => c.status === "active") || [];
  const completedChallenges = userChallenges?.filter(c => c.status === "completed") || [];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.currentStreak || 0}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats?.longestStreak || 0}</div>
            <p className="text-xs text-muted-foreground">days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Challenges Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedChallenges.length}</div>
            <p className="text-xs text-muted-foreground">total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Compliance</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats?.averageCompliance ? userStats.averageCompliance.toFixed(1) : "0.0"}
            </div>
            <p className="text-xs text-muted-foreground">out of 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Session */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Current Session</span>
          </CardTitle>
          <CardDescription>
            {activeSession ? "Track your current discipline session" : "Start a new session to begin tracking"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeSession ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{getSessionDuration()}h</p>
                  <p className="text-sm text-muted-foreground">Session duration</p>
                </div>
                <Button onClick={handleEndSession} variant="destructive">
                  <Pause className="h-4 w-4 mr-2" />
                  End Session
                </Button>
              </div>
              {activeSession.goalHours && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to goal</span>
                    <span>{getSessionDuration()}/{activeSession.goalHours}h</span>
                  </div>
                  <Progress 
                    value={(getSessionDuration() / activeSession.goalHours) * 100} 
                    className="h-2"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active session</p>
              <Button onClick={handleStartSession} disabled={isStartingSession}>
                <Play className="h-4 w-4 mr-2" />
                {isStartingSession ? "Starting..." : "Start Session"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Active Challenges</span>
          </CardTitle>
          <CardDescription>
            {activeChallenges.length > 0 
              ? "Continue working on your current challenges" 
              : "No active challenges. Start one to begin your journey!"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeChallenges.length > 0 ? (
            <div className="space-y-4">
              {activeChallenges.map((userChallenge) => (
                <div key={userChallenge._id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{userChallenge.challenge?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {userChallenge.challenge?.description}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="secondary">
                        {userChallenge.challenge?.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {userChallenge.challenge?.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Started {new Date(userChallenge.startedAt).toLocaleDateString()}
                    </p>
                    {userChallenge.targetCompletion && (
                      <p className="text-sm text-muted-foreground">
                        Due {new Date(userChallenge.targetCompletion).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No active challenges</p>
              <Button variant="outline">
                Browse Challenges
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activity</span>
          </CardTitle>
          <CardDescription>
            Your recent daily logs and progress updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentLogs && recentLogs.length > 0 ? (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log._id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{log.logDate}</p>
                    <p className="text-sm text-muted-foreground">
                      Compliance: {log.complianceRating}/5
                      {log.mood && ` • Mood: ${log.mood}`}
                    </p>
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < log.complianceRating ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
