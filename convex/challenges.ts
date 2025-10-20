import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "./auth.config";

// Get all available challenges
export const getAllChallenges = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("challenges")
      .order("desc")
      .collect();
  },
});

// Get challenges by category
export const getChallengesByCategory = query({
  args: {
    category: v.union(
      v.literal("physical"),
      v.literal("mental"),
      v.literal("social"),
      v.literal("productivity"),
      v.literal("wellness")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("category"), args.category))
      .collect();
  },
});

// Get challenges by difficulty
export const getChallengesByDifficulty = query({
  args: {
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
      v.literal("extreme")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("difficulty"), args.difficulty))
      .collect();
  },
});

// Get user's active challenges
export const getUserActiveChallenges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get challenge details for each user challenge
    const challengesWithDetails = await Promise.all(
      userChallenges.map(async (userChallenge) => {
        const challenge = await ctx.db.get(userChallenge.challengeId);
        return {
          ...userChallenge,
          challenge,
        };
      })
    );

    return challengesWithDetails;
  },
});

// Get user's completed challenges
export const getUserCompletedChallenges = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return [];

    const userChallenges = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("status"), "completed"))
      .collect();

    // Get challenge details for each user challenge
    const challengesWithDetails = await Promise.all(
      userChallenges.map(async (userChallenge) => {
        const challenge = await ctx.db.get(userChallenge.challengeId);
        return {
          ...userChallenge,
          challenge,
        };
      })
    );

    return challengesWithDetails;
  },
});

// Start a challenge
export const startChallenge = mutation({
  args: {
    challengeId: v.id("challenges"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    const challenge = await ctx.db.get(args.challengeId);
    if (!challenge) throw new Error("Challenge not found");

    // Check if user already has this challenge active
    const existingChallenge = await ctx.db
      .query("userChallenges")
      .withIndex("by_userId_challengeId", (q) =>
        q.eq("userId", user._id).eq("challengeId", args.challengeId)
      )
      .first();

    if (existingChallenge && existingChallenge.status === "active") {
      throw new Error("Challenge is already active");
    }

    const now = Date.now();
    const targetCompletion = now + challenge.durationDays * 24 * 60 * 60 * 1000;

    return await ctx.db.insert("userChallenges", {
      userId: user._id,
      challengeId: args.challengeId,
      status: "active",
      startedAt: now,
      targetCompletion,
    });
  },
});

// Complete a challenge
export const completeChallenge = mutation({
  args: {
    userChallengeId: v.id("userChallenges"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userChallenge = await ctx.db.get(args.userChallengeId);
    if (!userChallenge) throw new Error("User challenge not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || userChallenge.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    if (userChallenge.status !== "active") {
      throw new Error("Challenge is not active");
    }

    return await ctx.db.patch(args.userChallengeId, {
      status: "completed",
      completedAt: Date.now(),
    });
  },
});

// Abandon a challenge
export const abandonChallenge = mutation({
  args: {
    userChallengeId: v.id("userChallenges"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const userChallenge = await ctx.db.get(args.userChallengeId);
    if (!userChallenge) throw new Error("User challenge not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user || userChallenge.userId !== user._id) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.patch(args.userChallengeId, {
      status: "abandoned",
    });
  },
});

// Create a new challenge (for system challenges)
export const createChallenge = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.union(
      v.literal("physical"),
      v.literal("mental"),
      v.literal("social"),
      v.literal("productivity"),
      v.literal("wellness")
    ),
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard"),
      v.literal("extreme")
    ),
    durationDays: v.number(),
    isSystem: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    return await ctx.db.insert("challenges", {
      title: args.title,
      description: args.description,
      category: args.category,
      difficulty: args.difficulty,
      durationDays: args.durationDays,
      isSystem: args.isSystem,
      createdBy: user._id,
    });
  },
});

// Initialize system challenges
export const initializeSystemChallenges = mutation({
  args: {},
  handler: async (ctx) => {
    const systemChallenges = [
      {
        title: "Morning Meditation",
        description: "Start each day with 10 minutes of meditation",
        category: "mental" as const,
        difficulty: "easy" as const,
        durationDays: 7,
        isSystem: true,
      },
      {
        title: "No Social Media",
        description: "Avoid all social media platforms for the duration",
        category: "mental" as const,
        difficulty: "medium" as const,
        durationDays: 3,
        isSystem: true,
      },
      {
        title: "Daily Exercise",
        description: "Complete 30 minutes of physical activity daily",
        category: "physical" as const,
        difficulty: "medium" as const,
        durationDays: 14,
        isSystem: true,
      },
      {
        title: "Cold Shower Challenge",
        description: "Take cold showers for the entire duration",
        category: "physical" as const,
        difficulty: "hard" as const,
        durationDays: 7,
        isSystem: true,
      },
      {
        title: "Digital Detox",
        description: "No screens for 2 hours before bed",
        category: "wellness" as const,
        difficulty: "easy" as const,
        durationDays: 10,
        isSystem: true,
      },
      {
        title: "Gratitude Journal",
        description: "Write down 3 things you're grateful for each day",
        category: "mental" as const,
        difficulty: "easy" as const,
        durationDays: 21,
        isSystem: true,
      },
      {
        title: "Early Bird",
        description: "Wake up at 6 AM every day",
        category: "productivity" as const,
        difficulty: "hard" as const,
        durationDays: 14,
        isSystem: true,
      },
      {
        title: "No Junk Food",
        description: "Avoid all processed and junk food",
        category: "wellness" as const,
        difficulty: "medium" as const,
        durationDays: 7,
        isSystem: true,
      },
    ];

    // Check if system challenges already exist
    const existingChallenges = await ctx.db
      .query("challenges")
      .filter((q) => q.eq(q.field("isSystem"), true))
      .collect();

    if (existingChallenges.length > 0) {
      return; // System challenges already initialized
    }

    // Insert system challenges
    for (const challenge of systemChallenges) {
      await ctx.db.insert("challenges", challenge);
    }
  },
});