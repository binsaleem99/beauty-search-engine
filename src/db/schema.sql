-- Users table (Supabase Auth handles core auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'en', -- 'en' or 'ar'
  country TEXT DEFAULT 'KW', -- KW, AE, SA
  subscription_status TEXT DEFAULT 'free', -- free, premium, cancelled
  subscription_id TEXT, -- Tap subscription ID
  subscription_ends_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_ar TEXT,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  image_url TEXT,
  description_en TEXT,
  description_ar TEXT,
  benefits TEXT[], -- Array of benefits
  skin_types TEXT[], -- Array: dry, oily, combination, sensitive, normal
  main_ingredients TEXT[], -- Array of main active ingredients
  all_ingredients TEXT, -- Full INCI list
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT,
  aliases TEXT[], -- Alternative names
  category TEXT, -- Antioxidant, Humectant, Exfoliant, etc.
  benefits TEXT[],
  best_for TEXT[], -- Skin concerns
  usage_notes TEXT,
  conflicts_with TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Product-Ingredient junction table
CREATE TABLE IF NOT EXISTS product_ingredients (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  concentration TEXT, -- e.g., "15%", "unknown"
  is_main_ingredient BOOLEAN DEFAULT false,
  PRIMARY KEY (product_id, ingredient_id)
);

-- Retailers table
CREATE TABLE IF NOT EXISTS retailers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- noon, amazon_ae, faces, sephora_me
  display_name_en TEXT NOT NULL,
  display_name_ar TEXT,
  logo_url TEXT,
  base_url TEXT,
  affiliate_network TEXT, -- arabclicks, amazon_associates, direct
  affiliate_param TEXT, -- URL parameter for tracking
  commission_rate DECIMAL(5,2), -- e.g., 10.00 for 10%
  is_active BOOLEAN DEFAULT true
);

-- Prices table (main price tracking)
CREATE TABLE IF NOT EXISTS prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
  price DECIMAL(10,3) NOT NULL, -- KWD with 3 decimal places
  original_price DECIMAL(10,3), -- If on sale
  currency TEXT DEFAULT 'KWD',
  url TEXT NOT NULL, -- Product page URL
  affiliate_url TEXT, -- With tracking params
  in_stock BOOLEAN DEFAULT true,
  last_checked TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, retailer_id)
);

-- Price history for tracking changes
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  retailer_id UUID REFERENCES retailers(id) ON DELETE CASCADE,
  price DECIMAL(10,3) NOT NULL,
  recorded_at TIMESTAMP DEFAULT NOW()
);

-- User saved products
CREATE TABLE IF NOT EXISTS saved_products (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  list_name TEXT DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, product_id, list_name)
);

-- Price alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  target_price DECIMAL(10,3), -- NULL means any drop
  current_price DECIMAL(10,3) NOT NULL, -- Price when alert was set
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Search analytics (for future data sales)
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id), -- NULL for anonymous
  search_type TEXT NOT NULL, -- 'product' or 'ingredient'
  query TEXT NOT NULL,
  results_count INTEGER,
  country TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_name_en ON products USING gin(to_tsvector('english', name_en));
CREATE INDEX IF NOT EXISTS idx_products_name_ar ON products USING gin(to_tsvector('arabic', name_ar));
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
CREATE INDEX IF NOT EXISTS idx_prices_product ON prices(product_id);
CREATE INDEX IF NOT EXISTS idx_prices_retailer ON prices(retailer_id);
CREATE INDEX IF NOT EXISTS idx_product_ingredients_ingredient ON product_ingredients(ingredient_id);
CREATE INDEX IF NOT EXISTS idx_price_history_product ON price_history(product_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs(created_at DESC);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
