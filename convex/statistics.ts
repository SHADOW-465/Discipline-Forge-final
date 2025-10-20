import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth.config";

// Get user statistics
export const getUserStatistics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    // Get cached statistics
    const stats = await ctx.db
      .query("statistics")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    return stats;
  },
});

// Update user statistics
export const updateUserStatistics = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    // Get all daily logs
    const dailyLogs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    // Get all user challenges
    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    // Calculate current streak
    const sortedLogs = dailyLogs.sort((a, b) => b.logDate.localeCompare(a.logDate));
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    let currentDate = new Date(today);

    for (let i = 0; i < 365; i++) { // Check up to a year back
      const dateStr = currentDate.toISOString().split("T")[0];
      const logForDate = sortedLogs.find(log => log.logDate === dateStr);
      
      if (logForDate) {
        if (i === 0) {
          currentStreak = 1;
          tempStreak = 1;
        } else {
          currentStreak++;
          tempStreak++;
        }
      } else {
        if (i === 0) {
          // If no log for today, check yesterday
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        } else {
          break;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate total challenges completed
    const totalChallengesCompleted = userChallenges.filter(
      challenge => challenge.status === "completed"
    ).length;

    // Calculate average compliance
    const totalCompliance = dailyLogs.reduce(
      (sum, log) => sum + log.complianceRating,
      0
    );
    const averageCompliance = dailyLogs.length > 0 
      ? totalCompliance / dailyLogs.length 
      : 0;

    // Get or create statistics record
    let stats = await ctx.db
      .query("statistics")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    const statsData = {
      userId: user._id,
      currentStreak,
      longestStreak,
      totalLogs: dailyLogs.length,
      totalChallengesCompleted,
      averageCompliance: Math.round(averageCompliance * 100) / 100,
    };

    if (stats) {
      return await ctx.db.patch(stats._id, statsData);
    } else {
      return await ctx.db.insert("statistics", statsData);
    }
  },
});

// Get streak history for the last 30 days
export const getStreakHistory = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    const days = args.days || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyLogs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    // Create a map of logs by date
    const logsByDate = new Map();
    dailyLogs.forEach(log => {
      logsByDate.set(log.logDate, log);
    });

    // Generate streak history
    const streakHistory = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const hasLog = logsByDate.has(dateStr);
      
      streakHistory.push({
        date: dateStr,
        hasLog,
        complianceRating: hasLog ? logsByDate.get(dateStr).complianceRating : null,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return streakHistory;
  },
});

// Get challenge completion statistics
export const getChallengeStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const stats = {
      total: userChallenges.length,
      active: userChallenges.filter(c => c.status === "active").length,
      completed: userChallenges.filter(c => c.status === "completed").length,
      failed: userChallenges.filter(c => c.status === "failed").length,
      abandoned: userChallenges.filter(c => c.status === "abandoned").length,
    };

    return stats;
  },
});

// Get weekly progress
export const getWeeklyProgress = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const dailyLogs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    const weeklyLogs = dailyLogs.filter(log => {
      const logDate = new Date(log.logDate);
      return logDate >= startDate && logDate <= endDate;
    });

    const totalCompliance = weeklyLogs.reduce(
      (sum, log) => sum + log.complianceRating,
      0
    );
    const averageCompliance = weeklyLogs.length > 0 
      ? totalCompliance / weeklyLogs.length 
      : 0;

    return {
      daysLogged: weeklyLogs.length,
      averageCompliance: Math.round(averageCompliance * 100) / 100,
      logs: weeklyLogs.sort((a, b) => a.logDate.localeCompare(b.logDate)),
    };
  },
});