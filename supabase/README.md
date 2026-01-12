# Supabase Database Migrations

This directory contains all database migrations for the Beauty Search Engine platform.

## 📋 Migration Files

Migrations are applied in chronological order:

1. **20260113000001_initial_schema.sql** - Creates all core tables
2. **20260113000002_indexes.sql** - Adds performance indexes
3. **20260113000003_functions_and_triggers.sql** - Creates database functions and triggers
4. **20260113000004_row_level_security.sql** - Implements RLS policies for security

## 🚀 How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref cxvchdvqtcbxrjkyoazb

# Apply all migrations
supabase db push

# Or apply migrations remotely
supabase db push --db-url "your-database-url"
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/cxvchdvqtcbxrjkyoazb
2. Navigate to **SQL Editor**
3. Copy and paste each migration file in order
4. Execute each migration

### Option 3: Using the Setup Script

```bash
# Run the database setup script
npm run db:setup
```

### Option 4: Manual SQL Execution

Connect to your database and run each migration file:

```bash
psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000001_initial_schema.sql
psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000002_indexes.sql
psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb:PASSWORD@aws-1-ap-south-1.pooler.supabase.com:6543/postgres" -f supabase/migrations/20260113000003_functions_and_triggers.sql
psql "postgresql://postgres.cxvchdvqtcbxrjkyoazb:PASSWORD@aws-1-ap-south-1.pooler.com:6543/postgres" -f supabase/migrations/20260113000004_row_level_security.sql
```

## 📊 Database Schema Overview

### Core Tables

- **users** - User profiles (extends Supabase Auth)
- **products** - Beauty products catalog
- **ingredients** - Active ingredients database
- **product_ingredients** - Links products to ingredients
- **retailers** - Store configuration (Noon, Amazon.ae, Faces, Sephora)
- **prices** - Current product prices per retailer
- **price_history** - Historical price tracking
- **saved_products** - User favorites (Free: 5 max, Premium: unlimited)
- **price_alerts** - Price drop notifications (Premium only)
- **search_logs** - Search analytics

### Key Features

✅ **Automatic User Profile Creation** - Trigger creates profile on signup
✅ **Price Change Tracking** - Automatically logs price history
✅ **Free Tier Limits** - Enforces 5 product limit for free users
✅ **Premium Feature Gates** - RLS policies enforce premium features
✅ **Full-Text Search** - Indexes for English and Arabic search
✅ **Security** - Row Level Security on all tables

## 🔒 Security

All tables have Row Level Security (RLS) enabled:

- ✅ Users can only access their own data
- ✅ Public catalog data (products, prices) is readable by everyone
- ✅ Admin operations require service_role
- ✅ Premium features are gated by subscription status

## 🔧 Maintenance

### Creating a New Migration

```bash
# Create a new migration file
supabase migration new your_migration_name

# Or manually create:
# supabase/migrations/YYYYMMDDHHMMSS_description.sql
```

### Rolling Back

If you need to undo a migration, create a new migration that reverses the changes.

### Resetting Database (⚠️ Destroys all data)

```bash
supabase db reset
```

## 📝 Database Functions

### User Functions

- `handle_new_user()` - Creates user profile on signup
- `is_user_premium(user_id)` - Checks if user has active premium subscription
- `get_saved_products_count(user_id)` - Returns count of saved products

### Product Functions

- `get_lowest_price(product_id)` - Returns lowest available price
- `log_price_change()` - Logs price changes to history
- `check_saved_products_limit()` - Enforces free tier limits

### Utility Functions

- `update_updated_at_column()` - Updates timestamps automatically

## 🎯 Testing Migrations

After applying migrations, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check triggers exist
SELECT trigger_name, event_manipulation, event_object_table FROM information_schema.triggers WHERE trigger_schema = 'public';

-- Test user creation
SELECT * FROM public.users LIMIT 1;
```

## 🐛 Troubleshooting

### Migration Failed

1. Check the error message carefully
2. Verify database connection
3. Ensure migrations are applied in order
4. Check for conflicting table/index names

### RLS Blocking Queries

If queries fail with permission errors:
1. Verify user is authenticated: `SELECT auth.uid()`
2. Check RLS policies: `SELECT * FROM pg_policies WHERE schemaname = 'public'`
3. Use service_role key for admin operations

### Function Errors

If functions fail:
1. Check function exists: `\df public.*` in psql
2. Verify permissions: `SECURITY DEFINER` vs `SECURITY INVOKER`
3. Check search_path: `SET search_path = public`

## 📚 Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/managing-config)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## ⚡ Quick Commands

```bash
# Check migration status
supabase migration list

# Repair migration history
supabase migration repair

# Generate types from database
supabase gen types typescript --local > src/types/database.ts
```

---

**Need help?** Check the main project documentation or create an issue in the repository.
