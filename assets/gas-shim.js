/*
 * google.script.run 대체: 기존 Apps Script 화면 코드를 고치지 않고 정적 사이트에서 그대로 쓰기 위한 연결 코드.
 * google.script.run.withSuccessHandler(f).withFailureHandler(g).함수이름(인자…)
 *   → TOOL_API_URL 로 POST {fn, args} (쿠키 없이 보내므로 구글 계정이 여러 개여도 동작)
 */
(function () {
  var API = window.TOOL_API_URL;
  function call(fn, args) {
    return fetch(API, {
      method: 'POST', credentials: 'omit', redirect: 'follow', cache: 'no-store',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ fn: fn, args: args })
    }).then(function (res) {
      if (!res.ok) throw new Error('서버 응답 오류 (' + res.status + ')');
      return res.json();
    }).then(function (j) {
      if (!j) throw new Error('빈 응답');
      if (j.__err) throw new Error(j.__err);
      return j.r;
    });
  }
  var RESERVED = { withSuccessHandler: 1, withFailureHandler: 1, withUserObject: 1, then: 1 };
  function make(s, f, u) {
    var base = {
      withSuccessHandler: function (h) { return make(h, f, u); },
      withFailureHandler: function (h) { return make(s, h, u); },
      withUserObject: function (o) { return make(s, f, o); }
    };
    return new Proxy(base, {
      get: function (t, name) {
        if (typeof name !== 'string') return undefined;
        if (RESERVED[name]) return t[name];
        return function () {
          var args = Array.prototype.slice.call(arguments);
          call(name, args).then(function (r) { if (s) s(r, u); }, function (e) {
            if (f) f(e, u); else if (window.console) console.error('[' + name + ']', e);
          });
        };
      }
    });
  }
  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = make(null, null, undefined);
  window.toolApi = call; /* Promise 방식: toolApi('voteState', [id]).then(...) */
})();
