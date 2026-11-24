
(function(){
 function init(){
 const cards=[...document.querySelectorAll('#products .product')];
 for(const card of cards){
 const visual=card.querySelector('.visual'),img=visual&&visual.querySelector('img');
 if(visual&&img&&img.getAttribute('src')?.startsWith('/assets/'))visual.style.setProperty('--image','url("'+img.getAttribute('src')+'")');
 const facts=card.querySelector('.facts');if(!facts||facts.children.length<4)continue;
 facts.children[1].remove();
 const tip=facts.children[2];if(!tip)continue;
 tip.remove();
 const detail=document.createElement('details');detail.className='extra-info';
 const summary=document.createElement('summary');summary.textContent='查看体验方式';
 const box=document.createElement('div');box.className='extra-body';box.appendChild(tip);
 detail.append(summary,box);facts.after(detail);
 }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
