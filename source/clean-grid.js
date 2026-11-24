"use strict";
const fs=require("fs");
const path="src/index.html";
let s=fs.readFileSync(path,"utf8");
function update(before,after){if(!s.includes(before))throw Error("Missing calendar pattern: "+before.slice(0,80));s=s.replace(before,after);}
update('title.textContent=year+"年"+month+"月"+(year>2027?" · 预测":"");','title.textContent=year+"年"+month+"月";');
update('if(ev){btn.classList.add(ev.type==="holiday"?"is-holiday":"is-work");if(ev.estimated)btn.classList.add("is-estimated");}',
'if(ev)btn.classList.add(ev.type==="holiday"?"is-holiday":"is-work");');
update('flag.textContent=ev.estimated?"预":(ev.type==="holiday"?"假":"班");',
'flag.textContent=ev.type==="holiday"?"假":"班";');
update('ss[0].lastChild.textContent=year>2027?"预测放假":"放假";if(ss[1])ss[1].lastChild.textContent=year>2027?"预测补班":"补班";',
'ss[0].lastChild.textContent="放假";if(ss[1])ss[1].lastChild.textContent="补班";');
update('var tag=ev?(ev.type==="holiday"?(isEstimate?"预假":"假"):(isEstimate?"预班":"班")):(weekend?"周末":"工作日");',
'var tag=ev?(ev.type==="holiday"?"假":"班"):(weekend?"周末":"工作日");');
update('if(note)note.textContent=forecast?"假期与补班为推测 · 非官方安排":"以国务院办公厅正式通知为准";',
'if(note)note.textContent=forecast?"预测安排 · 假期与补班仅供参考":"以国务院办公厅正式通知为准";\n box.dataset.forecast=forecast?"1":"0";');
update('</head>', '<style>.china-calendar[data-forecast="1"] .cal-footer span{color:#f5becd;font-size:10.5px;font-weight:700}body.light .china-calendar[data-forecast="1"] .cal-footer span{color:#a23b57}</style></head>');
fs.writeFileSync(path,s);
console.log("calendar grid label cleanup passed; bytes:",Buffer.byteLength(s));
