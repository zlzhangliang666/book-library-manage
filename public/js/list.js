// 图书列表页：分页、模糊查询（记忆条件）、查看/修改/删除、新增入口
$(function () {
  const name = App.param('name');
  let page = parseInt(App.param('page'), 10) || 1;
  let pages = 1;

  $('#searchName').val(name);

  const msg = App.param('msg');
  if (msg) {
    $('#msg').text(msg).addClass(App.param('msgType') === 'err' ? 'err' : 'ok');
  }

  function listUrl(p, extra) {
    const q = new URLSearchParams();
    if (name) q.set('name', name);
    q.set('page', String(p));
    if (extra) for (const k in extra) q.set(k, extra[k]);
    return `index.html?${q.toString()}`;
  }

  function renderRows(list) {
    const $body = $('#bookBody').empty();
    if (!list.length) {
      $body.append('<tr><td colspan="8">暂无数据</td></tr>');
      return;
    }
    for (const b of list) {
      const q = `id=${b.bookId}&name=${encodeURIComponent(name)}&page=${page}`;
      $body.append(
        '<tr>' +
        `<td>${App.esc(b.bookCde)}</td>` +
        `<td>${App.esc(b.typeName)}</td>` +
        `<td>${App.esc(b.bookName)}</td>` +
        `<td>${App.esc(b.bookAuthor)}</td>` +
        `<td>${App.esc(b.publishPress)}</td>` +
        `<td>${App.esc(b.creationTime)}</td>` +
        `<td>${App.borrowedText(b.borrowed)}</td>` +
        '<td>' +
        `<a href="detail.html?${q}">查看</a>` +
        `<a href="edit.html?${q}">修改</a>` +
        `<a href="javascript:;" class="del" data-id="${b.bookId}">删除</a>` +
        '</td>' +
        '</tr>'
      );
    }
  }

  function renderPagination() {
    const $p = $('#pagination').empty();
    const link = (p, text) => `<a href="${listUrl(p)}">${text}</a>`;
    if (page > 1) $p.append(link(page - 1, '上一页'));
    $p.append('<span>◀</span>');
    for (let i = 1; i <= pages; i++) {
      $p.append(i === page ? `<span class="num current">${i}</span>` : `<span class="num" data-page="${i}">${i}</span>`);
    }
    $p.append('<span>▶</span>');
    if (page < pages) $p.append(link(page + 1, '下一页'));
    $p.append(`<span>共${pages}页</span>`);
    $p.append('到第<input type="text" id="jumpPage">页');
    $p.append('<button type="button" id="btnJump">确定</button>');
  }

  async function load() {
    try {
      const q = new URLSearchParams();
      if (name) q.set('name', name);
      q.set('page', String(page));
      const data = await App.api(`/api/books?${q.toString()}`);
      page = data.page;
      pages = data.pages;
      renderRows(data.list);
      renderPagination();
    } catch (e) {
      $('#msg').text('加载失败：' + e.message).removeClass('ok').addClass('err');
    }
  }

  $('#btnSearch').on('click', () => {
    const v = $('#searchName').val().trim();
    const q = new URLSearchParams();
    if (v) q.set('name', v);
    q.set('page', '1');
    location.href = `index.html?${q.toString()}`;
  });

  $('#btnAdd').on('click', () => {
    location.href = `add.html?name=${encodeURIComponent(name)}&page=${page}`;
  });

  $('#pagination').on('click', '.num', function () {
    location.href = listUrl(Number($(this).data('page')));
  });

  $('#pagination').on('click', '#btnJump', () => {
    const v = parseInt($('#jumpPage').val(), 10);
    if (!Number.isFinite(v)) return;
    location.href = listUrl(Math.min(Math.max(1, v), pages));
  });

  $('#bookBody').on('click', '.del', async function () {
    const id = $(this).data('id');
    if (!window.confirm('确定删除该图书信息？')) return;
    try {
      await App.api(`/api/books/${id}`, { method: 'DELETE' });
      location.href = listUrl(page, { msg: '删除成功', msgType: 'ok' });
    } catch (e) {
      location.href = listUrl(page, { msg: '删除失败：' + e.message, msgType: 'err' });
    }
  });

  load();
});
