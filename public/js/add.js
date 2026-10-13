// 新增页：默认值 + jQuery 必填校验 + 保存/返回
$(async function () {
  try {
    await Form.loadTypes();
  } catch (e) {
    alert('加载图书类型失败：' + e.message);
  }

  $('#createdBy').val('系统管理员');
  $('#creationTime').val(App.today());
  $('#borrowed').val('0');

  $('#btnBack').on('click', () => {
    location.href = Form.backUrl();
  });

  $('#btnSave').on('click', async () => {
    if (!Form.validate()) return;
    try {
      await App.api('/api/books', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Form.collect()),
      });
      location.href = Form.goList('新增成功', 'ok');
    } catch (e) {
      location.href = Form.goList('新增失败：' + e.message, 'err');
    }
  });
});
