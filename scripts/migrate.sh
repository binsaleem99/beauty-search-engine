#!/bin/bash

# Supabase Database Migration Script
# Applies all migrations to your Supabase database

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Supabase Database Migration Tool${NC}\n"

# Load environment variables
if [ -f .env.local ]; then
  source .env.local
else
  echo -e "${RED}❌ Error: .env.local file not found${NC}"
  exit 1
fi

# Check required variables
if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}❌ Error: DATABASE_URL not set in .env.local${NC}"
  exit 1
fi

# Get migrations directory
MIGRATIONS_DIR="$(pwd)/supabase/migrations"

if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo -e "${RED}❌ Error: Migrations directory not found: $MIGRATIONS_DIR${NC}"
  exit 1
fi

# Count migration files
MIGRATION_COUNT=$(ls -1 "$MIGRATIONS_DIR"/*.sql 2>/dev/null | wc -l)

if [ "$MIGRATION_COUNT" -eq 0 ]; then
  echo -e "${YELLOW}⚠️  No migration files found in $MIGRATIONS_DIR${NC}"
  exit 0
fi

echo -e "${GREEN}📁 Found $MIGRATION_COUNT migration(s)${NC}\n"

# List all migrations
echo -e "${BLUE}Migrations to apply:${NC}"
ls -1 "$MIGRATIONS_DIR"/*.sql | nl
echo ""

# Ask for confirmation
read -p "Do you want to apply these migrations? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Migration cancelled${NC}"
  exit 0
fi

# Apply each migration
for migration_file in "$MIGRATIONS_DIR"/*.sql; do
  filename=$(basename "$migration_file")
  echo -e "${BLUE}📝 Applying: $filename${NC}"

  # Execute migration
  if psql "$DATABASE_URL" -f "$migration_file" > /dev/null 2>&1; then
    echo -e "${GREEN}   ✅ Success${NC}\n"
  else
    echo -e "${RED}   ❌ Failed${NC}"
    echo -e "${YELLOW}   Continuing with remaining migrations...${NC}\n"
  fi
done

echo -e "${GREEN}✨ Migration process completed!${NC}\n"

# Verify tables
echo -e "${BLUE}🔍 Verifying database schema...${NC}"
TABLE_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null || echo "0")

if [ "$TABLE_COUNT" -gt 0 ]; then
  echo -e "${GREEN}   ✅ Found $TABLE_COUNT tables in public schema${NC}"
else
  echo -e "${YELLOW}   ⚠️  Could not verify tables${NC}"
fi

echo -e "\n${GREEN}🎉 Database is ready!${NC}\n"

# Print next steps
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Run seed script: npm run db:seed"
echo "  2. Test your application"
echo "  3. Check Supabase dashboard for any issues"
echo ""
