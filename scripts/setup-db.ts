import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const dbPassword = process.env.SUPABASE_DB_PASSWORD;

    let connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
        if (!supabaseUrl || !dbPassword) {
            console.error('Missing Supabase URL or DB Password in .env.local');
            process.exit(1);
        }
        // Extract project ref from URL (https://[ref].supabase.co)
        const projectRef = supabaseUrl.split('//')[1].split('.')[0];
        const dbHost = `db.${projectRef}.supabase.co`;
        connectionString = `postgres://postgres:${dbPassword}@${dbHost}:5432/postgres`;
    }

    console.log(`Connecting to database...`); // Hide credentials in logs

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false } // Required for Supabase
    });

    try {
        await client.connect();
        console.log('Connected successfully.');

        const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Applying schema...');
        await client.query(schemaSql);

        console.log('Schema applied successfully!');
    } catch (err) {
        console.error('Error setting up database:', err);
    } finally {
        await client.end();
    }
}

setupDatabase();
