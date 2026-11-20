/* 홈: 공지 팝업 · 업데이트 소식 · NEW 표시 (관리자 페이지에서 관리) */
(function () {
  var API = window.TOOL_API_URL; if (!API) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} }
  function ymd(d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  var KIND = { 'new': '새 도구', fix: '고침', up: '개선' };
  fetch(API, { method: 'POST', credentials: 'omit', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: 'siteInfo', args: [] }) })
    .then(function (r) { return r.json(); }).then(function (j) {
      var d = j && j.r; if (!d) return;
      var ups = d.updates || [], lim = new Date(); lim.setDate(lim.getDate() - 14); lim = ymd(lim);
      /* 도구 목록: 관리자 순서·숨김 + NEW(최근 14일 '새 도구', 관리자 강제 켜기/끄기 우선) */
      var fresh = {}; ups.forEach(function (u) { if (u.k === 'new' && u.m && u.d >= lim) fresh[u.m] = 1; });
      if (window.renderList) window.renderList(d.tools || {}, fresh);
      /* 업데이트 소식 */
      var box = document.getElementById('news');
      if (box && ups.length) {
        var row = function (u) { return '<li><span class="nd">' + esc(u.d.slice(5).replace('-', '.')) + '</span><span class="nk nk-' + esc(u.k) + '">' + KIND[u.k] + '</span>' + (u.m ? '<a href="tools.html?m=' + esc(u.m) + '">' + esc(u.t) + '</a>' : '<span>' + esc(u.t) + '</span>') + '</li>'; };
        box.innerHTML = '<h2>업데이트 소식</h2><ul class="news">' + ups.slice(0, 5).map(row).join('') + '</ul>' +
          (ups.length > 5 ? '<details class="more"><summary>지난 소식 더 보기</summary><ul class="news">' + ups.slice(5).map(row).join('') + '</ul></details>' : '');
        box.hidden = false;
      }
      /* 공지 팝업 */
      var p = d.popup; if (!p || ls('sseuk_pop_' + p.id) === ymd(new Date()) || ls('sseuk_pop_' + p.id) === 'x') return;
      var w = document.createElement('div'); w.className = 'pop'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true');
      var link = p.link ? '<a class="pl" href="' + esc(p.link) + '"' + (/^https?:/.test(p.link) ? ' target="_blank" rel="noopener"' : '') + '>' + esc(p.linkText || '자세히 보기') + ' →</a>' : '';
      w.innerHTML = '<div class="pb">' + (p.title ? '<b class="pt">' + esc(p.title) + '</b>' : '') + '<p class="px">' + esc(p.text).replace(/\n/g, '<br>') + '</p>' + link +
        '<div class="pf"><button type="button" data-x="day">오늘 그만 보기</button><button type="button" data-x="close">닫기</button></div></div>';
      function close(k) { if (k === 'day') ls('sseuk_pop_' + p.id, ymd(new Date())); w.remove(); }
      w.addEventListener('click', function (e) { var x = e.target.getAttribute && e.target.getAttribute('data-x'); if (x) close(x); else if (e.target === w) close(); });
      document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
      document.body.appendChild(w);
    }).catch(function () {});
})();
