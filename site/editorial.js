
(function(){
 "use strict";
 function init(){
  const body=document.body,radar=document.getElementById("radar"),products=document.getElementById("products");
  if(!radar||!products||body.classList.contains("editorial-refresh"))return;
  const cards=Array.from(products.querySelectorAll("article.product"));if(!cards.length)return;
  body.classList.add("editorial-refresh");
  const top=document.querySelector(".top");
  if(top&&!top.querySelector(".nav-progress")){const p=document.createElement("div");p.className="nav-progress";p.setAttribute("aria-hidden","true");top.appendChild(p)}
  const patterns=[
   ["ai",/ai|agent|gemini|智能体|陪伴|pophie|vivee/i],
   ["hardware",/机器人|robot|omron|switchbot|pophie|工业|硬件|ld-150|ld-300/i],
   ["av",/影像|摄影|视频|音频|听力|助听|obsbot|phonak|panocore|相机/i],
   ["life",/陪伴|穿戴|艺术|家居|音频|听力|htc|switchbot|pophie/i]
  ];
  cards.forEach(function(card,i){
   card.classList.add(i===0?"cover-story":"feed-story");
   const text=(card.querySelector(".kind")?.textContent||"")+" "+(card.querySelector("h3")?.textContent||"");
   card.dataset.topics=patterns.filter(a=>a[1].test(text)).map(a=>a[0]).join(" ");
   const main=card.querySelector(".body"),meta=card.querySelector(".meta"),facts=card.querySelector(".facts"),extra=card.querySelector(".extra-info"),source=card.querySelector(".source");
   if(i===0){
    const marker=document.createElement("span");marker.className="cover-kicker";marker.textContent="COVER STORY  /  本期焦点";
    if(main)main.insertBefore(marker,meta||main.firstChild);return;
   }
   if(!main||!facts)return;
   const details=document.createElement("details");details.className="news-details";
   const summary=document.createElement("summary");summary.textContent="规格、适用人群与体验方式";
   details.appendChild(summary);details.appendChild(facts);if(extra)details.appendChild(extra);
   if(source)main.insertBefore(details,source);else main.appendChild(details);
  });
  const toolbar=radar.querySelector("#news-toolbar");
  if(toolbar){
   const buttons=Array.from(toolbar.querySelectorAll("[data-news-filter]"));
   const results=toolbar.querySelector("#news-result");
   buttons.forEach(function(btn){
    const k=btn.dataset.newsFilter;
    const n=k==="all"?cards.length:cards.filter(c=>c.dataset.topics.split(" ").includes(k)).length;
    const node=btn.querySelector("small");if(node)node.textContent=String(n).padStart(2,"0");
   });
   function show(k){
    buttons.forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.newsFilter===k)));
    let shown=0;
    cards.forEach(function(c){const match=k==="all"||c.dataset.topics.split(" ").includes(k);c.hidden=!match;if(match)shown++});
    if(results)results.textContent="已显示 "+shown+" / "+cards.length+" 条 · 全部提供原始来源";
   }
   buttons.forEach(b=>b.addEventListener("click",()=>show(b.dataset.newsFilter)));
   show("all");
  }
  let scheduled=false;
  function tick(){scheduled=false;const doc=document.documentElement;const range=doc.scrollHeight-window.innerHeight;const progress=range>0?Math.max(0,Math.min(100,100*window.scrollY/range)):0;body.style.setProperty("--read-progress",progress.toFixed(1)+"%")}
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(tick)}}
  window.addEventListener("scroll",schedule,{passive:true});
  window.addEventListener("resize",schedule,{passive:true});
  tick();
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
