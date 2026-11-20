/* 방문 통계 (GoatCounter, 쿠키 없음·개인 식별 없음) */
(function(){
  var GC='https://sseuktool.goatcounter.com/count';
  if(!/sseuktool\.com$/.test(location.hostname))return;     /* 로컬·미리보기 제외 */
  if(/\/admin(\.html)?$/.test(location.pathname))return;
  try{if(localStorage.getItem('sseuk_nostat')==='1')return;}catch(e){} /* 관리자 본인 방문 제외 */
  var isTools=/\/tools(\.html)?$/.test(location.pathname);
  function send(p,first){
    var q='?p='+encodeURIComponent(p)+'&t='+encodeURIComponent(document.title)+
          (first?'&r='+encodeURIComponent(document.referrer):'')+'&s='+screen.width+'&rnd='+Math.random().toString(36).slice(2);
    new Image().src=GC+q;
  }
  var p;
  if(isTools){p='/'+(new URLSearchParams(location.search).get('m')||'mosaic');}  /* tools.html?m=qr → /qr */
  else{p=location.pathname.replace(/\.html$/,'').replace(/\/index$/,'/')||'/';}
  send(p,true);
  if(isTools){ /* 도구 안에서 탭을 바꿔도 해당 도구로 집계 */
    document.addEventListener('click',function(e){
      var b=e.target.closest&&e.target.closest('.tab[data-m]');
      if(b&&('/'+b.dataset.m)!==p){p='/'+b.dataset.m;setTimeout(function(){send(p,false)},300);}
    },true);
  }
})();
