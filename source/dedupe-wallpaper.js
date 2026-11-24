
const fs=require('fs');const data=[
{name:'Google Stitch',brand:'GOOGLE LABS',tag:'AI INTERFACE DESIGN',img:'/assets/stitch-ui.webp',url:'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/ainativecanvas.width-1200.format-webp.webp',desc:'Google Labs 的 AI 原生设计画布。用文字快速生成界面原型并持续修改。本期作为可立即体验的现成工具推荐，不称为今日首发。',facts:['Windows / macOS 浏览器','文字生成 UI、原型迭代、界面设计','具体免费额度及资格以 Google 官方为准','描述智能硬件 App 首页，生成界面后尝试修改布局'],source:'https://blog.google/innovation-and-ai/models-and-research/google-labs/stitch-ai-ui-design/',visit:'https://stitch.google.com/'},
{name:'Napkin AI',brand:'NAPKIN',tag:'TEXT TO VISUALS',img:'/assets/napkin-ui.webp',url:'https://www.napkin.ai/assets/v5/hero/visual-poster.webp?v=1',desc:'把文字直接转换成流程图、关系图、信息图并支持编辑，适合产品汇报。本期推荐现成工具，不称为今日新品。',facts:['Windows / macOS 浏览器','文字生成图解、结构图、可视化内容','提供免费方案，限制和高级功能以官网为准','粘贴一段 PRD，生成流程图并手动校验连线'],source:'https://www.napkin.ai/',visit:'https://app.napkin.ai/'}];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const norm=s=>String(s).toLowerCase().replace(/[^a-z0-9\u3400-\u9fff]/g,'');
async function main(){
 fs.mkdirSync('src/assets',{recursive:true});
 for(const x of data){
 const res=await fetch(x.url,{headers:{'User-Agent':'Mozilla/5.0','Accept':'image/webp,image/*'},signal:AbortSignal.timeout(22000)});
 if(res.status!==200)throw Error('Official screenshot fetch failed '+x.name+' '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());
 if(bytes.length<12000||bytes.length>8000000||bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP')throw Error('Invalid WEBP '+x.name);
 fs.writeFileSync('src'+x.img,bytes);console.log('IMAGE VERIFIED',x.name,bytes.length);
 }
 let h=fs.readFileSync('src/index.html','utf8');
 const a=h.indexOf('<section class="section" id="try">'),b=h.indexOf('</section>',a);
 if(a<0||b<0)throw Error('Try section missing');
 let sec=h.slice(a,b+10),n=0;
 sec=sec.replace(/<article class="panel try-card">[\s\S]*?<\/article>/g,card=>{
 const x=data[n++];if(!x)throw Error('unexpected extra card');
 card=card.replace(/(<img[^>]*alt=")[^"]+/,(_,p)=>p+esc(x.name+' 官方真实产品截图'));
 card=card.replace(/(<img[^>]*src=")[^"]+/,(_,p)=>p+x.img);
 card=card.replace(/(<div class="try-image-fallback"><strong>)[^<]+/,(_,p)=>p+x.brand);
 card=card.replace(/(<div class="try-image-fallback"><strong>[^<]+<\/strong><span>)[^<]+/,(_,p)=>p+x.name);
 card=card.replace(/(<span class="try-credit">)[^<]+/,(_,p)=>p+x.brand+' · OFFICIAL SCREENSHOT');
 card=card.replace(/(<div class="try-topline"><span class="tag">)[^<]+/,(_,p)=>p+x.tag);
 card=card.replace(/(<h3>)[^<]+/,(_,p)=>p+x.name);
 card=card.replace(/(<p class="try-lead">)[^<]+/,(_,p)=>p+esc(x.desc));
 let k=0;card=card.replace(/(<div class="try-fact"><small>[^<]+<\/small><strong>)[^<]*(<\/strong>)/g,(_,p,q)=>p+esc(x.facts[k++])+q);
 if(k!==4)throw Error('Incorrect number of fact rows');
 card=card.replace(/(<a class="try-link" href=")[^"]+/,(_,p)=>p+x.source);
 card=card.replace(/(<a class="try-secondary" href=")[^"]+/,(_,p)=>p+x.visit);
 return card;
 });
 if(n!==2)throw Error('Expected 2 try cards');
 sec=sec.replace('两款新近发布、可以直接体验的工具','两款现成可体验工具 · 与下方新品列表不重复');
 h=h.slice(0,a)+sec+h.slice(b+10);
 // The NASA file includes black pillarboxes: enlarge full viewport background to crop them, as yesterday's photo naturally did.
 const css='.scene{position:fixed!important;inset:0!important;transform:scale(1.28);transform-origin:center center;pointer-events:none;background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;background-attachment:scroll!important}body.light .scene{background-size:cover!important;background-position:center!important;background-repeat:no-repeat!important;background-attachment:scroll!important}@media(max-width:700px){.scene{transform:scale(1.22)}}';
 if(!h.includes('</style>'))throw Error('Mother style absent');
 h=h.replace('</style>',css+'</style>');
 const m=h.match(/const items=(\[[\s\S]*?\]);const esc=/);if(!m)throw Error('Products missing');
 const items=JSON.parse(m[1]);if(items.length!==8)throw Error('unexpected items');
 const names=[...data.map(x=>x.name),...items.map(x=>x.name)].map(norm);
 if(new Set(names).size!==names.length)throw Error('Now Try and New Products duplicate');
 if(!h.includes('RICE：资源有限时')||!h.includes('calendar-lunar.js')||!h.includes('2026-11-20.html')||!h.includes('Asia/Shanghai'))throw Error('Old feature missing');
 for(const x of [...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean))new Function(x);
 fs.writeFileSync('src/index.html',h);
 console.log('PASS 2 DISTINCT TRY TOOLS, 8 PRODUCTS, RICE, FULL BLEED, ALL FEATURES');
}
main().catch(e=>{console.error(e);process.exit(1)});
