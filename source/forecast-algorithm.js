
/* Estimated future holidays: published 2026/2027 remain unchanged.
   From 2028: 2025 Ordinance + heuristic bridge/compensatory weekends, marked 预测. */
var estimateCache={};
function addDays(k,n){
 var a=k.split("-").map(Number),d=new Date(Date.UTC(a[0],a[1]-1,a[2]+n));
 return iso(d.getUTCFullYear(),d.getUTCMonth()+1,d.getUTCDate());
}
function weekdayOf(k){
 var a=k.split("-").map(Number);return new Date(Date.UTC(a[0],a[1]-1,a[2])).getUTCDay();
}
function scanFestival(y,fn){
 var c=new Date(Date.UTC(y,0,1)),lim=new Date(Date.UTC(y+1,0,1));
 for(;c<lim;c.setUTCDate(c.getUTCDate()+1)){
  var k=iso(c.getUTCFullYear(),c.getUTCMonth()+1,c.getUTCDate());
  var l=lunar(c.getUTCFullYear(),c.getUTCMonth()+1,c.getUTCDate());
  if(l&&fn(k,l))return k;
 }
 return null;
}
function estimateShort(k){
 var w=weekdayOf(k),s=0,e=0,makeup=0;
 if(w===1){s=-2;}
 else if(w===2){s=-2;makeup=1;}
 else if(w===3){}
 else if(w===4){e=2;makeup=1;}
 else if(w===5||w===6){e=2;}
 else{s=-1;e=1;}
 return {start:addDays(k,s),end:addDays(k,e),makeup:makeup};
}
function estimatedYears(y){
 if(y<=2027||y>2199||estimateCache[y]||typeof Solar==="undefined")return;
 estimateCache[y]=true;
 try{
  var generated=[];
  function create(name,start,end,needed){generated.push({year:y,name:name,start:start,end:end,work:[],predicted:true,needed:needed||0});}
  var n=estimateShort(iso(y,1,1));create("元旦",n.start,n.end,n.makeup);
  var cny=scanFestival(y,function(k,l){return l.monthNumber===1&&l.dayNumber===1});
  if(cny){var eve=addDays(cny,-1);create("春节",eve,addDays(eve,7),2);}
  var qing=scanFestival(y,function(k){return solarTermFor(k)==="清明"});
  if(qing){var q=estimateShort(qing);create("清明节",q.start,q.end,q.makeup);}
  create("劳动节",iso(y,5,1),iso(y,5,5),1);
  var dragon=scanFestival(y,function(k,l){return l.monthNumber===5&&l.dayNumber===5});
  if(dragon){var d=estimateShort(dragon);create("端午节",d.start,d.end,d.makeup);}
  var mid=scanFestival(y,function(k,l){return l.monthNumber===8&&l.dayNumber===15});
  var merge=mid&&mid>=iso(y,9,27)&&mid<=iso(y,10,7);
  if(mid&&!merge){var m=estimateShort(mid);create("中秋节",m.start,m.end,m.makeup);}
  create(merge?"国庆节·中秋节":"国庆节",iso(y,10,1),iso(y,10,merge?8:7),2);
  function eachDay(start,end,fn){var k=start,lim=0;while(k<=end&&lim++<20){fn(k);k=addDays(k,1);}}
  generated.forEach(function(p){eachDay(p.start,p.end,function(k){
   if(!events[k]&&Number(k.slice(0,4))>=2028)events[k]={type:"holiday",name:p.name,estimated:true};
  });});
  generated.forEach(function(p){
   if(!p.needed)return;
   var opts=[],chosen={};
   for(var i=1;i<=15;i++){
    var left=addDays(p.start,-i),right=addDays(p.end,i);
    if((weekdayOf(left)===0||weekdayOf(left)===6)&&Number(left.slice(0,4))===y)opts.push({key:left,gap:i,side:0});
    if((weekdayOf(right)===0||weekdayOf(right)===6)&&Number(right.slice(0,4))===y)opts.push({key:right,gap:i,side:1});
   }
   opts.sort(function(a,b){return a.gap-b.gap||a.side-b.side;});
   for(var j=0;j<opts.length&&p.work.length<p.needed;j++){
    var c=opts[j];if(events[c.key]||chosen[c.side])continue;
    events[c.key]={type:"work",name:p.name+"调休",estimated:true};
    p.work.push(c.key);chosen[c.side]=true;
   }
   p.work.sort();
  });
  generated.forEach(function(p){plans.push(p);});
 }catch(err){console.warn("Forecast generation failed",y,err);delete estimateCache[y];}
}
