const mysql = require('mysql2/promise');

async function alterDb() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'full_accesorios_db'
  });

  try {
    console.log('Adding columns to productos table...');
    await connection.execute(`
      ALTER TABLE productos 
      ADD COLUMN en_oferta TINYINT DEFAULT 0,
      ADD COLUMN precio_oferta DECIMAL(10,2) NULL
    `);
    console.log('Columns added successfully!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist. Proceeding...');
    } else {
      console.error('Error altering table:', err);
    }
  } finally {
    await connection.end();
  }
}

alterDb();
