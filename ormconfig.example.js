const database = {
  development: 'pet_station_staging',
  production: 'pet_station',
};

module.exports = {
  name: 'default',
  type: 'mysql',
  host: '0.0.0.0',
  port: 3306,
  username: 'princewck',
  password: 'xxxxxxxxxxx',
  database: database[process.env.NODE_ENV],
  entities: ['dist/models/*.entity.js'],
  migrationsTableName: 'custom_migration_table',
  migrations: ['dist/database/migration/*.js'],
  cli: {
    migrationsDir: 'src/database/migration',
  },
  seeds: ['src/database/seeds/*.seed.ts'],
  factories: ['src/database/factories/*.factory.ts'],
};
