/* 방문 통계 (GoatCounter, 쿠키 없음·개인 식별 없음) */
(function(){
  var GC='https://sseuktool.goatcounter.com/count';
  var h=location.hostname;
  if(!/sseuktool\.com$/.test(h))return;            /* 로컬·미리보기 제외 */
  if(/\/admin(\.html)?$/.test(location.pathname))return;
  try{if(localStorage.getItem('sseuk_nostat')==='1')return;}catch(e){} /* 관리자 본인 방문 제외 */
  var p=location.pathname.replace(/\.html$/,'').replace(/\/index$/,'/')||'/';
  var q='?p='+encodeURIComponent(p)+'&t='+encodeURIComponent(document.title)+
        '&r='+encodeURIComponent(document.referrer)+'&s='+screen.width+'&rnd='+Math.random().toString(36).slice(2);
  new Image().src=GC+q;
})();
