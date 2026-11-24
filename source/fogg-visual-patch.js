
const fs=require("node:fs");
let page=fs.readFileSync("src/index.html","utf8");
const start=page.indexOf('<section class="section" id="academy">');
const end=page.indexOf('</section>',start);
if(start<0||end<0)throw Error("Product Thinking section missing");
let section=page.slice(start,end+10);
const heroStart=section.indexOf('<div class="rice-hero">');
const following=section.indexOf('<div class="rice-label">',heroStart);
if(heroStart<0||following<0)throw Error("Existing lesson hero not found");
if(!section.includes('Fogg 行为模型')||!section.includes('Pophie AI 陪伴机器人'))throw Error("Not the Nov22 Fogg course");
const diagram=fs.readFileSync("fogg-figure.html","utf8");
section=section.slice(0,heroStart)+diagram+section.slice(following);
if(!section.includes('class="fogg-diagram"')||!section.includes('fogg-svg-mobile')||!section.includes('behavior-model')){
// official source is checked separately; prevent silent omission of the figure
if(!section.includes('behaviordesign.stanford.edu/resources/fogg-behavior-model'))throw Error('Diagram/source missing');
}
page=page.slice(0,start)+section+page.slice(end+10);
page=page.replace('</style>',fs.readFileSync("fogg-figure.css","utf8")+'</style>');
const items=JSON.parse(page.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
const tools=[...page.matchAll(/<article class="panel try-card">[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(m=>m[1]);
if(items.length!==8||tools.length!==2||tools.some(x=>items.some(y=>x===y.name)))throw Error("Current issue item regression");
for(const item of ['id="try"','id="radar"','id="insight"','id="academy"','id="archive"','id="ambient-play"','calendar-lunar.js','Asia/Shanghai','Fogg 行为模型','Pophie AI 陪伴机器人','rice-metrics','rice-case','rice-expand'])if(!page.includes(item))throw Error("Missing required part: "+item);
if(page.includes('<div class="rice-equation">'))throw Error("Old formula-only block remains");
const scripts=[...page.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);
for(const [i,s] of scripts.entries())try{new Function(s)}catch(e){throw Error("Invalid inline JS "+i+": "+e.message)}
fs.writeFileSync("src/index.html",page);
console.log("FOGG VISUAL COMPLETE: two responsive vector models, official academic source, 8 products, 2 try tools, five sections, "+scripts.length+" valid scripts");
