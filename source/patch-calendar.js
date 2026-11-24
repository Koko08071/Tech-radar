'use strict';
const fs=require('fs');
const path='src/index.html';
let html=fs.readFileSync(path,'utf8');
function replaceOnce(before,after){
 const a=html.indexOf(before);
 if(a<0)throw Error('Missing/duplicate match: '+before.slice(0,75));
 html=html.slice(0,a)+after+html.slice(a+before.length);
}
replaceOnce('<div class="cal-top"><div><div class="cal-kicker">CHINA CALENDAR</div><strong>中国日历</strong></div><button','<div class="cal-top"><button');
replaceOnce('<div class="cal-year-switch"><button type="button" class="cal-year active" data-cal-year="2026">2026 年</button><button type="button" class="cal-year" data-cal-year="2027">2027 年</button></div>',
 '<div class="cal-year-switch"><button type="button" class="cal-year" id="cal-schedule-prev" aria-label="查看上一年放假安排">‹</button><strong id="cal-schedule-year">2026 年放假安排</strong><button type="button" class="cal-year" id="cal-schedule-next" aria-label="查看下一年放假安排">›</button></div>');
const lunarPrefix=[
'function lunar(y,m,d){',
' if(typeof Solar!=="undefined"&&Solar.fromYmd){',
'  try{',
'   var ln=Solar.fromYmd(y,m,d).getLunar(),cm=ln.getMonthInChinese();',
'   var label=cm==="正"?"正月":cm==="腊"?"腊月":cm==="冬"?"十一月":/月$/.test(cm)?cm:cm+"月";',
'   return {month:label,day:ln.getDayInChinese(),dayNumber:ln.getDay(),monthNumber:ln.getMonth()};',
'  }catch(e){}',
' }'
].join('\n');
replaceOnce('function lunar(y,m,d){',lunarPrefix);
const helpers=[
'function solarTermFor(key){',
' if(solarTerms[key])return solarTerms[key];',
' if(typeof Solar!=="undefined"&&Solar.fromYmd){try{var p=key.split("-").map(Number);return Solar.fromYmd(p[0],p[1],p[2]).getLunar().getJieQi()||"";}catch(e){}}',
' return "";',
'}',
'function festivalFor(key,l){',
' if(traditionalFestivals[key])return traditionalFestivals[key];',
' if(!l||!l.monthNumber||l.monthNumber<0)return "";',
' var m=l.monthNumber,d=l.dayNumber;',
' if(m===1&&d===1)return "春节";',
' if(m===1&&d===15)return "元宵节";',
' if(m===2&&d===2)return "龙头节";',
' if(m===5&&d===5)return "端午节";',
' if(m===7&&d===7)return "七夕节";',
' if(m===8&&d===15)return "中秋节";',
' if(m===9&&d===9)return "重阳节";',
' if(m===12&&d===8)return "腊八节";',
' if(m===12&&d>=29){',
'  var parts=key.split("-").map(Number),nxt=new Date(Date.UTC(parts[0],parts[1]-1,parts[2]+1));',
'  var tomorrow=lunar(nxt.getUTCFullYear(),nxt.getUTCMonth()+1,nxt.getUTCDate());',
'  if(tomorrow&&tomorrow.monthNumber===1&&tomorrow.dayNumber===1)return "除夕";',
' }',
' return "";',
'}',
'function fixedFestivalFor(key){',
' return fixedFestivals[key]||({"01-01":"元旦","05-01":"劳动节","10-01":"国庆节"}[key.slice(5)]||"");',
'}',
''
].join('\n');
replaceOnce('function calendarLabel(key,l){',helpers+'function calendarLabel(key,l){');
replaceOnce('return traditionalFestivals[key]||(l&&l.month==="正月"&&l.dayNumber<=10?l.day:"")||solarTerms[key]||fixedFestivals[key]||(l?(l.day==="初一"?l.month:l.day):"");',
 'return festivalFor(key,l)||solarTermFor(key)||fixedFestivalFor(key)||(l&&l.month==="正月"&&l.dayNumber<=10?l.day:"")||(l?(l.day==="初一"?l.month:l.day):"");');
replaceOnce('var now=chineseNow(),year=Math.min(2027,Math.max(2026,now.y)),month=(year===now.y?now.m:1),selected=iso(year,month,year===now.y?now.d:1),scheduleYear=year,view="month";',
 'var now=chineseNow(),year=now.y,month=now.m,selected=iso(year,month,now.d),scheduleYear=year,view="month";');
replaceOnce('function updatePolicy(){policy.href=policies[view==="schedule"?scheduleYear:year];}',
 [
 'function updatePolicy(){',
 ' var y=view==="schedule"?scheduleYear:year,url=policies[y];',
 ' policy.hidden=!url;policy.style.display=url?"":"none";',
 ' if(url)policy.href=url;else policy.removeAttribute("href");',
 ' var note=policy.parentElement.querySelector("span");',
 ' if(note)note.textContent=url?"以国务院办公厅正式通知为准":"法定节假日与调休安排待官方公布";',
 '}'
 ].join('\n'));
replaceOnce('var p=selected.split("-").map(Number),key=selected,l=lunar(p[0],p[1],p[2]),ev=events[key],term=solarTerms[key],festival=traditionalFestivals[key]||fixedFestivals[key];',
 'var p=selected.split("-").map(Number),key=selected,l=lunar(p[0],p[1],p[2]),ev=events[key],term=solarTermFor(key),festival=festivalFor(key,l)||fixedFestivalFor(key);');
