const express = require('express');
const { query } = require('../db');

const router = express.Router();

const PAGE_SIZE = 5;

function toInt(v, dft) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : dft;
}

// 必填与类型校验，返回错误信息数组
function validateBook(body, { partial = false } = {}) {
  const errs = [];
  const reqStr = ['bookCde', 'bookName', 'bookAuthor', 'publishPress', 'createdBy', 'creationTime'];
  for (const f of reqStr) {
    const v = body[f];
    if (v === undefined || v === null || String(v).trim() === '') errs.push(`${f} 不能为空`);
  }
  if (body.bookType === undefined || body.bookType === null || body.bookType === '' || !Number.isInteger(toInt(body.bookType, NaN))) {
    errs.push('bookType 必须为有效的类型 ID');
  }
  if (body.borrowed !== undefined && body.borrowed !== null && body.borrowed !== '') {
    if (![0, 1].includes(toInt(body.borrowed, -1))) errs.push('borrowed 只能为 0 或 1');
  }
  if (body.publishDate === undefined || body.publishDate === null || String(body.publishDate).trim() === '') {
    errs.push('publishDate 不能为空');
  }
  return errs;
}

// 列表：分页 + 名称模糊查询，按入库时间降序
router.get('/', async (req, res, next) => {
  try {
    const name = (req.query.name || '').trim();
    const page = Math.max(1, toInt(req.query.page, 1));
    const pageSize = PAGE_SIZE;
    const offset = (page - 1) * pageSize;

    const where = name ? 'WHERE b.bookName LIKE ?' : '';
    const params = name ? [`%${name}%`] : [];

    const countRows = await query(`SELECT COUNT(*) AS total FROM book_info b ${where}`, params);
    const total = countRows[0].total;
    const pages = Math.max(1, Math.ceil(total / pageSize));

    const list = await query(
      `SELECT b.bookId, b.bookCde, b.bookName, b.bookType, t.typeName,
              b.bookAuthor, b.publishPress, b.publishDate, b.borrowed,
              b.createdBy, b.creationTime, b.lastUpdatetime
         FROM book_info b
         LEFT JOIN book_type t ON t.id = b.bookType
         ${where}
        ORDER BY b.creationTime DESC, b.bookId DESC
        LIMIT ${pageSize} OFFSET ${offset}`,
      params
    );

    res.json({ list, total, page, pages, pageSize });
  } catch (e) {
    next(e);
  }
});

// 详情
router.get('/:id', async (req, res, next) => {
  try {
    const rows = await query(
      `SELECT b.bookId, b.bookCde, b.bookName, b.bookType, t.typeName,
              b.bookAuthor, b.publishPress, b.publishDate, b.borrowed,
              b.createdBy, b.creationTime, b.lastUpdatetime
         FROM book_info b
         LEFT JOIN book_type t ON t.id = b.bookType
        WHERE b.bookId = ?`,
      [toInt(req.params.id, -1)]
    );
    if (!rows.length) return res.status(404).json({ error: '图书不存在' });
    res.json(rows[0]);
  } catch (e) {
    next(e);
  }
});

// 新增
router.post('/', async (req, res, next) => {
  try {
    const errs = validateBook(req.body);
    if (errs.length) return res.status(400).json({ error: errs.join('；') });

    const b = req.body;
    const result = await query(
      `INSERT INTO book_info
         (bookCde, bookName, bookType, bookAuthor, publishPress, publishDate, borrowed, createdBy, creationTime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(b.bookCde).trim(),
        String(b.bookName).trim(),
        toInt(b.bookType, 0),
        String(b.bookAuthor).trim(),
        String(b.publishPress).trim(),
        b.publishDate,
        toInt(b.borrowed, 0),
        String(b.createdBy).trim(),
        b.creationTime,
      ]
    );
    res.status(201).json({ bookId: result.insertId });
  } catch (e) {
    next(e);
  }
});

// 修改（入库人、入库时间不可改）
router.put('/:id', async (req, res, next) => {
  try {
    const errs = validateBook(req.body);
    if (errs.length) return res.status(400).json({ error: errs.join('；') });

    const id = toInt(req.params.id, -1);
    const exist = await query('SELECT bookId FROM book_info WHERE bookId = ?', [id]);
    if (!exist.length) return res.status(404).json({ error: '图书不存在' });

    const b = req.body;
    await query(
      `UPDATE book_info
          SET bookCde = ?, bookName = ?, bookType = ?, bookAuthor = ?,
              publishPress = ?, publishDate = ?, borrowed = ?, lastUpdatetime = NOW()
        WHERE bookId = ?`,
      [
        String(b.bookCde).trim(),
        String(b.bookName).trim(),
        toInt(b.bookType, 0),
        String(b.bookAuthor).trim(),
        String(b.publishPress).trim(),
        b.publishDate,
        toInt(b.borrowed, 0),
        id,
      ]
    );
    res.json({ bookId: id });
  } catch (e) {
    next(e);
  }
});

// 删除
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await query('DELETE FROM book_info WHERE bookId = ?', [toInt(req.params.id, -1)]);
    if (!result.affectedRows) return res.status(404).json({ error: '图书不存在' });
    res.json({ deleted: true });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
