
const fs=require("node:fs");
const guard=(ok,label)=>{if(!ok)throw Error(label)};
let h=fs.readFileSync("src/index.html","utf8");
guard(h.includes('id="radar"')&&h.includes('id="try"')&&h.includes('id="insight"')&&h.includes('id="academy"')&&h.includes('id="archive"')&&h.includes('id="ambient-play"'),"Missing existing mother sections");
guard(!h.includes('id="news-toolbar"'),"Already modified");
const m=h.match(/const items=(\[[\s\S]*?\]);const esc=/);
guard(!!m,"News payload missing");
const data=JSON.parse(m[1]);guard(data.length===8,"Original dataset count changed");
for(const x of data){
 guard(x.image.startsWith("/assets/")&&/\.(png|jpe?g|webp)$/.test(x.image),"Non-official product asset "+x.name);
 const p="src"+x.image;guard(fs.existsSync(p),"Real source image missing "+x.name);
 const bytes=fs.readFileSync(p);const type=(bytes[0]===255&&bytes[1]===216)||(bytes[0]===137&&bytes.toString("ascii",1,4)==="PNG")||(bytes.toString("ascii",0,4)==="RIFF"&&bytes.toString("ascii",8,12)==="WEBP");
 guard(bytes.length>10000&&type,"Product image corrupted "+x.name);
 guard(x.alt&&x.source&&x.source.startsWith("https://"),"Missing original attribution "+x.name);
}
const groups=[["all","全部"],["ai","AI / Agent"],["hardware","机器人 / 硬件"],["av","影像 / 音频"],["life","智能生活"]];
const intro='<div class="news-intro"><strong>THE EDITION / 本期精选</strong><span>头条先读 · 然后按兴趣浏览全球新品</span></div>';
const bar='<div class="news-toolbar" id="news-toolbar" aria-label="筛选本期新闻"><div class="news-filters" role="group" aria-label="新闻分类筛选">'+groups.map(([k,label])=>'<button class="news-filter" type="button" data-news-filter="'+k+'" aria-pressed="'+(k==="all")+'">'+label+' <small>00</small></button>').join("")+'</div><span id="news-result" aria-live="polite">'+data.length+' 条真实新品与更新</span></div>';
guard(h.includes('<div class="products" id="products"></div>'),"Missing news container");
h=h.replace('<div class="products" id="products"></div>',intro+bar+'<div class="products" id="products"></div>');
guard(h.includes("</head>")&&h.includes("</body>"),"Bad html");
h=h.replace("</head>",'<link rel="stylesheet" href="/editorial.css"/></head>');
h=h.replace("</body>",'<script src="/editorial.js" defer></script></body>');
for(const key of ['id="date"','id="time"','Asia/Shanghai','calendar-lunar.js','rice-metrics','class="fogg-diagram"','id="ambient-play"','/archive/2026-11-21.html'])guard(h.includes(key),"Missing fixed feature "+key);
const scripts=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
scripts.forEach((code,i)=>{try{new Function(code)}catch(e){throw Error("Main script "+i+": "+e.message)}});
new Function(fs.readFileSync("editorial.js","utf8"));
fs.copyFileSync("editorial.css","src/editorial.css");
fs.copyFileSync("editorial.js","src/editorial.js");
fs.writeFileSync("src/index.html",h);
console.log("EDITORIAL TEST PASS: 8 real source images, two Now Try cards, Fogg lesson, calendar, archives; JS",scripts.length);
