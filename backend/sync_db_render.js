const { DataSource } = require('typeorm');
const path = require('path');

const config = new DataSource({
  type: 'postgres',
  url: 'postgresql://admin_accesorios:0mUP3q84JgJ1fMLFfc5s5EuhrUvPtBhV@dpg-d8j3tauq1p3s73fae98g-a.oregon-postgres.render.com/full_accesorios_db',
  ssl: {
    rejectUnauthorized: false
  },
  entities: [path.join(__dirname, 'dist/**/*.entity.js')],
  synchronize: true,
});

config.initialize()
  .then(() => {
    console.log('Data Source has been initialized and schemas synced to RENDER!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
    process.exit(1);
  });
