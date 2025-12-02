# Modex

Production deployment: <https://modex-eta.vercel.app>

Modex is a modern dashboard application built with Next.js 16 (App Router), React 19, Tailwind CSS v4, and Appwrite. It provides authenticated access to customer and invoice management, revenue insights, and a clean, themeable UI.

## Features

- Authentication: Email/password and Google OAuth (Appwrite)
- Customers: Create, list, search, edit, delete
- Invoices: Create, list, search, edit, delete, latest invoices
- Revenue: Monthly revenue chart and KPI cards
- Pagination & Search: URL-driven with debounced inputs
- Theming: Dark/light via `next-themes` with Tailwind CSS variables
- Performance: Suspense fallbacks and skeleton components

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 with CSS variables
- Appwrite (browser SDK for OAuth; Node SDK for server actions)
- Zod v3 for server-side validation

## Architecture

- Server actions in `lib/actions/*` handle CRUD and validation (e.g., `action.customer.ts`, `action.invoice.ts`, `action.revenue.ts`, `action.auth.ts`).
- Appwrite clients:
	- Browser: `lib/appwrite-client.ts` (OAuth initiation)
	- Server: `lib/appwrite-server.ts` (Databases, Storage, Account)
- Route Groups:
	- `(auth)`: public authentication pages and Google OAuth callback
	- `(root)`: protected dashboard routes (customers, invoices, revenue)
- Helpers: `lib/utils.ts` (currency/date, pagination), `lib/url.ts` (query helpers)
- Types: `types/index.d.ts` for shared data models

## Environment Setup

Create `.env.local` with your Appwrite credentials:

```bash
NEXT_PUBLIC_APPWRITE_PROJECT_ID=... 
APPWRITE_API_KEY=...
NEXT_PUBLIC_APPWRITE_DATABASE_ID=...
NEXT_PUBLIC_APPWRITE_STORAGE_ID=...
NEXT_PUBLIC_APPWRITE_COLLECTION_REVENUE_ID=revenue
NEXT_PUBLIC_APPWRITE_COLLECTION_CUSTOMERS_ID=customers
NEXT_PUBLIC_APPWRITE_COLLECTION_INVOICES_ID=invoice-table
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Ensure `next.config.ts` allows remote images from your Appwrite endpoint (default `fra.cloud.appwrite.io`).

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. For production:

```bash
pnpm build
pnpm start
```

Linting:

```bash
pnpm lint
```

## Authentication Flow

- Email/password:
	- Signup and login create an Appwrite session and set an `appwrite-session` httpOnly cookie.
	- Redirect to `/dashboard` after session is established.
- Google OAuth:
	- Initiated in `components/auth/social-auth.tsx` via `loginWithGoogle()`.
	- Callback page verifies session and calls `/api/auth/session` to set cookie, then redirects to dashboard.

## Key Pages & Components

- Dashboard: `app/(root)/dashboard/page.tsx` (cards, revenue chart, latest invoices)
- Customers: `app/(root)/dashboard/customers/page.tsx`
- Invoices: `app/(root)/dashboard/invoices/page.tsx`
- Auth: `app/(auth)/login/page.tsx`, `app/(auth)/sign-up/page.tsx`, Google callback at `app/(auth)/auth/google/success/page.tsx`

## Contributing

Pull requests are welcome. Please keep to the established patterns:

- Use server actions with `"use server"` and validate inputs via Zod.
- Revalidate paths and redirect after mutations.
- Keep styling consistent with Tailwind variables and component patterns.

## License

Proprietary. All rights reserved.
