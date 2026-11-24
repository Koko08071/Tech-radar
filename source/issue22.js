
"use strict";
const fs=require("fs"),path=require("path");
const data=JSON.parse(fs.readFileSync("issue22-data.json","utf8"));
function must(a,m){if(!a)throw Error(m)}
function norm(s){return String(s).normalize("NFKC").toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]/g,"")}
async function getImage(file,url){
 const r=await fetch(url,{signal:AbortSignal.timeout(33000),headers:{"User-Agent":"Mozilla/5.0","Accept":"image/jpeg,image/png,image/*"}});
 const mime=(r.headers.get("content-type")||"").split(";")[0];
 const b=Buffer.from(await r.arrayBuffer());
 const jpg=b[0]===255&&b[1]===216,png=b[0]===137&&b[1]===80;
 must(r.status===200&&b.length>12000&&b.length<6000000&&((file.endsWith(".jpg")&&mime==="image/jpeg"&&jpg)||(file.endsWith(".png")&&mime==="image/png"&&png)),"ASSET error "+file+" "+r.status+" "+mime+" "+b.length);
 fs.mkdirSync("src/assets",{recursive:true});fs.writeFileSync("src"+file,b);
 console.log("IMAGE_OK",file,mime,b.length);
}
function esc(x){return String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function card(t,i){
 return '<article class="panel try-card"><div class="try-visual" style="--preview-image:url('+t.image+')"><img alt="'+esc(t.alt)+'" decoding="async" loading="lazy" src="'+t.image+'" onerror="this.remove()"/><div class="try-image-fallback"><strong>'+esc(t.brand)+'</strong><span>'+esc(t.name)+'</span><small>官方图片暂不可用 · 查看来源</small></div><span class="try-credit">'+esc(t.brand)+' · OFFICIAL IMAGE</span></div><div class="try-content"><div class="try-topline"><span class="tag">'+esc(t.tag)+'</span><span class="try-kicker">0'+(i+1)+' / TRY IT NOW</span></div><h3>'+esc(t.name)+'</h3><p class="try-lead">'+esc(t.desc)+'</p><div class="try-facts"><div class="try-fact"><small>平台</small><strong>'+esc(t.platform)+'</strong></div><div class="try-fact"><small>核心能力</small><strong>'+esc(t.cap)+'</strong></div><div class="try-fact"><small>费用 / 开放</small><strong>'+esc(t.cost)+'</strong></div><div class="try-fact"><small>上手建议</small><strong>'+esc(t.how)+'</strong></div></div><div class="try-actions"><a class="try-link" href="'+esc(t.source)+'" rel="noopener" target="_blank">官方发布说明 ↗</a><a class="try-secondary" href="'+esc(t.open)+'" rel="noopener" target="_blank">立即体验 ↗</a></div></div></article>';
}
function lesson(){
 return '<section class="section" id="academy"><div class="section-head"><div><div class="eyebrow">04 / PRODUCT THINKING</div><h2>Product Thinking</h2></div><p>DAILY LESSON · 每日一课</p></div><article class="panel lesson lesson-readable"><div class="tag">TODAY\\'S FRAMEWORK / FOGG BEHAVIOR MODEL</div><div class="rice-hero"><div class="rice-headline"><h3>Fogg 行为模型：为什么用户喜欢，却未必天天用？</h3><p class="rice-deck">让用户主动使用产品，需要<strong>动机（Motivation）、能力（Ability）、提示（Prompt）</strong>在当下同时成立。功能强不代表行为自然发生。</p></div><div class="rice-equation"><small>BEHAVIOR MODEL</small><b>B = MAP</b><span class="rice-line"></span><b>三个条件</b><em>先降低阻力，再设计触发</em></div></div><div class="rice-label"><span>01 / CORE IDEA</span><h4>三个要素，判断行为卡在哪里</h4></div><div class="rice-metrics"><div class="rice-metric"><span class="rice-initial">M <small>MOTIVATION</small></span><strong>为什么愿意用？</strong><p>用户真正需要陪伴、帮助还是新鲜感？先明确价值。</p></div><div class="rice-metric"><span class="rice-initial">A <small>ABILITY</small></span><strong>用起来是否足够简单？</strong><p>评估配网、唤醒、操作步骤和维护成本。</p></div><div class="rice-metric"><span class="rice-initial">P <small>PROMPT</small></span><strong>什么情境提醒使用？</strong><p>主动提示必须合适、可关闭，不应频繁打扰。</p></div></div><div class="rice-case"><div class="rice-label"><span>02 / REAL PRODUCT</span><h4>案例 · Pophie AI 陪伴机器人</h4></div><p class="rice-case-intro">Pophie 日本开放预订，强调主动对话。把这项体验拆成三个问题：<b>为什么回应、是否易于回应、何时适合发起互动？</b></p><div class="rice-example-list"><div class="rice-example"><strong>动机 <small>MOTIVATION</small></strong><span>访谈区分情绪陪伴、提醒和新奇体验三种真实需求。</span></div><div class="rice-example"><strong>能力 <small>ABILITY</small></strong><span>测试首次配置、语音唤醒和记忆权限管理的实际耗时。</span></div><div class="rice-example"><strong>提示 <small>PROMPT</small></strong><span>比较固定招呼和场景触发对互动率、打扰率的影响。</span></div></div><p class="rice-evidence-note">以上为产品经理的验证方案，不是厂商公布的真实留存数据或已实现功能清单。</p></div><details class="rice-expand"><summary><span>展开完整实操方法</span><small>实验设计 · 指标 · 决策</small><span class="rice-plus" aria-hidden="true"></span></summary><div class="rice-expand-body"><div><b>1. 定义行为</b><p>把“提升粘性”改为“用户每天自愿完成一次有意义的互动”。</p></div><div><b>2. 分解阻力</b><p>访谈动机、测试操作能力、记录提醒被忽略或关闭的场景。</p></div><div><b>3. 设计小样本实验</b><p>比较两种提示策略，记录7日回访率、有效互动和误提醒频率。</p></div><div><b>4. 先改善能力</b><p>让启动、退出和撤销授权更容易，而不是无条件增加提醒次数。</p></div><p class="rice-warning"><strong>边界：</strong>交互习惯的培养不能凌驾于用户自愿选择、可关闭提示和隐私管理之上。</p></div></details><div class="rice-source">理论来源：<a href="https://behaviormodel.org/" target="_blank" rel="noopener">BJ Fogg · Behavior Model</a>；案例来源：<a href="https://prtimes.jp/main/html/rd/p/000000001.000191046.html" target="_blank" rel="noopener">InsBotics 官方公告</a></div></article></section>';
}
async function main(){
 let h=fs.readFileSync("src/index.html","utf8");
 must(h.includes("<title>科技新品雷达 · 2026.11.21</title>"),"Wrong mother edition");
 const archiveStyle='<style>.latest22{position:fixed;right:16px;bottom:16px;z-index:9999;background:rgba(10,25,48,.9);color:#fff!important;padding:10px 16px;border-radius:999px;text-decoration:none!important;font:700 13px Segoe UI,sans-serif}.arch22{position:fixed;left:14px;bottom:18px;z-index:9997;background:rgba(10,25,48,.78);color:#e1eafd;padding:8px;border-radius:12px;font:600 11px Segoe UI,sans-serif}</style>';
 const archived=h.replace("</head>",archiveStyle+"</head>").replace(/<body\b[^>]*>/i,m=>m+'<a class="latest22" href="/">✦ 最新一期</a><span class="arch22">ARCHIVE · 2026.11.21</span>');
 fs.mkdirSync("src/archive",{recursive:true});fs.writeFileSync("src/archive/2026-11-21.html",archived);
 console.log("ARCHIVED FULL Nov21",archived.length);
 for(const [file,url] of Object.entries(data.images))await getImage(file,url);
 const found=h.match(/const items=(\[[\s\S]*?\]);const esc=/);must(found,"Missing product payload");
 const old=JSON.parse(found[1]);must(old.length===8&&data.items.length===8,"Item count changed");
 const previous=new Set();
 for(const d of ["17","18","19","20","21"]){
  const text=fs.readFileSync("src/archive/2026-11-"+d+".html","utf8");
  for(const m of text.matchAll(/"name"\s*:\s*"([^"]+)"/g))previous.add(norm(m[1]));
  for(const m of text.matchAll(/\bname\s*:\s*"([^"]+)"/g))previous.add(norm(m[1]));
 }
 const current=new Set();for(const item of data.items){const n=norm(item.name);must(!current.has(n)&&!previous.has(n),"Duplicate "+item.name);current.add(n);must(fs.existsSync("src"+item.image),"No image "+item.name);}
 for(const t of data.tools2)must(!previous.has(norm(t.name))&&!current.has(norm(t.name)),"Tool duplicated "+t.name);
 h=h.replace(found[0],"const items="+JSON.stringify(data.items)+";const esc=");
 const s=h.indexOf('<section class="section" id="try">'),e=h.indexOf('</section>',s)+10;must(s>=0&&e>s,"Try section absent");
 let tr=h.slice(s,e);must((tr.match(/class="panel try-card"/g)||[]).length===2,"Current try cards not two");
 tr=tr.replace(/<div class="try-grid">[\s\S]*?<\/article><\/div><\/section>/,'<div class="try-grid">'+data.tools2.map(card).join("")+'</div></section>');
 must(tr.includes("Gemini 4 Neon")&&tr.includes("Excalidraw"),"Try tools update failed");
 h=h.slice(0,s)+tr+h.slice(e);
 const is=h.indexOf('<section class="section" id="insight">'),ie=h.indexOf('</section>',is)+10;must(is>=0&&ie>is,"Insight missing");
 let ins=h.slice(is,ie),oi=0;
 const obs=[["01 / AGENT","Agent 从推荐迈向可执行交易","Google Connected Apps 将零售商接入采购链路；价值在完成交易、授权透明和出错后的撤销能力。"],["02 / COMPANION","陪伴硬件竞争的是长期使用","Pophie 与 HTC VIVEE 重新讨论什么是合适的主动互动：记忆权限、打扰边界和长周期留存。"],["03 / HARDWARE","智能设备从规格竞争进入任务交付","OBSBOT 的自动取景、OMRON 的存量车队兼容与 PANOCORE 的会议摘要，都强调把完整任务做成闭环。"]];
 ins=ins.replace(/<article class="panel insight">[\s\S]*?<\/article>/g,()=>{const z=obs[oi++];return '<article class="panel insight"><div class="tag">'+z[0]+'</div><h3>'+z[1]+'</h3><p>'+z[2]+'</p></article>'});must(oi===3,"Three insights not replaced");
 h=h.slice(0,is)+ins+h.slice(ie);
 const as=h.indexOf('<section class="section" id="academy">'),ae=h.indexOf('</section>',as)+10;must(as>=0&&ae>as,"Lesson missing");
 h=h.slice(0,as)+lesson()+h.slice(ae);
 h=h.replace('<title>科技新品雷达 · 2026.11.21</title>','<title>科技新品雷达 · 2026.11.22</title>');
 h=h.replace('DAILY ISSUE · 2026.11.21 · SATURDAY','DAILY ISSUE · 2026.11.22 · SUNDAY');
 h=h.replace(/<span class="clock-date" id="date">[^<]*<\/span>/,'<span class="clock-date" id="date">2026.11.22 · 周日</span>');
 const now=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Shanghai",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(new Date());
 h=h.replace(/<time id="time">[^<]*<\/time>/,'<time id="time">'+now+'</time>');
 h=h.replace('<strong>05 / 03</strong>','<strong>06 / 02</strong>');
 const ars=h.indexOf('<section class="section" id="archive">'),are=h.indexOf('</section>',ars);must(ars>=0&&are>ars,"Archive section missing");
 let arch=h.slice(ars,are);
 arch=arch.replace('<div class="archive-grid">','<div class="archive-grid"><a class="panel archive-item" href="/archive/2026-11-21.html"><span class="archive-date">2026.11.21 · 已归档</span><strong>科技新品雷达 · 11月21日</strong><small>完整刊期 · RICE 与 Agent 产品</small></a>');
 h=h.slice(0,ars)+arch+h.slice(are);
 h=h.replace(/<footer class="foot">[\s\S]*?<\/footer>/,'<footer class="foot">11月22日周日刊期：近24小时符合标准的海外新品较少，因此选题扩展至11月17—20日；各条均标注实际事件日期。今日背景：<a href="https://science.nasa.gov/image-article/apod-2026-november-22-swirls-and-colors-on-jupiter-from-juno/" target="_blank" rel="noopener">NASA APOD · Jupiter</a>。</footer>');
 const extra='/* NASA APOD 2026-11-22 */.scene{background:linear-gradient(180deg,rgba(6,13,27,.58),rgba(4,13,29,.74)),url("/assets/22-nasa.jpg") center/cover fixed!important}body.light .scene{background:linear-gradient(180deg,rgba(244,248,252,.59),rgba(237,244,250,.75)),url("/assets/22-nasa.jpg") center/cover fixed!important}#academy .rice-metrics{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:900px){#academy .rice-metrics{grid-template-columns:1fr 1fr}}@media(max-width:720px){#academy .rice-metrics{grid-template-columns:1fr}}';
 h=h.replace("</style>",extra+"</style>");
 const scripts=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 scripts.forEach((s,i)=>{try{new Function(s)}catch(e){throw Error("Inline JS "+i+": "+e.message)}});
 for(const marker of ['id="try"','id="radar"','id="insight"','id="academy"','id="archive"','id="ambient-play"','calendar-lunar.js','history.scrollRestoration','Asia/Shanghai','B = MAP'])must(h.includes(marker),"Lost module "+marker);
 fs.writeFileSync("src/index.html",h);
 console.log("PASS NOV22: Eight unique official projects, two new tools, Fogg lesson, five historic archives, NASA and calendar/game/theme preserved");
}
main().catch(e=>{console.error(e.stack||e);process.exit(1)});
