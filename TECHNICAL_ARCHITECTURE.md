# Technical Architecture - DisciplineForge

This document provides a comprehensive technical overview of the DisciplineForge application architecture, including system design, data flow, and implementation details.

## 🏗️ System Architecture Overview

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (Convex)      │◄──►│   (Convex DB)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Authentication│    │   Real-time     │    │   Data Storage  │
│   (Clerk)       │    │   Sync          │    │   & Indexing    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 Core Technologies

### Frontend Stack
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **State Management**: React hooks + Convex queries

### Backend Stack
- **Database**: Convex (real-time database)
- **API**: Convex functions (queries, mutations, actions)
- **Authentication**: Clerk integration
- **Real-time**: Convex subscriptions
- **File Storage**: Convex file storage (if needed)

### Infrastructure
- **Hosting**: Vercel
- **CDN**: Vercel Edge Network
- **Domain**: Custom domain with SSL
- **Monitoring**: Vercel Analytics

## 📊 Database Schema Design

### Entity Relationship Diagram
```
Users (1) ──┐
            ├── (1:N) Sessions
            ├── (1:N) DailyLogs
            ├── (1:N) UserChallenges
            └── (1:1) Statistics

Sessions (1) ── (1:1) Keyholders

Challenges (1) ── (1:N) UserChallenges
```

### Table Definitions

#### Users Table
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

#### Sessions Table
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

#### Challenges Table
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

#### Daily Logs Table
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

## 🔄 Data Flow Architecture

### 1. Authentication Flow
```
User → Clerk Auth → JWT Token → Convex Auth → User Creation/Update
```

### 2. Real-time Data Flow
```
User Action → React Component → Convex Mutation → Database Update → Real-time Sync → UI Update
```

### 3. Query Flow
```
React Component → Convex Query → Database Read → Cached Result → UI Render
```

## 🎨 Frontend Architecture

### Component Hierarchy
```
App
├── Providers (Clerk + Convex)
├── RootLayout
│   ├── Header
│   ├── Navigation
│   └── Main Content
│       ├── Dashboard
│       ├── Solo Dashboard
│       ├── Keyholder Dashboard
│       ├── Challenges
│       ├── Logs
│       ├── Progress
│       └── Sessions
└── Auth Pages
    ├── Sign In
    └── Sign Up
```

### State Management Strategy
- **Server State**: Convex queries and mutations
- **Client State**: React useState and useReducer
- **Form State**: Controlled components with local state
- **UI State**: Component-level state management

### Routing Structure
```
/ (Home/Redirect)
├── /sign-in
├── /sign-up
└── /dashboard
    ├── /solo
    ├── /keyholder
    ├── /challenges
    ├── /logs
    ├── /progress
    └── /sessions (Keyholder only)
```

## 🔧 Backend Architecture

### Convex Functions Structure
```
convex/
├── auth.config.ts          # Authentication configuration
├── schema.ts               # Database schema
├── http.ts                 # HTTP endpoints (webhooks)
├── users.ts                # User management functions
├── sessions.ts             # Session management functions
├── challenges.ts           # Challenge management functions
├── logs.ts                 # Daily logging functions
├── statistics.ts           # Analytics functions
└── _generated/             # Auto-generated files
    ├── api.d.ts
    ├── api.js
    └── server.d.ts
```

### Function Types
- **Queries**: Read-only database operations
- **Mutations**: Write operations with side effects
- **Actions**: External API calls and complex operations
- **HTTP Routes**: Webhook endpoints

### Authentication Integration
```typescript
// auth.config.ts
export const getAuthUserId = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  return identity?.subject;
};
```

## 🔒 Security Architecture

### Authentication Security
- **Provider**: Clerk (industry-standard authentication)
- **Token Management**: JWT tokens with automatic refresh
- **Session Security**: Secure session management
- **Password Security**: Handled by Clerk

### Data Security
- **Encryption**: All data encrypted in transit and at rest
- **Access Control**: Row-level security based on user ID
- **API Security**: Authenticated endpoints only
- **Input Validation**: Type-safe input validation

### Webhook Security
```typescript
// http.ts - Webhook verification
const wh = new Webhook(WEBHOOK_SECRET);
const evt = wh.verify(payload, headers) as WebhookEvent;
```

## ⚡ Performance Architecture

