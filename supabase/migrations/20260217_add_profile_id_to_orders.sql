ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS profile_id TEXT REFERENCES public.profiles(id);

-- Optional: Migrate existing data if user_id matches profile id
UPDATE public.orders
SET profile_id = user_id
WHERE profile_id IS NULL AND user_id IS NOT NULL;
