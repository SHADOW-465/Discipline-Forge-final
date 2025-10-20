# API Reference - DisciplineForge

This document provides comprehensive API documentation for all Convex functions, including parameters, return types, and usage examples.

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users API](#users-api)
3. [Sessions API](#sessions-api)
4. [Challenges API](#challenges-api)
5. [Logs API](#logs-api)
6. [Statistics API](#statistics-api)
7. [HTTP Endpoints](#http-endpoints)
8. [Error Handling](#error-handling)

---

## 🔐 Authentication

All API functions require authentication. The authentication is handled automatically by Convex when using the React hooks.

### Authentication Helper
```typescript
// convex/auth.config.ts
export const getAuthUserId = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject;
};
```

---

## 👤 Users API

### `getCurrentUser`
Get the current authenticated user's profile.

**Type**: `query`  
**Parameters**: None  
**Returns**: `User | null`

```typescript
// Usage in React component
const currentUser = useQuery(api.users.getCurrentUser);
```

**Response**:
```typescript
interface User {
  _id: Id<"users">;
  name: string;
  email: string;
  imageUrl?: string;
  clerkId: string;
  program: "solo" | "keyholder";
  currentPhase: string;
  commitmentStart?: number;
  commitmentDuration: number;
  _creationTime: number;
}
```

### `createOrUpdateUser`
Create a new user or update an existing user's profile.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  name: string;
  email: string;
  imageUrl?: string;
  clerkId: string;
  program: "solo" | "keyholder";
  currentPhase: string;
  commitmentDuration: number;
}
```
**Returns**: `Id<"users">`

```typescript
// Usage in React component
const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

await createOrUpdateUser({
  name: "John Doe",
  email: "john@example.com",
  imageUrl: "https://example.com/avatar.jpg",
  clerkId: "user_123",
  program: "solo",
  currentPhase: "getting_started",
  commitmentDuration: 7
});
```

### `updateUserProgram`
Update a user's program and related settings.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  program: "solo" | "keyholder";
  currentPhase: string;
  commitmentDuration: number;
}
```
**Returns**: `Id<"users">`

```typescript
// Usage in React component
const updateUserProgram = useMutation(api.users.updateUserProgram);

await updateUserProgram({
  program: "keyholder",
  currentPhase: "keyholder_setup",
  commitmentDuration: 14
});
```

### `deleteUser`
Delete a user and all associated data.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  clerkId: string;
}
```
**Returns**: `void`

```typescript
// Usage in webhook handler
await ctx.runMutation(api.users.deleteUser, {
  clerkId: "user_123"
});
```

---

## ⏱️ Sessions API

### `getActiveSession`
Get the user's currently active session.

**Type**: `query`  
**Parameters**: None  
**Returns**: `Session | null`

```typescript
// Usage in React component
const activeSession = useQuery(api.sessions.getActiveSession);
```

**Response**:
```typescript
interface Session {
  _id: Id<"sessions">;
  userId: Id<"users">;
  startDate: number;
  endDate?: number;
  isActive: boolean;
  goalHours?: number;
  _creationTime: number;
}
```

### `getUserSessions`
Get all sessions for the current user.

**Type**: `query`  
**Parameters**: None  
**Returns**: `Session[]`

```typescript
// Usage in React component
const userSessions = useQuery(api.sessions.getUserSessions);
```

### `startSession`
Start a new chastity session.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  goalHours?: number;
}
```
**Returns**: `Id<"sessions">`

```typescript
// Usage in React component
const startSession = useMutation(api.sessions.startSession);

await startSession({ goalHours: 24 });
```

### `endSession`
End an active session.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  sessionId: Id<"sessions">;
}
```
**Returns**: `Id<"sessions">`

```typescript
// Usage in React component
const endSession = useMutation(api.sessions.endSession);

await endSession({ sessionId: "session_123" });
```

### `getSessionWithKeyholder`
Get session details including keyholder information.

**Type**: `query`  
**Parameters**:
```typescript
{
  sessionId: Id<"sessions">;
}
```
**Returns**: `{ session: Session; keyholder: Keyholder | null } | null`

```typescript
// Usage in React component
const sessionWithKeyholder = useQuery(
  api.sessions.getSessionWithKeyholder,
  { sessionId: "session_123" }
);
```

### `createKeyholder`
Create a keyholder for a session.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  sessionId: Id<"sessions">;
  name: string;
  passwordHash: string;
  requiredDurationHours?: number;
}
```
**Returns**: `Id<"keyholders">`

```typescript
// Usage in React component
const createKeyholder = useMutation(api.sessions.createKeyholder);

await createKeyholder({
  sessionId: "session_123",
  name: "Partner",
  passwordHash: "hashed_password",
  requiredDurationHours: 24
});
```

### `verifyKeyholderPassword`
Verify a keyholder password.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  sessionId: Id<"sessions">;
  password: string;
}
```
**Returns**: `boolean`

```typescript
// Usage in React component
const verifyKeyholderPassword = useMutation(api.sessions.verifyKeyholderPassword);

const isValid = await verifyKeyholderPassword({
  sessionId: "session_123",
  password: "user_password"
});
```

---

## 🎯 Challenges API

### `getAllChallenges`
Get all available challenges.

**Type**: `query`  
**Parameters**: None  
**Returns**: `Challenge[]`

```typescript
// Usage in React component
const allChallenges = useQuery(api.challenges.getAllChallenges);
```

**Response**:
```typescript
interface Challenge {
  _id: Id<"challenges">;
  title: string;
  description: string;
  category: "physical" | "mental" | "social" | "productivity" | "wellness";
  difficulty: "easy" | "medium" | "hard" | "extreme";
  durationDays: number;
  isSystem: boolean;
  createdBy?: Id<"users">;
  _creationTime: number;
}
```

### `getChallengesByCategory`
Get challenges filtered by category.

**Type**: `query`  
**Parameters**:
```typescript
{
  category: "physical" | "mental" | "social" | "productivity" | "wellness";
}
```
**Returns**: `Challenge[]`

```typescript
// Usage in React component
const physicalChallenges = useQuery(
  api.challenges.getChallengesByCategory,
  { category: "physical" }
);
```

### `getChallengesByDifficulty`
Get challenges filtered by difficulty.

**Type**: `query`  
**Parameters**:
```typescript
{
  difficulty: "easy" | "medium" | "hard" | "extreme";
}
```
**Returns**: `Challenge[]`

```typescript
// Usage in React component
const easyChallenges = useQuery(
  api.challenges.getChallengesByDifficulty,
  { difficulty: "easy" }
);
```

### `getUserActiveChallenges`
Get user's currently active challenges.

**Type**: `query`  
**Parameters**: None  
**Returns**: `UserChallengeWithDetails[]`

```typescript
// Usage in React component
const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);
```

**Response**:
```typescript
interface UserChallengeWithDetails {
  _id: Id<"userChallenges">;
  userId: Id<"users">;
  challengeId: Id<"challenges">;
  status: "active" | "completed" | "failed" | "abandoned";
  startedAt: number;
  completedAt?: number;
  targetCompletion?: number;
  challenge: Challenge;
}
```

### `getUserCompletedChallenges`
Get user's completed challenges.

**Type**: `query`  
**Parameters**: None  
**Returns**: `UserChallengeWithDetails[]`

```typescript
// Usage in React component
const completedChallenges = useQuery(api.challenges.getUserCompletedChallenges);
```

### `startChallenge`
Start a new challenge.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  challengeId: Id<"challenges">;
}
```
**Returns**: `Id<"userChallenges">`

```typescript
// Usage in React component
const startChallenge = useMutation(api.challenges.startChallenge);

await startChallenge({ challengeId: "challenge_123" });
```

### `completeChallenge`
Mark a challenge as completed.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  userChallengeId: Id<"userChallenges">;
}
```
**Returns**: `Id<"userChallenges">`

```typescript
// Usage in React component
const completeChallenge = useMutation(api.challenges.completeChallenge);

await completeChallenge({ userChallengeId: "user_challenge_123" });
```

### `abandonChallenge`
Abandon an active challenge.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  userChallengeId: Id<"userChallenges">;
}
```
**Returns**: `Id<"userChallenges">`

```typescript
// Usage in React component
const abandonChallenge = useMutation(api.challenges.abandonChallenge);

await abandonChallenge({ userChallengeId: "user_challenge_123" });
```

### `createChallenge`
Create a new custom challenge.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  title: string;
  description: string;
  category: "physical" | "mental" | "social" | "productivity" | "wellness";
  difficulty: "easy" | "medium" | "hard" | "extreme";
  durationDays: number;
  isSystem: boolean;
}
```
**Returns**: `Id<"challenges">`

```typescript
// Usage in React component
const createChallenge = useMutation(api.challenges.createChallenge);