### Frontend Performance
- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Optimization**: Tree shaking and minification
- **Caching**: Browser caching and CDN caching

### Backend Performance
- **Database Indexing**: Optimized queries with proper indexes
- **Caching**: Statistics caching for better performance
- **Real-time Updates**: Efficient subscription management
- **Query Optimization**: Minimal data fetching

### Caching Strategy
```typescript
// Statistics caching example
export const getUserStatistics = query({
  args: {},
  handler: async (ctx) => {
    // Check cached statistics first
    let stats = await ctx.db
      .query("statistics")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    
    // Return cached data or calculate fresh
    return stats;
  },
});
```

## 🔄 Real-time Architecture

### Convex Subscriptions
```typescript
// Real-time data updates
const userStats = useQuery(api.statistics.getUserStatistics);
const activeChallenges = useQuery(api.challenges.getUserActiveChallenges);
```

### Optimistic Updates
```typescript
// Immediate UI updates
const createLog = useMutation(api.logs.createOrUpdateDailyLog);
// UI updates immediately, syncs with server
```

## 📱 Responsive Architecture

### Mobile-First Design
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Grid System**: CSS Grid and Flexbox
- **Touch Targets**: Minimum 44px touch targets
- **Navigation**: Collapsible mobile navigation

### Component Responsiveness
```typescript
// Responsive component example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Responsive grid */}
</div>
```

## 🧪 Testing Architecture

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and database testing
- **E2E Tests**: Full user journey testing
- **Performance Tests**: Load and stress testing

### Test Structure
```
tests/
├── unit/
│   ├── components/
│   └── functions/
├── integration/
│   ├── api/
│   └── database/
└── e2e/
    ├── auth/
    └── features/
```

## 🚀 Deployment Architecture

### Vercel Deployment
- **Build Process**: Next.js build with TypeScript compilation
- **Static Generation**: Static pages where possible
- **Serverless Functions**: API routes as serverless functions
- **CDN**: Global content delivery

### Environment Management
- **Development**: Local development with hot reload
- **Staging**: Preview deployments for testing
- **Production**: Stable production deployment

## 📊 Monitoring Architecture

### Application Monitoring
- **Performance**: Core Web Vitals tracking
- **Errors**: Error boundary and logging
- **Analytics**: User behavior tracking
- **Uptime**: Service availability monitoring

### Database Monitoring
- **Query Performance**: Slow query detection
- **Connection Pooling**: Connection management
- **Data Growth**: Storage monitoring
- **Backup Verification**: Data integrity checks

## 🔧 Development Architecture

### Development Workflow
1. **Local Development**: `npm run dev`
2. **Database Sync**: `npx convex dev`
3. **Type Generation**: Automatic TypeScript types
4. **Hot Reload**: Instant development feedback

### Code Organization
```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components
├── lib/                    # Utility functions
├── types/                  # TypeScript types
└── hooks/                  # Custom React hooks
```

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: New feature development
- **Pull Requests**: Code review process
- **Automated Testing**: CI/CD pipeline

## 🔄 API Architecture

### Convex API Design
```typescript
// API structure
export const api = {
  users: {
    getCurrentUser: query(...),
    createOrUpdateUser: mutation(...),
    updateUserProgram: mutation(...),
    deleteUser: mutation(...),
  },
  sessions: {
    getActiveSession: query(...),
    startSession: mutation(...),
    endSession: mutation(...),
    // ... more functions
  },
  // ... other modules
};
```

### Error Handling
```typescript
// Consistent error handling
try {
  await createOrUpdateLog({...});
} catch (error) {
  console.error("Error saving log:", error);
  // User-friendly error message
}
```

## 📈 Scalability Architecture

### Horizontal Scaling
- **Stateless Design**: No server-side state
- **Database Scaling**: Convex handles scaling
- **CDN Distribution**: Global content delivery
- **Load Balancing**: Automatic load distribution

### Vertical Scaling
- **Memory Optimization**: Efficient memory usage
- **CPU Optimization**: Optimized algorithms
- **Storage Optimization**: Efficient data storage
- **Network Optimization**: Minimized data transfer

---

This technical architecture provides a comprehensive foundation for understanding, maintaining, and extending the DisciplineForge application. The architecture is designed for scalability, maintainability, and performance.
