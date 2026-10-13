const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`图书借阅系统后台已启动: http://localhost:${config.port}`);
});
