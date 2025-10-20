# Environment Variables Setup Guide

This document provides detailed instructions for setting up all required environment variables for the DisciplineForge application.

## 📋 Required Environment Variables

### Clerk Authentication Variables

#### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- **Purpose**: Public key for Clerk authentication
- **Type**: String
- **Example**: `pk_test_example_key_replace_with_your_actual_key`
- **Location**: Frontend (browser-accessible)

#### `CLERK_SECRET_KEY`
- **Purpose**: Secret key for server-side Clerk operations
- **Type**: String
- **Example**: `sk_test_example_key_replace_with_your_actual_key`
- **Location**: Backend (server-only)

#### `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- **Purpose**: Custom sign-in page URL
- **Type**: String
- **Example**: `/sign-in`
- **Location**: Frontend

#### `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- **Purpose**: Custom sign-up page URL
- **Type**: String
- **Example**: `/sign-up`
- **Location**: Frontend

#### `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- **Purpose**: Redirect URL after successful sign-in
- **Type**: String
- **Example**: `/dashboard`
- **Location**: Frontend

#### `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
- **Purpose**: Redirect URL after successful sign-up
- **Type**: String
- **Example**: `/dashboard`
- **Location**: Frontend

#### `CLERK_WEBHOOK_SECRET`
- **Purpose**: Secret for verifying Clerk webhooks
- **Type**: String
- **Example**: `whsec_your_webhook_secret_here`
- **Location**: Backend

### Convex Database Variables

#### `NEXT_PUBLIC_CONVEX_URL`
- **Purpose**: Convex deployment URL
- **Type**: String
- **Example**: `https://your-convex-deployment.convex.cloud`
- **Location**: Frontend

#### `CONVEX_DEPLOY_KEY`
- **Purpose**: Deploy key for Convex functions
- **Type**: String
- **Example**: `convex_deploy_key_your_deploy_key_here`
- **Location**: Backend

## 🔧 How to Obtain Environment Variables

### 1. Clerk Setup

#### Step 1: Create Clerk Account
1. Go to [clerk.com](https://clerk.com)
2. Sign up for a free account
3. Create a new application

#### Step 2: Get Clerk Keys
1. In your Clerk dashboard, go to "API Keys"
2. Copy the "Publishable key" → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy the "Secret key" → `CLERK_SECRET_KEY`

#### Step 3: Configure URLs
1. Go to "Paths" in your Clerk dashboard
2. Set custom paths:
   - Sign-in path: `/sign-in`
   - Sign-up path: `/sign-up`
   - After sign-in: `/dashboard`
   - After sign-up: `/dashboard`

#### Step 4: Set Up Webhooks
1. Go to "Webhooks" in your Clerk dashboard
2. Create a new webhook
3. Set endpoint URL: `https://your-domain.com/clerk-webhook`
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Copy the webhook secret → `CLERK_WEBHOOK_SECRET`

### 2. Convex Setup

#### Step 1: Install Convex CLI
```bash
npm install -g convex
```

#### Step 2: Create Convex Project
```bash
npx convex dev
```
Follow the prompts to:
1. Create a new Convex project
2. Choose a team (or create one)
3. Select a region

#### Step 3: Get Convex URL
After running `npx convex dev`, you'll get:
- Deployment URL → `NEXT_PUBLIC_CONVEX_URL`
- Deploy key → `CONVEX_DEPLOY_KEY`

#### Step 4: Configure Auth
1. In your Convex dashboard, go to "Settings" → "Auth"
2. Add Clerk as an auth provider
3. Use your Clerk keys from step 1

## 📁 Environment File Setup

### 1. Create Environment Files

#### `.env.local` (Local Development)
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_example_key_replace_with_your_actual_key
CLERK_SECRET_KEY=sk_test_example_key_replace_with_your_actual_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Convex Database
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOY_KEY=convex_deploy_key_your_deploy_key_here
```

#### `.env.production` (Production)
```bash
# Clerk Authentication (Production Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_example_key_replace_with_your_actual_key
CLERK_SECRET_KEY=sk_live_example_key_replace_with_your_actual_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Convex Database (Production)
NEXT_PUBLIC_CONVEX_URL=https://your-production-convex-url.convex.cloud
CONVEX_DEPLOY_KEY=convex_deploy_key_your_deploy_key_here
```

### 2. Environment File Locations

```
discipline-forge/
├── .env.local              # Local development
├── .env.production         # Production build
├── .env.example            # Template file
└── .gitignore              # Excludes .env files
```

### 3. Git Configuration

#### `.gitignore` Entry
```gitignore
# Environment variables
.env
.env.local
.env.production
.env.development
```

## 🔒 Security Best Practices

### 1. Key Management
- **Never commit** environment files to version control
- **Use different keys** for development and production
- **Rotate keys** regularly for security
- **Store production keys** in secure environment variable services

### 2. Key Validation
- **Test keys** in development before production
- **Verify webhook endpoints** are working correctly
- **Check database connections** are properly configured
- **Validate redirect URLs** are correct

### 3. Production Security
- **Use production keys** only in production environment
- **Enable webhook verification** for all webhook endpoints
- **Set up monitoring** for failed authentication attempts
- **Regular security audits** of environment configuration

## 🚀 Deployment Environment Variables

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each environment variable:
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: `pk_live_example_key_replace_with_your_actual_key`
   - Environment: Production, Preview, Development

### Environment Variable Priority
1. **Production**: `.env.production`
2. **Development**: `.env.local`
3. **Default**: `.env`

## 🧪 Testing Environment Variables

### 1. Local Testing
```bash
# Check if environment variables are loaded
npm run dev
# Check browser console for any missing variables
```

### 2. Production Testing
```bash
# Test production build locally
npm run build
npm run start
```

### 3. Environment Validation
Create a simple validation script:

```javascript
// scripts/validate-env.js
const requiredEnvVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CONVEX_URL',
  'CONVEX_DEPLOY_KEY'
];

const missing = requiredEnvVars.filter(key => !process.env[key]);

if (missing.length > 0) {
  console.error('Missing environment variables:', missing);
  process.exit(1);
}

console.log('All environment variables are set!');
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Missing environment variable" errors
- **Check**: All required variables are set
- **Verify**: File is named correctly (`.env.local`)
- **Restart**: Development server after adding variables

#### 2. Clerk authentication not working
- **Verify**: Keys are correct and active
- **Check**: URLs are properly configured
- **Test**: Webhook endpoints are accessible

#### 3. Convex connection issues
- **Verify**: URL is correct and accessible
- **Check**: Deploy key has proper permissions
- **Test**: Database connection in Convex dashboard

#### 4. Webhook failures
- **Verify**: Webhook secret is correct
- **Check**: Endpoint URL is accessible
- **Test**: Webhook events are being received

### Debug Commands
```bash
# Check environment variables
node -e "console.log(process.env)"

# Test Clerk connection
npx convex run users:getCurrentUser

# Test Convex connection
npx convex dev --once
```

## 📞 Support

If you encounter issues with environment variable setup:

1. **Check the logs** for specific error messages
2. **Verify all keys** are correct and active
3. **Test each service** individually (Clerk, Convex)
4. **Review documentation** for each service
5. **Contact support** for the respective services

---

This comprehensive environment setup guide ensures your DisciplineForge application is properly configured for both development and production environments.
