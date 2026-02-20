-- Create carts table
CREATE TABLE IF NOT EXISTS public.carts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL REFERENCES public.carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    UNIQUE(cart_id, product_id)
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Carts Policies
CREATE POLICY "Users can view own cart" ON public.carts FOR SELECT USING ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can insert own cart" ON public.carts FOR INSERT WITH CHECK ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can update own cart" ON public.carts FOR UPDATE USING ((auth.jwt() ->> 'sub') = user_id);
CREATE POLICY "Users can delete own cart" ON public.carts FOR DELETE USING ((auth.jwt() ->> 'sub') = user_id);

-- Cart Items Policies
CREATE POLICY "Users can view own cart items" ON public.cart_items FOR SELECT USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = (auth.jwt() ->> 'sub'))
);
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = (auth.jwt() ->> 'sub'))
);
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = (auth.jwt() ->> 'sub'))
);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (
    cart_id IN (SELECT id FROM public.carts WHERE user_id = (auth.jwt() ->> 'sub'))
);
