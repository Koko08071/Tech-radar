const fs=require('fs'),cp=require('child_process'),vm=require('vm');
const assets=[
{path:'/assets/2026-11-27-x500.jpg',original:'https://cn-exstatic-vivofs.iqoo.com/Br81IMbjh1IEtVmx/1789119308401/44cd7aaa01aa6918839869df273433a1.png',referer:'https://www.vivo.com.cn/',credit:'vivo official product page'},
{path:'/assets/2026-11-27-watch-gt2.png',original:'https://wwwstatic.vivo.com.cn/vivoportal/files/image/detail/20250925/1302b12af7c62dd673087aa13bc56fe0.png',referer:'https://www.vivo.com.cn/',credit:'vivo official product page'},
{path:'/assets/2026-11-27-iplay80h.jpg',original:'https://img2.quasarzone.com/editor/2026/11/27/9fb7c56648cbc40b819fc5449d28a81f.webp',referer:'https://quasarzone.com/recent/views/news/52207436',credit:'QuasarZone product photo'},
{path:'/assets/2026-11-27-datacanvas.jpg',original:'https://imgslim.geekpark.net/uploads/image/file/e3/55/e355ed02b7318071c5960157139cff94.jpeg',referer:'https://www.geekpark.net/',credit:'GeekPark event coverage'},
{path:'/assets/2026-11-27-spire2.jpg',original:'https://www.zj-humanoid.com/uploads/upload/images/20250329/f8ec310f809a95e7e5ec5fe18f2eb530.jpg',referer:'https://www.zj-humanoid.com/',credit:'Zhejiang Humanoid official site'},
{path:'/assets/2026-11-27-engineai-t800.png',original:'https://cn-engineai-1304599088.cos.ap-guangzhou.myqcloud.com/uploads/upload/images/20251208/0ac7c9164d5ffb5043caa2131cefa5d7.png',referer:'https://www.engineai.com.cn/product-t800.html',credit:'EngineAI official T800 product page'},
{path:'/assets/2026-11-27-service-blueprint.webp',original:'https://www.deeprobotics.cn/en/bocupload/2026/10/13/17919061588029ujpry.webp',referer:'https://www.deeprobotics.cn/en/index/industry.html',credit:'DEEP Robotics official Embodied AI for Energy Inspection image'},
{path:'/assets/2026-11-27-background-robotics.jpg',original:'https://images.pexels.com/photos/34207359/pexels-photo-34207359.jpeg?auto=compress&cs=tinysrgb&w=2400',referer:'https://www.pexels.com/',credit:'Pexels · Freek Wolsink'},
{path:'/assets/2026-11-27-openscad.png',original:'https://dl.flathub.org/media/org/openscad/OpenSCAD/eafb5ebab7b4a4abb0a8aa8e1b8524c5/screenshots/image-2_orig.png',referer:'https://flathub.org/',credit:'Flathub screenshot'},
{path:'/assets/2026-11-27-n8n.jpg',original:'https://europe1.discourse-cdn.com/n8n/original/3X/e/b/eb0f022e2e0b22a3110c3af9c21f47e7d5429a73.jpeg',referer:'https://community.n8n.io/',credit:'n8n Community screenshot'}
];
const ipAsset=assets.find(a=>a.path==='/assets/2026-11-27-iplay80h.jpg');
for(const pageUrl of ['https://www.alldocube.com/jp/products/iplay80h/','https://www.51cube.com/products/iplay80h/']){
 try{
  const page=cp.execFileSync('curl',['-fLsS','--connect-timeout','4','--max-time','10','-A','Mozilla/5.0','-e',new URL(pageUrl).origin+'/',pageUrl],{encoding:'utf8',maxBuffer:8*1024*1024});
  const tags=[...page.matchAll(/<img\b[^>]*>/gi)].map(m=>m[0]);
  const candidates=tags.map(tag=>{const src=(tag.match(/\b(?:src|data-src|data-lazy-src|data-original)=["']([^"']+)["']/i)||[])[1];const alt=(tag.match(/\balt=["']([^"']*)["']/i)||[])[1]||'';return{src,alt};}).filter(x=>x.src&&!/^data:/i.test(x.src));
  let chosen=candidates.find(x=>/iplay.?80h/i.test(x.alt+' '+x.src))?.src;
  if(!chosen){const metas=[...page.matchAll(/<meta\b[^>]*>/gi)].map(m=>m[0]);for(const tag of metas){if(/og:image|twitter:image/i.test(tag)){const c=(tag.match(/\bcontent=["']([^"']+)["']/i)||[])[1];if(c){chosen=c;break;}}}}
  if(chosen){ipAsset.original=new URL(chosen,pageUrl).href;ipAsset.referer=pageUrl;ipAsset.credit='ALLDOCUBE official product page';ipAsset.scrapedFrom=pageUrl;console.log('IPLAY_OFFICIAL_IMAGE '+ipAsset.original);break;}
  console.log('IPLAY_PAGE_NO_IMAGE '+pageUrl);
 }catch(e){console.log('IPLAY_PAGE_FETCH_MISS '+pageUrl);}
}
fs.mkdirSync('src/assets',{recursive:true});fs.mkdirSync('src/archive',{recursive:true});
for(const a of assets){let ok=false;for(const [url,ref] of [['https://tech-radar-daily.vercel.app'+a.path,null],[a.original,a.referer],[a.original,null]]){try{const args=['-fLsS','--connect-timeout','5','--max-time','12','-A','Mozilla/5.0'];if(ref)args.push('-e',ref);args.push('-o','src'+a.path,url);cp.execFileSync('curl',args,{stdio:'pipe'});const b=fs.readFileSync('src'+a.path);const valid=(b[0]===255&&b[1]===216)||b.subarray(0,8).toString('hex')==='89504e470d0a1a0a'||(b.toString('ascii',0,4)==='RIFF'&&b.toString('ascii',8,12)==='WEBP');if(b.length<8000||!valid)throw Error('Invalid image asset '+a.path+' bytes='+b.length);a.bytes=b.length;ok=true;console.log('IMAGE_OK '+a.path+' '+b.length);break;}catch(e){console.log('IMAGE_RETRY '+a.path+' '+(ref||'no-referer'));}}if(!ok){a.remoteFallback=true;try{fs.unlinkSync('src'+a.path)}catch{}console.log('IMAGE_REMOTE_FALLBACK '+a.path+' '+a.original);}}

