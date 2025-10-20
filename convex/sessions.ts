import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth.config";

// Get user's active session
export const getActiveSession = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return null;

    return await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

// Get all user sessions
export const getUserSessions = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    return await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

// Start a new session
export const startSession = mutation({
  args: {
    goalHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    // Check if there's already an active session
    const activeSession = await ctx.db
      .query("sessions")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    if (activeSession) {
      throw new Error("User already has an active session");
    }

    return await ctx.db.insert("sessions", {
      userId: user._id,
      startDate: Date.now(),
      isActive: true,
      goalHours: args.goalHours,
    });
  },
});

// End a session
export const endSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.sessionId, {
      endDate: Date.now(),
      isActive: false,
    });
  },
});

// Get session with keyholder details
export const getSessionWithKeyholder = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;

    const keyholder = await ctx.db
      .query("keyholders")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    return {
      session,
      keyholder,
    };
  },
});

// Create keyholder for session
export const createKeyholder = mutation({
  args: {
    sessionId: v.id("sessions"),
    name: v.string(),
    passwordHash: v.string(),
    requiredDurationHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || session.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    // Check if keyholder already exists
    const existingKeyholder = await ctx.db
      .query("keyholders")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existingKeyholder) {
      throw new Error("Keyholder already exists for this session");
    }

    return await ctx.db.insert("keyholders", {
      sessionId: args.sessionId,
      name: args.name,
      passwordHash: args.passwordHash,
      requiredDurationHours: args.requiredDurationHours,
    });
  },
});

// Verify keyholder password
export const verifyKeyholderPassword = mutation({
  args: {
    sessionId: v.id("sessions"),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const keyholder = await ctx.db
      .query("keyholders")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!keyholder) {
      throw new Error("Keyholder not found");
    }

    // In a real app, you'd use proper password hashing like bcrypt
    // For now, we'll do a simple comparison (not secure for production)
    return keyholder.passwordHash === args.password;
  },
});