replaceOnce('var text=ev?(ev.type==="holiday"?ev.name+" · 国务院放假安排":"调休补班 · 正常上班"):(weekend?"常规周末":"正常工作日");',
 'var text=ev?(ev.type==="holiday"?ev.name+" · 国务院放假安排":"调休补班 · 正常上班"):(policies[p[0]]?(weekend?"常规周末":"正常工作日"):(weekend?"常规周末 · 调休安排待公布":"法定节假日与调休安排待公布"));');
replaceOnce('var tag=ev?(ev.type==="holiday"?"假":"班"):(weekend?"周末":"工作日");',
 'var tag=ev?(ev.type==="holiday"?"假":"班"):(weekend?"周末":policies[p[0]]?"工作日":"待定");');
replaceOnce('var key=iso(year,month,d),ev=events[key],l=lunar(year,month,d),term=solarTerms[key],festival=traditionalFestivals[key]||fixedFestivals[key],week=new Date(Date.UTC(year,month-1,d)).getUTCDay();',
 'var key=iso(year,month,d),ev=events[key],l=lunar(year,month,d),term=solarTermFor(key),festival=festivalFor(key,l)||fixedFestivalFor(key),week=new Date(Date.UTC(year,month-1,d)).getUTCDay();');
replaceOnce('prev.disabled=year===2026&&month===1;next.disabled=year===2027&&month===12;',
 'prev.disabled=false;next.disabled=false;');
replaceOnce('document.querySelectorAll("[data-cal-year]").forEach(function(b){b.classList.toggle("active",Number(b.dataset.calYear)===scheduleYear)});',
 'document.getElementById("cal-schedule-year").textContent=scheduleYear+" 年放假安排";\n if(!plans.some(function(p){return p.year===scheduleYear})){var msg=document.createElement("div");msg.className="cal-sched-empty";msg.textContent=scheduleYear+" 年的官方放假调休安排尚未收录。日历仍显示农历、传统节日与二十四节气，假期和补班日期不作推测。";schedule.appendChild(msg);}');
replaceOnce('if(n<2026*12||n>2027*12+11)return;',
 'if(!Number.isSafeInteger(n)||n<12||n>=9999*12)return;');
replaceOnce('var n=chineseNow();year=Math.min(2027,Math.max(2026,n.y));month=n.y>=2026&&n.y<=2027?n.m:1;selected=iso(year,month,n.y===year?n.d:1);',
 'var n=chineseNow();year=n.y;month=n.m;selected=iso(year,month,n.d);');
replaceOnce('todayBtn.addEventListener("click",function(){var n=chineseNow();year=Math.min(2027,Math.max(2026,n.y));month=n.y>=2026&&n.y<=2027?n.m:1;selected=iso(year,month,n.y===year?n.d:1);renderMonth()});',
 'todayBtn.addEventListener("click",function(){var n=chineseNow();year=n.y;month=n.m;selected=iso(year,month,n.d);renderMonth()});');
replaceOnce('document.querySelectorAll("[data-cal-year]").forEach(function(el){el.addEventListener("click",function(){scheduleYear=Number(el.dataset.calYear);renderSchedule()})});',
 'document.getElementById("cal-schedule-prev").addEventListener("click",function(){if(scheduleYear>1){scheduleYear--;renderSchedule()}});\ndocument.getElementById("cal-schedule-next").addEventListener("click",function(){if(scheduleYear<9999){scheduleYear++;renderSchedule()}});');
replaceOnce('next.addEventListener("click",function(){changeMonth(1)});',
 'next.addEventListener("click",function(){changeMonth(1)});\nvar lastWheelAt=0;grid.addEventListener("wheel",function(e){if(Math.abs(e.deltaY)<8)return;e.preventDefault();var nowTime=Date.now();if(nowTime-lastWheelAt<260)return;lastWheelAt=nowTime;changeMonth(e.deltaY>0?1:-1);},{passive:false});');
const css='<style>/* Calendar: continuous month/year navigation */'+
'.china-calendar .cal-top{position:absolute;top:11px;right:12px;z-index:2;display:flex;justify-content:flex-end}'+
'.china-calendar .cal-tabs{margin:0 36px 8px 0}'+
'.cal-year-switch{display:grid;grid-template-columns:38px minmax(0,1fr) 38px;align-items:center;gap:8px}'+
'.cal-year-switch strong{font-size:12px;font-weight:700;text-align:center;color:var(--cal-text)}'+
'.cal-year-switch .cal-year{padding:5px 7px;font-size:19px;line-height:20px}'+
'.cal-sched-empty{font-size:11px;line-height:1.8;color:var(--cal-muted);background:rgba(128,145,179,.08);border:1px solid var(--cal-line);border-radius:10px;padding:12px}'+
'@media(max-width:380px){.china-calendar .cal-top{top:9px;right:9px}}</style><script defer src="/calendar-lunar.js"></script>';
replaceOnce('</head>',css+'</head>');
fs.writeFileSync(path,html);
fs.copyFileSync(require.resolve('lunar-javascript/lunar.js'),'src/calendar-lunar.js');
console.log('patched html bytes='+Buffer.byteLength(html)+', library='+fs.statSync('src/calendar-lunar.js').size);
