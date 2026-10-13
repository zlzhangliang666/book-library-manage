// 修改页：回填数据，入库人/入库时间只读，校验后提交
$(async function () {
  const id = App.param('id');

  try {
    await Form.loadTypes();
  } catch (e) {
    alert('加载图书类型失败：' + e.message);
  }

  let b;
  try {
    b = await App.api(`/api/books/${id}`);
  } catch (e) {
    alert('加载图书信息失败：' + e.message);
    location.href = Form.backUrl();
    return;
  }

  $('#bookCde').val(b.bookCde);
  $('#bookName').val(b.bookName);
  $('#bookType').val(String(b.bookType));
  $('#bookAuthor').val(b.bookAuthor);
  $('#publishPress').val(b.publishPress);
  $('#publishDate').val(b.publishDate);
  $('#borrowed').val(String(b.borrowed));
  $('#createdBy').val(b.createdBy).prop('readonly', true);
  $('#creationTime').val(b.creationTime).prop('readonly', true);

  $('#btnBack').on('click', () => {
    location.href = Form.backUrl();
  });

  $('#btnSave').on('click', async () => {
    if (!Form.validate()) return;
    try {
      await App.api(`/api/books/${id}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Form.collect()),
      });
      location.href = Form.goList('修改成功', 'ok');
    } catch (e) {
      location.href = Form.goList('修改失败：' + e.message, 'err');
    }
  });
});
