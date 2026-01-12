-- Migration: Row Level Security (RLS) Policies
-- Created: 2026-01-13
-- Description: Implements security policies for data access control

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USERS TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Service role can do everything (for webhooks, admin operations)
CREATE POLICY "Service role has full access to users"
  ON public.users
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PRODUCTS TABLE POLICIES
-- =====================================================

-- Everyone can view products (public catalog)
CREATE POLICY "Anyone can view products"
  ON public.products
  FOR SELECT
  USING (true);

-- Only service role can modify products (admin only)
CREATE POLICY "Only service role can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Only service role can update products"
  ON public.products
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Only service role can delete products"
  ON public.products
  FOR DELETE
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- INGREDIENTS TABLE POLICIES
-- =====================================================

-- Everyone can view ingredients
CREATE POLICY "Anyone can view ingredients"
  ON public.ingredients
  FOR SELECT
  USING (true);

-- Only service role can modify
CREATE POLICY "Only service role can modify ingredients"
  ON public.ingredients
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PRODUCT_INGREDIENTS TABLE POLICIES
-- =====================================================

-- Everyone can view product-ingredient relationships
CREATE POLICY "Anyone can view product ingredients"
  ON public.product_ingredients
  FOR SELECT
  USING (true);

-- Only service role can modify
CREATE POLICY "Only service role can modify product ingredients"
  ON public.product_ingredients
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- RETAILERS TABLE POLICIES
-- =====================================================

-- Everyone can view active retailers
CREATE POLICY "Anyone can view active retailers"
  ON public.retailers
  FOR SELECT
  USING (is_active = true);

-- Service role can view all retailers
CREATE POLICY "Service role can view all retailers"
  ON public.retailers
  FOR SELECT
  USING (auth.jwt()->>'role' = 'service_role');

-- Only service role can modify
CREATE POLICY "Only service role can modify retailers"
  ON public.retailers
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PRICES TABLE POLICIES
-- =====================================================

-- Everyone can view prices
CREATE POLICY "Anyone can view prices"
  ON public.prices
  FOR SELECT
  USING (true);

-- Only service role can modify prices
CREATE POLICY "Only service role can modify prices"
  ON public.prices
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PRICE_HISTORY TABLE POLICIES
-- =====================================================

-- Everyone can view price history
CREATE POLICY "Anyone can view price history"
  ON public.price_history
  FOR SELECT
  USING (true);

-- Only service role can insert
CREATE POLICY "Only service role can insert price history"
  ON public.price_history
  FOR INSERT
  WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- SAVED_PRODUCTS TABLE POLICIES
-- =====================================================

-- Users can view their own saved products
CREATE POLICY "Users can view own saved products"
  ON public.saved_products
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can save products
CREATE POLICY "Users can save products"
  ON public.saved_products
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can remove their saved products
CREATE POLICY "Users can delete own saved products"
  ON public.saved_products
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role has full access to saved products"
  ON public.saved_products
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- PRICE_ALERTS TABLE POLICIES
-- =====================================================

-- Users can view their own alerts
CREATE POLICY "Users can view own alerts"
  ON public.price_alerts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Premium users can create alerts
CREATE POLICY "Premium users can create alerts"
  ON public.price_alerts
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id
    AND public.is_user_premium(auth.uid())
  );

-- Users can update their own alerts
CREATE POLICY "Users can update own alerts"
  ON public.price_alerts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
  ON public.price_alerts
  FOR DELETE
  USING (auth.uid() = user_id);

-- Service role has full access (for cron jobs)
CREATE POLICY "Service role has full access to price alerts"
  ON public.price_alerts
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- SEARCH_LOGS TABLE POLICIES
-- =====================================================

-- Users can view their own search history
CREATE POLICY "Users can view own search logs"
  ON public.search_logs
  FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Anyone can insert search logs (for analytics)
CREATE POLICY "Anyone can insert search logs"
  ON public.search_logs
  FOR INSERT
  WITH CHECK (true);

-- Service role has full access
CREATE POLICY "Service role has full access to search logs"
  ON public.search_logs
  FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables for anon users (public read)
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.ingredients TO anon, authenticated;
GRANT SELECT ON public.product_ingredients TO anon, authenticated;
GRANT SELECT ON public.retailers TO anon, authenticated;
GRANT SELECT ON public.prices TO anon, authenticated;
GRANT SELECT ON public.price_history TO anon, authenticated;

-- Grant access to tables for authenticated users
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.saved_products TO authenticated;
GRANT ALL ON public.price_alerts TO authenticated;
GRANT ALL ON public.search_logs TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Comments
COMMENT ON POLICY "Users can view own profile" ON public.users IS 'Users can only see their own user record';
COMMENT ON POLICY "Anyone can view products" ON public.products IS 'Product catalog is public';
COMMENT ON POLICY "Premium users can create alerts" ON public.price_alerts IS 'Price alerts are a premium-only feature';
