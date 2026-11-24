
(function(){
'use strict';
function ready(){
 const root=document.querySelector('#radar-mini.hop-game');
 if(!root)return;
 const q=s=>root.querySelector(s),board=q('#hop-board'),canvas=q('#hop-canvas'),ctx=canvas.getContext('2d'),W=600,H=335,G=276;
 const scoreNode=q('#hop-score'),bestNode=q('#hop-best'),info=q('#hop-info');
 let running=false,over=false,focus=false,y=0,vy=0,t=0,score=0,ob=[],spawn=75,best=0,raf=0,last=0;
 try{best=Number(localStorage.getItem('radar-hop-best')||0)}catch(e){}
 bestNode.textContent=String(best).padStart(3,'0');
 const stars=Array.from({length:35},(_,i)=>({x:(i*163+53)%W,y:(i*71+12)%236,r:i%3?1:2}));
 const fmt=n=>String(Math.floor(Math.max(0,n))).padStart(3,'0');
 function reset(play){running=!!play;over=false;score=0;t=0;y=0;vy=0;ob=[];spawn=75;scoreNode.textContent='000';info.textContent=running?'点击 / 空格跳跃':'点击 / 轻触 / 空格开始跳跃';draw();if(running)loop()}
 function jump(){if(over){reset(true);vy=-14;return}if(!running){reset(true);vy=-14;return}if(y===0)vy=-14}
 function action(){focus=true;board.focus({preventScroll:true});jump()}
 function box(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
 function draw(){
  const light=document.body.classList.contains('light');
  const grad=ctx.createLinearGradient(0,0,0,H);grad.addColorStop(0,light?'#d3e8fa':'#0c325c');grad.addColorStop(1,light?'#f0f7ff':'#081a34');ctx.fillStyle=grad;ctx.fillRect(0,0,W,H);
  ctx.fillStyle=light?'rgba(63,137,203,.22)':'rgba(157,217,255,.35)';
  for(const s of stars){ctx.beginPath();ctx.arc((s.x-t*.13+W*10)%W,s.y,s.r,0,7);ctx.fill()}
  ctx.strokeStyle=light?'rgba(60,127,194,.11)':'rgba(134,197,254,.11)';
  for(let x=0;x<W;x+=50){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
  ctx.fillStyle=light?'#a2c9e7':'#28577c';ctx.fillRect(0,G,W,3);
  for(let i=0;i<13;i++){let x=(i*50-(t*2%50)+W)%W;ctx.fillRect(x,G+13,24,2)}
  for(const a of ob){ctx.shadowBlur=11;ctx.shadowColor='#71d7ff';ctx.fillStyle=light?'#4aa6ce':'#50b7eb';box(a.x,G-a.h,a.w,a.h,5);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(240,255,255,.48)';ctx.fillRect(a.x+5,G-a.h+9,a.w-10,3)}
  const robotY=G-43+y;ctx.shadowBlur=12;ctx.shadowColor='#85d2ff';ctx.fillStyle=light?'#e7f6ff':'#9fd9ff';box(89,robotY,45,38,12);ctx.fill();ctx.shadowBlur=0;
  ctx.fillStyle=light?'#2d6491':'#153959';box(96,robotY+9,31,21,7);ctx.fill();ctx.fillStyle='#8dffff';ctx.fillRect(102,robotY+17,6,6);ctx.fillRect(115,robotY+17,6,6);
  ctx.strokeStyle=light?'#47799d':'#b0e9ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(96,robotY+37);ctx.lineTo(93,robotY+45);ctx.moveTo(128,robotY+37);ctx.lineTo(131,robotY+45);ctx.stroke();
  if(over){ctx.fillStyle=light?'rgba(242,249,255,.87)':'rgba(7,19,40,.83)';ctx.fillRect(0,0,W,H);ctx.textAlign='center';ctx.fillStyle=light?'#305674':'#e9f5ff';ctx.font='bold 28px Segoe UI';ctx.fillText('SIGNAL LOST',W/2,145);ctx.font='19px Segoe UI';ctx.fillText('点击重新挑战',W/2,180);ctx.textAlign='left'}
 }
 function loop(){if(!raf&&running&&!document.hidden){last=0;raf=requestAnimationFrame(tick)}}
 function tick(now){raf=0;if(!running||document.hidden)return;const d=last?Math.min(2,(now-last)/16.67):1;last=now;t+=d;score+=d*.10;scoreNode.textContent=fmt(score);
  if(y<0||vy<0){vy+=.70*d;y+=vy*d;if(y>0){y=0;vy=0}}
  spawn-=d;const speed=4.5+Math.min(3,score*.022);
  if(spawn<=0){const height=27+Math.random()*19;ob.push({x:W+10,w:24+Math.random()*12,h:height});spawn=68+Math.random()*48}
  for(const a of ob)a.x-=speed*d;ob=ob.filter(a=>a.x+a.w>-10);
  for(const a of ob){if(125>a.x+4&&95<a.x+a.w-4&&G+y-2>G-a.h+6){running=false;over=true;info.textContent='挑战结束 · 点击重开';if(score>best){best=Math.floor(score);bestNode.textContent=fmt(best);try{localStorage.setItem('radar-hop-best',String(best))}catch(e){}}break}}
  draw();if(running)loop()
 }
 board.addEventListener('pointerdown',e=>{e.preventDefault();action()});
 q('#hop-action').addEventListener('click',action);
 q('#hop-restart').addEventListener('click',()=>{if(raf)cancelAnimationFrame(raf);raf=0;reset(false)});
 document.addEventListener('keydown',e=>{if(!['Space','ArrowUp'].includes(e.code)||!focus)return;const el=e.target;if(el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable))return;e.preventDefault();action()});
 document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))focus=false});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden&&running)loop()});
 reset(false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
