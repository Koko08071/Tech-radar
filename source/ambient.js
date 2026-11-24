
(function(){
 "use strict";
 function mount(){
 const root=document.getElementById("ambient-play");
 if(!root)return;
 const board=root.querySelector("#ambient-field");
 const canvas=root.querySelector("#ambient-canvas");
 const ctx=canvas&&canvas.getContext&&canvas.getContext("2d");
 if(!ctx)return;
 const hint=root.querySelector("#ambient-hint"),scoreNode=root.querySelector("#ambient-score"),bestNode=root.querySelector("#ambient-best"),overNode=root.querySelector("#ambient-game-over");
 const W=850,H=390,ground=283,heroX=120;
 let running=false,over=false,y=0,v=0,frame=0,score=0,spawn=70,obstacles=[],best=0,raf=0,last=0,armed=false;
 try{best=Number(localStorage.getItem("radar-hop-best")||0)||0}catch(e){}
 const n=x=>String(Math.floor(Math.max(0,x))).padStart(3,"0");
 bestNode.textContent=n(best);
 const motionOK=!window.matchMedia||!window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 function rr(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
 function render(){
  const light=document.body.classList.contains("light");
  ctx.clearRect(0,0,W,H);
  // The original NASA photograph remains fully visible behind the transparent canvas.
  const trace=ctx.createLinearGradient(30,0,W-30,0);
  trace.addColorStop(0,"rgba(137,203,251,0)");
  trace.addColorStop(.17,light?"rgba(47,110,164,.27)":"rgba(154,210,253,.24)");
  trace.addColorStop(.55,light?"rgba(55,121,177,.37)":"rgba(160,217,255,.32)");
  trace.addColorStop(.85,light?"rgba(47,110,164,.23)":"rgba(154,210,253,.20)");
  trace.addColorStop(1,"rgba(137,203,251,0)");
  ctx.strokeStyle=trace;ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(40,ground);ctx.lineTo(W-32,ground);ctx.stroke();
  // Only a handful of cosmic dust motes, rather than a second enclosed scene.
  for(let i=0;i<9;i++){
   let xx=(i*113+49+(running?frame*.08:0))%W, yy=65+(i*53)%158;
   ctx.fillStyle=light?"rgba(58,131,190,.32)":"rgba(195,227,254,.35)";
   ctx.beginPath();ctx.arc(xx,yy,(i%3===0?1.8:1.1),0,Math.PI*2);ctx.fill();
  }
  // Energy barriers are translucent and glow over the photo.
  for(const o of obstacles){
   ctx.shadowColor=light?"rgba(31,126,190,.55)":"rgba(89,201,255,.68)";
   ctx.shadowBlur=17;ctx.fillStyle=light?"rgba(62,155,202,.72)":"rgba(99,193,234,.69)";
   rr(o.x,ground-o.h,o.w,o.h,6);ctx.fill();ctx.shadowBlur=0;
   ctx.strokeStyle=light?"rgba(24,111,177,.84)":"rgba(173,235,255,.92)";ctx.lineWidth=1.6;
   rr(o.x,ground-o.h,o.w,o.h,6);ctx.stroke();
   ctx.fillStyle="rgba(245,255,255,.50)";rr(o.x+4,ground-o.h+6,o.w-8,3,1.5);ctx.fill();
  }
  let ry=ground-43+y+(running&&y===0?Math.sin(frame*.12)*1.5:0);
  ctx.fillStyle=light?"rgba(46,89,124,.14)":"rgba(3,15,39,.30)";
  ctx.beginPath();ctx.ellipse(heroX+23,ground+2,24*Math.max(.55,1+y/220),4,0,0,Math.PI*2);ctx.fill();
  ctx.shadowColor=light?"rgba(47,118,185,.28)":"rgba(133,214,255,.45)";
  ctx.shadowBlur=motionOK?18:7;ctx.fillStyle=light?"#e8f6ff":"#a9dcff";
  rr(heroX,ry,46,37,12);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=light?"#305d85":"#113450";rr(heroX+7,ry+8,32,21,7);ctx.fill();
  ctx.fillStyle="#9dfaff";rr(heroX+13,ry+15,7,6,3);ctx.fill();rr(heroX+27,ry+15,7,6,3);ctx.fill();
  ctx.strokeStyle=light?"rgba(50,104,151,.8)":"rgba(175,229,255,.85)";ctx.lineWidth=3.5;
  ctx.beginPath();ctx.moveTo(heroX+8,ry+36);ctx.lineTo(heroX+5,ry+43);ctx.moveTo(heroX+38,ry+36);ctx.lineTo(heroX+41,ry+43);ctx.stroke();
  ctx.beginPath();ctx.moveTo(heroX+23,ry);ctx.lineTo(heroX+23,ry-7);ctx.stroke();
  ctx.fillStyle="#9aeaff";ctx.beginPath();ctx.arc(heroX+23,ry-9,3.4,0,Math.PI*2);ctx.fill();
  if(over){overNode.hidden=false}else overNode.hidden=true;
 }
 function schedule(){if(running&&raf===0&&!document.hidden)raf=requestAnimationFrame(tick)}
 function reset(play){
  if(raf){cancelAnimationFrame(raf);raf=0}
  running=!!play;over=false;y=0;v=0;frame=0;score=0;spawn=70;obstacles=[];last=0;
  scoreNode.textContent="000";
  hint.textContent=running?"轻触 · 跳过下一道星际信号":"轻触机器人 · 解锁星际跳跃";
  render();if(running)schedule();
 }
 function jump(){
  if(over){reset(true);v=-14.8;return}
  if(!running){reset(true);v=-14.8;return}
  if(y===0){v=-14.8;hint.textContent="跃迁中 · 保持节奏"}
 }
 function tick(t){
  raf=0;
  if(!running||document.hidden)return;
  const delta=last?Math.min(2,(t-last)/16.67):1;last=t;frame+=delta;
  score+=delta*.09;scoreNode.textContent=n(score);
  if(y<0||v<0){v+=.68*delta;y+=v*delta;if(y>=0){y=0;v=0}}
  spawn-=delta;
  if(spawn<=0){obstacles.push({x:W+22,w:24+Math.random()*10,h:28+Math.random()*18});spawn=78+Math.random()*50-Math.min(12,score*.08)}
  const speed=4.7+Math.min(3,score*.028);
  for(const o of obstacles)o.x-=speed*delta;
  obstacles=obstacles.filter(o=>o.x+o.w>-30);
  const botTop=ground-43+y,botBottom=botTop+42;
  for(const o of obstacles){
   if(heroX+41>o.x+4&&heroX+7<o.x+o.w-3&&botBottom>ground-o.h+5&&botTop<ground-2){
    over=true;running=false;hint.textContent="信号中断 · 点击再试";
    if(score>best){best=Math.floor(score);bestNode.textContent=n(best);try{localStorage.setItem("radar-hop-best",String(best))}catch(e){}}
    break
   }
  }
  render();schedule();
 }
 board.addEventListener("pointerdown",e=>{e.preventDefault();armed=true;board.focus({preventScroll:true});jump()});
 board.addEventListener("keydown",e=>{if(e.code!=="Space"&&e.code!=="ArrowUp")return;e.preventDefault();armed=true;jump()});
 document.addEventListener("keydown",e=>{
  if(!armed||e.target===board||!(e.code==="Space"||e.code==="ArrowUp"))return;
  const target=e.target;
  if(target&&(/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)||target.isContentEditable))return;
  e.preventDefault();jump()
 });
 document.addEventListener("pointerdown",e=>{if(!root.contains(e.target))armed=false});
 document.addEventListener("visibilitychange",()=>{if(!document.hidden&&running)schedule()});
 window.addEventListener("pagehide",()=>{if(raf){cancelAnimationFrame(raf);raf=0}},{once:true});
 reset(false);
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
