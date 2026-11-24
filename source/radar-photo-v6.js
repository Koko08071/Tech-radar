const fs=require('fs'),vm=require('vm');const css="\n/* Product art: the same original image fills the backdrop, softly diffused. */\n#radar #products .product .visual{position:relative;isolation:isolate;overflow:hidden;background:#172433!important}\n#radar #products .product .visual::before{content:\"\";position:absolute;inset:-32px;z-index:0;pointer-events:none;background:var(--card-art,none) center/cover no-repeat!important;filter:blur(24px) saturate(1.15) brightness(.82)!important;transform:scale(1.07);opacity:1!important}\n#radar #products .product .visual::after{content:\"\";position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(155deg,rgba(235,247,255,.09),transparent 38%,rgba(5,14,25,.19));box-shadow:inset 0 1px rgba(255,255,255,.12)}\n#radar #products .product .visual img{position:relative!important;z-index:2!important;object-fit:contain!important;object-position:center!important;filter:drop-shadow(0 10px 20px rgba(0,0,0,.24))!important}\n#radar #products .product .visual.image-failed::before{background:none!important}\n#radar #products .product .visual img[hidden],#radar #products .product .visual.image-failed img{display:none!important}\n#radar #products .product .visual-fallback{z-index:3}\nbody.light #radar #products .product .visual{background:#e0eaf5!important}\nbody.light #radar #products .product .visual::before{filter:blur(24px) saturate(.98) brightness(1.1)!important;opacity:.84!important}\nbody.light #radar #products .product .visual::after{background:linear-gradient(145deg,rgba(255,255,255,.20),rgba(230,243,255,.02) 50%,rgba(221,237,250,.18))}\n",runtime="(function(){\n\"use strict\";\nvar root=document.getElementById(\"products\");if(!root)return;\nfunction sync(){\n root.querySelectorAll(\".product .visual\").forEach(function(box){\n  var img=box.querySelector(\"img\");if(!img){box.style.removeProperty(\"--card-art\");return;}\n  var src=img.getAttribute(\"src\");if(!src)return;\n  var val=\"url(\"+JSON.stringify(src)+\")\";\n  if(box.style.getPropertyValue(\"--card-art\")!==val)box.style.setProperty(\"--card-art\",val);\n });\n}\nsync();\nnew MutationObserver(sync).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:[\"src\"]});\n})();";

const p='src/index.html';let h=fs.readFileSync(p,'utf8');
if(!h.includes('id="editorial-photo-horizontal-v5"')||!h.includes('id="apple-frosted-glass-v4"'))throw Error('Latest template missing');
const old=h.match(/<script id="same-source-soft-background">[\s\S]*?<\/script>/);
if(!old)throw Error('Existing product background runtime missing');
h=h.replace(old[0],'<script id="same-source-soft-background">'+runtime+'</script>');
h=h.replace('</head>','<style id="radar-same-image-v6">'+css+'</style></head>');
for(const m of h.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)){if(m[1].trim())new vm.Script(m[1]);}
const items=JSON.parse(h.match(/const items=(\[[\s\S]*?\]);const esc=/)[1]);
if(!items.every(x=>x.image))throw Error('Product image missing');
const assert=require('assert');
let cb,options;const boxes=items.map(x=>{let v='';return {querySelector:()=>({getAttribute:()=>x.image}),style:{getPropertyValue:()=>v,setProperty:(k,s)=>{v=s},removeProperty:()=>{v=''}}}});
const root={querySelectorAll:()=>boxes};
vm.runInNewContext(runtime,{document:{getElementById:()=>root},MutationObserver:class{constructor(c){cb=c}observe(r,o){options=o}}});
assert(boxes.every((b,i)=>b.style.getPropertyValue()==='url('+JSON.stringify(items[i].image)+')'));
const newBox={querySelector:()=>({getAttribute:()=>'/assets/new-product.png'}),style:{value:'',getPropertyValue(){return this.value},setProperty(k,v){this.value=v}}};boxes.push(newBox);cb();
assert.equal(newBox.style.value,'url("/assets/new-product.png")');
assert(options.childList&&options.subtree&&options.attributeFilter.includes('src'));
fs.writeFileSync(p,h,'utf8');fs.writeFileSync('src/radar-same-image.css',css,'utf8');
console.log('RADAR PHOTO V6 QA: '+items.length+' exact source-image backgrounds; mutation refresh passed; foreground contain; light and dark; unchanged card layout and glass style');
