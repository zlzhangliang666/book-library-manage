// 新增/修改页共用：类型下拉加载、必填校验、数据收集、回列表跳转
window.Form = (function () {
  const REQUIRED = ['bookCde', 'bookName', 'bookType', 'bookAuthor', 'publishPress', 'createdBy', 'creationTime', 'publishDate'];

  function clearErrors() {
    $('.field-error').text('');
  }

  function validate() {
    clearErrors();
    let ok = true;
    for (const f of REQUIRED) {
      const v = ($('#' + f).val() || '').trim();
      if (!v) {
        ok = false;
        $(`.field-error[data-for="${f}"]`).text('必填');
      }
    }
    return ok;
  }

  function collect() {
    return {
      bookCde: $('#bookCde').val().trim(),
      bookName: $('#bookName').val().trim(),
      bookType: Number($('#bookType').val()),
      bookAuthor: $('#bookAuthor').val().trim(),
      publishPress: $('#publishPress').val().trim(),
      publishDate: $('#publishDate').val(),
      borrowed: Number($('#borrowed').val()),
      createdBy: $('#createdBy').val().trim(),
      creationTime: $('#creationTime').val(),
    };
  }

  async function loadTypes() {
    const { list } = await App.api('/api/book-types');
    const $s = $('#bookType');
    for (const t of list) $s.append(`<option value="${t.id}">${App.esc(t.typeName)}</option>`);
  }

  function backUrl() {
    const q = new URLSearchParams();
    const name = App.param('name');
    const page = App.param('page') || '1';
    if (name) q.set('name', name);
    q.set('page', page);
    return `index.html?${q.toString()}`;
  }

  function goList(msg, type) {
    return `${backUrl()}&msg=${encodeURIComponent(msg)}&msgType=${type}`;
  }

  return { validate, collect, loadTypes, backUrl, goList };
})();