await createChallenge({
  title: "Daily Meditation",
  description: "Meditate for 10 minutes every day",
  category: "mental",
  difficulty: "easy",
  durationDays: 7,
  isSystem: false
});
```

### `initializeSystemChallenges`
Initialize default system challenges.

**Type**: `mutation`  
**Parameters**: None  
**Returns**: `void`

```typescript
// Usage in React component
const initializeChallenges = useMutation(api.challenges.initializeSystemChallenges);

await initializeChallenges({});
```

---

## 📝 Logs API

### `getUserDailyLogs`
Get user's daily logs with optional limit.

**Type**: `query`  
**Parameters**:
```typescript
{
  limit?: number;
}
```
**Returns**: `DailyLog[]`

```typescript
// Usage in React component
const dailyLogs = useQuery(api.logs.getUserDailyLogs, { limit: 30 });
```

**Response**:
```typescript
interface DailyLog {
  _id: Id<"dailyLogs">;
  userId: Id<"users">;
  logDate: string; // YYYY-MM-DD format
  complianceRating: number; // 1-5
  journalEntry: string;
  mood: "great" | "okay" | "difficult" | "";
  completedChallenges: Id<"userChallenges">[];
  _creationTime: number;
}
```

### `getTodaysLog`
Get today's log entry.

**Type**: `query`  
**Parameters**: None  
**Returns**: `DailyLog | null`

```typescript
// Usage in React component
const todaysLog = useQuery(api.logs.getTodaysLog);
```

### `createOrUpdateDailyLog`
Create or update a daily log entry.

**Type**: `mutation`  
**Parameters**:
```typescript
{
  logDate: string; // YYYY-MM-DD format
  complianceRating: number; // 1-5
  journalEntry: string;
  mood: "great" | "okay" | "difficult" | "";
  completedChallenges: Id<"userChallenges">[];
}
```
**Returns**: `Id<"dailyLogs">`

```typescript
// Usage in React component
const createOrUpdateLog = useMutation(api.logs.createOrUpdateDailyLog);

