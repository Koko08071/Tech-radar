
const fs=require('fs');
let h=fs.readFileSync('src/index.html','utf8');
const css=fs.readFileSync('radar-mini.css','utf8');
const runtime=fs.readFileSync('radar-mini-runtime.js','utf8');
const aside="<aside class=\"radar-mini\" id=\"radar-mini\" aria-label=\"新品探索交互控制台\"><div class=\"radar-mini-title\"><i></i> SIGNAL EXPLORER <em>INTERACTIVE</em></div><div class=\"radar-mini-center\"><button type=\"button\" class=\"radar-scan\" id=\"radar-scan\" aria-label=\"随机探索一个新品\" title=\"随机探索一个新品\"><span>SCAN</span></button><div class=\"radar-mini-stat\"><b id=\"radar-mini-count\">08</b><small>个可探索信号</small><p id=\"radar-mini-status\" aria-live=\"polite\">点击扫描，发现一个新品</p></div></div><div class=\"radar-filters\" role=\"group\" aria-label=\"筛选本期新品\"><button type=\"button\" data-filter=\"all\" aria-pressed=\"true\">全部</button><button type=\"button\" data-filter=\"ai\" aria-pressed=\"false\">AI / Agent</button><button type=\"button\" data-filter=\"creative\" aria-pressed=\"false\">影音创作</button><button type=\"button\" data-filter=\"hardware\" aria-pressed=\"false\">创客硬件</button></div></aside>";
const mark=/<section class="hero">([\s\S]*?)<\/section>/;
if(!mark.test(h)||h.includes('id="radar-mini"'))throw Error('Hero missing or duplicate');
h=h.replace(mark,(w,inner)=>'<section class="hero hero-interactive"><div class="hero-copy">'+inner+'</div>'+aside+'</section>');
h=h.replace('</style>',css+'</style>').replace('</body>','<script>'+runtime+'</script></body>');
const items=JSON.parse(h.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
const names=[...h.matchAll(/<article class="panel try-card">[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(m=>m[1]);
if(items.length!==8||names.length!==2||names.some(n=>items.some(x=>n===x.name)))throw Error('Product collision');
for(const x of ['Tech Insights','Product Thinking','RICE：资源有限时','calendar-lunar.js','Asia/Shanghai','2026-11-20.html','id="radar-mini"'])if(!h.includes(x))throw Error('Missing '+x);
const js=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
js.forEach((s,i)=>{try{new Function(s)}catch(e){throw Error('Script '+i+' invalid '+e.message)}});
fs.writeFileSync('src/index.html',h);console.log('PASS: hero radar, 8 products, 2 try cards, '+js.length+' JS scripts');
