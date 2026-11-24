
const fs=require("node:fs");
let html=fs.readFileSync("src/index.html","utf8");
const lesson=fs.readFileSync("rice-lesson.html","utf8");
const css=fs.readFileSync("lesson-compact.css","utf8");
const section=/<section class="section" id="academy">[\s\S]*?<\/section>/;
if(!section.test(html)||!html.includes("class=\"ambient-play\""))throw Error("Expected live mother template not found");
html=html.replace(section,lesson);
if(!html.includes("</style>"))throw Error("Original inline styles missing");
html=html.replace("</style>",css+"</style>");
const news=JSON.parse(html.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
const tools=[...html.matchAll(/<article class="panel try-card">[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x=>x[1]);
if(news.length!==8||tools.length!==2||tools.some(x=>news.some(y=>y.name===x)))throw Error("Product item regression");
for(const token of ['id="academy"','rice-example-list','RICE','Connectors','Schedules','Skills','id="ambient-play"','calendar-lunar.js','Asia/Shanghai','id="archive"','/archive/2026-11-20.html','id="time"']){
if(!html.includes(token))throw Error("Missing essential module "+token);
}
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const [i,s] of scripts.entries()){try{new Function(s)}catch(e){throw Error("Script "+i+" invalid "+e.message)}}
fs.writeFileSync("src/index.html",html);
console.log("RICE READABILITY + PET SIZE CHECKED",news.length,"products",tools.length,"tools",scripts.length,"scripts");