await createOrUpdateLog({
  logDate: "2024-01-15",
  complianceRating: 4,
  journalEntry: "Had a great day!",
  mood: "great",
  completedChallenges: ["user_challenge_123"]
});
```

### `getLogsForDateRange`
Get logs within a date range.

**Type**: `query`  
**Parameters**:
```typescript
{
  startDate: string; // YYYY-MM-DD format
  endDate: string; // YYYY-MM-DD format
}
```
**Returns**: `DailyLog[]`

```typescript
// Usage in React component
const logsInRange = useQuery(api.logs.getLogsForDateRange, {
  startDate: "2024-01-01",
  endDate: "2024-01-31"
});
```

### `getComplianceStats`
Get compliance statistics for a period.

**Type**: `query`  
**Parameters**:
```typescript
{
  days?: number; // Number of days to look back
}
```
**Returns**: `ComplianceStats | null`

```typescript
// Usage in React component
const complianceStats = useQuery(api.logs.getComplianceStats, { days: 30 });
```

**Response**:
```typescript
interface ComplianceStats {
  averageCompliance: number;
  totalLogs: number;
  complianceDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
```

### `getMoodStats`
Get mood statistics for a period.

**Type**: `query`  
**Parameters**:
```typescript
{
  days?: number; // Number of days to look back
}
```
**Returns**: `MoodStats | null`

```typescript
// Usage in React component
const moodStats = useQuery(api.logs.getMoodStats, { days: 30 });
```

**Response**:
```typescript
interface MoodStats {
  totalLogs: number;
  moodDistribution: {
    great: number;
    okay: number;
    difficult: number;
    "": number;
  };
}
```

---

## 📊 Statistics API

### `getUserStatistics`
Get user's cached statistics.

**Type**: `query`  
**Parameters**: None  
**Returns**: `Statistics | null`

```typescript
// Usage in React component
const userStats = useQuery(api.statistics.getUserStatistics);
```

**Response**:
```typescript
interface Statistics {
  _id: Id<"statistics">;
  userId: Id<"users">;
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  totalChallengesCompleted: number;
  averageCompliance: number;
  _creationTime: number;
}
```

### `updateUserStatistics`
Update user statistics (recalculate from data).

**Type**: `mutation`  
**Parameters**: None  
**Returns**: `Id<"statistics">`

```typescript
// Usage in React component
const updateStats = useMutation(api.statistics.updateUserStatistics);

await updateStats({});
```

### `getStreakHistory`
Get streak history for a period.

**Type**: `query`  
**Parameters**:
```typescript
{
  days?: number; // Number of days to look back
}
```
**Returns**: `StreakDay[]`

```typescript
// Usage in React component
const streakHistory = useQuery(api.statistics.getStreakHistory, { days: 30 });
```

**Response**:
```typescript
interface StreakDay {
  date: string; // YYYY-MM-DD format
  hasLog: boolean;
  complianceRating: number | null;
}
```

### `getChallengeStats`
Get challenge completion statistics.

**Type**: `query`  
**Parameters**: None  
**Returns**: `ChallengeStats | null`

```typescript
// Usage in React component
const challengeStats = useQuery(api.statistics.getChallengeStats);
```

**Response**:
```typescript
interface ChallengeStats {
  total: number;
  active: number;
  completed: number;
  failed: number;
  abandoned: number;
}
```

### `getWeeklyProgress`
Get weekly progress summary.

**Type**: `query`  
**Parameters**: None  
**Returns**: `WeeklyProgress | null`

```typescript
// Usage in React component
const weeklyProgress = useQuery(api.statistics.getWeeklyProgress);
```

**Response**:
```typescript
interface WeeklyProgress {
  daysLogged: number;
  averageCompliance: number;
  logs: DailyLog[];
}
```

---

## 🌐 HTTP Endpoints

### Clerk Webhook
**Endpoint**: `POST /api/webhooks/clerk`  
**Purpose**: Handle Clerk user events  
**Authentication**: Webhook secret verification

**Events Handled**:
- `user.created`: Create new user in database
- `user.updated`: Update existing user
- `user.deleted`: Delete user and all data

**Request Body**:
```typescript
interface WebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses: Array<{ email_address: string }>;
    first_name: string;
    last_name: string;
    image_url: string;
  };
}
```

**Response**: `200 OK` or error status

---

## ❌ Error Handling

### Common Error Types

#### Authentication Errors
```typescript
// User not authenticated
if (!userId) throw new Error("Not authenticated");
```

#### Validation Errors
```typescript
// Invalid input data
if (!challengeId) throw new Error("Challenge ID is required");
```

#### Authorization Errors
```typescript
// User not authorized for resource
if (session.userId !== user._id) {
  throw new Error("Unauthorized");
}
```

#### Not Found Errors
```typescript
// Resource not found
if (!session) throw new Error("Session not found");
```

### Error Response Format
```typescript
interface ErrorResponse {
  error: string;
  message: string;
  code?: string;
}
```

### Client-Side Error Handling
```typescript
// React component error handling
try {
  await createOrUpdateLog({...});
} catch (error) {
  console.error("Error saving log:", error);
  // Show user-friendly error message
}
```

---

## 🔧 Usage Examples

### Complete User Flow Example
```typescript
// 1. Get current user
const currentUser = useQuery(api.users.getCurrentUser);

