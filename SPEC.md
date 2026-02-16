# Project Specification: TechNova Web Platform

## 1. Core Objectives
**Goal:** Transition TechNova from brick-and-mortar to a digital-first lifestyle brand. 
**Platform:** Unify "sales, customer engagement, and brand identity" into a single web application.
**Target Audience:**
- **Public (B2C):** Shoppers for Fashion, Gadgets, Lifestyle.
- **Internal (Admin):** Staff managing products, users, orders.

## 2. Technical Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS + Shadcn UI (Custom Theme)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Clerk (Synced to Supabase `users` table)
- **Billing:** RevenueCat Web Billing (Stripe Wrapper)
- **State Management:** React Query / Zustand (if needed)

## 3. Visual Identity (Frozen)
> **Ref:** `SPEC.md.resolved`
- **Primary Background:** `#E8ECEF` (Soft Gray-Blue)
- **Text:** Slate-900 (Primary), Slate-600 (Secondary)
- **Typography:** `Inter` (UI/Body), `Playfair Display` (Accents)
- **Key Visuals:** Large typography, glassmorphism (`backdrop-blur-md`), rounded UI (`rounded-[3rem]`).

## 4. Key Features
### Public Features
- **Hero/Landing:** Dynamic, high-impact visuals.
- **Product Catalog:** Filterable categories (Fashion, Gadgets, Home).
- **Cart & Checkout:** Persistent cart, Stripe integration via RevenueCat.
- **User Dashboard:** Order history, profile management.

### Admin Features
- **Dashboard:** Analytics overview.
- **Product Management:** Add/Edit/Delete items.
- **User Management:** View customer data.
- **Order Management:** Tracking and status updates.

## 5. Billing & Monetization
- **Provider:** RevenueCat (Web Billing) / Stripe Connect.
- **Model:** Pay-per-product (Standard E-commerce).
- **Note:** RevenueCat integration is prepared for future Loyalty/Membership tiers, but primary transaction flow will be standard commerce.
