# Supabase Migrations Guide

Complete guide for applying database migrations to your Beauty Search Engine Supabase instance.

## 📁 What's Included

```
supabase/
├── migrations/
│   ├── 20260113000001_initial_schema.sql      # Core tables
│   ├── 20260113000002_indexes.sql             # Performance indexes
│   ├── 20260113000003_functions_and_triggers.sql  # Automation
│   └── 20260113000004_row_level_security.sql  # Security policies
├── config.toml                                 # Supabase config
└── README.md                                   # Detailed documentation
```

## 🚀 Quick Start

### Method 1: Using the Migration Script (Easiest)

```bash
# Apply all migrations at once
npm run db:migrate
```

The script will:
- ✅ Load your database credentials from `.env.local`
- ✅ Apply all migrations in order
- ✅ Verify the database schema
- ✅ Show clear success/error messages

### Method 2: Using Supabase Dashboard (Recommended for First Time)

**Best for:** First-time setup or if you want visual feedback

1. **Go to SQL Editor:**
   https://supabase.com/dashboard/project/cxvchdvqtcbxrjkyoazb/sql

2. **Apply Each Migration:**
   - Open `supabase/migrations/20260113000001_initial_schema.sql`
   - Copy the entire content
   - Paste into SQL Editor
   - Click "Run"
   - Repeat for migrations 002, 003, and 004 **in order**

3. **Verify:**
   - Go to Table Editor
   - You should see: users, products, ingredients, retailers, prices, etc.

### Method 3: Using psql Command Line

```bash
# Export your database password
export PGPASSWORD="nAqhuz-vomped-vodhi3"

# Apply migrations one by one
psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000001_initial_schema.sql

psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000002_indexes.sql

psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000003_functions_and_triggers.sql

psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000004_row_level_security.sql
```

## ✅ Verification Steps

After applying migrations, verify everything is working:

### 1. Check Tables

Go to: https://supabase.com/dashboard/project/cxvchdvqtcbxrjkyoazb/editor

You should see these tables:
- ✅ users
- ✅ products
- ✅ ingredients
- ✅ product_ingredients
- ✅ retailers
- ✅ prices
- ✅ price_history
- ✅ saved_products
- ✅ price_alerts
- ✅ search_logs

### 2. Check Row Level Security

Run in SQL Editor:

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

All tables should have `rowsecurity = true`

### 3. Check Triggers

```sql
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';
```

You should see:
- ✅ on_auth_user_created (auth.users)
- ✅ update_users_updated_at (users)
- ✅ update_products_updated_at (products)
- ✅ check_saved_products_limit_trigger (saved_products)
- ✅ log_price_change_trigger (prices)

### 4. Test User Creation

1. Go to your deployed site
2. Register a new account
3. Check if user appears in `public.users` table
4. The trigger should auto-create the profile

## 🔧 What Each Migration Does

### Migration 1: Initial Schema
Creates all core tables with proper relationships:
- User profiles table
- Products catalog
- Ingredients library
- Retailers configuration
- Price tracking system
- User features (saved products, alerts)
- Analytics (search logs)

### Migration 2: Indexes
Adds performance indexes for:
- Full-text search (English & Arabic)
- Common query patterns
- Foreign key relationships
- Sorting and filtering

**Result:** Faster queries, especially for search

### Migration 3: Functions & Triggers
Implements automation:
- Auto-create user profile on signup
- Auto-update timestamps
- Enforce free tier limits (5 saved products)
- Log price changes automatically
- Helper functions (is_premium, get_lowest_price, etc.)

**Result:** Less code in your app, data integrity enforced

### Migration 4: Row Level Security
Implements security policies:
- Users can only see their own data
- Public catalog is readable by everyone
- Premium features require active subscription
- Admin operations require service_role

**Result:** Secure database, no unauthorized access

## 🛡️ Security Features

After migrations, your database has:

✅ **Row Level Security** - Every table is protected
✅ **User Isolation** - Users can't see each other's data
✅ **Premium Gates** - Price alerts require premium subscription
✅ **Free Tier Limits** - Automatic enforcement (5 saved products)
✅ **Admin Protection** - Only service_role can modify catalog

## 📊 Database Functions Available

Your app can now use these helper functions:

```typescript
// Check if user is premium
const { data } = await supabase
  .rpc('is_user_premium', { p_user_id: userId });

// Get saved products count
const { data } = await supabase
  .rpc('get_saved_products_count', { p_user_id: userId });

// Get lowest price for a product
const { data } = await supabase
  .rpc('get_lowest_price', { p_product_id: productId });
```

## 🐛 Troubleshooting

### Error: "relation already exists"

**Solution:** Migrations already applied. Skip or drop tables first:

```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

Then reapply migrations.

### Error: "permission denied"

**Solution:** Use service_role key, not anon key:

```typescript
const supabase = createClient(url, SERVICE_ROLE_KEY);
```

### Migrations work but app can't access data

**Problem:** RLS policies blocking access

**Solution:** Check if user is authenticated:
```sql
SELECT auth.uid(); -- Should return user UUID, not NULL
```

### Trigger not firing

**Solution:** Check trigger exists:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

If missing, reapply migration 3.

## 📚 Next Steps

After successful migration:

1. **Seed Database:**
   ```bash
   npm run db:seed
   ```

2. **Test Your App:**
   - Register a new user
   - Search for products
   - Save products (test free limit)
   - Try premium features

3. **Monitor:**
   - Check Supabase dashboard for errors
   - Review API logs
   - Test authentication flow

## 🔄 Future Migrations

When you need to modify the database:

1. **Create new migration:**
   ```bash
   # Format: YYYYMMDDHHMMSS_description.sql
   touch supabase/migrations/20260113120000_add_reviews_table.sql
   ```

2. **Write your changes:**
   ```sql
   -- Migration: Add product reviews
   CREATE TABLE public.reviews (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID REFERENCES public.users(id),
     product_id UUID REFERENCES public.products(id),
     rating INTEGER CHECK (rating BETWEEN 1 AND 5),
     comment TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );
   ```

3. **Apply:**
   ```bash
   npm run db:migrate
   ```

## 💡 Pro Tips

1. **Always backup before migrations:**
   ```bash
   # Backup via Supabase dashboard or:
   pg_dump "$DATABASE_URL" > backup.sql
   ```

2. **Test migrations locally first:**
   - Use Supabase local development
   - Or create a test project

3. **Never edit applied migrations:**
   - Create a new migration to fix issues
   - Migrations are immutable

4. **Document your changes:**
   - Add comments to complex SQL
   - Update this guide for major changes

## 📞 Support

Need help?
- Supabase Docs: https://supabase.com/docs
- Project Dashboard: https://supabase.com/dashboard/project/cxvchdvqtcbxrjkyoazb
- PostgreSQL Docs: https://www.postgresql.org/docs/

---

**Migrations created:** 2026-01-13
**Last updated:** 2026-01-13
**Database version:** PostgreSQL 15
