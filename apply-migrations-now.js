/**
 * Apply Database Migrations
 * Applies all Supabase migrations to the production database
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL not found in .env.local');
  process.exit(1);
}

// Create database connection
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function applyMigrations() {
  console.log('🚀 Starting Supabase database migrations...\n');

  const migrationsDir = path.join(__dirname, 'supabase', 'migrations');

  try {
    // Get all migration files
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`📁 Found ${files.length} migration(s):\n`);
    files.forEach((file, index) => {
      console.log(`   ${index + 1}. ${file}`);
    });
    console.log('');

    // Connect to database
    const client = await pool.connect();
    console.log('✅ Connected to database\n');

    // Apply each migration
    for (const file of files) {
      console.log(`📝 Applying: ${file}`);

      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf-8');

      try {
        // Execute migration
        await client.query(sql);
        console.log(`   ✅ Success\n`);
      } catch (error) {
        console.error(`   ❌ Failed: ${error.message}\n`);

        // Check if it's a "already exists" error (safe to continue)
        if (error.message.includes('already exists')) {
          console.log(`   ⚠️  Migration already applied, continuing...\n`);
          continue;
        }

        // For other errors, stop
        console.error('\n❌ Migration failed. Stopping.\n');
        throw error;
      }
    }

    // Verify tables
    console.log('🔍 Verifying database schema...');
    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log(`   ✅ Found ${result.rows.length} tables:`);
    result.rows.forEach(row => {
      console.log(`      - ${row.table_name}`);
    });
    console.log('');

    // Verify RLS
    console.log('🔒 Checking Row Level Security...');
    const rlsResult = await client.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public' AND rowsecurity = true
    `);

    console.log(`   ✅ RLS enabled on ${rlsResult.rows.length} tables\n`);

    // Verify triggers
    console.log('⚡ Checking triggers...');
    const triggersResult = await client.query(`
      SELECT trigger_name, event_object_table
      FROM information_schema.triggers
      WHERE trigger_schema = 'public'
      ORDER BY trigger_name
    `);

    console.log(`   ✅ Found ${triggersResult.rows.length} triggers:`);
    triggersResult.rows.forEach(row => {
      console.log(`      - ${row.trigger_name} on ${row.event_object_table}`);
    });
    console.log('');

    client.release();
    console.log('✨ All migrations completed successfully!\n');
    console.log('🎉 Your database is ready!\n');

    console.log('📋 Next steps:');
    console.log('   1. Test user registration (should auto-create profile)');
    console.log('   2. Try saving products (free users limited to 5)');
    console.log('   3. Check Supabase dashboard for verification');
    console.log('');

  } catch (error) {
    console.error('\n❌ Migration error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run migrations
applyMigrations()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
