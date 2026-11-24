
const fs=require("node:fs");
const source="https://commons.wikimedia.org/wiki/Special:FilePath/Fogg_behavior_model.svg?width=512";
const file="src/assets/fogg-goodmanguy-2017.png";
const commons="https://commons.wikimedia.org/wiki/File:Fogg_behavior_model.svg";
(async()=>{
 const response=await fetch(source,{headers:{"User-Agent":"Mozilla/5.0","Accept":"image/png,image/*;q=0.8"},signal:AbortSignal.timeout(35000)});
 const mime=response.headers.get("content-type")||"";
 if(response.status!==200||!mime.includes("image/png"))throw Error("Published Wikimedia image failed "+response.status+" "+mime);
 const img=Buffer.from(await response.arrayBuffer());
 const png=Buffer.from([137,80,78,71,13,10,26,10]);
 if(img.length<20000||img.length>3000000||!img.subarray(0,8).equals(png))throw Error("Invalid Commons image "+img.length);
 const w=img.readUInt32BE(16),hh=img.readUInt32BE(20);
 if(w<480||hh<320)throw Error("Unexpected low resolution "+w+"x"+hh);
 fs.mkdirSync("src/assets",{recursive:true});fs.writeFileSync(file,img);
 let html=fs.readFileSync("src/index.html","utf8");
 const original=/<div class="fogg-diagram-graphic">[\s\S]*?<\/div>\s*(?=<div class="fogg-diagram-guide">)/;
 if(!original.test(html))throw Error("Redrawn graphic block not found");
 const graphic='<div class="fogg-diagram-graphic fogg-authentic-graphic"><img class="fogg-published-image" src="/assets/fogg-goodmanguy-2017.png" width="'+w+'" height="'+hh+'" alt="Goodmanguy 2017年真实已发表的 Fogg Behavior Model 图示，采用已授权原图而非 AI 生成图片" loading="lazy" decoding="async" onerror="this.hidden=true;this.nextElementSibling.hidden=false"/><span class="fogg-authentic-fallback" hidden>图片暂不可用 · <a href="'+commons+'" target="_blank" rel="noopener noreferrer">查看原始授权图稿</a></span></div>';
 html=html.replace(original,graphic);
 const oldCaption=/<figcaption>依据 BJ Fogg 经典行为模型重新绘制的解释图（非官方原图）。[\s\S]*?<\/figcaption>/;
 if(!oldCaption.test(html))throw Error("Old redraw source caption missing");
 const attribution='<figcaption>真实出版图示（非AI生成）：<a href="'+commons+'" target="_blank" rel="noopener noreferrer">Goodmanguy · Wikimedia Commons（2017）</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a>；原图未改动，非斯坦福官方原图。理论依据：<a href="https://behaviordesign.stanford.edu/resources/fogg-behavior-model" target="_blank" rel="noopener noreferrer">Stanford Behavior Design Lab</a>。</figcaption>';
 html=html.replace(oldCaption,attribution);
 if(!html.includes("</head>"))throw Error("HTML head missing");
 html=html.replace("</head>",'<link rel="stylesheet" href="/licensed-fogg.css"/></head>');
 const figure=html.slice(html.indexOf('<figure class="fogg-diagram"'),html.indexOf('</figure>',html.indexOf('<figure class="fogg-diagram"'))+9);
 if(figure.includes('<svg')||!figure.includes("fogg-published-image")||!figure.includes("CC BY-SA"))throw Error("Original AI-like plot not fully replaced");
 for(const key of ['id="try"','id="radar"','id="insight"','id="academy"','id="archive"','id="ambient-play"','calendar-lunar.js','news-toolbar'])if(!html.includes(key))throw Error("Mother feature lost: "+key);
 for(const [i,s] of [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean).entries())try{new Function(s)}catch(e){throw Error("Inline JS "+i+": "+e.message)}
 fs.writeFileSync("src/index.html",html);
 fs.copyFileSync("licensed-fogg.css","src/licensed-fogg.css");
 console.log("REAL HISTORIC ARTWORK INSTALLED",w,hh,img.length,"bytes Goodmanguy CC BY-SA 4.0",commons);
})().catch(e=>{console.error(e);process.exit(1)});
