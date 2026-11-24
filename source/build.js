
const fs=require('fs'),cp=require('child_process');
for(const f of ['restore-daily.js','finalize.js','patch-images-lesson.js','mime-fix.js','dedupe-wallpaper.js','glass-ui.js','radar-mini.js'])cp.execFileSync('node',[f],{stdio:'inherit',timeout:120000});
let html=fs.readFileSync('src/index.html','utf8');
const aside=fs.readFileSync('hop.html','utf8');
const a=html.indexOf('<aside class="radar-mini"');
const b=html.indexOf('</aside>',a);
if(a<0||b<0)throw Error('Radar area missing');
html=html.slice(0,a)+aside+html.slice(b+8);
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
let removed=0;
for(const m of scripts){if(m[0].includes('radar-mini-status')&&m[0].includes('data-filter')){html=html.replace(m[0],'');removed++}}
if(removed!==1)throw Error('Old radar behavior not removed: '+removed);
html=html.replace('</head>','<link rel="stylesheet" href="/site-polish.css"/></head>');
html=html.replace('</body>','<script src="/polish.js" defer></script><script src="/hop.js" defer></script></body>');
for(const v of ['id="hop-canvas"','id="products"','calendar-lunar.js','id="academy"','id="archive"','Asia/Shanghai'])if(!html.includes(v))throw Error('Required module missing '+v);
const product=JSON.parse(html.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);if(product.length!==8)throw Error('Product list changed');
const blocks=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const s of blocks)new Function(s);
for(const fname of ['site-polish.css','polish.js','hop.js'])fs.copyFileSync(fname,'src/'+fname);
fs.writeFileSync('src/index.html',html);
(async()=>{const r=await fetch('https://tech-radar-daily.vercel.app/calendar-lunar.js',{signal:AbortSignal.timeout(25000)});if(!r.ok)throw Error('Calendar fetch '+r.status);let s=await r.text();if(s.length<20000)throw Error('Calendar too small');fs.writeFileSync('src/calendar-lunar.js',s);console.log('Validated',product.length,'products,',blocks.length,'inline scripts, game and editorial design')})().catch(e=>{console.error(e);process.exit(1)});
