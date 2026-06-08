const { DataSource } = require('typeorm');
const path = require('path');

const config = new DataSource({
  type: 'postgres',
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: '123456',
  database: 'full_accesorios_db',
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  synchronize: true,
});

config.initialize()
  .then(() => {
    console.log('Data Source has been initialized and schemas synced!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });
