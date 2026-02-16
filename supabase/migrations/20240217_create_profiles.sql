-- Create a custom type for user roles
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create a table for public profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY, -- This will be the Clerk User ID
  email TEXT UNIQUE NOT NULL,
  role public.user_role NOT NULL DEFAULT 'customer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create a function to check if the current user is an admin
-- SECURITY DEFINER allows the function to bypass RLS for its internal query
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin'
    FROM public.profiles
    WHERE id = (auth.jwt() ->> 'sub')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Anyone can read their own profile
DO $$ BEGIN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.jwt() ->> 'sub') = id);
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admins can read all profiles using the non-recursive function
DO $$ BEGIN
    CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (is_admin());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Admins can update profiles using the non-recursive function
DO $$ BEGIN
    CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE USING (is_admin());
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
