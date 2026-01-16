import 'dotenv/config';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error('DATABASE_URL is missing in .env');
    process.exit(1);
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function restore() {
    console.log('🔄 Starting database restore...');

    // Get backup folder path from args
    const backupFolder = process.argv[2];
    if (!backupFolder) {
        console.error('❌ No backup folder specified.');
        process.exit(1);
    }

    if (!fs.existsSync(backupFolder)) {
        console.error(`❌ Backup folder not found: ${backupFolder}`);
        process.exit(1);
    }

    const client = await pool.connect();

    try {
        console.log(`📂 Reading backup from: ${backupFolder}`);

        // Get all JSON files
        const files = fs.readdirSync(backupFolder).filter(f => f.endsWith('.json'));
        if (files.length === 0) {
            console.error('❌ No JSON backup files found in directory.');
            process.exit(1);
        }

        await client.query('BEGIN');

        // Disable FK constraints for session
        console.log('🔓 Disabling foreign key constraints...');
        await client.query("SET session_replication_role = 'replica';");

        for (const file of files) {
            const tableName = path.basename(file, '.json');
            const filePath = path.join(backupFolder, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const rows = JSON.parse(content);

            console.log(`  Targeting table: ${tableName} (${rows.length} rows)`);

            // Truncate table
            // We use CASCADE to be safe even though constraints are disabled, 
            // cleaning up is good practice before insert.
            await client.query(`TRUNCATE TABLE "${tableName}" CASCADE;`);

            if (rows.length > 0) {
                // Construct INSERT query
                // We assume rows have keys matching columns.
                const keys = Object.keys(rows[0]);
                const columns = keys.map(k => `"${k}"`).join(', ');

                // Batch insert logic could be optimized, but for simple restore loop is fine for now
                // or constructing a giant VALUES statement. 
                // Let's do multi-row insert for speed.

                // Chunking to avoid parameter limit
                const chunkSize = 1000;
                for (let i = 0; i < rows.length; i += chunkSize) {
                    const chunk = rows.slice(i, i + chunkSize);

                    const values: any[] = [];
                    const placeholders: string[] = [];

                    chunk.forEach((row: any, rIndex: number) => {
                        const rowPlaceholders: string[] = [];
                        keys.forEach((key, kIndex) => {
                            values.push(row[key]); // Parameter
                            rowPlaceholders.push(`$${values.length}`);
                        });
                        placeholders.push(`(${rowPlaceholders.join(', ')})`);
                    });

                    const query = `
                        INSERT INTO "${tableName}" (${columns})
                        VALUES ${placeholders.join(', ')}
                    `;

                    await client.query(query, values);
                }
                console.log(`    ✓ Restored ${rows.length} rows.`);
            } else {
                console.log(`    (Skipping insert, 0 rows)`);
            }
        }

        // Re-enable constraints
        console.log('🔒 Re-enabling foreign key constraints...');
        await client.query("SET session_replication_role = 'origin';");

        await client.query('COMMIT');
        console.log(`\n✅ Restore completed successfully!`);

    } catch (err: any) {
        await client.query('ROLLBACK');
        console.error('❌ Restore failed:', err.message);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
}

restore();
