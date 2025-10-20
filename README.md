# DisciplineForge - Self-Discipline & Chastity Tracker

A comprehensive web application built with Next.js, Convex, and Clerk for tracking self-discipline progress through structured challenges and daily logging. The app supports two distinct programs: **Solo Chastity** for personal self-discipline and **Keyholder Chastity** for advanced session management with enhanced security controls.

## 🎯 Overview

DisciplineForge is designed to help users build and maintain self-discipline through a gamified experience. It combines daily compliance tracking, challenge-based progression, and detailed analytics to create a comprehensive self-improvement platform.

### Core Philosophy
- **Structured Progress**: Break down self-discipline into manageable, trackable components
- **Gamification**: Use challenges, streaks, and achievements to maintain motivation
- **Personalization**: Two distinct programs tailored to different user needs
- **Privacy-First**: Secure, private tracking with optional keyholder controls

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14+ with App Router
- **Backend**: Convex (real-time database and serverless functions)
- **Authentication**: Clerk (user management and security)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **TypeScript**: Full type safety throughout

### Database Schema
The application uses Convex with the following main entities:
- **Users**: User profiles and program selection
- **Sessions**: Chastity session management (Keyholder program)
- **Keyholders**: Password-protected session controls
- **Challenges**: System and custom self-discipline challenges
- **UserChallenges**: User progress on specific challenges
- **DailyLogs**: Daily compliance and mood tracking
- **Statistics**: Cached performance metrics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Convex account
- Clerk account

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd discipline-forge
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env.local
   # Fill in your environment variables (see ENVIRONMENT.md)
   ```

3. **Database Setup**
   ```bash
   npx convex dev
   # Follow prompts to set up your Convex project
   ```

4. **Start Development Server**
```bash
npm run dev
   ```

5. **Access Application**
   Open [http://localhost:3000](http://localhost:3000)

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed Vercel deployment instructions.

## 📱 Features

### Solo Program
- Personal challenge tracking
- Daily compliance logging
- Progress analytics
- Achievement system
- Streak monitoring

### Keyholder Program
- Session management with start/stop controls
- Password-protected keyholder access
- Advanced security features
- Session history tracking
- Enhanced monitoring capabilities

### Universal Features
- Daily mood and compliance tracking
- Challenge browsing and management
- Comprehensive progress analytics
- Responsive mobile-first design
- Dark theme interface

## 📁 Project Structure

```
discipline-forge/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   ├── sign-in/             # Sign-in page
│   │   └── sign-up/             # Sign-up page
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── dashboard/           # Main dashboard
│   │   ├── solo/                # Solo program dashboard
│   │   ├── keyholder/           # Keyholder program dashboard
│   │   ├── challenges/          # Challenges management
│   │   ├── logs/                # Daily logging
│   │   ├── progress/            # Analytics and progress
│   │   ├── sessions/            # Session management (Keyholder)
│   │   └── layout.tsx           # Dashboard layout
│   ├── _components/             # Shared components
│   │   └── program-selection-modal.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable UI components
│   └── ui/                      # shadcn/ui components
├── convex/                      # Convex backend
│   ├── _generated/              # Auto-generated files
│   ├── auth.config.ts           # Authentication configuration
│   ├── challenges.ts            # Challenge management functions
│   ├── http.ts                  # Webhook handlers
│   ├── logs.ts                  # Daily logging functions
│   ├── schema.ts                # Database schema
│   ├── sessions.ts              # Session management functions
│   ├── statistics.ts            # Analytics functions
│   └── users.ts                 # User management functions
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
├── public/                      # Static assets
├── middleware.ts                # Next.js middleware
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🔧 Configuration

### Environment Variables
See [ENVIRONMENT.md](./ENVIRONMENT.md) for detailed environment variable setup.

### Database Configuration
The Convex schema is defined in `convex/schema.ts` and includes all necessary tables and indexes for the application.

### Authentication Setup
Clerk integration is configured in `convex/auth.config.ts` and `app/providers.tsx`.

## 🎨 Design System

### Color Palette
- **Primary**: Slate gray backgrounds (slate-800, slate-900)
- **Accent**: Emerald and teal (emerald-600, teal-600)
- **Text**: White and slate variations
- **Status**: Green (success), Yellow (warning), Red (error), Blue (info)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, clear hierarchy
- **Body**: Readable, accessible contrast

### Components
Built with shadcn/ui for consistency and accessibility:
- Buttons, Cards, Dialogs, Forms
- Inputs, Labels, Textareas
- Badges, Avatars, Progress indicators

## 📊 Data Flow

1. **User Authentication**: Clerk handles user creation and authentication
2. **Program Selection**: New users choose Solo or Keyholder program
3. **Daily Logging**: Users track compliance, mood, and journal entries
4. **Challenge Management**: Browse, start, and complete self-discipline challenges
5. **Progress Tracking**: Real-time statistics and analytics
6. **Session Management**: Keyholder users can manage chastity sessions

## 🔒 Security

- **Authentication**: Clerk provides secure user management
- **Authorization**: Convex handles data access control
- **Password Protection**: Keyholder sessions require password verification
- **Data Privacy**: All user data is encrypted and secure

## 🚀 Performance

- **Real-time Updates**: Convex provides instant data synchronization
- **Optimistic UI**: Immediate feedback for user actions
- **Caching**: Statistics are cached for better performance
- **Responsive**: Mobile-first design with optimal loading

## 📈 Analytics

The application tracks:
- Daily compliance ratings (1-5 scale)
- Mood patterns (Great, Okay, Difficult)
- Challenge completion rates
- Streak tracking and history
- Session duration and goals
- Progress trends over time

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the [FEATURES.md](./FEATURES.md) for detailed feature documentation
- Review [ENVIRONMENT.md](./ENVIRONMENT.md) for setup issues
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help

---

**DisciplineForge** - Building self-discipline through structured progress tracking and gamified challenges.