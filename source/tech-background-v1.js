const fs=require('fs'),vm=require('vm');const photo={"image":"https://images.pexels.com/photos/35139106/pexels-photo-35139106.jpeg?auto=compress&cs=tinysrgb&w=2400","page":"https://www.pexels.com/photo/abstract-blue-light-panels-ceiling-installation-35139106/","by":"Magda Ehlers","local":"/assets/background-2026-11-24-tech.jpg"};

async function main(){
 const p='src/index.html';let h=fs.readFileSync(p,'utf8');
 if(!h.includes('clear-blue-glass-v9')||!h.includes('daily-scenery-rotation'))throw Error('Current template missing');
 const r=await fetch(photo.image);if(!r.ok||!r.headers.get('content-type')?.startsWith('image/jpeg'))throw Error('Background unavailable '+r.status);
 const b=Buffer.from(await r.arrayBuffer());if(b.length<50000||b[0]!==255||b[1]!==216)throw Error('Bad image');
 fs.mkdirSync('src/assets',{recursive:true});fs.writeFileSync('src'+photo.local,b);
 h=h.replace(/<script id="daily-scenery-rotation">[\s\S]*?<\/script>/,'');
 h=h.replace(/<style id="daily-scenery-style">([\s\S]*?)<\/style>/,(m,css)=>'<style id="daily-scenery-style">'+css.replace(/--daily-scenery-photo:url\("[^"]+"\)/,'--daily-scenery-photo:url("'+photo.local+'")')+'</style>');
 h=h.replace(/<a id="daily-scenery-credit"[^>]*>[\s\S]*?<\/a>/,'<a id="daily-scenery-credit" href="'+photo.page+'" target="_blank" rel="noopener noreferrer">摄影：'+photo.by+' · Pexels</a>');
 const css='html body:not(.light) .scene{background:linear-gradient(180deg,rgba(3,12,29,.43),rgba(3,10,25,.51) 60%,rgba(3,11,25,.68)),var(--daily-scenery-photo) center center/cover fixed no-repeat!important}html body.light .scene{background:linear-gradient(180deg,rgba(235,245,255,.64),rgba(237,247,255,.73)),var(--daily-scenery-photo) center center/cover fixed no-repeat!important}@media(max-width:720px){html body .scene{background-attachment:scroll!important}}';
 h=h.replace('</head>','<style id="tech-background-daily-v1">'+css+'</style></head>');
 for(const m of h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(m[1].trim())new vm.Script(m[1]);}
 if(!h.includes(photo.local)||h.includes('id="daily-scenery-rotation"'))throw Error('Background replacement failed');
 fs.writeFileSync(p,h);console.log('TECH BACKGROUND READY',photo.by,b.length);
}
main().catch(e=>{console.error(e);process.exit(1)});
