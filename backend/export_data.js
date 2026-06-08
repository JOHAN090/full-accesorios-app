const mysql = require('mysql2/promise');
const fs = require('fs');

async function exportData() {
  console.log('Connecting to MySQL...');
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'full_accesorios_db'
  });

  const tables = ['roles', 'usuarios', 'categorias', 'productos', 'logs_acceso'];
  const backup = {};

  for (const table of tables) {
    console.log(`Exporting table: ${table}...`);
    const [rows] = await connection.execute(`SELECT * FROM ${table}`);
    backup[table] = rows;
  }

  await connection.end();

  const backupPath = 'D:\\Recuperado\\UMSA\\SEXTO\\BACKEND\\PROYECTO_BACKEND\\backup_seguridad.json';
  fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
  console.log(`Backup completed successfully! Saved to ${backupPath}`);
}

exportData().catch(console.error);
