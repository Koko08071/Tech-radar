const fs=require("node:fs");const path=require("node:path");
const assets=[{"key":"space","file":"space.webp","url":"https://images.ctfassets.net/kftzwdyauwt9/2NDk63u0I7A78LBKQmFGyg/3b2a9e859d667067d49828fd999c3d49/image__2_.png?w=1200&q=85&fm=webp"},{"key":"lumo","file":"lumo.png","url":"https://pmecdn.protonweb.com/image-transformation/?s=c&image=images/v1794904428/wp-pme/lumo-desktop-announce-blog-cover/lumo-desktop-announce-blog-cover.png"},{"key":"gemini","file":"gemini.png","url":"https://storage.googleapis.com/gweb-uniblog-publish-prod/images/Hero_2784_x_1566_1.width-1300.png"},{"key":"replit","file":"replit.jpg","url":"https://cdn.sanity.io/images/bj34pdbp/migration/3aa673405983a5f4d54bfdfbb901981f1ab32d0f-1280x720.gif?w=1200&h=630&fit=max&fm=jpg"},{"key":"assembly","file":"assembly.jpg","url":"https://www.assemblyai.com/_aai/images/meta/introducing-assemblyai-stt-3-7-og.jpg"},{"key":"suno","file":"suno.jpg","url":"https://cdn.sanity.io/images/cl7b1q1i/production/89947c59d1f2c8fda3d2133d67c0f7e11da012c5-3840x2160.jpg?rect=0,72,3840,2016&w=1200&h=630&fit=crop&auto=format"},{"key":"makera","file":"makera.png","url":"https://global.makera.com/cdn/shop/files/01_6025b35b-8176-4a8b-b917-ee93e101fca0.png?v=1794897564"},{"key":"tencent","file":"tencent.png","url":"https://www.tencent.com/wp-content/uploads/2026/11/2026111517490716_6d0b8dd02dcfff6174ba34e437a09247-scaled.png"}];
const lesson="<section class=\"section\" id=\"academy\"><div class=\"section-head\"><div><div class=\"eyebrow\">04 / PRODUCT THINKING</div><h2>Product Thinking</h2></div><p>DAILY LESSON · 每期一项独立产品方法</p></div><article class=\"panel lesson\"><div class=\"tag\">TODAY'S FRAMEWORK / RICE PRIORITIZATION</div><h3>RICE：资源有限时，先做哪个需求？</h3><p class=\"lesson-lead\">RICE 是产品需求优先级模型：Reach（触达人数）× Impact（单人影响）× Confidence（证据置信度）÷ Effort（投入成本）。它不是凭感觉排功能，而是把机会规模、用户价值、证据可靠性和开发代价放在同一张决策表里；分数来自调研与评估，不能凭空填写。</p><div class=\"jobs\"><div class=\"job\"><small>REACH × IMPACT</small><h4>覆盖范围 × 实际价值</h4><p>有多少目标用户会在指定周期遇到该任务？一次改进能节省多少时间或减少多少失败？两个维度要分别估计。</p></div><div class=\"job\"><small>CONFIDENCE</small><h4>证据置信度</h4><p>来自真实使用数据、访谈和可复现测试，还是团队猜测？缺少依据时应降低置信度，明确待验证假设。</p></div><div class=\"job\"><small>EFFORT</small><h4>开发与维护投入</h4><p>不仅估研发工时，也考虑跨应用兼容、权限审核、异常恢复、长期维护与支持成本。</p></div></div><h4 class=\"sub\">以 Proton Lumo Desktop 的三项新能力为例</h4><p>官方近期同时推出 Connectors、Schedules 和 Skills。假设你负责其下一轮迭代，必须决定先投入哪个功能的体验优化。以下是要验证的判断，不代表官方真实用户数据或产品排期。</p><div class=\"lesson-table\"><table><thead><tr><th>候选能力</th><th>需要收集的真实证据</th><th>可能影响优先级的条件</th></tr></thead><tbody><tr><td>Connectors · 数据连接</td><td>跨应用检索频率、权限拒绝率、连接成功率</td><td>若高频用户普遍受阻且接入成本可控，优先级可能更高</td></tr><tr><td>Schedules · 定时任务</td><td>重复任务发生频次、运行成功率、失败恢复耗时</td><td>若用户每周高频使用且任务稳定，潜在影响更明确</td></tr><tr><td>Skills · 可复用技能</td><td>技能复用次数、设置成本、任务完成率提升</td><td>若复用收益高但构建成本较大，需要进一步验证投入产出比</td></tr></tbody></table></div><div class=\"callout\"><strong>产品决策：</strong>先以相同的目标用户群和时间窗口收集 Reach、Impact、Confidence、Effort，再进行 RICE 排序；安全、隐私和法规等底线需求不应仅因分数低而被推迟。</div><h4 class=\"sub\">今天就能实践的四步</h4><div class=\"steps\"><div class=\"step\"><b>01 · 选定场景</b><span>明确目标用户、具体任务和统一的评估周期。</span></div><div class=\"step\"><b>02 · 建立证据</b><span>用访谈、埋点与实验估计触达人数和影响程度。</span></div><div class=\"step\"><b>03 · 评估投入</b><span>向研发与运营核对实现、维护成本和不确定性。</span></div><div class=\"step\"><b>04 · 排序验证</b><span>计算 RICE，记录假设并用小范围试点修正分数。</span></div></div><p class=\"lesson-lead\">核心提醒：RICE 是辅助排序工具，不是自动决策公式。对 Proton Lumo 这类涉及隐私和任务执行的产品，合规、授权可解释性与失败恢复必须先满足基本要求。</p></article></section>";
async function main(){
 const dir=path.resolve("src/assets");fs.mkdirSync(dir,{recursive:true});
 for(const a of assets){
  const ctrl=AbortSignal.timeout(25000);
  const resp=await fetch(a.url,{headers:{"user-agent":"Mozilla/5.0 (compatible; TechRadarPublisher/1.0; official-image-verification)","accept":"image/avif,image/webp,image/apng,image/*,*/*;q=0.8"},signal:ctrl});
  const type=resp.headers.get("content-type")||"";
  if(resp.status!==200||!type.startsWith("image/"))throw new Error("Image fetch failed "+a.key+" "+resp.status+" "+type);
  const bytes=Buffer.from(await resp.arrayBuffer());if(bytes.length<10000||bytes.length>12000000)throw new Error("Unexpected image size "+a.key+" "+bytes.length);
  fs.writeFileSync(path.join(dir,a.file),bytes);console.log("ASSET OK",a.key,resp.status,type,bytes.length);
 }
 let html=fs.readFileSync("src/index.html","utf8");
 const match=html.match(/const items=(\[[\s\S]*?\]);const esc=/);
 if(!match)throw new Error("Current product data array missing");
 const items=JSON.parse(match[1]);if(items.length!==8)throw new Error("Unexpected item count "+items.length);
 items.forEach((it,i)=>{it.image="/assets/"+assets[i].file;it.alt=it.name+" 官方发布图 / 官方产品截图"});
 html=html.replace(match[0],"const items="+JSON.stringify(items)+";const esc=");
 for(const a of [assets[1],assets[5]]){
  const local="/assets/"+a.file;
  html=html.replaceAll(a.url,local).replaceAll(a.url.replaceAll("&","&amp;"),local);
 }
 html=html.replace('<h2>产品观察</h2>','<h2>Tech Insights</h2>');
 const loc=/<section class="section" id="academy">[\s\S]*?<\/section>/;
 if(!loc.test(html))throw new Error("Academy section missing");
 html=html.replace(loc,lesson);
 if(!html.includes("Tech Insights")||!html.includes("Product Thinking")||!html.includes("RICE：资源有限时"))throw new Error("Lesson/title validation failed");
 if(!html.includes("calendar-lunar.js")||!html.includes("2026-11-20.html")||!html.includes("Asia/Shanghai"))throw new Error("Mother page module missing");
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 for(let i=0;i<scripts.length;i++){try{new Function(scripts[i])}catch(e){throw new Error("Inline script "+i+" invalid: "+e.message)}}
 fs.writeFileSync("src/index.html",html);
 console.log("FULL REPORT CHECKED",items.length,"products",assets.length,"images",scripts.length,"valid scripts");
}
main().catch(e=>{console.error(e);process.exit(1)});
