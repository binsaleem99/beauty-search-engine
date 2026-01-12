-- Migration: Initial Database Schema
-- Created: 2026-01-13
-- Description: Creates all core tables for Beauty Search Engine

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ar')),
  country TEXT DEFAULT 'KW' CHECK (country IN ('KW', 'AE', 'SA')),
  subscription_status TEXT DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'cancelled')),
  subscription_id TEXT,
  subscription_ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  image_url TEXT,
  description_en TEXT,
  description_ar TEXT,
  benefits_en TEXT,
  benefits_ar TEXT,
  skin_types TEXT,
  main_ingredients TEXT,
  inci_list TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT,
  slug TEXT UNIQUE,
  aliases TEXT[],
  category TEXT,
  benefits TEXT[],
  best_for TEXT[],
  usage_notes TEXT,
  conflicts_with TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Product-Ingredient junction table
CREATE TABLE IF NOT EXISTS public.product_ingredients (
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES public.ingredients(id) ON DELETE CASCADE,
  concentration_percentage DECIMAL(5,2),
  is_main_ingredient BOOLEAN DEFAULT false,
  PRIMARY KEY (product_id, ingredient_id)
);

-- Retailers table
CREATE TABLE IF NOT EXISTS public.retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_ar TEXT,
  logo_url TEXT,
  base_url TEXT,
  affiliate_network TEXT CHECK (affiliate_network IN ('arabclicks', 'amazon_associates', 'direct')),
  affiliate_param TEXT,
  commission_rate DECIMAL(5,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prices table (current prices)
CREATE TABLE IF NOT EXISTS public.prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES public.retailers(id) ON DELETE CASCADE,
  price DECIMAL(10,3) NOT NULL,
  original_price DECIMAL(10,3),
  currency TEXT DEFAULT 'KWD',
  product_url TEXT NOT NULL,
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, retailer_id)
);

-- Price history for tracking changes
CREATE TABLE IF NOT EXISTS public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  price_id UUID REFERENCES public.prices(id) ON DELETE CASCADE,
  price DECIMAL(10,3) NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- User saved products
CREATE TABLE IF NOT EXISTS public.saved_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  list_name TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, list_name)
);

-- Price alerts (Premium feature)
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES public.retailers(id) ON DELETE SET NULL,
  target_price DECIMAL(10,3) NOT NULL,
  current_price DECIMAL(10,3) NOT NULL,
  triggered BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Search analytics
CREATE TABLE IF NOT EXISTS public.search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  search_type TEXT NOT NULL CHECK (search_type IN ('product', 'ingredient')),
  query TEXT NOT NULL,
  results_count INTEGER,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.users IS 'User profiles extending Supabase Auth';
COMMENT ON TABLE public.products IS 'Beauty products catalog';
COMMENT ON TABLE public.ingredients IS 'Active ingredients database';
COMMENT ON TABLE public.retailers IS 'Retail stores configuration';
COMMENT ON TABLE public.prices IS 'Current product prices per retailer';
COMMENT ON TABLE public.price_history IS 'Historical price tracking';
COMMENT ON TABLE public.saved_products IS 'User favorite products';
COMMENT ON TABLE public.price_alerts IS 'User price drop alerts (Premium)';
COMMENT ON TABLE public.search_logs IS 'Search analytics for insights';
