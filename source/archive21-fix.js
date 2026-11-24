
const fs=require('node:fs');
const page='src/archive/2026-11-21.html';
if(!fs.existsSync(page))throw Error('Nov21 full archive missing');
let html=fs.readFileSync(page,'utf8');
if(html.length<50000||!html.includes('<title>')||!html.includes('2026.11.21'))throw Error('Nov21 archive invalid');
if(html.includes('<iframe'))throw Error('Archive must not be iframe');
if(html.includes('class="archive-latest"')){console.log('Archive21 nav already exists');process.exit(0)}
const css='<style id="archive-return-css">.archive-latest{position:fixed;z-index:9999;right:18px;bottom:18px;border-radius:100px;padding:11px 17px;display:inline-flex;align-items:center;gap:8px;color:#eff7ff!important;background:rgba(10,29,53,.89);box-shadow:0 8px 30px rgba(5,14,33,.2);border:1px solid rgba(180,216,251,.35);font:700 13px "Segoe UI","Microsoft YaHei",sans-serif;text-decoration:none!important;backdrop-filter:blur(18px)}.archive-latest:hover{background:rgba(36,66,106,.95)}body.light .archive-latest{background:rgba(249,252,255,.96);color:#234765!important;border-color:rgba(73,123,166,.22)}</style>';
const script='<script id="archive-refresh-latest">(function(){try{history.scrollRestoration="manual";var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload")location.replace("/");}catch(e){}})();</script>';
if(!html.includes('</head>'))throw Error('Archive21 head missing');
html=html.replace('</head>',css+script+'</head>');
html=html.replace(/<body([^>]*)>/i,m=>m+'<a href="/" class="archive-latest" aria-label="返回科技新品雷达最新一期">✦ 最新一期</a>');
if(!html.includes('class="archive-latest"')||!html.includes('location.replace("/")'))throw Error('Archive nav patch failed');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const [i,s] of scripts.entries())try{new Function(s)}catch(e){throw Error('Nov21 syntax '+i+':'+e.message)}
fs.writeFileSync(page,html);
console.log('ARCHIVE NOV21 fixed: full report, latest link, reload redirects home',html.length);
