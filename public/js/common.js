// 前端公共工具：URL 参数、API 调用、转义、日期
window.App = (function () {
  function param(name) {
    return new URLSearchParams(location.search).get(name) || '';
  }

  async function api(path, opts) {
    const res = await fetch(path, opts);
    let data = {};
    try {
      data = await res.json();
    } catch (e) {
      data = {};
    }
    if (!res.ok) throw new Error(data.error || ('HTTP ' + res.status));
    return data;
  }

  function esc(v) {
    return String(v === null || v === undefined ? '' : v).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    }[c]));
  }

  function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  // 借阅状态文案
  function borrowedText(v) {
    return Number(v) === 1 ? '已借阅' : '未借阅';
  }

  return { param, api, esc, today, borrowedText };
})();
