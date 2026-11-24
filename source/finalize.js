const fs=require('fs');
(async()=>{
let html=fs.readFileSync('src/index.html','utf8');
const begin=html.indexOf('<section class="section" id="academy"');
const end=html.indexOf('</section>',begin);
if(begin<0||end<0)throw Error('lesson section missing');
let sec=html.slice(begin,end+10);
const pairs=[["TODAY'S FRAMEWORK / 03","TODAY'S FRAMEWORK / JTBD"],["FEASIBILITY","SITUATION"],["技术可行性","触发情境"],["DESIRABILITY","PROGRESS"],["用户价值","期望进展"],["VIABILITY","ALTERNATIVES"],["商业可持续","替代方案"],["它是否显著缩短仿真环境搭建时间、减少人工标注或降低试验成本？不要只看演示惊艳程度。","真实用户是在开发过程中反复切换工具、确认进度与处理返工，核心诉求是更稳定地完成任务。"],["算力成本、服务可用性、稳定性和权限边界能否支撑长期高频使用？","替代方案包括传统开发、外包和普通代码助手；应该比较整个任务的交付周期与错误成本。"],["以 Genie 4 × 机器人数据采集为例","以 Replit Missions × Agent 软件开发为例"],["概念验证","识别任务"],["能否稳定生成所需场景？","用户究竟要在什么场景完成哪类软件任务？"],["生成成功率、平均等待时间、帧率","任务触发频率、现有耗时、参与角色"],["任务验证","检验进展"],["场景是否支持可重复的操作任务？","Agent 能否交付符合验收标准的软件？"],["动作响应延迟、物体交互一致性","任务完成率、成本、人工接管次数"],["真实迁移","比较替代"],["模拟训练是否改善真实机器人表现？","相较传统开发，是否减少实际交付成本？"],["真实任务成功率、失败模式、人工干预率","验收通过率、返工次数、交付时间"],["先选一个低风险、可测量的抓取或导航任务，建立真实环境基线，再用 Genie 4 生成场景做对照实验。若无法证明真实任务提升，不应把“生成更逼真”当作商业价值。","先选一个边界清晰的小型软件需求，记录传统交付流程，再用 Replit Missions 执行并对比。若交付速度、成本和验收质量没有改善，就不能只凭 Agent 演示判断其有产品价值。"]];
for(const [a,b] of pairs){if(!sec.includes(a))throw Error('missing content '+a.slice(0,40));sec=sec.replaceAll(a,b)}
html=html.slice(0,begin)+sec+html.slice(end+10);
html=html.replace('<h2>Tech Insights</h2>','<h2>产品观察</h2>');
const original='https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2026/june/eagle.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg';
const nasa='https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/november/IMG_4364N_Kyriazis.jpg?w=1920&fit=clip';
try{const r=await fetch(nasa,{signal:AbortSignal.timeout(12000)});const type=r.headers.get('content-type')||'';if(r.ok&&type.startsWith('image/')){html=html.replaceAll(original,nasa);console.log('Verified NASA APOD image',r.status,type)}else console.log('NASA source fallback',r.status,type);if(r.body)await r.body.cancel()}catch(e){console.log('NASA source fallback',String(e).slice(0,100))}
fs.writeFileSync('src/index.html',html);console.log('Finalized lesson and background',html.length)
})().catch(e=>{console.error(e);process.exit(1)});
