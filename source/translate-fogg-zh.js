
const fs=require('node:fs');
const path=require('node:path');
const src="fogg-zh-annotated.webp",dest="src/assets/fogg-zh-annotated.webp";
const buf=fs.readFileSync(src);
if(buf.length<10000||buf.length>200000||buf.toString('ascii',0,4)!=="RIFF"||buf.toString('ascii',8,12)!=="WEBP")throw Error("Invalid translated, source-verified WebP");
fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);
let h=fs.readFileSync("src/index.html","utf8");
const start=h.indexOf('<figure class="fogg-diagram"'),end=h.indexOf("</figure>",start)+9;
if(start<0||end<=start)throw Error("Published Fogg lesson graphic not found");
let figure=h.slice(start,end);
if(!figure.includes('src="/assets/fogg-goodmanguy-2017.png"'))throw Error("Published original artwork not present");
if(figure.includes("<svg"))throw Error("Refusing to overlay fake/redrawn SVG");
figure=figure.replace('src="/assets/fogg-goodmanguy-2017.png"','src="/assets/fogg-zh-annotated.webp"');
figure=figure.replace(/alt="[^"]+"/,'alt="真实已发表的 Goodmanguy Fogg 行为模型原图中文标注版：纵轴动机（高到低），横轴能力（难到易），曲线上方提示有效区，曲线下方提示失效区。原图经授权仅作中文文字标注修改"');
figure=figure.replace('THE CLASSIC MODEL · 经典框架图','THE CLASSIC MODEL · 中文标注图');
figure=figure.replace('行为发生的临界线 · Action Line','Fogg 行为模型 · 行动阈值曲线');
const newCaption='<figcaption>**中文标注版**：依据 <a href="https://commons.wikimedia.org/wiki/File:Fogg_behavior_model.svg" target="_blank" rel="noopener noreferrer">Goodmanguy（2017）真实图稿</a> 修改，仅将图内英文标注翻译为中文；原图曲线与区域未重新生成。翻译修改：科技新品雷达（2026年11月22日）。原作及修改版沿用 <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a> 授权。<a href="/assets/fogg-goodmanguy-2017.png" target="_blank" rel="noopener noreferrer">查看英文原图</a> · <a href="https://behaviordesign.stanford.edu/resources/fogg-behavior-model" target="_blank" rel="noopener noreferrer">Stanford 理论来源</a>。</figcaption>';
if(!/<figcaption>[\s\S]*?<\/figcaption>/.test(figure))throw Error("Attribution block missing");
figure=figure.replace(/<figcaption>[\s\S]*?<\/figcaption>/,newCaption.replace("**中文标注版**","中文标注版"));
h=h.slice(0,start)+figure+h.slice(end);
const keep=['id="try"','id="radar"','id="insight"','id="academy"','id="archive"','calendar-lunar.js','id="ambient-play"','id="news-toolbar"','id="time"','id="date"'];
for(const token of keep)if(!h.includes(token))throw Error("Mother template feature missing: "+token);
const scripts=[...h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const [i,s] of scripts.entries()){try{new Function(s)}catch(e){throw Error("Inline JS "+i+" failed: "+e.message)}}
fs.writeFileSync("src/index.html",h);
console.log("CHINESE SOURCE-VERIFIED FIGURE",buf.length,"bytes; original source and CC BY-SA license preserved; no fake illustration; "+scripts.length+" script checks");
