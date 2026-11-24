
const fs=require('node:fs');
let html=fs.readFileSync('src/index.html','utf8');
const css=fs.readFileSync('glass-ui.css','utf8');
if(!html.includes('</style>'))throw Error('Original styles missing');
let count=0;
html=html.replace(/<div class="try-visual"><img([^>]*\bsrc="([^"]+)"[^>]*)>/g,(whole,attrs,src)=>{
  if(!/^\/assets\/[a-z0-9.-]+$/i.test(src))throw Error('Non-local screenshot '+src);
  count++;
  return '<div class="try-visual" style="--preview-image:url(\''+src+'\')"><img'+attrs+'>';
});
if(count!==2)throw Error('Expected exactly 2 image cards, found '+count);
html=html.replace('</style>',css+'</style>');
for(const x of ['Tech Insights','Product Thinking','RICE：资源有限时','calendar-lunar.js','/archive/2026-11-20.html','Asia/Shanghai','id="time"'])if(!html.includes(x))throw Error('Lost module '+x);
const products=JSON.parse(html.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
const names=[...html.matchAll(/<article class="panel try-card">[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(m=>m[1]);
if(products.length!==8||names.length!==2||names.some(x=>products.some(y=>y.name===x)))throw Error('Duplicate or missing products');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
scripts.forEach((code,i)=>{try{new Function(code)}catch(e){throw Error('Invalid JS '+i+': '+e.message)}});
fs.writeFileSync('src/index.html',html);
fs.mkdirSync('src/styles',{recursive:true});fs.writeFileSync('src/styles/glass-ui.css',css);
console.log('GLASS UI VALID:',count,'image cards,',products.length,'products,',scripts.length,'JS scripts,',css.length,'CSS chars');
