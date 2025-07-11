# Uganda Viral Load Manager - Simple Deployment Guide

A quick and simple guide to deploy the Uganda Viral Load Manager Next.js application.

## Prerequisites

- Ubuntu 20.04 LTS or later
- Root or sudo access
- Internet connection

## 🚀 Simple Deployment Steps

### 1. Install Node.js

```bash
# Install Node.js (v18 or later)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Bun

```bash
# Install Bun package manager
curl -fsSL https://bun.sh/install | bash
source ~/.bashrc

# Verify installation
bun --version
```

### 3. Clone the Repository

```bash
# Clone your project
git clone https://github.com/yourusername/uganda-viral-load-manager.git
cd uganda-viral-load-manager
```

### 4. Install Dependencies

```bash
# Install all project dependencies
bun install
```

### 5. Set Up Environment Variables

```bash
# Copy environment file
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

Add your environment variables:
```env
# Database URLs - Three separate MySQL databases
DATABASE_URL="mysql://uganda_user:your_password@localhost:3306/etest_users"
DATABASE_URL_EID="mysql://uganda_user:your_password@localhost:3306/etest_eid"
DATABASE_URL_VL_LIMS="mysql://uganda_user:your_password@localhost:3306/etest_vl_lims"

# Better Auth Configuration
BETTER_AUTH_SECRET="your-super-secret-key-here-32-chars-min"
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"

# Application
NODE_ENV="production"
PORT=3000
```

### 6. Build the Application

```bash
# Build the Next.js application
bun run build
```

### 7. Start the Application

```bash
# Start the production server
bun start
```

## 🎉 That's It!

Your application should now be running at `http://localhost:3000`

## 📝 Quick Commands Summary

```bash
# One-liner setup (after installing Node.js and Bun)
git clone https://github.com/yourusername/uganda-viral-load-manager.git && \
cd uganda-viral-load-manager && \
bun install && \
bun run build && \
bun start
```

## 🔧 Optional: Run in Background

To keep the application running even after closing the terminal:

```bash
# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start "bun start" --name uganda-app

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## 🚨 Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
sudo lsof -t -i:3000 | xargs kill -9

# Or use a different port
PORT=3001 bun start
```

**Permission issues?**
```bash
# Fix permissions
sudo chown -R $USER:$USER ~/uganda-viral-load-manager
```

**Build fails?**
```bash
# Clear cache and retry
rm -rf .next
rm -rf node_modules
bun install
bun run build
```

## 🔄 Updates

To update the application:

```bash
cd uganda-viral-load-manager
git pull origin main
bun install
bun run build
# Stop current process (Ctrl+C if running directly, or pm2 restart uganda-app)
bun start
```

---

**Note:** This guide assumes you have your MySQL databases already set up and running. For database setup, refer to your database administrator or the full deployment guide. 