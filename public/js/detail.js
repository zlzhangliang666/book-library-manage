// 查看页：所有字段只读，返回保留列表查询条件与页码
$(function () {
  const id = App.param('id');
  const name = App.param('name');
  const page = App.param('page') || '1';

  function back() {
    const q = new URLSearchParams();
    if (name) q.set('name', name);
    q.set('page', page);
    location.href = `index.html?${q.toString()}`;
  }

  $('#btnBack').on('click', back);

  (async () => {
    try {
      const b = await App.api(`/api/books/${id}`);
      $('#bookCde').val(b.bookCde);
      $('#bookName').val(b.bookName);
      $('#typeName').val(b.typeName);
      $('#bookAuthor').val(b.bookAuthor);
      $('#publishPress').val(b.publishPress);
      $('#borrowed').val(String(b.borrowed));
      $('#createdBy').val(b.createdBy);
      $('#creationTime').val(b.creationTime);
    } catch (e) {
      alert('加载图书信息失败：' + e.message);
      back();
    }
  })();
});
