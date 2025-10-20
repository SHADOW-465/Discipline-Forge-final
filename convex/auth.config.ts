// Simple auth helper for Convex
export const getAuthUserId = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject;
};

// Default export required by Convex
export default {
    providers: [
      {
        domain: process.env.CLERK_FRONTEND_API_URL,
        applicationID: 'convex',
      },
    ],
  }