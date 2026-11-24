
'use strict';
const fs=require("node:fs"),path=require("node:path");
const additions=[{"at":1,"region":"德国 · 欧洲","date":"11月17日 · 首次发布","category":"AI 音频 / 视频后期","name":"Mirelo Sound Agent","short":"Mirelo Sound Agent","image":"/assets/mirelo-sound-agent.jpg","alt":"Mirelo Sound Agent 官方产品发布图","source":"https://mirelo.ai/blog/mirelo-sound-agent","url":"https://mirelo.ai/blog/mirelo-sound-agent","imageSrc":"https://mirelo.ai/marketing/blog/mirelo-sound-agent-cover.jpg","desc":"Mirelo 于11月17日推出视频声音设计 Agent，通过自然语言指令为视频制作和修改音效，强调反复调整而非一次性生成。","why":"把声音后期从逐轨编辑转向目标驱动的协作；产品价值要以修改次数、最终可用率与节省时间衡量。","who":"短视频创作者、后期剪辑师、独立内容团队","heat":"官方博客标注2026年11月17日首次发布","cost":"浏览器服务，Windows 可通过网页访问；具体免费额度与订阅价格以官网为准","try":"上传有权使用的短视频，描述需要的环境声并迭代修改"},{"at":2,"region":"美国","date":"11月17日 · 开发者工具发布","category":"机器人 / AI Agent","name":"Gemini 4 Hydrogen Robotics","short":"Hydrogen Robotics","image":"/assets/gemini-robotics.jpg","alt":"Google 官方 Gemini 4 Hydrogen Robotics 发布配图","source":"https://developers.googleblog.com/en/gemini-hydrogen-for-robotics/","url":"https://developers.googleblog.com/en/gemini-hydrogen-for-robotics/","imageSrc":"https://storage.googleapis.com/gweb-developer-goog-blog-assets/images/Robotics_Banner.2e16d0ba.fill-1200x600.jpg","desc":"Google 在11月17日公布面向通用机器人任务的 Gemini 4 Hydrogen 开发者工作流，涉及机器人控制、工具和仿真验证；并非面向普通消费者开售的实体机器人。","why":"机器人 Agent 从模型演示走向工具链，关键要验证仿真成功率能否转化成真实环境中的稳定执行。","who":"机器人研发工程师、具身智能产品团队、开发者","heat":"Google for Developers 2026年11月17日技术发布","cost":"开发者工具与模型使用条件依官方页面及账号资格；Windows 开发环境可阅读和使用相关接口","try":"阅读官方示例，从限定任务与可重复评测指标开始"},{"at":4,"region":"日本市场 / 中国品牌","date":"11月17日 · 日本市场官宣；11月27日计划开售","category":"智能穿戴 / 耳夹音频","name":"Xiaomi Clip · Japan Launch","short":"Xiaomi Clip","image":"/assets/xiaomi-clip-japan.jpg","alt":"小米日本官方新闻稿 Xiaomi Clip 产品展示图","source":"https://prtimes.jp/main/html/rd/p/000000263.000098799.html","url":"https://www.mi.com/global/product/xiaomi-clip/","imageSrc":"https://prcdn.freetls.fastly.net/release_image/98799/263/98799-263-a2190e8547dd76017f1c74cce74623de-1732x974.jpg?format=jpeg&auto=webp&fit=bounds&width=2400&height=1260","desc":"小米日本11月17日宣布引入耳夹式无线耳机 Xiaomi Clip，并公布11月27日的日本开售计划；本条报道的是日本市场官宣，不将现有产品误称全球首发。","why":"开放式耳夹产品需要长期比较佩戴稳固性、耳形适配、漏音与通勤场景下的听音可用性。","who":"不喜欢入耳式耳机的用户、通勤人群、开放式音频爱好者","heat":"小米日本官方新闻稿2026年11月17日发布；日本计划11月27日发售","cost":"日本市场预定上市，具体零售价及地区购买条件以小米日本官方公告为准","try":"查看官方产品资料并对比耳夹结构、续航及开放式听音场景"},{"at":7,"region":"中国 · 全球众筹","date":"11月18日 · Kickstarter 众筹上线","category":"3D 扫描 / 创客硬件","name":"Revopoint MIRACO 2","short":"MIRACO 2","image":"/assets/revopoint-miraco2.jpg","alt":"Revopoint MIRACO 2 官方发布产品图","source":"https://store.revopoint3d.com/blogs/news/revopoint-launches-miraco-2-on-kickstarter-scan-in-one-create-with-agents","url":"https://store.revopoint3d.com/blogs/news/revopoint-launches-miraco-2-on-kickstarter-scan-in-one-create-with-agents","imageSrc":"https://store.revopoint3d.com/cdn/shop/articles/1280x720.jpg?v=1794983121&width=1500","desc":"Revopoint 11月18日在 Kickstarter 上线一体式 3D 扫描仪 MIRACO 2，强调现场扫描与 Revo Agents 辅助的建模工作流；现阶段属于众筹而非现货交付。","why":"3D 扫描设备的闭环取决于后处理、导出 CAD 的可用率及真实尺寸精度，而不是只看扫描帧率。","who":"工业设计师、硬件原型团队、创客与3D打印用户","heat":"Revopoint 官方2026年11月18日公告 Kickstarter 启动","cost":"官网披露众筹限时早鸟起价 US$1,425；实际档位、运费及交付风险以 Kickstarter 为准","try":"核对官方扫描样例、交付计划与 CAD 导出流程"}];
function guard(b,m){if(!b)throw new Error(m)}
async function fetchText(url,min){
 const r=await fetch(url,{signal:AbortSignal.timeout(30000),headers:{"User-Agent":"Mozilla/5.0 (compatible; TechRadarArchiver/1.0)"}});
 guard(r.status===200,"Historical source "+url+" returned "+r.status);
 const str=await r.text();
 guard(str.length>=min&&str.includes("<html"),"Historical archive incomplete "+url+" "+str.length);
 return str;
}
async function fetchImage(a){
 const r=await fetch(a.imageSrc,{signal:AbortSignal.timeout(30000),headers:{"User-Agent":"Mozilla/5.0","Accept":"image/jpeg,image/*;q=0.8"}});
 const type=r.headers.get("content-type")||"";
 guard(r.status===200&&type.toLowerCase().startsWith("image/jpeg"),"Official image failed "+a.name+" "+r.status+" "+type);
 const buf=Buffer.from(await r.arrayBuffer());
 guard(buf.length>11000&&buf.length<3000000&&buf[0]===0xff&&buf[1]===0xd8,"Invalid JPEG "+a.name+" "+buf.length);
 fs.mkdirSync(path.dirname("src"+a.image),{recursive:true});
 fs.writeFileSync("src"+a.image,buf);
 console.log("VERIFIED OFFICIAL IMAGE",a.name,buf.length,type);
}
function patchArchive(html,day){
 const stamp="2026.11."+day;
 const title="科技新品雷达 · "+stamp;
 html=html.replace(/<title>[\s\S]*?<\/title>/i,"<title>"+title+"</title>");
 const headAddition='<style id="archive-navigation-style">.archive-latest{position:fixed;right:16px;bottom:17px;z-index:9999;text-decoration:none!important;display:flex;align-items:center;gap:8px;border:1px solid rgba(175,207,251,.35);border-radius:999px;padding:10px 16px;background:rgba(12,26,49,.87);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);color:#f1f6ff!important;font:700 13px "Segoe UI","Microsoft YaHei",sans-serif;box-shadow:0 8px 25px rgba(2,11,29,.27)}.archive-latest:hover{background:rgba(35,64,108,.96)}body.light .archive-latest{background:rgba(248,251,255,.94);color:#25445f!important;border-color:rgba(55,110,153,.22)}.archive-date-note{position:fixed;left:14px;bottom:17px;z-index:9998;border-radius:999px;padding:8px 11px;background:rgba(11,28,48,.73);backdrop-filter:blur(12px);color:#dfecfa;font:600 11px "Segoe UI",sans-serif}body.light .archive-date-note{background:rgba(255,255,255,.87);color:#375773}@media(max-width:500px){.archive-date-note{bottom:69px}.archive-latest{bottom:12px}}</style><script id="archive-reload-fix">(function(){try{history.scrollRestoration="manual";var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(n&&n.type==="reload"){location.replace("/");}}catch(e){}})();</script>';
 guard(html.includes("</head>"),"Archive lacks head "+stamp);
 html=html.replace("</head>",headAddition+"</head>");
 const bar='<div class="archive-date-note">ARCHIVE · '+stamp+'</div><a class="archive-latest" href="/" aria-label="返回科技新品雷达最新一期">✦ 最新一期</a>';
 guard(/<body\b[^>]*>/i.test(html),"Archive missing body "+stamp);
 html=html.replace(/<body\b[^>]*>/i,m=>m+bar);
 guard(!/<iframe\b/i.test(html),"Archive may not embed a preview iframe: "+stamp);
 guard(!/tech-radar-daily-[a-z0-9]{6,}-1161013527-4155\.vercel\.app/.test(html),"Archive contains immutable preview link "+stamp);
 return html;
}
function nameNorm(s){return String(s).toLowerCase().normalize("NFKC").replace(/[^a-z0-9\u3400-\u9fff]/g,"")}
async function main(){
 let html=fs.readFileSync("src/index.html","utf8");
 const archiveLinks=[
  ["17","https://tech-radar-daily-hvabu529n-1161013527-4155.vercel.app/archive/2026-11-17.html",50000],
  ["18","https://tech-radar-daily-hvabu529n-1161013527-4155.vercel.app/archive/2026-11-18.html",50000],
  ["19","https://tech-radar-daily-p3pu4eb8u-1161013527-4155.vercel.app/",18000]
 ];
 fs.mkdirSync("src/archive",{recursive:true});
 const historical=[];
 for(const [day,url,min] of archiveLinks){
  const original=await fetchText(url,min);
  guard(original.includes("科技新品雷达"),"Archive not a radar report: "+day);
  historical.push(original);
  const revised=patchArchive(original,day);
  fs.writeFileSync("src/archive/2026-11-"+day+".html",revised);
  console.log("RESTORED FULL ARCHIVE 2026-11-"+day,original.length,revised.length);
 }
 const old20=fs.readFileSync("src/archive/2026-11-20.html","utf8");
 guard(old20.length>50000,"Nov20 archive lacks full text");
 historical.push(old20);
 fs.writeFileSync("src/archive/2026-11-20.html",patchArchive(old20,"20"));
 const match=html.match(/const items=(\[[\s\S]*?\]);const esc=/);
 guard(!!match,"Product payload missing");
 const items=JSON.parse(match[1]);guard(items.length===8,"Expected eight current products");
 for(const a of additions){
  guard(items[a.at],"Missing product slot "+a.at);
  const imageSrc=a.imageSrc;
  const it={...a};delete it.at;delete it.imageSrc;
  items[a.at]=it;
  await fetchImage({...a,imageSrc});
 }
 const previousNames=[];
 for(const doc of historical){
  for(const x of doc.matchAll(/\bname\s*:\s*["']([^"']+)["']/g))previousNames.push(x[1]);
  for(const x of doc.matchAll(/"name"\s*:\s*"([^"]+)"/g))previousNames.push(x[1]);
 }
 const seen=new Set();const prev=new Set(previousNames.map(nameNorm));
 for(const item of items){
  let n=nameNorm(item.name);
  guard(!seen.has(n),"Duplicate product within edition "+item.name);
  guard(!prev.has(n),"Previously reported product repeated: "+item.name);
  seen.add(n);
  guard(item.image.startsWith("/assets/")&&fs.existsSync("src"+item.image),"Missing official asset "+item.name);
  guard(item.url.startsWith("https://"),"Missing official link "+item.name);
 }
 const tryNames=[...html.matchAll(/<article class="panel try-card">[\s\S]*?<h3>([^<]+)<\/h3>/g)].map(x=>x[1]);
 guard(tryNames.length===2&&tryNames.every(n=>!seen.has(nameNorm(n))),"Repeated Now Try item in product list");
 html=html.replace(match[0],"const items="+JSON.stringify(items)+";const esc=");
 const insStart=html.indexOf('<section class="section" id="insight">'),insEnd=html.indexOf('</section>',insStart);
 guard(insStart>=0&&insEnd>insStart,"Tech Insights missing");
 let insight=html.slice(insStart,insEnd+10);
 const observation=[
  {tag:"01 / WORKFLOWS",title:"Agent 开始对可验收结果负责",body:"ChatGPT Space 与 Replit Missions 把一次性的回答推进到持续协作和任务交付。关注任务成功率、权限边界与人工接管成本。"},
  {tag:"02 / ROBOTICS",title:"具身智能更需要完整工具链",body:"Gemini 4 Hydrogen Robotics、Revopoint MIRACO 2 与 Makera A1S 指向仿真、数字化采集和实物制造的连续工作流；每一环都必须有可验证指标。"},
  {tag:"03 / CREATOR",title:"影音创作走向端到端工作流",body:"Suno Visuals 与德国 Mirelo Sound Agent 分别切入视觉和音效制作，Xiaomi Clip 则提醒我们：消费电子最终仍要回到真实佩戴场景与体验完成度。"}
 ];
 let i=0;
 insight=insight.replace(/<article class="panel insight">[\s\S]*?<\/article>/g,block=>{
  const a=observation[i++];guard(!!a,"Unexpected observations");
  return block.replace(/(<div class="tag">)[^<]+/,"$1"+a.tag)
              .replace(/(<h3>)[^<]+/,"$1"+a.title)
              .replace(/(<p>)[^<]+/,"$1"+a.body);
 });
 guard(i===3,"Observation count "+i);
 html=html.slice(0,insStart)+insight+html.slice(insEnd+10);
 const academyStart=html.indexOf('<section class="section" id="academy">'),academyEnd=html.indexOf('</section>',academyStart);
 guard(academyStart>=0&&academyEnd>academyStart,"Daily lesson missing");
 let academy=html.slice(academyStart,academyEnd+10);
 const rename=[
  ["案例 · Proton Lumo Desktop","案例 · Replit Missions"],
  ["假设要在 <b>Connectors、Schedules、Skills</b> 三项能力中选择下轮优化重点，先验证这些关键数据，而不是凭功能新鲜度排序。","假设要在 <b>预算护栏、自动测试、人工接管</b> 三项能力中选择下一轮优化重点，先收集真实任务证据，不凭演示的新鲜度排序。"],
  ["Connectors <small>数据连接</small>","预算护栏 <small>成本控制</small>"],
  ["观察跨应用检索频率、连接成功率、权限拒绝率。","观察任务超支率、预算耗尽时的中断成功率及用户理解成本。"],
  ["Schedules <small>定时任务</small>","自动测试 <small>交付质量</small>"],
  ["观察每周重复任务次数、自动运行成功率和失败恢复成本。","观察需求验收通过率、回归失败率与平均返工次数。"],
  ["Skills <small>可复用技能</small>","人工接管 <small>异常恢复</small>"],
  ["观察技能复用次数、配置时间和实际任务完成率。","观察任务失败后的接管频率、恢复时长与最终交付成功率。"],
  ["不是 Proton 官方提供的真实使用数据","不是 Replit 官方提供的真实使用数据"]
 ];
 for(const [before,after] of rename){guard(academy.includes(before),"Lesson source missing "+before);academy=academy.replace(before,after)}
 html=html.slice(0,academyStart)+academy+html.slice(academyEnd+10);
 html=html.replace('<strong>06 / 02</strong><small>海外 / 中国</small>','<strong>05 / 03</strong><small>海外 / 中国</small>');
 guard(html.includes('05 / 03'),'Hero stats not updated');
 const currentDate='<span class="clock-date" id="date">2026.11.21 · 周六</span>';
 const dateRegex=/<span class="clock-date" id="date">[^<]*<\/span>/;
 guard(dateRegex.test(html),"Static date missing");html=html.replace(dateRegex,currentDate);
 guard(/<time id="time">[^<]+<\/time>/.test(html),"Static time missing");
 html=html.replace(/<time id="time">[^<]+<\/time>/,'<time id="time">00:00:00</time>');
 html=html.replace(/<meta content="[^"]*" name="description"\/>/,'<meta content="科技新品雷达 2026.11.21：全球新品、AI Agent、机器人、音频和创客硬件。精选真实官方消息，按日期与地区标注，历史日报完整可访问。" name="description"/>');
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 for(const [i,s] of scripts.entries()){try{new Function(s)}catch(e){throw Error("Inline script "+i+": "+e.message)}}
 for(const token of ['id="try"','id="radar"','id="insight"','id="academy"','id="archive"','id="ambient-play"','Asia/Shanghai','history.scrollRestoration','calendar-lunar.js','id="time"','RICE','rice-metrics'])guard(html.includes(token),"Missing mother feature "+token);
 fs.writeFileSync("src/index.html",html);
 console.log("AUDIT PASSED: ",items.length,"history-unique product records,",tryNames.length,"Now Try,",historical.length,"historical full pages,",scripts.length,"inline scripts; changed lesson and insight; clock placeholders correct");
}
main().catch(e=>{console.error(e);process.exit(1)});
