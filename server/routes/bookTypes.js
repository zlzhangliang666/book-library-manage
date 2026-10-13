const express = require('express');
const { query } = require('../db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const list = await query('SELECT id, typeName FROM book_type ORDER BY id');
    res.json({ list });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
