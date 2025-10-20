"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Target,
  Trophy,
  Flame,
  Activity,
  Award
} from "lucide-react";

export default function ProgressPage() {
  const userStats = useQuery(api.statistics.getUserStatistics);
  const weeklyProgress = useQuery(api.statistics.getWeeklyProgress);
  const streakHistory = useQuery(api.statistics.getStreakHistory, { days: 30 });
  const challengeStats = useQuery(api.statistics.getChallengeStats);
  const complianceStats = useQuery(api.logs.getComplianceStats, { days: 30 });
  const moodStats = useQuery(api.logs.getMoodStats, { days: 30 });

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "text-purple-500";
    if (streak >= 14) return "text-blue-500";
    if (streak >= 7) return "text-green-500";
    if (streak >= 3) return "text-yellow-500";
    return "text-slate-500";
  };

  const getComplianceColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-500";
    if (rating >= 3.5) return "text-yellow-500";
    if (rating >= 2.5) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Progress & Analytics</h1>
          <p className="text-slate-400">Track your self-discipline journey and achievements</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
            <Trophy className="h-3 w-3 mr-1" />
            {userStats?.totalChallengesCompleted || 0} Completed
          </Badge>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
            <Flame className="h-3 w-3 mr-1" />
            {userStats?.currentStreak || 0} Day Streak
          </Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStreakColor(userStats?.currentStreak || 0)}`}>
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
            <div className={`text-2xl font-bold ${getComplianceColor(userStats?.averageCompliance || 0)}`}>
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

      {/* Weekly Progress */}
      {weeklyProgress && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-500" />
              Weekly Progress
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your performance over the last 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {weeklyProgress.daysLogged}
                  </div>
                  <div className="text-sm text-slate-400">Days Logged</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {weeklyProgress.averageCompliance}
                  </div>
                  <div className="text-sm text-slate-400">Avg Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    {Math.round((weeklyProgress.daysLogged / 7) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Consistency</div>
                </div>
              </div>
              
              <div className="w-full bg-slate-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(weeklyProgress.daysLogged / 7) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Challenge Statistics */}
      {challengeStats && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Challenge Statistics
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your challenge completion breakdown
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{challengeStats.total}</div>
                <div className="text-sm text-slate-400">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500">{challengeStats.active}</div>
                <div className="text-sm text-slate-400">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{challengeStats.completed}</div>
                <div className="text-sm text-slate-400">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{challengeStats.failed}</div>
                <div className="text-sm text-slate-400">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-500">{challengeStats.abandoned}</div>
                <div className="text-sm text-slate-400">Abandoned</div>
              </div>
            </div>
            
            {challengeStats.total > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                  <span>Completion Rate</span>
                  <span>{Math.round((challengeStats.completed / challengeStats.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(challengeStats.completed / challengeStats.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Compliance Distribution */}
      {complianceStats && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
              Compliance Distribution
            </CardTitle>
            <CardDescription className="text-slate-400">
              How often you rate each compliance level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = complianceStats.complianceDistribution[rating as keyof typeof complianceStats.complianceDistribution];
                const percentage = complianceStats.totalLogs > 0 
                  ? (count / complianceStats.totalLogs) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="w-8 text-slate-300 font-medium">{rating}</div>
                    <div className="flex-1 bg-slate-700 rounded-full h-4">
                      <div 
                        className={`h-4 rounded-full transition-all duration-300 ${
                          rating >= 4 ? "bg-green-500" :
                          rating >= 3 ? "bg-yellow-500" :
                          rating >= 2 ? "bg-orange-500" : "bg-red-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-slate-400 text-sm text-right">
                      {count} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mood Statistics */}
      {moodStats && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Award className="h-5 w-5 mr-2 text-purple-500" />
              Mood Tracking
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your emotional state over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(moodStats.moodDistribution).map(([mood, count]) => {
                const percentage = moodStats.totalLogs > 0 
                  ? (count / moodStats.totalLogs) * 100 
                  : 0;
                
                const getMoodColor = (mood: string) => {
                  switch (mood) {
                    case "great": return "text-green-500";
                    case "okay": return "text-yellow-500";
                    case "difficult": return "text-red-500";
                    default: return "text-slate-500";
                  }
                };
                
                const getMoodLabel = (mood: string) => {
                  switch (mood) {
                    case "great": return "Great";
                    case "okay": return "Okay";
                    case "difficult": return "Difficult";
                    default: return "Not Set";
                  }
                };
                
                return (
                  <div key={mood} className="text-center">
                    <div className={`text-2xl font-bold ${getMoodColor(mood)}`}>
                      {count}
                    </div>
                    <div className="text-sm text-slate-400">{getMoodLabel(mood)}</div>
                    <div className="text-xs text-slate-500">{percentage.toFixed(1)}%</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak History */}
      {streakHistory && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-500" />
              Streak History
            </CardTitle>
            <CardDescription className="text-slate-400">
              Your daily logging consistency over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {streakHistory.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-sm ${
                    day.hasLog 
                      ? "bg-emerald-500" 
                      : "bg-slate-700"
                  }`}
                  title={`${day.date}: ${day.hasLog ? "Logged" : "No log"}`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
                <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
              </div>
              <span>More</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
