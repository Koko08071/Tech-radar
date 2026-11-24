
const fs=require("node:fs");
const p="src/archive/2026-11-19.html";
let html=fs.readFileSync(p,"utf8");
const old='onerror="this.style.display=\x27none\x27"';
const count=html.split(old).length-1;
if(count!==1)throw Error("Expected exactly one historical inline quote bug, got "+count);
html=html.replace(old,'onerror="this.remove()"');
const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(let i=0;i<scripts.length;i++){try{new Function(scripts[i])}catch(e){throw Error("Historic Nov19 script invalid "+i+": "+e.message)}}
if(html.includes("<iframe")||!html.includes("ARCHIVE · 2026.11.19")||!html.includes('href="/"'))throw Error("Historical shell guard failed");
fs.writeFileSync(p,html);
console.log("NOVEMBER 19 ARCHIVE SCRIPT FIXED",count,"broken handler,",scripts.length,"validated scripts");
