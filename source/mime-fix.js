
const fs=require("node:fs");
const path=require("node:path");
const variants={"lumo.png":"lumo.webp","suno.jpg":"suno.avif","makera.png":"makera.webp"};
let html=fs.readFileSync("src/index.html","utf8");
for(const [oldName,newName] of Object.entries(variants)){
 const from=path.join("src/assets",oldName),to=path.join("src/assets",newName);
 if(!fs.existsSync(from))throw new Error("Missing original "+from);
 fs.renameSync(from,to);html=html.replaceAll("/assets/"+oldName,"/assets/"+newName);
}
if(!html.includes('Suno Visuals 官方图片'))throw new Error('Suno try card unexpectedly changed');
const target=/(<div class="try-visual"><img[^>]*alt="Suno Visuals 官方图片"[^>]*src=")[^"]+(")/;
if(!target.test(html))throw new Error('Cannot find Suno card image');
html=html.replace(target,'$1/assets/suno.avif$2');
if(!html.includes('/assets/suno.avif'))throw new Error('Suno local file URL missing');
const support='<p class="lesson-lead"><small>方法原始资料：<a href="https://www.intercom.com/blog/rice-simple-prioritization-for-product-managers" target="_blank" rel="noopener">Intercom · RICE Prioritization ↗</a></small></p>';
const end='</article></section>';
const a=html.indexOf('<section class="section" id="academy">');
const b=html.indexOf(end,a);
if(a<0||b<0)throw new Error('Lesson closing section missing');
html=html.slice(0,b)+support+html.slice(b);
const body=html.slice(a,html.indexOf('</section>',a));
if(!body.includes('Intercom · RICE Prioritization'))throw new Error('Missing authoritative source in lesson');
const items=JSON.parse(html.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
if(items.length!==8)throw new Error('Incorrect product count');
for(const it of items)if(!it.image||!it.image.startsWith('/assets/')||!fs.existsSync('src'+it.image))throw new Error('Image absent '+it.name);
const localCards=[...html.matchAll(/<div class="try-visual"><img[^>]*src="([^"]+)"/g)].map(m=>m[1]);
if(localCards.length!==2||localCards.some(p=>!p.startsWith('/assets/')))throw new Error('Now Try images not both local: '+JSON.stringify(localCards));
const sc=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
sc.forEach((s,i)=>{try{new Function(s)}catch(e){throw Error('Inline JS '+i+' invalid '+e.message)}});
fs.writeFileSync("src/index.html",html);
console.log('VERIFIED: 8 products and 2 try cards with local official images, RICE lesson with source, '+sc.length+' valid scripts');
