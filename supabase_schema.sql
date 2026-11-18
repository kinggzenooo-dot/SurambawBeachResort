-- ========================================================
-- Surambaw Beach Resort - Complete Supabase Database Schema
-- Paste and run this script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cgssryoqqsfxwnirmxzb/sql
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'customer', 'staff', 'admin'
    phone TEXT,
    address TEXT,
    tier TEXT DEFAULT 'Standard Guest',
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Accommodations Table
CREATE TABLE IF NOT EXISTS public.accommodations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'rooms', 'cottages', 'villas'
    type TEXT NOT NULL,
    tag TEXT,
    price NUMERIC NOT NULL,
    price_period TEXT DEFAULT 'per night',
    rating NUMERIC DEFAULT 4.9,
    reviews_count INTEGER DEFAULT 50,
    image TEXT,
    description TEXT,
    capacity INTEGER NOT NULL,
    sqm INTEGER,
    bed_type TEXT,
    view TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Available'
);

-- 3. Addons Table
CREATE TABLE IF NOT EXISTS public.addons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT DEFAULT 'addons',
    price NUMERIC NOT NULL,
    price_period TEXT DEFAULT 'per service',
    icon TEXT,
    image TEXT,
    description TEXT
);

-- 4. Reservations Table
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    guest_id TEXT,
    guest_name TEXT NOT NULL,
    guest_email TEXT,
    guest_phone TEXT,
    accommodation_id TEXT,
    accommodation_name TEXT NOT NULL,
    category TEXT,
    check_in TEXT NOT NULL,
    check_out TEXT NOT NULL,
    nights INTEGER NOT NULL,
    guests_count INTEGER NOT NULL,
    addons_json JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL,
    tax NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    total NUMERIC NOT NULL,
    paid NUMERIC DEFAULT 0,
    balance NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Confirmed', -- 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Guests CRM Table
CREATE TABLE IF NOT EXISTS public.guests (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    tier TEXT DEFAULT 'Regular Guest',
    total_stays INTEGER DEFAULT 1,
    total_spent NUMERIC DEFAULT 0,
    last_stay TEXT,
    status TEXT DEFAULT 'Active'
);

-- 6. Inventory Table
CREATE TABLE IF NOT EXISTS public.inventory (
    id TEXT PRIMARY KEY,
    sku TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    in_stock INTEGER NOT NULL,
    min_threshold INTEGER NOT NULL,
    unit TEXT NOT NULL,
    status TEXT NOT NULL -- 'In Stock', 'Low Stock', 'Out of Stock'
);

-- 7. Inventory History Table
CREATE TABLE IF NOT EXISTS public.inventory_history (
    id BIGSERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    action TEXT NOT NULL,
    staff TEXT NOT NULL,
    date TEXT NOT NULL
);

-- Enable Row Level Security (RLS) but allow anon access for resort demo
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update users" ON public.users FOR UPDATE USING (true);

CREATE POLICY "Allow public read accommodations" ON public.accommodations FOR SELECT USING (true);
CREATE POLICY "Allow public insert accommodations" ON public.accommodations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update accommodations" ON public.accommodations FOR UPDATE USING (true);

CREATE POLICY "Allow public read addons" ON public.addons FOR SELECT USING (true);
CREATE POLICY "Allow public read reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Allow public insert reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update reservations" ON public.reservations FOR UPDATE USING (true);

CREATE POLICY "Allow public read guests" ON public.guests FOR SELECT USING (true);
CREATE POLICY "Allow public insert guests" ON public.guests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update guests" ON public.guests FOR UPDATE USING (true);

CREATE POLICY "Allow public read inventory" ON public.inventory FOR SELECT USING (true);
CREATE POLICY "Allow public update inventory" ON public.inventory FOR UPDATE USING (true);

CREATE POLICY "Allow public read history" ON public.inventory_history FOR SELECT USING (true);
CREATE POLICY "Allow public insert history" ON public.inventory_history FOR INSERT WITH CHECK (true);

-- Initial Seed Data for Users
INSERT INTO public.users (id, name, email, password, role, phone, address, tier, avatar)
VALUES
  ('user-admin-01', 'Arthur Pendelton', 'admin@surambaw.com', 'admin123', 'admin', '+63 917 111 0001', 'Surambaw Executive Suite, Palawan', 'General Manager / Admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'),
  ('user-staff-01', 'Maria Santos', 'staff@surambaw.com', 'staff123', 'staff', '+63 917 222 0002', 'Staff Quarters Villa 4, Palawan', 'Senior Desk Supervisor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
  ('user-guest-01', 'Alexander Wright', 'guest@surambaw.com', 'guest123', 'customer', '+63 917 555 8920', '88 Ocean Drive, Waterfront District, Manila', 'Surambaw Gold VIP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80')
ON CONFLICT (email) DO NOTHING;
