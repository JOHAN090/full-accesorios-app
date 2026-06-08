const { Client } = require('pg');
const fs = require('fs');

async function importData() {
  console.log('Reading backup...');
  const backupPath = 'D:\\Recuperado\\UMSA\\SEXTO\\BACKEND\\PROYECTO_BACKEND\\backup_seguridad.json';
  const backup = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

  console.log('Connecting to PostgreSQL...');
  const client = new Client({
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: '123456',
    database: 'full_accesorios_db'
  });

  await client.connect();

  const tables = ['roles', 'usuarios', 'categorias', 'productos', 'logs_acceso'];

  for (const table of tables) {
    const rows = backup[table];
    if (!rows || rows.length === 0) {
      console.log(`Skipping empty table ${table}`);
      continue;
    }

    console.log(`Importing table: ${table} (${rows.length} rows)...`);
    
    for (const row of rows) {
      const columns = Object.keys(row);
      // We must handle nulls and proper quotes
      const values = Object.values(row);
      
      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
      
      try {
        // Convert tinyint to smallint manually if needed, but pg handles numbers fine.
        // Also fix dates, MySQL returned Date objects in JSON export?
        // JSON stringify converts dates to ISO strings, pg driver handles ISO strings fine!
        await client.query(query, values);
      } catch (err) {
        console.error(`Error inserting into ${table}:`, err);
        // Continue attempting others
      }
    }
    
    // Reset sequences
    try {
      console.log(`Resetting sequence for ${table}...`);
      await client.query(`SELECT setval(pg_get_serial_sequence('${table}', 'id'), COALESCE(MAX(id), 1)) FROM ${table}`);
    } catch (seqErr) {
      console.log(`Warning: could not reset sequence for ${table}:`, seqErr.message);
    }
  }

  await client.end();
  console.log('Import completed successfully!');
}

importData().catch(console.error);
