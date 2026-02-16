# Stripe Connect Setup Guide for RevenueCat

Since you are using RevenueCat Web Billing, you need to connect a Stripe account to handle payments.

## 1. Create a Stripe Account
1. Go to [Stripe.com](https://stripe.com) and sign up.
2. Complete the **Activate Payments** form (requires business/personal details, bank account for payouts).

## 2. RevenueCat Integration
1. Go to the [RevenueCat Dashboard](https://app.revenuecat.com).
2. Navigate to **Project Settings** > **Integrations**.
3. Select **Stripe** under "Payment Gateways" (or Web Billing).
4. You will be asked to **Connect with Stripe**.
5. Log in with your Stripe credentials and authorize the connection.

## 3. Stripe "Restricted" Keys (For App)
You will need API keys for the web app to initialize the Stripe SDK.
1. In Stripe Dashboard: **Developers** > **API keys**.
2. **Publishable Key**: `pk_test_...` (Safe to use in frontend).
3. **Secret Key**: `sk_test_...` (Keep secret, use in Supabase/Edge Functions if needed).

> **Note:** For now, we will use "Test Mode" keys so you can simulate payments without real money.
