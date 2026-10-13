const path = require('path');
const express = require('express');
const booksRouter = require('./routes/books');
const bookTypesRouter = require('./routes/bookTypes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/books', booksRouter);
app.use('/api/book-types', bookTypesRouter);

app.use((req, res) => {
  res.status(404).json({ error: '资源不存在' });
});

// 统一异常处理：数据库等异常返回 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || '服务器内部错误' });
});

module.exports = app;
