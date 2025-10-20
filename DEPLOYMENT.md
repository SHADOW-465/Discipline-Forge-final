# Deployment Guide - DisciplineForge

This comprehensive guide covers deploying the DisciplineForge application to Vercel, including all necessary configurations and optimizations.

## 📋 Prerequisites

- Vercel account
- GitHub repository with your code
- Clerk production keys
- Convex production deployment
- Domain name (optional)

## 🚀 Vercel Deployment

### Step 1: Prepare Your Repository

#### 1.1 Push to GitHub
```bash
git add .
git commit -m "Initial DisciplineForge deployment"
git push origin main
```

#### 1.2 Verify Environment Variables
Ensure you have all required environment variables (see [ENVIRONMENT.md](./ENVIRONMENT.md))

### Step 2: Deploy to Vercel

#### 2.1 Connect Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository: `discipline-forge`

#### 2.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`

#### 2.3 Set Environment Variables
In Vercel dashboard, go to "Settings" → "Environment Variables":

```bash
# Clerk Authentication (Production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_publishable_key
CLERK_SECRET_KEY=sk_live_your_production_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Convex Database (Production)
NEXT_PUBLIC_CONVEX_URL=https://your-production-convex-url.convex.cloud
CONVEX_DEPLOY_KEY=convex_deploy_key_your_deploy_key_here
```

#### 2.4 Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Note your deployment URL

### Step 3: Configure Production Services

#### 3.1 Update Clerk Configuration
1. Go to your Clerk dashboard
2. Navigate to "Domains"
3. Add your Vercel domain: `your-app.vercel.app`
4. Update webhook URL: `https://your-app.vercel.app/api/webhooks/clerk`

#### 3.2 Update Convex Configuration
1. Go to your Convex dashboard
2. Navigate to "Settings" → "Auth"
3. Update allowed origins with your Vercel domain
4. Deploy production functions:
```bash
npx convex deploy --prod
```

## 🔧 Production Optimizations

### 1. Next.js Configuration

#### `next.config.ts`
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['img.clerk.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig
```

### 2. Performance Optimizations

#### 2.1 Image Optimization
- Use Next.js Image component
- Optimize images with appropriate formats
- Implement lazy loading

#### 2.2 Bundle Optimization
- Enable tree shaking
- Use dynamic imports for heavy components
- Optimize bundle size

#### 2.3 Caching Strategy
- Implement proper caching headers
- Use Vercel's edge caching
- Optimize API responses

### 3. Security Hardening

#### 3.1 Environment Variables
- Use production keys only
- Enable webhook verification
- Set up proper CORS policies

#### 3.2 Headers Configuration
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## 🌐 Custom Domain Setup

### Step 1: Add Domain to Vercel
1. Go to your project in Vercel dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### Step 2: Update Service Configurations
1. **Clerk**: Add custom domain to allowed origins
2. **Convex**: Update allowed origins
3. **Webhooks**: Update webhook URLs

### Step 3: SSL Certificate
- Vercel automatically provides SSL certificates
- Ensure HTTPS is enforced
- Update redirects to use HTTPS

## 📊 Monitoring and Analytics

### 1. Vercel Analytics
- Enable Vercel Analytics in dashboard
- Monitor performance metrics
- Track user behavior

### 2. Error Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor application errors
- Set up alerts for critical issues

### 3. Performance Monitoring
- Use Vercel's built-in performance monitoring
- Set up Core Web Vitals tracking
- Monitor API response times

## 🔄 CI/CD Pipeline

### 1. Automatic Deployments
- Push to `main` branch triggers production deployment
- Push to other branches creates preview deployments
- Set up branch protection rules

### 2. Pre-deployment Checks
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
```

### 3. Environment-Specific Deployments
- **Development**: Auto-deploy from `develop` branch
- **Staging**: Auto-deploy from `staging` branch
- **Production**: Manual approval for `main` branch

## 🗄️ Database Management

### 1. Convex Production Setup
```bash
# Deploy to production
npx convex deploy --prod

# Set production environment variables
npx convex env set NEXT_PUBLIC_CONVEX_URL https://your-prod-url.convex.cloud --prod
```

### 2. Data Migration
- Plan data migration strategy
- Test migration scripts
- Backup existing data

### 3. Database Monitoring
- Monitor database performance
- Set up alerts for high usage
- Regular backup verification

## 🔐 Security Checklist

### Pre-Deployment
- [ ] All environment variables set correctly
- [ ] Production keys are used (not development)
- [ ] Webhook endpoints are secure
- [ ] CORS policies are configured
- [ ] Security headers are set

### Post-Deployment
- [ ] Test all authentication flows
- [ ] Verify webhook functionality
- [ ] Check database connections
- [ ] Test all user journeys
- [ ] Monitor for security issues

## 🚨 Troubleshooting

### Common Deployment Issues

#### 1. Build Failures
```bash
# Check build logs in Vercel dashboard
# Common issues:
# - Missing environment variables
# - TypeScript errors
# - Dependency conflicts
```

#### 2. Runtime Errors
```bash
# Check function logs in Vercel dashboard
# Common issues:
# - Database connection problems
# - Authentication configuration
# - API endpoint errors
```

#### 3. Environment Variable Issues
```bash
# Verify all variables are set in Vercel dashboard
# Check variable names match exactly
# Ensure no typos in variable values
```

### Debug Commands
```bash
# Test production build locally
npm run build
npm run start

# Check environment variables
vercel env ls

# View deployment logs
vercel logs
```

## 📈 Performance Optimization

### 1. Bundle Analysis
```bash
# Analyze bundle size
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

### 2. Image Optimization
- Use WebP format when possible
- Implement responsive images
- Use Next.js Image component

### 3. Code Splitting
- Implement dynamic imports
- Split large components
- Lazy load non-critical features

## 🔄 Backup and Recovery

### 1. Database Backups
- Set up regular Convex backups
- Test backup restoration
- Document recovery procedures

### 2. Code Backups
- Use Git for version control
- Tag stable releases
- Maintain deployment history

### 3. Configuration Backups
- Document all configurations
- Backup environment variables
- Maintain deployment scripts

## 📞 Support and Maintenance

### 1. Monitoring Setup
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics

### 2. Regular Maintenance
- Update dependencies regularly
- Monitor security advisories
- Review and update configurations

### 3. Documentation
- Keep deployment docs updated
- Document any custom configurations
- Maintain troubleshooting guides

---

This deployment guide ensures your DisciplineForge application is properly deployed, secured, and optimized for production use on Vercel.
