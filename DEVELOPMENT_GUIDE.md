# Development Guide - DisciplineForge

This comprehensive guide covers everything needed to set up, develop, and contribute to the DisciplineForge application.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Project Structure](#project-structure)
4. [Development Workflow](#development-workflow)
5. [Code Standards](#code-standards)
6. [Testing Guidelines](#testing-guidelines)
7. [Debugging](#debugging)
8. [Contributing](#contributing)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **npm**: Version 8 or higher (comes with Node.js)
- **Git**: For version control
- **VS Code**: Recommended IDE (with extensions)

### Required Accounts
- **Clerk Account**: For authentication
- **Convex Account**: For database and backend
- **GitHub Account**: For code repository

### VS Code Extensions (Recommended)
```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "convex.convex",
    "clerk.clerk"
  ]
}
```

---

## 🚀 Local Development Setup

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd discipline-forge
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
# See ENVIRONMENT.md for detailed setup
```

### Step 4: Database Setup
```bash
# Start Convex development server
npx convex dev

# Follow prompts to:
# 1. Create Convex account
# 2. Create new project
# 3. Configure authentication
```

### Step 5: Start Development Server
```bash
# Start Next.js development server
npm run dev

# Open http://localhost:3000
```

---

## 📁 Project Structure

### Directory Overview
```
discipline-forge/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── dashboard/            # Main dashboard
│   │   ├── solo/                 # Solo program dashboard
│   │   ├── keyholder/            # Keyholder program dashboard
│   │   ├── challenges/           # Challenges management
│   │   ├── logs/                 # Daily logging
│   │   ├── progress/             # Analytics and progress
│   │   ├── sessions/             # Session management
│   │   └── layout.tsx            # Dashboard layout
│   ├── _components/              # Shared components
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                   # Reusable UI components
│   └── ui/                       # shadcn/ui components
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated files
│   ├── auth.config.ts            # Authentication configuration
│   ├── challenges.ts             # Challenge management functions
│   ├── http.ts                   # Webhook handlers
│   ├── logs.ts                   # Daily logging functions
│   ├── schema.ts                 # Database schema
│   ├── sessions.ts               # Session management functions
│   ├── statistics.ts             # Analytics functions
│   └── users.ts                  # User management functions
├── lib/                          # Utility functions
│   └── utils.ts                  # Common utilities
├── public/                       # Static assets
├── middleware.ts                 # Next.js middleware
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

### Key Files Explained

#### `app/layout.tsx`
Root layout component that wraps the entire application with providers.

#### `app/(dashboard)/layout.tsx`
Dashboard layout with navigation and program-specific routing.

#### `convex/schema.ts`
Database schema definition with all tables and indexes.

#### `convex/auth.config.ts`
Authentication configuration for Convex integration.

#### `middleware.ts`
Next.js middleware for route protection and authentication.

---

## 🔄 Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Test locally
npm run dev

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request
```

### 2. Database Changes
```bash
# Update schema in convex/schema.ts
# Run Convex to sync changes
npx convex dev

# Test database changes
# Update related functions if needed
```

### 3. Component Development
```bash
# Create component in appropriate directory
# Follow naming conventions
# Add TypeScript types
# Test component in isolation
```

### 4. API Development
```bash
# Add new functions to appropriate convex/*.ts file
# Follow existing patterns
# Add proper error handling
# Test with Convex dashboard
```

---

## 📝 Code Standards

### TypeScript Guidelines

#### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

// Use types for unions and primitives
type Program = "solo" | "keyholder";
type Difficulty = "easy" | "medium" | "hard" | "extreme";
```

#### Function Signatures
```typescript
// Convex query function
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Implementation
  },
});

// Convex mutation function
export const createUser = mutation({
  args: { name: v.string(), email: v.string() },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

#### React Component Patterns
```typescript
// Component with props interface
interface ComponentProps {
  title: string;
  description?: string;
  onAction: () => void;
}

export function Component({ title, description, onAction }: ComponentProps) {
  // Implementation
}
```

### Styling Guidelines

#### Tailwind CSS Classes
```typescript
// Use semantic class names
<div className="bg-slate-800 text-white p-4 rounded-lg">
  <h2 className="text-xl font-semibold mb-2">{title}</h2>
  <p className="text-slate-400">{description}</p>
</div>

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

#### Component Styling
```typescript
// Use consistent spacing
const cardClasses = "bg-slate-800 border border-slate-700 rounded-lg p-6";

// Use consistent colors
const primaryButton = "bg-emerald-600 hover:bg-emerald-700 text-white";
const secondaryButton = "bg-slate-700 hover:bg-slate-600 text-slate-300";
```

### File Naming Conventions

#### Components
- **PascalCase**: `UserProfile.tsx`
- **Descriptive names**: `ProgramSelectionModal.tsx`
- **Group related**: `(dashboard)/` for dashboard components

#### Functions
- **camelCase**: `getUserStatistics`
- **Descriptive verbs**: `createOrUpdateUser`
- **Consistent patterns**: `get*`, `create*`, `update*`, `delete*`

#### Files
- **kebab-case**: `user-profile.tsx`
- **Descriptive**: `daily-logging-form.tsx`
- **Consistent extensions**: `.tsx`, `.ts`, `.css`

---

## 🧪 Testing Guidelines

### Unit Testing
```typescript
// Test component rendering
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

test('renders component with title', () => {
  render(<Component title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

### Integration Testing
```typescript
// Test API integration
import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';

test('fetches user data', async () => {
  const { result } = renderHook(() => useQuery(api.users.getCurrentUser));
  // Test implementation
});
```

### E2E Testing
```typescript
// Test user flows
test('user can create daily log', async () => {
  // Navigate to logs page
  // Fill out form
  // Submit form
  // Verify success
});
```

### Testing Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

---

## 🐛 Debugging

### Frontend Debugging

#### React DevTools
- Install React DevTools browser extension
- Inspect component state and props
- Debug performance issues

#### Console Debugging
```typescript
// Add debug logs
console.log('User data:', userData);
console.error('Error occurred:', error);

// Use debugger
debugger; // Pause execution
```

#### Network Debugging
- Use browser DevTools Network tab
- Check API requests and responses
- Monitor WebSocket connections

### Backend Debugging

#### Convex Dashboard
- Use Convex dashboard for database inspection
- View function logs and errors
- Test functions directly

#### Console Logging
```typescript
// Add debug logs in Convex functions
console.log('Processing user:', userId);
console.error('Database error:', error);
```

#### Function Testing
```bash
# Test Convex functions
npx convex run users:getCurrentUser

# Test with specific arguments
npx convex run challenges:getAllChallenges
```

### Common Debugging Scenarios

#### Authentication Issues
```typescript
// Check if user is authenticated
const { user, isLoaded } = useUser();
console.log('User loaded:', isLoaded);
console.log('User data:', user);
```

#### Database Connection Issues
```typescript
// Check Convex connection
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
console.log('Convex URL:', convexUrl);
```

#### Component Rendering Issues
```typescript
// Check component props
console.log('Component props:', props);
console.log('Component state:', state);
```

---

## 🤝 Contributing

### Pull Request Process

#### 1. Create Feature Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Changes
- Follow code standards
- Add tests if applicable
- Update documentation

#### 3. Test Changes
```bash
# Run tests
npm test

# Check linting
npm run lint

# Test build
npm run build
```

#### 4. Submit Pull Request
- Provide clear description
- Reference related issues
- Include screenshots if UI changes

### Code Review Guidelines

#### Review Checklist
- [ ] Code follows project standards
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] Performance considerations addressed

#### Review Process
1. **Automated Checks**: CI/CD pipeline runs tests
2. **Code Review**: Team members review code
3. **Testing**: Manual testing of changes
4. **Approval**: At least one approval required
5. **Merge**: Merge to main branch

---

## 🔧 Development Tools

### VS Code Configuration
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "typescript",
    "typescriptreact": "typescriptreact"
  }
}
```

### Git Hooks
```bash
# Pre-commit hook
npm run lint
npm run type-check

# Pre-push hook
npm run test
npm run build
```

### Development Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading
```bash
# Check file name and location
ls -la .env.local

# Restart development server
npm run dev
```

#### 2. Convex Connection Issues
```bash
# Check Convex status
npx convex dev --once

# Verify environment variables
echo $NEXT_PUBLIC_CONVEX_URL
```

#### 3. Build Failures
```bash
# Check TypeScript errors
npm run type-check

# Check linting errors
npm run lint

# Clear Next.js cache
rm -rf .next
npm run build
```

#### 4. Authentication Issues
```bash
# Check Clerk configuration
# Verify webhook endpoints
# Check environment variables
```

### Debug Commands
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check installed packages
npm list

# Check Convex status
npx convex dev --once

# Check Next.js build
npm run build
```

### Getting Help

#### Documentation
- Check this development guide
- Review API reference
- Check feature documentation

#### Community
- GitHub Issues for bug reports
- GitHub Discussions for questions
- Discord/Slack for real-time help

#### Debugging Resources
- React DevTools
- Convex Dashboard
- Browser DevTools
- VS Code Debugger

---

## 📚 Additional Resources

### Learning Materials
- [Next.js Documentation](https://nextjs.org/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Clerk Documentation](https://clerk.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Development Tools
- [VS Code](https://code.visualstudio.com)
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Convex Dashboard](https://dashboard.convex.dev)
- [Clerk Dashboard](https://dashboard.clerk.com)

### Best Practices
- [React Best Practices](https://react.dev/learn)
- [TypeScript Best Practices](https://typescript-eslint.io/rules)
- [Next.js Best Practices](https://nextjs.org/docs/app/building-your-application)
- [Tailwind CSS Best Practices](https://tailwindcss.com/docs/reusing-styles)

---

This development guide provides everything needed to contribute effectively to the DisciplineForge project. Follow these guidelines to maintain code quality and project consistency.
