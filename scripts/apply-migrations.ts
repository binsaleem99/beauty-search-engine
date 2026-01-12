/**
 * Apply Supabase Database Migrations
 *
 * This script applies all migrations to your Supabase database
 * Run with: npm run db:migrate
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('   Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigrations() {
  console.log('🚀 Starting database migrations...\n');

  const migrationsDir = join(process.cwd(), 'supabase', 'migrations');

  try {
    // Get all migration files
    const files = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Apply in chronological order

    if (files.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }

    console.log(`📁 Found ${files.length} migration(s):\n`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log('');

    // Apply each migration
    for (const file of files) {
      console.log(`📝 Applying: ${file}`);

      const filePath = join(migrationsDir, file);
      const sql = readFileSync(filePath, 'utf-8');

      // Execute SQL migration
      const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(async () => {
        // If exec_sql function doesn't exist, try direct execution
        // Note: This requires creating a custom function in Supabase
        return { error: 'exec_sql function not available - use Supabase dashboard' };
      });

      if (error) {
        console.error(`   ❌ Failed: ${error.message || error}`);
        console.log('\n⚠️  Migration failed. Please apply manually via:');
        console.log(`   1. Supabase Dashboard: https://supabase.com/dashboard/project/${SUPABASE_URL.split('//')[1].split('.')[0]}/sql`);
        console.log(`   2. Or use: psql $DATABASE_URL -f ${filePath}`);
        process.exit(1);
      }

      console.log(`   ✅ Success\n`);
    }

    console.log('✨ All migrations completed successfully!\n');

    // Verify tables exist
    console.log('🔍 Verifying database schema...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (!tablesError && tables) {
      console.log(`   ✅ Found ${tables.length} tables in public schema`);
    }

  } catch (error) {
    console.error('❌ Migration error:', error);
    console.log('\n💡 Manual migration instructions:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/cxvchdvqtcbxrjkyoazb/sql');
    console.log('   2. Copy each migration file from supabase/migrations/ in order');
    console.log('   3. Paste and execute in the SQL Editor\n');
    process.exit(1);
  }
}

// Run migrations
applyMigrations().then(() => {
  console.log('🎉 Database is ready!\n');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
