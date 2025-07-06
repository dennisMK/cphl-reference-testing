# Uganda Viral Load Manager

A comprehensive web application for managing viral load testing and Early Infant Diagnosis (EID) in Uganda's healthcare system.

## 🚀 Features

- **Patient Management**: Complete patient registration and tracking
- **Sample Collection**: Streamlined sample collection and tracking workflow
- **Test Requests**: Create and manage viral load and EID test requests
- **Results Management**: Track test results and generate reports
- **User Authentication**: Secure login system with role-based access
- **Facility Management**: Multi-facility support with facility-specific data
- **Dashboard Analytics**: Real-time insights and analytics
- **Responsive Design**: Mobile-friendly interface for field use

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: MySQL with Drizzle ORM (3 separate databases)
- **Authentication**: Better Auth
- **UI Components**: Radix UI primitives with shadcn/ui
- **Package Manager**: Bun
- **Deployment**: Ubuntu Server with PM2 and Nginx

## 📋 Prerequisites

- Node.js 18+ or Bun
- MySQL 8.0+
- Git

## 🏃‍♂️ Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uganda-viral-load-manager.git
   cd uganda-viral-load-manager
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database and other configuration
   ```


5. **Start the development server**
   ```bash
   bun run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗂️ Project Structure

```
uganda-viral-load-manager/
├── app/                      # Next.js app directory
│   ├── (protected)/         # Protected routes
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── viral-load/      # Viral load management
│   │   ├── eid/            # EID management
│   │   └── settings/       # User settings
│   ├── api/                # API routes
│   └── auth/               # Authentication pages
├── src/
│   ├── components/         # Reusable UI components
│   ├── lib/               # Utility functions
│   ├── server/            # Server-side code
│   │   ├── api/          # tRPC routers
│   │   └── db/           # Database schemas
│   └── styles/           # Global styles
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🔒 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database URLs - Three separate MySQL databases
DATABASE_URL="mysql://username:password@localhost:3306/etest_users"
DATABASE_URL_EID="mysql://username:password@localhost:3306/etest_eid"
DATABASE_URL_VL_LIMS="mysql://username:password@localhost:3306/etest_vl_lims"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here-32-chars-min"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Application
NODE_ENV="development"
PORT=3000

```

## 📊 Database

The application uses MySQL with Drizzle ORM for database operations across three separate databases:
- `etest_users` - User management and authentication
- `etest_eid` - Early Infant Diagnosis test data
- `etest_vl_lims` - Viral Load Laboratory Information Management System

See `DATABASE_SETUP.md` and `DATABASE_USAGE.md` for detailed information.

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run start        # Start production server


# Code Quality
bun run lint         # Run ESLint
bun run type-check   # Run TypeScript checks
```

## 🚀 Deployment

For production deployment on Ubuntu servers, see our comprehensive [Deployment Guide](./DEPLOYMENT_README.md).


## 🔐 Authentication

The application uses NextAuth.js for authentication with support for:
- Email/password authentication

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices, making it suitable for field use by healthcare workers.

## 🎨 UI/UX

- **Design System**: Based on shadcn/ui components
- **Accessibility**: WCAG compliant
- **Responsive**: Mobile-first design

## 🧪 Testing

```bash
# Run tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage
```

## 📄 API Documentation

The application uses tRPC for type-safe API routes. API documentation is available at `/api/trpc` when running in development mode.

## 🔧 Configuration

### Database Configuration

See `drizzle.config.ts` for database configuration options.

### Next.js Configuration

See `next.config.js` for Next.js specific configurations.


## 🆘 Support

For technical support or questions:
- Check the [Deployment Guide](./DEPLOYMENT_README.md)
- Review the documentation
- Open an issue on GitHub
- Contact the development team
