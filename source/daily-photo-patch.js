"use strict";
const fs = require("fs");
const path = require("path");
const photos = __PHOTOS__;
const fallback = photos[0].image;
const style = [
'<style id="daily-scenery-style">',
':root{--daily-scenery-photo:url("'+fallback+'")}',
'body:not(.light) .scene{background:linear-gradient(180deg,rgba(4,13,30,.40),rgba(4,13,30,.53) 60%,rgba(4,11,23,.68)),var(--daily-scenery-photo) center center/cover fixed no-repeat!important;filter:none!important}',
'body.light .scene{background:linear-gradient(180deg,rgba(243,249,255,.50),rgba(241,248,254,.67) 62%,rgba(241,248,254,.75)),var(--daily-scenery-photo) center center/cover fixed no-repeat!important;filter:none!important}',
'@media(max-width:720px){body:not(.light) .scene,body.light .scene{background-attachment:scroll!important;background-position:center center!important}}',
'</style>'
].join("\n");
const runtime = String.raw`(function(){
"use strict";
var photos = __PHOTOS__;
var previousDay = "";
function getDate(){
  var match = location.pathname.match(/\/archive\/(\d{4})-(\d{2})-(\d{2})\.html/);
  if(match) return match[1]+"-"+match[2]+"-"+match[3];
  var parts = new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Shanghai",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date());
  var obj = {}; parts.forEach(function(p){obj[p.type]=p.value;});
  return obj.year+"-"+obj.month+"-"+obj.day;
}
function update(){
  var date = getDate(); if(previousDay===date)return; previousDay=date;
  var bits=date.split("-").map(Number);
  var delta=Math.floor(Date.UTC(bits[0],bits[1]-1,bits[2])/86400000)-Math.floor(Date.UTC(2026,10,23)/86400000);
  var ix=((delta%photos.length)+photos.length)%photos.length;
  var p=photos[ix];
  var preload=new Image();
  preload.onload=function(){document.documentElement.style.setProperty("--daily-scenery-photo",'url("'+p.image+'")');};
  preload.onerror=function(){document.documentElement.style.setProperty("--daily-scenery-photo",'url("'+photos[0].image+'")');};
  preload.src=p.image;
  var credit=document.getElementById("daily-scenery-credit");
  if(credit){credit.href=p.page; credit.textContent="摄影："+p.by+" · Pexels"; credit.title="查看原始摄影作品与版权许可";}
}
update();
setInterval(update,60000);
})();`;
const script = '<script id="daily-scenery-rotation">'+runtime.replace(/[{"image":"https://images.pexels.com/photos/39918896/pexels-photo-39918896.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/spectacular-ocean-sunset-with-dramatic-clouds-39918896/","by":"Oleksiy Yeshtokyn"},{"image":"https://images.pexels.com/photos/39898794/pexels-photo-39898794.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/stunning-coastal-cliff-with-turquoise-waves-39898794/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/40341864/pexels-photo-40341864.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/breathtaking-ocean-sunset-with-dramatic-clouds-40341864/","by":"Hkn clk"},{"image":"https://images.pexels.com/photos/37190343/pexels-photo-37190343.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/aerial-view-of-turquoise-ocean-waves-and-rocky-coastline-37190343/","by":"Hobi Photography"},{"image":"https://images.pexels.com/photos/39898986/pexels-photo-39898986.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/stunning-ocean-sunset-with-reflective-waters-39898986/","by":"Emre Ayata"},{"image":"https://images.pexels.com/photos/38003826/pexels-photo-38003826.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/scenic-mediterranean-coastal-landscape-38003826/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/36999616/pexels-photo-36999616.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/tranquil-ocean-and-sky-with-whispy-clouds-36999616/","by":"Marianna Sigov"},{"image":"https://images.pexels.com/photos/40649708/pexels-photo-40649708.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/rocky-coastline-with-turquoise-ocean-view-40649708/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/39918895/pexels-photo-39918895.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/stunning-ocean-sunset-with-dramatic-clouds-39918895/","by":"Oleksiy Yeshtokyn"},{"image":"https://images.pexels.com/photos/35642659/pexels-photo-35642659.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/aerial-view-of-tropical-island-and-blue-ocean-35642659/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/35432861/pexels-photo-35432861.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/vivid-ocean-sunset-with-dramatic-clouds-35432861/","by":"Oleksiy"},{"image":"https://images.pexels.com/photos/39816871/pexels-photo-39816871.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/scenic-coastal-view-of-turquoise-ocean-and-cliffs-39816871/","by":"Leandra FF"},{"image":"https://images.pexels.com/photos/36618489/pexels-photo-36618489.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/dramatic-ocean-sunset-with-clouds-and-sun-rays-36618489/","by":"Nothing Ahead"},{"image":"https://images.pexels.com/photos/35642724/pexels-photo-35642724.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/aerial-view-of-coastal-island-and-ocean-35642724/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/37374352/pexels-photo-37374352.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/scenic-rocky-coastline-with-turquoise-sea-37374352/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/35784625/pexels-photo-35784625.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/serene-tropical-shoreline-with-turquoise-water-35784625/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/37050375/pexels-photo-37050375.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/scenic-rocky-coastline-with-turquoise-waters-37050375/","by":"Pexels 摄影作者"},{"image":"https://images.pexels.com/photos/40486745/pexels-photo-40486745.jpeg?auto=compress&cs=tinysrgb&w=1920","page":"https://www.pexels.com/photo/scenic-cliffside-with-clear-ocean-view-40486745/","by":"Pexels 摄影作者"}]/g,JSON.stringify(photos))+'</script>';
const root = "src";
const targets = [path.join(root,"index.html")];
const arch=path.join(root,"archive");
if(fs.existsSync(arch))for(const name of fs.readdirSync(arch))if(/\.html$/i.test(name))targets.push(path.join(arch,name));
var n=0;
for(const filename of targets){
  if(!fs.existsSync(filename))continue;
  var html=fs.readFileSync(filename,"utf8");
  if(html.includes('id="daily-scenery-rotation"'))continue;
  if(!html.includes("</head>")||!html.includes("</body>"))throw new Error("Invalid generated HTML: "+filename);
  html=html.replace(/当前背景：<a[^>]*>[^<]*<\/a>（今日选用的真实历史天文摄影，不冒充11月23日新发布）。/g,'当前背景：<a id="daily-scenery-credit" href="'+photos[0].page+'" target="_blank" rel="noopener noreferrer">摄影师真实风光作品 · Pexels</a>。');
  html=html.replace("</head>",style+"</head>");
  html=html.replace("</body>",script+"</body>");
  fs.writeFileSync(filename,html,"utf8");n++;
}
if(!n)throw new Error("No HTML pages patched");
console.log("DAILY REAL PHOTOGRAPHY READY; "+n+" pages; "+photos.length+" verified photographs; Asia/Shanghai date-based rotation");
