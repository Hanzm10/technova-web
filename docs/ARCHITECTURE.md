# TechNova Architecture

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI
- **Authentication:** Clerk
- **Database:** Supabase (PostgreSQL + RLS)
- **Billing:** RevenueCat (Web Billing)
- **State Management:** Zustand (for Cart/Toast)
- **Animations:** Framer Motion

## Key Patterns
- **Server Actions:** Used for database mutations (e.g., `src/app/actions/order.ts`).
- **Hooks:** Custom hooks for complex logic (e.g., `src/hooks/useCheckout.ts`, `src/hooks/useCartStore.ts`).
- **Providers:** Context providers for global services (e.g., `RevenueCatProvider`, `SupabaseProvider`).
- **Security:** 
  - RLS (Row Level Security) on Supabase with Clerk integration.
  - Server-side role verification (`getUserRole` in `src/utils/supabase/server.ts`).
  - Search Modal with accessibility and scroll lock.

## File Map
- `src/app/`: Next.js pages and layouts.
- `src/components/`:
  - `catalog/`: Product listing and detail components.
  - `layout/`: Global UI (Navbar, Footer, Providers).
  - `search/`: Global search implementation (`SearchModal`).
  - `ui/`: Shared Shadcn UI components.
- `src/hooks/`: Custom React hooks.
- `src/utils/`: Shared utility functions (Supabase client, server utilities).
- `src/types/`: TypeScript definitions and database schema types.

## Recent Decisions
- **Search Component:** Implemented `cmdk` for a VS Code-style command palette to provide high-velocity search.
- **Hero Animations:** Switched from `whileInView` to `animate` in `HeroSection` to ensure immediate impact on load/refresh, especially on mobile.
- **Scroll Lock:** Added manual body scroll locking in modals to ensure clean UI state.

## Context Restoration
- **Current Goal:** Prepare for release (Audit & Documentation).
- **Last Action:** Security sweep, log cleanup, and architecture documentation initialization.
- **Active Problems:** None identified during sweep.
