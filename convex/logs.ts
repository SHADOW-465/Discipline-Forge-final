import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth.config";

// Get user's daily logs
export const getUserDailyLogs = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    let query = ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .order("desc");

    if (args.limit) {
      return await query.take(args.limit);
    }

    return await query.collect();
  },
});

// Get today's log
export const getTodaysLog = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    return await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) =>
        q.eq("userId", user._id).eq("logDate", today)
      )
      .first();
  },
});

// Create or update daily log
export const createOrUpdateDailyLog = mutation({
  args: {
    logDate: v.string(), // YYYY-MM-DD format
    complianceRating: v.number(), // 1-5
    journalEntry: v.string(),
    mood: v.union(
      v.literal("great"),
      v.literal("okay"),
      v.literal("difficult"),
      v.literal("")
    ),
    completedChallenges: v.array(v.id("userChallenges")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    // Check if log already exists for this date
    const existingLog = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) =>
        q.eq("userId", user._id).eq("logDate", args.logDate)
      )
      .first();

    const logData = {
      userId: user._id,
      logDate: args.logDate,
      complianceRating: args.complianceRating,
      journalEntry: args.journalEntry,
      mood: args.mood,
      completedChallenges: args.completedChallenges,
    };

    if (existingLog) {
      return await ctx.db.patch(existingLog._id, logData);
    } else {
      return await ctx.db.insert("dailyLogs", logData);
    }
  },
});

// Get logs for date range
export const getLogsForDateRange = query({
  args: {
    startDate: v.string(), // YYYY-MM-DD format
    endDate: v.string(), // YYYY-MM-DD format
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    const logs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    // Filter logs by date range
    return logs.filter((log) => {
      return log.logDate >= args.startDate && log.logDate <= args.endDate;
    });
  },
});

// Get compliance statistics
export const getComplianceStats = query({
  args: {
    days: v.optional(v.number()), // Number of days to look back
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    const days = args.days || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.logDate);
      return logDate >= startDate && logDate <= endDate;
    });

    if (filteredLogs.length === 0) {
      return {
        averageCompliance: 0,
        totalLogs: 0,
        complianceDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalCompliance = filteredLogs.reduce(
      (sum, log) => sum + log.complianceRating,
      0
    );
    const averageCompliance = totalCompliance / filteredLogs.length;

    const complianceDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    filteredLogs.forEach((log) => {
      complianceDistribution[log.complianceRating as keyof typeof complianceDistribution]++;
    });

    return {
      averageCompliance: Math.round(averageCompliance * 100) / 100,
      totalLogs: filteredLogs.length,
      complianceDistribution,
    };
  },
});

// Get mood statistics
export const getMoodStats = query({
  args: {
    days: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    const days = args.days || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await ctx.db
      .query("dailyLogs")
      .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
      .collect();

    const filteredLogs = logs.filter((log) => {
      const logDate = new Date(log.logDate);
      return logDate >= startDate && logDate <= endDate;
    });

    const moodDistribution = {
      great: 0,
      okay: 0,
      difficult: 0,
      "": 0,
    };

    filteredLogs.forEach((log) => {
      moodDistribution[log.mood]++;
    });

    return {
      totalLogs: filteredLogs.length,
      moodDistribution,
    };
  },
});