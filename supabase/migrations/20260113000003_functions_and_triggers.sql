-- Migration: Functions and Triggers
-- Created: 2026-01-13
-- Description: Creates database functions and triggers for automation

-- Function: Handle new user signup
-- Automatically creates a user profile when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NULL)
  );
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    -- User already exists, ignore
    RETURN NEW;
END;
$$;

-- Trigger: on_auth_user_created
-- Fires when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Update timestamp
-- Automatically updates the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger: Update users.updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Update products.updated_at
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Check saved products limit for free users
CREATE OR REPLACE FUNCTION public.check_saved_products_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_subscription TEXT;
  saved_count INTEGER;
BEGIN
  -- Get user's subscription status
  SELECT subscription_status INTO user_subscription
  FROM public.users
  WHERE id = NEW.user_id;

  -- If premium, allow unlimited
  IF user_subscription = 'premium' THEN
    RETURN NEW;
  END IF;

  -- For free users, check count
  SELECT COUNT(*) INTO saved_count
  FROM public.saved_products
  WHERE user_id = NEW.user_id;

  -- Free users can save up to 5 products
  IF saved_count >= 5 THEN
    RAISE EXCEPTION 'Free users can only save up to 5 products. Upgrade to Premium for unlimited saves.';
  END IF;

  RETURN NEW;
END;
$$;

-- Trigger: Check saved products limit before insert
DROP TRIGGER IF EXISTS check_saved_products_limit_trigger ON public.saved_products;
CREATE TRIGGER check_saved_products_limit_trigger
  BEFORE INSERT ON public.saved_products
  FOR EACH ROW
  EXECUTE FUNCTION public.check_saved_products_limit();

-- Function: Log price change to history
CREATE OR REPLACE FUNCTION public.log_price_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only log if price actually changed
  IF (TG_OP = 'UPDATE' AND OLD.price != NEW.price) OR TG_OP = 'INSERT' THEN
    INSERT INTO public.price_history (price_id, price, recorded_at)
    VALUES (NEW.id, NEW.price, NOW());
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger: Log price changes
DROP TRIGGER IF EXISTS log_price_change_trigger ON public.prices;
CREATE TRIGGER log_price_change_trigger
  AFTER INSERT OR UPDATE OF price ON public.prices
  FOR EACH ROW
  EXECUTE FUNCTION public.log_price_change();

-- Function: Get user's saved products count
CREATE OR REPLACE FUNCTION public.get_saved_products_count(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO count
  FROM public.saved_products
  WHERE user_id = p_user_id;

  RETURN count;
END;
$$;

-- Function: Check if user is premium
CREATE OR REPLACE FUNCTION public.is_user_premium(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_premium BOOLEAN;
BEGIN
  SELECT
    subscription_status = 'premium'
    AND (subscription_ends_at IS NULL OR subscription_ends_at > NOW())
  INTO is_premium
  FROM public.users
  WHERE id = p_user_id;

  RETURN COALESCE(is_premium, false);
END;
$$;

-- Function: Get lowest price for product
CREATE OR REPLACE FUNCTION public.get_lowest_price(p_product_id UUID)
RETURNS TABLE (
  price DECIMAL(10,3),
  retailer_name TEXT,
  retailer_id UUID,
  product_url TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.price,
    r.name_en,
    r.id,
    p.product_url
  FROM public.prices p
  JOIN public.retailers r ON r.id = p.retailer_id
  WHERE p.product_id = p_product_id
    AND p.in_stock = true
  ORDER BY p.price ASC
  LIMIT 1;
END;
$$;

-- Add comments
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user profile on signup';
COMMENT ON FUNCTION public.update_updated_at_column() IS 'Updates the updated_at timestamp';
COMMENT ON FUNCTION public.check_saved_products_limit() IS 'Enforces 5 product limit for free users';
COMMENT ON FUNCTION public.log_price_change() IS 'Logs price changes to history table';
COMMENT ON FUNCTION public.get_saved_products_count(UUID) IS 'Returns count of saved products for a user';
COMMENT ON FUNCTION public.is_user_premium(UUID) IS 'Checks if user has active premium subscription';
COMMENT ON FUNCTION public.get_lowest_price(UUID) IS 'Returns lowest available price for a product';
