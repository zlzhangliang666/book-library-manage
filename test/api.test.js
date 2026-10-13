const test = require('node:test');
const assert = require('node:assert');
const app = require('../server/app');
const { pool } = require('../server/db');

let server;
let base;
const marker = `T${Date.now()}`;
let createdId;

test.before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
});

test.after(async () => {
  server.close();
  await pool.end();
});

test('图书类型字典返回 8 种', async () => {
  const res = await fetch(`${base}/api/book-types`);
  assert.strictEqual(res.status, 200);
  const { list } = await res.json();
  assert.strictEqual(list.length, 8);
  assert.strictEqual(list[0].typeName, '小说');
});

test('列表默认每页 5 条且按入库时间降序', async () => {
  const res = await fetch(`${base}/api/books`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.pageSize, 5);
  assert.strictEqual(data.list.length, 5);
  const times = data.list.map((b) => b.creationTime);
  const sorted = [...times].sort().reverse();
  assert.deepStrictEqual(times, sorted);
});

test('分页第二页与第一页不重叠', async () => {
  const p1 = await (await fetch(`${base}/api/books?page=1`)).json();
  const p2 = await (await fetch(`${base}/api/books?page=2`)).json();
  const ids1 = new Set(p1.list.map((b) => b.bookId));
  for (const b of p2.list) assert.ok(!ids1.has(b.bookId));
});

test('新增图书返回 id', async () => {
  const res = await fetch(`${base}/api/books`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      bookCde: marker,
      bookName: `${marker}测试图书`,
      bookType: 1,
      bookAuthor: '测试作者',
      publishPress: '测试出版社',
      publishDate: '2024-01-01',
      borrowed: 0,
      createdBy: '系统管理员',
      creationTime: '2024-01-01',
    }),
  });
  assert.strictEqual(res.status, 201);
  const { bookId } = await res.json();
  assert.ok(bookId > 0);
  createdId = bookId;
});

test('新增缺少必填项返回 400', async () => {
  const res = await fetch(`${base}/api/books`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ bookCde: marker }),
  });
  assert.strictEqual(res.status, 400);
});

test('查看详情字段完整', async () => {
  const res = await fetch(`${base}/api/books/${createdId}`);
  assert.strictEqual(res.status, 200);
  const b = await res.json();
  assert.strictEqual(b.bookCde, marker);
  assert.strictEqual(b.typeName, '小说');
  assert.strictEqual(b.createdBy, '系统管理员');
});

test('按名称模糊查询能命中新增图书', async () => {
  const res = await fetch(`${base}/api/books?name=${encodeURIComponent(marker)}`);
  const data = await res.json();
  assert.ok(data.list.some((b) => b.bookId === createdId));
});

test('修改图书且不改入库人/入库时间', async () => {
  const before = await (await fetch(`${base}/api/books/${createdId}`)).json();
  const res = await fetch(`${base}/api/books/${createdId}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      bookCde: marker,
      bookName: `${marker}已修改`,
      bookType: 2,
      bookAuthor: '测试作者',
      publishPress: '测试出版社',
      publishDate: '2024-01-01',
      borrowed: 1,
      createdBy: '不应生效',
      creationTime: '1999-01-01',
    }),
  });
  assert.strictEqual(res.status, 200);
  const after = await (await fetch(`${base}/api/books/${createdId}`)).json();
  assert.strictEqual(after.bookName, `${marker}已修改`);
  assert.strictEqual(after.borrowed, 1);
  assert.strictEqual(after.createdBy, before.createdBy);
  assert.strictEqual(after.creationTime, before.creationTime);
  assert.ok(after.lastUpdatetime);
});

test('删除图书后查询 404', async () => {
  const del = await fetch(`${base}/api/books/${createdId}`, { method: 'DELETE' });
  assert.strictEqual(del.status, 200);
  const get = await fetch(`${base}/api/books/${createdId}`);
  assert.strictEqual(get.status, 404);
});
