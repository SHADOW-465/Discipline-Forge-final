import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Stores user data synced from Clerk
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    program: v.union(v.literal("solo"), v.literal("keyholder")),
    currentPhase: v.string(),
    commitmentStart: v.optional(v.number()),
    commitmentDuration: v.number(),
  }).index("by_clerkId", ["clerkId"]),

  // Tracks chastity sessions, mainly for the Keyholder program
  sessions: defineTable({
    userId: v.id("users"),
    startDate: v.number(),
    endDate: v.optional(v.number()),
    isActive: v.boolean(),
    goalHours: v.optional(v.number()),
  }).index("by_userId", ["userId"]),

  // Manages keyholder details for a session
  keyholders: defineTable({
    sessionId: v.id("sessions"),
    name: v.string(),
    passwordHash: v.string(), // Note: Implement secure hashing
    requiredDurationHours: v.optional(v.number()),
  }).index("by_sessionId", ["sessionId"]),

  // Library of all available challenges
  challenges: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.union(v.literal("physical"), v.literal("mental"), v.literal("social"), v.literal("productivity"), v.literal("wellness")),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"), v.literal("extreme")),
    durationDays: v.number(),
    isSystem: v.boolean(),
    createdBy: v.optional(v.id("users")),
  }),

  // Tracks user progress on specific challenges
  userChallenges: defineTable({
    userId: v.id("users"),
    challengeId: v.id("challenges"),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("failed"), v.literal("abandoned")),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    targetCompletion: v.optional(v.number()),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_challengeId", ["userId", "challengeId"]),

  // Daily user check-ins
  dailyLogs: defineTable({
    userId: v.id("users"),
    logDate: v.string(), // Format: "YYYY-MM-DD"
    complianceRating: v.number(), // 1-5
    journalEntry: v.string(),
    mood: v.union(v.literal("great"), v.literal("okay"), v.literal("difficult"), v.literal("")),
    completedChallenges: v.array(v.id("userChallenges")),
  }).index("by_userId_logDate", ["userId", "logDate"]),

  // Cached statistics for performance
  statistics: defineTable({
    userId: v.id("users"),
    currentStreak: v.number(),
    longestStreak: v.number(),
    totalLogs: v.number(),
    totalChallengesCompleted: v.number(),
    averageCompliance: v.number(),
  }).index("by_userId", ["userId"]),
});