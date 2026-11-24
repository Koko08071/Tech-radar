
"use strict";
const fs=require("fs");
const path="src/index.html";
let html=fs.readFileSync(path,"utf8");
function replaceOnce(before,after){
 const at=html.indexOf(before);
 if(at<0||html.indexOf(before,at+before.length)>=0)throw Error("Adjacent calendar source changed: "+before.slice(0,100));
 html=html.slice(0,at)+after+html.slice(at+before.length);
}
const appendAdjacent = [
'function appendAdjacentDay(ay,am,ad){',
' var key=iso(ay,am,ad),l=lunar(ay,am,ad),ev=events[key],term=solarTermFor(key),festival=festivalFor(key,l)||fixedFestivalFor(key);',
' var weekday=new Date(Date.UTC(ay,am-1,ad)).getUTCDay();',
' var btn=document.createElement("button");btn.type="button";btn.className="cal-day is-adjacent";',
' if(weekday===0||weekday===6)btn.classList.add("is-weekend");',
' if(ev)btn.classList.add(ev.type==="holiday"?"is-holiday":"is-work");',
' if(term)btn.classList.add("is-solar-term");if(festival)btn.classList.add("is-traditional-festival");',
' btn.dataset.date=key;',
' btn.setAttribute("aria-label",ay+"年"+am+"月"+ad+"日 · 相邻月份"+(festival?" "+festival:"")+(ev?" "+ev.name:""));',
' btn.setAttribute("aria-pressed","false");',
' var num=document.createElement("span");num.className="cal-num";num.textContent=ad;',
' var sub=document.createElement("span");sub.className="cal-lunar";sub.textContent=calendarLabel(key,l);',
' btn.append(num,sub);',
' if(ev){var flag=document.createElement("span");flag.className="cal-flag";flag.textContent=ev.type==="holiday"?"假":"班";btn.appendChild(flag);}',
' grid.appendChild(btn);',
'}',
''
].join("\n");
replaceOnce('function renderMonth(){',appendAdjacent+'function renderMonth(){');
replaceOnce('for(var i=0;i<begin;i++){var blank=document.createElement("span");blank.className="cal-empty";blank.setAttribute("aria-hidden","true");grid.appendChild(blank);}',
 'for(var i=0;i<begin;i++){var p=new Date(Date.UTC(year,month-1,1-begin+i));appendAdjacentDay(p.getUTCFullYear(),p.getUTCMonth()+1,p.getUTCDate());}');
replaceOnce(' prev.disabled=false;next.disabled=false;',
 ' var tail=(7-(begin+count)%7)%7;if(begin+count+tail<35)tail+=7;\n for(var i=1;i<=tail;i++){var p=new Date(Date.UTC(year,month-1,count+i));appendAdjacentDay(p.getUTCFullYear(),p.getUTCMonth()+1,p.getUTCDate());}\n prev.disabled=false;next.disabled=false;');
replaceOnce('grid.addEventListener("click",function(e){var cell=e.target.closest(".cal-day");if(!cell)return;selected=cell.dataset.date;renderMonth();});',
 'grid.addEventListener("click",function(e){var cell=e.target.closest(".cal-day");if(!cell)return;selected=cell.dataset.date;if(cell.classList.contains("is-adjacent")){var p=selected.split("-").map(Number);year=p[0];month=p[1];}renderMonth();});');
replaceOnce('</head>', '<style>/* Adjacent-month days in full calendar weeks */.cal-day.is-adjacent{opacity:.44;background:transparent!important;border-color:transparent!important}.cal-day.is-adjacent .cal-num,.cal-day.is-adjacent .cal-lunar{color:var(--cal-muted)!important}.cal-day.is-adjacent .cal-flag{opacity:.78}.cal-day.is-adjacent:hover{opacity:.85;background:rgba(160,185,220,.09)!important}.cal-day.is-adjacent:focus-visible{opacity:1}</style></head>');
fs.writeFileSync(path,html);console.log("Adjacent month dates added to calendar grid",Buffer.byteLength(html));
