# Copilot Instructions for this Repo

These instructions guide AI coding agents to be immediately productive in this Next.js (App Router) monorepo. Focus is the `dashboard/` app.

## Architecture Overview
- **App Router**: Pages and server components live under `dashboard/app/**`. Layout in `app/layout.tsx`, global styles in `app/globals.css`.
- **Feature modules**: UI under `dashboard/components/**` (e.g., `customers/`, `invoices/`, `navigation/`). Keep components small and colocate feature-specific components.
- **Server Actions**: CRUD/data fetch logic in `dashboard/lib/actions/*` (e.g., `action.customer.ts`, `action.invoice.ts`). All server actions begin with `"use server"` and use Appwrite SDK.
- **Data layer**: Appwrite client(s) in `dashboard/lib/appwrite-server.ts` (server SDK: `node-appwrite`) and `dashboard/lib/appwrite-client.ts` (browser SDK: `appwrite`). Prefer server SDK for privileged operations.
- **Utilities & validation**: Common helpers in `dashboard/lib/{utils.ts,url.ts,validation.ts,placeholder-data.ts}`. Zod is used for schemas.
- **Configuration**: Theme, fonts, and site metadata under `dashboard/config/**` and `dashboard/context/**`.

## External Integrations
- **Appwrite**: Databases, Storage, and OAuth (Google). Configure via env vars: `NEXT_PUBLIC_APPWRITE_PROJECT_ID`, `NEXT_PUBLIC_APPWRITE_DATABASE_ID`, `NEXT_PUBLIC_APPWRITE_STORAGE_ID`, `APPWRITE_API_KEY`, `NEXT_PUBLIC_BASE_URL`. Server SDK endpoint: `https://fra.cloud.appwrite.io/v1`.
- **Auth**: `next-auth@5 beta` is present; OAuth flows initiated via `loginWithGoogle` in `lib/appwrite-client.ts`. Use server-side checks where possible.
- **Styling**: Tailwind CSS v4 with PostCSS. Class composition via `clsx` and `tailwind-merge`.

## Patterns & Conventions
- **Server-first data**: Fetch and mutate through server actions in `lib/actions/**`. Example: `createCustomer(formData)` in `lib/actions/action.customer.ts` uploads to Storage then writes to `customers` collection.
- **Pagination & search**: Use `ITEMS_PER_PAGE` from `lib/utils.ts`. Filter client-side for merged datasets as in `fetchFilteredCustomers`.
- **Revalidation**: After mutations, call `revalidatePath('/dashboard/...')` to refresh routes.
- **IDs & files**: Generate IDs with `ID.unique()` from `appwrite`. For Storage uploads, construct public view URL using bucket and file IDs.
- **Types**: Shared types under `dashboard/types/**` (e.g., `Customer`). Keep action return shapes `{ success, message, ... }`.
- **Components**: Reusable UI primitives in `components/*` (e.g., `button.tsx`, `submit-button.tsx`, `theme-switch.tsx`). Follow existing prop naming and minimal inline logic.

## Workflows
- **Dev**: `npm run dev` (or `pnpm dev`) from `dashboard/`.
- **Build**: `npm run build` to compile Next.js.
- **Lint**: `npm run lint` (ESLint config at `eslint.config.mjs`).
- **Start**: `npm run start` for production.
- **Environment**: Define required env vars before running. For local dev, create `.env.local` in `dashboard/` with the keys listed above.

## File Examples to Reference
- Data fetch + merge: `lib/actions/action.customer.ts` (`getFormattedCustomersTable`, `fetchFilteredCustomers`).
- Appwrite server setup: `lib/appwrite-server.ts`.
- Client OAuth flow: `lib/appwrite-client.ts`.
- UI composition: `components/*` and feature subfolders (e.g., `components/customers/*`).

## Guardrails for AI Agents
- Prefer server SDK (`node-appwrite`) for database/storage mutations; avoid using browser SDK for privileged ops.
- Keep server actions pure and side-effect scoped: validate inputs, call Appwrite, then `revalidatePath`.
- Maintain consistent return contracts and type usage; update `dashboard/types/**` if adding new entities.
- Do not hardcode IDs or URLs; always use env-configured project, database, and storage IDs.
- When adding routes under `app/**`, ensure layout and metadata integration remain consistent with existing structure.

If any section is unclear or incomplete (e.g., additional collections, invoices flow), tell us what you need and we’ll refine this file.