// 2. Get active challenges
const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);

// 3. Get today's log
const todaysLog = useQuery(api.logs.getTodaysLog);

// 4. Create or update log
const createOrUpdateLog = useMutation(api.logs.createOrUpdateDailyLog);

const handleSaveLog = async () => {
  try {
    await createOrUpdateLog({
      logDate: new Date().toISOString().split('T')[0],
      complianceRating: 4,
      journalEntry: "Great day!",
      mood: "great",
      completedChallenges: []
    });
  } catch (error) {
    console.error("Error saving log:", error);
  }
};
```

### Session Management Example
```typescript
// 1. Get active session
const activeSession = useQuery(api.sessions.getActiveSession);

// 2. Start session
const startSession = useMutation(api.sessions.startSession);

// 3. End session
const endSession = useMutation(api.sessions.endSession);

const handleStartSession = async () => {
  try {
    await startSession({ goalHours: 24 });
  } catch (error) {
    console.error("Error starting session:", error);
  }
};

const handleEndSession = async () => {
  if (!activeSession) return;
  
  try {
    await endSession({ sessionId: activeSession._id });
  } catch (error) {
    console.error("Error ending session:", error);
  }
};
```

---

This API reference provides comprehensive documentation for all available functions in the DisciplineForge application. Each function includes detailed parameter descriptions, return types, and usage examples.
