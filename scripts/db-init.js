// 本地一键初始化数据库：mysql -uroot -p < sql/schema.sql 的等价实现
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../server/config');

(async () => {
  const sql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'schema.sql'), 'utf8');
  // 建库阶段不指定 database
  const conn = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });
  await conn.query(sql);
  await conn.end();
  console.log('数据库初始化完成:', config.db.database);
})().catch((e) => {
  console.error('数据库初始化失败:', e.message);
  process.exit(1);
});
