import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth.config";

// Get current user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();
  },
});

// Create or update user
export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    program: v.union(v.literal("solo"), v.literal("keyholder")),
    currentPhase: v.string(),
    commitmentDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        program: args.program,
        currentPhase: args.currentPhase,
        commitmentDuration: args.commitmentDuration,
      });
    } else {
      return await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        clerkId: args.clerkId,
        program: args.program,
        currentPhase: args.currentPhase,
        commitmentStart: Date.now(),
        commitmentDuration: args.commitmentDuration,
      });
    }
  },
});

// Update user program
export const updateUserProgram = mutation({
  args: {
    program: v.union(v.literal("solo"), v.literal("keyholder")),
    currentPhase: v.string(),
    commitmentDuration: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.patch(user._id, {
      program: args.program,
      currentPhase: args.currentPhase,
      commitmentDuration: args.commitmentDuration,
      commitmentStart: Date.now(),
    });
  },
});

// Delete user
export const deleteUser = mutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      // Delete related data
      const sessions = await ctx.db
        .query("sessions")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      for (const session of sessions) {
        await ctx.db.delete(session._id);
      }

      const userChallenges = await ctx.db
        .query("userChallenges")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();

      for (const challenge of userChallenges) {
        await ctx.db.delete(challenge._id);
      }

      const dailyLogs = await ctx.db
        .query("dailyLogs")
        .withIndex("by_userId_logDate", (q) => q.eq("userId", user._id))
        .collect();

      for (const log of dailyLogs) {
        await ctx.db.delete(log._id);
      }

      const statistics = await ctx.db
        .query("statistics")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .first();

      if (statistics) {
        await ctx.db.delete(statistics._id);
      }

      await ctx.db.delete(user._id);
    }
  },
});