const motionAsset={path:'/assets/2026-11-27-background-robotics.mp4',original:'https://videos.pexels.com/video-files/6450803/6450803-hd_1920_1080_25fps.mp4',source:'https://www.pexels.com/video/automated-car-factory-6450803/',credit:'Engin Altundağ / Pexels',duration:8};
const motionPath='src'+motionAsset.path;
cp.execFileSync('curl',['-fLsS','--connect-timeout','8','--max-time','60','--max-filesize','30000000','--retry','1','-A','Mozilla/5.0','-o',motionPath,motionAsset.original],{stdio:'pipe'});
const motionBytes=fs.readFileSync(motionPath);if(motionBytes.length<50000||motionBytes.toString('ascii',4,8)!=='ftyp')throw Error('Invalid background MP4');
motionAsset.bytes=motionBytes.length;fs.writeFileSync('src/assets/2026-11-27-video-source.json',JSON.stringify(motionAsset,null,2));console.log('VIDEO_OK '+motionAsset.path+' '+motionBytes.length);
let h=fs.readFileSync('nov27-final.html','utf8');for(const a of assets)if(a.remoteFallback)h=h.replaceAll(a.path,a.original);if(!h.includes('DAILY ISSUE · 2026.11.27 · FRIDAY')||!h.includes('2026-11-27-engineai-t800.png')||!h.includes('id="issue27-service-blueprint"')||!h.includes('issue27-section-head')||!h.includes('2026-11-27-service-blueprint.webp')||!h.includes('2026-11-27-background-robotics.jpg'))throw Error('Issue 27 content validation failed');
const scriptMatches=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];for(const m of scriptMatches)if(m[1].trim())new vm.Script(m[1]);
const itemMatch=scriptMatches.map(m=>m[1]).find(s=>s.includes('const items='));const parsed=JSON.parse(itemMatch.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);if(parsed.length!==6)throw Error('Expected six news items');if(!h.includes('OpenSCAD')||!h.includes('n8n')||!h.includes('SERVICE BLUEPRINT'))throw Error('Required daily modules missing');
fs.writeFileSync('src/index.html',h);fs.copyFileSync('nov26-final.html','src/archive/2026-11-26.html');
fs.writeFileSync('src/assets/2026-11-27-image-sources.json',JSON.stringify(assets,null,2));
console.log('NOV27 READY: six current items, two new tools, three insights, service blueprint, prior-day archive');