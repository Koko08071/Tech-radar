const fs=require('fs'),cp=require('child_process'),vm=require('vm');
const assets=[
{path:'/assets/2026-11-27-x500.jpg',original:'https://akurat.sgp1.cdn.digitaloceanspaces.com/images/20260923-16946416434-0-img-20260923-wa0015.jpg',credit:'Akurat media image'},
{path:'/assets/2026-11-27-watch-gt2.png',original:'https://wwwstatic.vivo.com.cn/vivoportal/files/image/detail/20250925/1302b12af7c62dd673087aa13bc56fe0.png',credit:'vivo official product page'},
{path:'/assets/2026-11-27-iplay80h.jpg',original:'https://img2.quasarzone.com/editor/2026/11/27/9fb7c56648cbc40b819fc5449d28a81f.webp',credit:'QuasarZone product photo'},
{path:'/assets/2026-11-27-datacanvas.jpg',original:'https://imgslim.geekpark.net/uploads/image/file/e3/55/e355ed02b7318071c5960157139cff94.jpeg',credit:'GeekPark event coverage'},
{path:'/assets/2026-11-27-spire2.jpg',original:'https://www.zj-humanoid.com/uploads/upload/images/20250329/f8ec310f809a95e7e5ec5fe18f2eb530.jpg',credit:'Zhejiang Humanoid official site'},
{path:'/assets/2026-11-27-engineai.jpg',original:'https://en-engineai-1304599088.cos.ap-guangzhou.myqcloud.com/static/home/images/tuprimfw1.jpg',credit:'EngineAI official product page'},
{path:'/assets/2026-11-27-background-robotics.jpg',original:'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&w=2400',credit:'Pexels · Freek Wolsink'},
{path:'/assets/2026-11-27-openscad.png',original:'https://dl.flathub.org/media/org/openscad/OpenSCAD/eafb5ebab7b4a4abb0a8aa8e1b8524c5/screenshots/image-2_orig.png',credit:'Flathub screenshot'},
{path:'/assets/2026-11-27-n8n.jpg',original:'https://europe1.discourse-cdn.com/n8n/original/3X/e/b/eb0f022e2e0b22a3110c3af9c21f47e7d5429a73.jpeg',credit:'n8n Community screenshot'}
];
fs.mkdirSync('src/assets',{recursive:true});fs.mkdirSync('src/archive',{recursive:true});
for(const a of assets){cp.execFileSync('curl',['-fLsS','--retry','2','--max-time','35','-A','Mozilla/5.0','-o','src'+a.path,a.original]);const b=fs.readFileSync('src'+a.path);const valid=(b[0]===255&&b[1]===216)||b.subarray(0,8).toString('hex')==='89504e470d0a1a0a'||(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP');if(b.length<8000||!valid)throw Error('Invalid image asset '+a.path+' bytes='+b.length);a.bytes=b.length;console.log('IMAGE_OK '+a.path+' '+b.length)}
const h=fs.readFileSync('nov27-final.html','utf8');if(!h.includes('DAILY ISSUE · 2026.11.27 · FRIDAY')||!h.includes('id="issue27-service-blueprint"')||!h.includes('2026-11-27-background-robotics.jpg'))throw Error('Issue 27 content validation failed');
const scriptMatches=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];for(const m of scriptMatches)if(m[1].trim())new vm.Script(m[1]);
const itemMatch=scriptMatches.map(m=>m[1]).find(s=>s.includes('const items='));const parsed=JSON.parse(itemMatch.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);if(parsed.length!==6)throw Error('Expected six news items');if(!h.includes('OpenSCAD')||!h.includes('n8n')||!h.includes('SERVICE BLUEPRINT'))throw Error('Required daily modules missing');
fs.copyFileSync('nov27-final.html','src/index.html');fs.copyFileSync('nov26-final.html','src/archive/2026-11-26.html');
fs.writeFileSync('src/assets/2026-11-27-image-sources.json',JSON.stringify(assets,null,2));
console.log('NOV27 READY: six current items, two new tools, three insights, service blueprint, prior-day archive');