# Kretz Architecture: Decoupled Deployment & Infrastructure Guide

This guide details how to deploy and operate the three separated architectural tiers:
1. **Customer Frontend** (`kretz.site`)
2. **Backend Server** (`api.kretz.site`)
3. **Admin Panel** (`admin.kretz.site`)

---

## Architecture Topology

```
┌─────────────────────────────────┐        ┌─────────────────────────────────┐
│        Customer Frontend        │        │           Admin Panel           │
│        (kretz.site)             │        │        (admin.kretz.site)       │
│  Public Portal • Investor Desk  │        │   Compliance • Treasury Control │
└────────────────┬────────────────┘        └────────────────┬────────────────┘
                 │                                          │
                 │ HTTPS / REST (JWT Bearer: investor)      │ HTTPS / REST (JWT Bearer: admin)
                 │ CORS Allowed: https://kretz.site         │ CORS Allowed: https://admin.kretz.site
                 ▼                                          ▼
   ┌──────────────────────────────────────────────────────────────┐
   │                    Kretz Backend Server                      │
   │                    (api.kretz.site)                          │
   │  Express API Engine • Rate Limiting • Correlation IDs        │
   │  Server-Authoritative Balances • Webhook HMAC Verification   │
   └───────────────┬──────────────────────────────┬───────────────┘
                   │                              │
                   │ TLS PostgreSQL               │ HTTPS Signed Webhooks
                   ▼                              ▼
   ┌──────────────────────────────┐ ┌──────────────────────────────┐
   │     Protected Database       │ │ Payment Providers & Gateways │
   │ (PostgreSQL / Cloud SQL /    │ │   (CaixaBank SWIFT/SEPA,     │
   │  Supabase Private Network)   │ │    EVM Treasury, Stripe)     │
   └──────────────────────────────┘ └──────────────────────────────┘
```

---

## Component 1: Customer Frontend

### Responsibilities
* Public marketing website, property discovery, and calculator.
* User registration, login, and password recovery.
* Customer investor dashboard, wallet view, and tokenized investment certificates.
* Communicates with Backend Server strictly via versioned HTTPS endpoints (`/api/v1/*`).
* **Zero privileged secrets**: Contains only public keys. No database credentials, no payment secrets, and no admin controls.

### Build & Deploy
1. **Environment Configuration:**
   Copy `.env.frontend.example` to `.env`:
   ```bash
   VITE_API_BASE_URL=https://api.kretz.site/api/v1
   VITE_SITE_URL=https://kretz.site
   VITE_SUPPORT_EMAIL=info@kretz.site
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1...
   ```

2. **Compilation:**
   ```bash
   npm run build
   ```
   Outputs static assets to the `dist/` directory.

3. **Hosting Options:**
   * **Vercel / Netlify / Cloudflare Pages:**
     * Build Command: `npm run build`
     * Output Directory: `dist`
     * Single Page App (SPA) rewrite rule: `/*` -> `/index.html`

---

## Component 2: Backend Server

### Responsibilities
* Centralized authentication, JWT issuance, and RBAC enforcement (`requireAuth`, `requireAdmin`).
* Database transactions, balance modifications, and escrow processing.
* Strict CORS filtering restricting access to authorized Frontend and Admin origins.
* Payment webhook verification with HMAC SHA-256 signatures, replay attack timestamp defenses, and idempotency tracking.
* Comprehensive audit logging and structured systems telemetry.

### Build & Deploy
1. **Environment Configuration:**
   Copy `.env.backend.example` to `.env`:
   ```bash
   NODE_ENV=production
   PORT=8080
   CORS_ORIGIN=https://kretz.site,https://admin.kretz.site
   JWT_SECRET=super_secure_random_64_char_key
   DATABASE_URL=postgresql://user:pass@host:5432/dbname
   PAYMENT_WEBHOOK_SECRET=whsec_your_hmac_secret
   ```

2. **Launch Standalone Server:**
   ```bash
   # Run standalone Express backend server
   npx tsx server/index.ts
   # or with Node.js production build:
   node dist-server/index.js
   ```

3. **Hosting Options:**
   * **Render / Fly.io / Google Cloud Run / AWS ECS:**
     * Expose Port `8080` (or `PORT` environment variable).
     * Health check endpoint: `GET /api/health`.

---

## Component 3: Admin Panel

### Responsibilities
* Dedicated back-office dashboard for executive management and compliance officers.
* Review and approve/reject deposit notifications.
* Review and approve/reject withdrawal requests.
* Execute manual institutional wire credits.
* Update treasury escrow bank details and crypto network settlement addresses.
* Review KYC identity submissions.
* Inspect real-time audit logs, systems health, and query structured server logs.
* **Direct database connection is completely blocked**: Operates exclusively over authenticated HTTPS bearer token requests to `/api/v1/admin/*`.

### Deployment & Isolation
1. **Environment Configuration:**
   Copy `.env.admin.example` to `.env`:
   ```bash
   VITE_API_BASE_URL=https://api.kretz.site/api/v1
   VITE_PORTAL_TITLE=Kretz Executive & Compliance Console
   ```

2. **Deployment Recommendations:**
   * Deploy on a protected subdomain (e.g., `admin.kretz.site`).
   * Protect behind Cloudflare Access, Google BeyondCorp, or an internal corporate VPN.
   * Direct route entry: `/admin` and `/admin/login`.

---

## Security Invariants Checklist

- [x] **Client-Side Secret Isolation:** No database passwords, webhook signing secrets, or private keys exist in frontend code.
- [x] **Server-Authoritative Ledger:** Balance deductions, manual credits, and approvals are executed exclusively by the backend API.
- [x] **Rate Limiting:** Auth routes limited to 15 attempts / 5 mins; global API rate limiters enforced.
- [x] **CORS Lockdown:** Preflight and response headers validate requesting origins against `CORS_ORIGIN`.
- [x] **HMAC SHA-256 Webhooks:** Payment webhooks cryptographically verified using constant-time comparison to prevent timing attacks.
- [x] **Webhook Idempotency & Replay Defense:** Rejects duplicate events and validates timestamps within 300 seconds.
- [x] **RBAC Enforcement:** Admin routes (`/api/v1/admin/*`) reject non-admin users with `403 Forbidden`.
