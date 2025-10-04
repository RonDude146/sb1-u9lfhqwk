# Newhill Spices - Production E-commerce Platform

A complete B2B/B2C spice e-commerce platform built with Next.js 14, featuring multi-region payments, shipping integration, and comprehensive admin management.

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd newhill-spices
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Fill in your environment variables
   ```

3. **Database Setup**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run seed
   ```

4. **Start Development**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js Route Handlers, Prisma ORM
- **Database**: PostgreSQL with comprehensive schema
- **Authentication**: NextAuth.js with Email OTP + Google OAuth
- **Payments**: Razorpay (India) + Mock adapters (GCC countries)
- **Shipping**: Shiprocket (India) + Mock GCC logistics
- **Storage**: UploadThing + Cloudflare R2
- **Cache**: Upstash Redis with local fallback

### Key Features
- **Multi-region Support**: Payments and shipping for India + GCC countries
- **B2B Wholesale**: Business accounts, quotes, tiered pricing
- **Admin Panel**: 12 comprehensive modules with toggles
- **Multi-language**: EN, HI, TA, KN, AR support
- **Multi-currency**: INR, QAR, AED, SAR, OMR with server-side conversion
- **Inventory Management**: Lot tracking and automated stock updates
- **Real-time Analytics**: PostHog integration with custom events

## 📂 Project Structure

```
├── app/                    # Next.js app router
│   ├── (auth)/            # Authentication pages
│   ├── (admin)/           # Admin panel
│   ├── (b2b)/            # B2B portal
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── admin/            # Admin-specific components
│   └── providers/        # Context providers
├── lib/                  # Utilities and configurations
│   ├── payments/         # Payment providers
│   ├── shipping/         # Shipping integrations
│   └── utils/            # Helper functions
├── prisma/               # Database schema and migrations
│   ├── schema.prisma     # Main schema
│   └── seed.ts           # Seed data
├── types/                # TypeScript type definitions
├── locales/              # Translation files
└── tests/                # Test files (Vitest + Playwright)
```

## 🗄️ Database Schema

### Core Entities
- **Users & Authentication**: NextAuth integration with roles
- **Products & Variants**: SKUs, pricing, inventory by lot
- **Orders & Payments**: Multi-provider payment tracking
- **B2B System**: Business accounts, quotes, approvals
- **Shipping**: Multi-provider shipment tracking
- **Admin**: Audit logs, system settings, toggles

### Sample Data
The seed script creates:
- Admin user: `admin@newhillspices.com`
- 6 spice products with 4 variants each
- Business account for B2B testing
- Currency conversion rates
- System settings and translation keys

## 💳 Payment Integration

### Supported Providers
- **India**: Razorpay (Production ready)
- **Qatar**: Dibsy (Mock adapter)
- **UAE**: Telr (Mock adapter)
- **Saudi**: Moyasar (Mock adapter)
- **Oman**: OmanNet (Mock adapter)

### Implementation
```typescript
// Auto-select provider based on shipping country
const provider = getPaymentProvider(order.shippingCountry);
const paymentOrder = await provider.createOrder({
  orderId: order.id,
  amount: order.totalINR,
  currency: order.currency,
  customerEmail: user.email,
});
```

## 📦 Shipping Integration

### Providers
- **India**: Shiprocket (Real API integration)
- **GCC**: Mock connector with extensible interface

### Features
- Automatic rate calculation
- Real-time tracking
- Delivery estimates
- COD support (India)

## 🌐 Multi-language & Currency

### Languages
- English, Hindi, Tamil, Kannada, Arabic
- Admin-editable translations
- Toggle-controlled activation

### Currency
- Server-side conversion using live rates
- Automatic selection by shipping region
- Admin-managed exchange rates

## 🔧 Admin Panel Modules

1. **Overview**: KPIs, charts, real-time feed
2. **Products**: CRUD, variants, lots, CSV import
3. **Orders**: Management, status updates, invoicing
4. **Customers**: User management, LTV tracking
5. **B2B**: Account approvals, quote management
6. **Finance**: Revenue reports, tax calculations
7. **Marketing**: Coupons, banners, A/B testing
8. **Support**: Ticket system, internal notes
9. **Security**: Role management, audit logs
10. **Toggles**: Feature flag management
11. **CMS**: Content management, translations
12. **Analytics**: Insights, forecasting, health monitoring

## 🧪 Testing

### Setup
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Interactive E2E
npm run test:e2e:ui
```

### Test Coverage
- **Unit Tests**: Payment calculations, currency conversion, inventory logic
- **E2E Tests**: Complete user flows, admin operations, B2B workflows
- **API Tests**: All endpoints with authentication

## 🚀 Deployment

### Production Checklist
1. Set up production database (Supabase/Neon)
2. Configure live payment providers
3. Set up Shiprocket production account
4. Configure Cloudflare R2 storage
5. Set up monitoring (Sentry, PostHog)

### Environment Variables
Refer to `.env.example` for all required variables.

### Vercel Deployment
```bash
npm run build
# Deploy to Vercel with environment variables set
```

## 🛡️ Security

### Features
- **Authentication**: NextAuth with multiple providers
- **Authorization**: Role-based access control
- **Input Validation**: Zod schemas on all APIs
- **Rate Limiting**: Built-in protection
- **Audit Logging**: Complete action tracking
- **CSRF Protection**: Built into forms
- **Data Encryption**: Sensitive data protection

### Compliance
- GDPR considerations
- PCI DSS for payment handling
- SOC 2 compatible architecture

## 🔍 Monitoring & Analytics

### Observability Stack
- **Analytics**: PostHog + GA4
- **Logging**: Pino with structured logging
- **Monitoring**: Health checks and uptime
- **Error Tracking**: Sentry integration

### Business Metrics
- Conversion funnel tracking
- Product performance analytics
- Customer journey mapping
- Revenue attribution

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Ensure all tests pass
4. Update documentation
5. Submit pull request

### Code Standards
- TypeScript strict mode
- ESLint + Prettier
- Component documentation
- API documentation

## 📞 Support

### Production Support
- **Email**: tech@newhillspices.com
- **Documentation**: `/docs` folder
- **Issue Tracking**: GitHub Issues

### Business Operations
- **Admin Training**: Comprehensive guides in `/docs/admin`
- **API Documentation**: Auto-generated from code
- **Troubleshooting**: Common issues and solutions

---

## 🎯 Key Success Metrics

- **Performance**: < 2s page load time
- **Uptime**: 99.9% availability
- **Security**: Zero data breaches
- **User Experience**: < 3% cart abandonment
- **Business**: Multi-region scaling capability

Built with ❤️ for Newhill Spices - Bringing Kerala's finest spices to the world.