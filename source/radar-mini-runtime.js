
(function(){
function ready(){
 var box=document.getElementById('radar-mini'),list=document.getElementById('products');
 if(!box||!list)return;
 var cards=Array.from(list.querySelectorAll('.product')),stat=box.querySelector('#radar-mini-status'),count=box.querySelector('#radar-mini-count'),buttons=Array.from(box.querySelectorAll('[data-filter]'));
 if(!cards.length){stat.textContent='新品正在加载';return}
 function type(card){var s=(card.querySelector('.kind')||card).textContent||'';if(/创客|CNC|机器人|硬件|制造/i.test(s))return 'hardware';if(/语音|影音|音频|创作|影像/i.test(s))return 'creative';return 'ai'}
 function shown(){return cards.filter(function(c){return !c.hidden})}
 function filter(k){cards.forEach(function(c){c.hidden=k!=='all'&&type(c)!==k;c.classList.remove('radar-selected')});buttons.forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.filter===k))});count.textContent=String(shown().length).padStart(2,'0');stat.textContent=k==='all'?'全部信号已显示':'已筛选 '+shown().length+' 项信号'}
 buttons.forEach(function(b){b.addEventListener('click',function(){filter(b.dataset.filter);var target=document.getElementById('radar');if(target)target.scrollIntoView({block:'start',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})})});
 var prev=-1;
 box.querySelector('#radar-scan').addEventListener('click',function(){var arr=shown();if(!arr.length){filter('all');arr=shown()}var i=Math.floor(Math.random()*arr.length);if(arr.length>1&&i===prev)i=(i+1)%arr.length;prev=i;cards.forEach(function(c){c.classList.remove('radar-selected')});var current=arr[i],global=cards.indexOf(current)+1;current.classList.add('radar-selected');stat.textContent='已定位第 '+String(global).padStart(2,'0')+' 项';current.scrollIntoView({block:'center',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});window.setTimeout(function(){current.classList.remove('radar-selected')},2800)});
 filter('all');
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
