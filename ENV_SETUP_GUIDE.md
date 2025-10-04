# Environment Variables Setup Guide

This guide will help you collect and configure all the required environment variables for the Newhill Spices e-commerce platform.

## 📋 Required Environment Variables

Copy `.env.example` to `.env` and fill in the following values:

```bash
cp .env.example .env
```

## 🗄️ Database Configuration

### DATABASE_URL
**What it is:** PostgreSQL database connection string
**How to get it:**
1. **Option 1 - Supabase (Recommended):**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Go to Settings → Database
   - Copy the connection string from "Connection string" → "URI"
   - Replace `[YOUR-PASSWORD]` with your database password

2. **Option 2 - Neon:**
   - Go to [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string from the dashboard

3. **Option 3 - Local PostgreSQL:**
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/newhill_spices"
   ```

## 🔐 Authentication (NextAuth)

### NEXTAUTH_URL
**What it is:** Your application's base URL
**How to set it:**
- Development: `http://localhost:3000`
- Production: `https://yourdomain.com`

### NEXTAUTH_SECRET
**What it is:** Secret key for JWT encryption
**How to generate:**
```bash
openssl rand -base64 32
```
Or use: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

### Google OAuth (Optional but Recommended)

#### GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
**How to get them:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
7. Copy Client ID and Client Secret

## 📧 Email Configuration (SMTP)

### SMTP Settings
**What it is:** Email service for sending OTP and notifications
**How to get them:**

#### Option 1 - Gmail (Easiest)
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use these settings:
```
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@newhillspices.com"
```

#### Option 2 - SendGrid
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key
3. Use these settings:
```
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
SMTP_FROM="noreply@newhillspices.com"
```

## 💳 Payment Providers

### Razorpay (India - Real Integration)
**How to get keys:**
1. Sign up at [razorpay.com](https://razorpay.com)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate Test/Live keys
5. Set up webhooks:
   - Webhook URL: `https://yourdomain.com/api/webhooks/razorpay`
   - Events: `payment.captured`, `payment.failed`

```
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-secret-key"
RAZORPAY_WEBHOOK_SECRET="webhook-secret"
```

### GCC Payment Providers (Mock - For Development)
These are mock values for development. Replace with real credentials when integrating:

```
DIBSY_API_KEY="mock-dibsy-key"
TELR_STORE_ID="mock-telr-store-id"
MOYASAR_PUBLIC_KEY="mock-moyasar-key"
OMANNET_MERCHANT_ID="mock-omannet-merchant"
```

## 📦 Shipping Integration

### Shiprocket (India - Real Integration)
**How to get credentials:**
1. Sign up at [shiprocket.in](https://shiprocket.in)
2. Complete seller onboarding
3. Go to Settings → API
4. Get your credentials

```
SHIPROCKET_EMAIL="your-shiprocket-email"
SHIPROCKET_PASSWORD="your-shiprocket-password"
SHIPROCKET_CHANNEL_ID="your-channel-id"
SHIPROCKET_ENVIRONMENT="sandbox" # or "live"
```

## 📁 File Storage

### UploadThing
**How to get keys:**
1. Sign up at [uploadthing.com](https://uploadthing.com)
2. Create a new app
3. Copy the keys from dashboard

```
UPLOADTHING_SECRET="sk_live_xxxxxxxxxx"
UPLOADTHING_APP_ID="your-app-id"
```

### Cloudflare R2 (Optional)
**How to get keys:**
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Go to R2 Object Storage
3. Create a bucket
4. Generate API tokens

```
CLOUDFLARE_R2_ACCESS_KEY_ID="your-access-key"
CLOUDFLARE_R2_SECRET_ACCESS_KEY="your-secret-key"
CLOUDFLARE_R2_BUCKET_NAME="newhill-spices"
CLOUDFLARE_R2_ENDPOINT="your-r2-endpoint"
```

## 🚀 Cache & Rate Limiting

### Upstash Redis
**How to get credentials:**
1. Sign up at [upstash.com](https://upstash.com)
2. Create a Redis database
3. Copy REST URL and token

```
UPSTASH_REDIS_REST_URL="https://your-redis.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"
```

## 📊 Analytics & Monitoring

### PostHog
**How to get keys:**
1. Sign up at [posthog.com](https://posthog.com)
2. Create a project
3. Copy Project API Key from Settings

```
POSTHOG_KEY="phc_xxxxxxxxxx"
POSTHOG_HOST="https://app.posthog.com"
```

### Google Analytics 4
**How to get Measurement ID:**
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create a property
3. Set up a data stream
4. Copy Measurement ID (starts with G-)

```
GA4_MEASUREMENT_ID="G-XXXXXXXXXX"
```

### Sentry (Error Tracking)
**How to get DSN:**
1. Sign up at [sentry.io](https://sentry.io)
2. Create a project
3. Copy DSN from project settings

```
SENTRY_DSN="https://xxxxxxxxxx@sentry.io/xxxxxxx"
```

## 🏢 Application Configuration

### Basic App Settings
```
NEXT_PUBLIC_APP_URL="http://localhost:3000" # Your domain in production
NEXT_PUBLIC_COMPANY_NAME="Newhill Spices"
NEXT_PUBLIC_SUPPORT_EMAIL="support@newhillspices.com"
NEXT_PUBLIC_SUPPORT_PHONE="+91-9876543210"
```

### Feature Flags (Admin Controllable)
```
ENABLE_MULTI_LANG="true"
ENABLE_MULTI_CURRENCY="true"
ENABLE_B2B="true"
ALLOW_GUEST_CHECKOUT="false"
ENABLE_NEWSLETTER="true"
ENABLE_SUBSCRIPTIONS="false"
ENABLE_GCC_SHIPPING="true"
```

## 🔧 Development vs Production

### Development Setup (Minimum Required)
For local development, you only need:
1. `DATABASE_URL` (local PostgreSQL or Supabase)
2. `NEXTAUTH_SECRET`
3. `NEXTAUTH_URL="http://localhost:3000"`
4. Basic SMTP settings (Gmail)

### Production Setup (All Required)
For production deployment, configure all variables with real credentials.

## 🚀 Quick Start Commands

After setting up your `.env` file:

```bash
# Install dependencies
npm install

# Set up database
npx prisma generate
npx prisma db push
npm run seed

# Start development server
npm run dev
```

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database is accessible
   - Verify credentials

2. **Email Not Sending**
   - Check SMTP credentials
   - Verify app password for Gmail
   - Check firewall/network restrictions

3. **Payment Integration Issues**
   - Verify API keys are correct
   - Check webhook URLs
   - Ensure proper environment (test/live)

4. **File Upload Issues**
   - Verify UploadThing credentials
   - Check file size limits
   - Ensure proper CORS settings

## 📞 Support

If you need help setting up any of these services:
- Check the official documentation for each service
- Contact the respective support teams
- Refer to the troubleshooting section in README.md

---

**Security Note:** Never commit your `.env` file to version control. Keep your credentials secure and rotate them regularly.