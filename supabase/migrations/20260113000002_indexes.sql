-- Migration: Database Indexes
-- Created: 2026-01-13
-- Description: Creates indexes for query performance optimization

-- Full-text search indexes for products
CREATE INDEX IF NOT EXISTS idx_products_name_en_fts
  ON public.products USING gin(to_tsvector('english', name_en));

CREATE INDEX IF NOT EXISTS idx_products_name_ar_fts
  ON public.products USING gin(to_tsvector('arabic', name_ar));

CREATE INDEX IF NOT EXISTS idx_products_brand_fts
  ON public.products USING gin(to_tsvector('english', brand));

-- Regular indexes for common queries
CREATE INDEX IF NOT EXISTS idx_products_brand
  ON public.products(brand);

CREATE INDEX IF NOT EXISTS idx_products_category
  ON public.products(category);

CREATE INDEX IF NOT EXISTS idx_products_created_at
  ON public.products(created_at DESC);

-- Ingredient indexes
CREATE INDEX IF NOT EXISTS idx_ingredients_name_en
  ON public.ingredients(name_en);

CREATE INDEX IF NOT EXISTS idx_ingredients_slug
  ON public.ingredients(slug);

CREATE INDEX IF NOT EXISTS idx_ingredients_category
  ON public.ingredients(category);

-- Product-Ingredient junction indexes
CREATE INDEX IF NOT EXISTS idx_product_ingredients_product
  ON public.product_ingredients(product_id);

CREATE INDEX IF NOT EXISTS idx_product_ingredients_ingredient
  ON public.product_ingredients(ingredient_id);

-- Retailer indexes
CREATE INDEX IF NOT EXISTS idx_retailers_slug
  ON public.retailers(slug);

CREATE INDEX IF NOT EXISTS idx_retailers_active
  ON public.retailers(is_active);

-- Price indexes
CREATE INDEX IF NOT EXISTS idx_prices_product
  ON public.prices(product_id);

CREATE INDEX IF NOT EXISTS idx_prices_retailer
  ON public.prices(retailer_id);

CREATE INDEX IF NOT EXISTS idx_prices_product_retailer
  ON public.prices(product_id, retailer_id);

CREATE INDEX IF NOT EXISTS idx_prices_in_stock
  ON public.prices(in_stock);

CREATE INDEX IF NOT EXISTS idx_prices_last_checked
  ON public.prices(last_checked DESC);

-- Price history indexes
CREATE INDEX IF NOT EXISTS idx_price_history_price
  ON public.price_history(price_id);

CREATE INDEX IF NOT EXISTS idx_price_history_recorded_at
  ON public.price_history(recorded_at DESC);

-- Saved products indexes
CREATE INDEX IF NOT EXISTS idx_saved_products_user
  ON public.saved_products(user_id);

CREATE INDEX IF NOT EXISTS idx_saved_products_product
  ON public.saved_products(product_id);

CREATE INDEX IF NOT EXISTS idx_saved_products_created_at
  ON public.saved_products(created_at DESC);

-- Price alerts indexes
CREATE INDEX IF NOT EXISTS idx_price_alerts_user
  ON public.price_alerts(user_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_product
  ON public.price_alerts(product_id);

CREATE INDEX IF NOT EXISTS idx_price_alerts_triggered
  ON public.price_alerts(triggered)
  WHERE triggered = false;

-- Search logs indexes
CREATE INDEX IF NOT EXISTS idx_search_logs_user
  ON public.search_logs(user_id);

CREATE INDEX IF NOT EXISTS idx_search_logs_type
  ON public.search_logs(search_type);

CREATE INDEX IF NOT EXISTS idx_search_logs_created_at
  ON public.search_logs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_search_logs_query
  ON public.search_logs(query);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_products_brand_category
  ON public.products(brand, category);

CREATE INDEX IF NOT EXISTS idx_prices_product_price
  ON public.prices(product_id, price);

-- Users index
CREATE INDEX IF NOT EXISTS idx_users_subscription
  ON public.users(subscription_status);

CREATE INDEX IF NOT EXISTS idx_users_email
  ON public.users(email);
