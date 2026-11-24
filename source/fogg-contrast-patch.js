
const fs=require("node:fs");
const file="src/index.html";
let h=fs.readFileSync(file,"utf8");
if(!h.includes('class="fogg-diagram"')||!h.includes('class="fogg-svg fogg-svg-mobile"'))throw Error("Fogg figure not installed");
const css=fs.readFileSync("fogg-contrast.css","utf8");
if(!h.includes('</style>'))throw Error("Missing master stylesheet");
h=h.replace("</style>",css+"</style>");
if(!h.includes('body.light #academy .fogg-svg [fill="#76ebd1"]'))throw Error("Contrast CSS not applied");
fs.writeFileSync(file,h);
console.log("FOGG COLOR/TABLET QA CSS ADDED",css.length);
