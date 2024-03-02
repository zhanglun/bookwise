const { ConnectionOptions, DataSource } = require('typeorm');

const dbConfig = {
  type: 'sqlite',
  database: "./bookwise.db",
  entities: [
    'src/**/*.entities.ts'  // 对应的实体类位置
  ],
  migrations: [
    'src/migrations/**/*.ts'  // 对应的迁移文件位置
  ],
}

const AppDataSource = new DataSource(dbConfig);

AppDataSource.initialize();

module.exports = AppDataSource;
