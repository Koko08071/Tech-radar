# 科技新品雷达 · Tech Radar

[![在线体验](https://img.shields.io/badge/在线体验-Tech%20Radar-398dff?style=flat-square)](https://tech-radar-daily.vercel.app/)
![每日更新](https://img.shields.io/badge/每日发布-06%3A00%20CST-398dff?style=flat-square)
![技术栈](https://img.shields.io/badge/HTML%20%2F%20CSS%20%2F%20JavaScript-Vercel-182c43?style=flat-square)

**[打开正式网站 →](https://tech-radar-daily.vercel.app/)**

面向产品经理、开发者、创客与科技爱好者的中文科技日报。聚焦全球真实科技新品、重要版本更新、产品体验与设计思考，提供来源链接、真实产品配图及历史刊期。

## 首页动态预览

[![科技新品雷达首页动态预览（高清，7 秒循环）](https://raw.githubusercontent.com/Koko08071/Tech-radar/eb9e2fb12c93b3c93a04aabfb3a0af6a2b235f14/docs/homepage-preview.gif)](https://tech-radar-daily.vercel.app/)

*正式站录屏，包含动态背景、TECH RADAR 主标题、极简数字信息条与横向滚动的科技生态标签。点击动图可进入正式网站。*

## 最新刊期 · 2026.11.27

本期精选 6 项产品与技术更新，覆盖印度、日本和中国：

- **vivo X500 Series**：印度发布，重点关注长焦追踪与高帧率视频能力。
- **vivo WATCH GT 2**：vivo 在印度推出首款智能手表。
- **ALLDOCUBE iPlay 80H**：日本上市的 11 英寸 Android 17 平板。
- **DataCanvas Physical AI Factory**：连接数据、模型、仿真、真机验证与运营部署。
- **浙江人形 SPIRE 2.0**：Navi 数据、环境表征、动作策略与技能库协同。
- **EngineAI Awaken 消防巡检方案**：将任务理解、导航、操作和检测用于消防设施巡检。

本期「现在就试」：OpenSCAD、n8n。产品研习每日课程：服务蓝图（Service Blueprint），以 Amazon 1-Click 一键下单这一经典功能拆解用户动作、前台触点、后台流程与支撑系统；后台链路明确标注为教学推演，不冒充 Amazon 内部架构。

## 产品研习内容原则

- 本栏目定位为产品经理经典理论与方法论学习，不做当日科技新闻的延伸评论。
- 每期先讲理论定义、提出背景、核心结构和适用场景，再用与理论高度匹配的经典产品或经典功能解释，例如 Amazon 1-Click、iPhone 多点触控、Google 搜索、微信红包等。
- 案例事实优先引用产品官方资料；公开资料未披露的后台流程必须标注为教学推演，不得写成企业真实内部实现。
- 理论图紧跟理论说明，优先使用权威原图；无法直接使用时自行绘制并标注理论来源。案例照片不能代替理论图。

## 视觉与功能

- 全屏真实科技主题动态背景、金属质感 TECH RADAR 标题、极简数字信息条与横向滚动科技生态标签。
- 深色与浅色两套独立主题，太阳/月亮图标切换，支持响应式布局。
- 导航左侧仅保留返回首页的品牌图标，五个栏目居中，日期和主题采用轻量图标控件，当前栏目随滚动高亮；首页统计数字不补前导零。
- 工具实验室、前沿雷达、科技洞察、产品研习、往期档案五大栏目。
- 历史日报按日期归档，日历可跳转历史刊期。
- 首页不展示额外副标题，突出刊期和主标题。

本期背景摄影：[Freek Wolsink · Pexels](https://www.pexels.com/photo/industrial-robot-arm-in-a-manufacturing-facility-34207359/)。产品配图优先采用官方图片；使用媒体图片时在页面标注图片来源。具体图片地址和来源记录在 `/assets/2026-11-27-image-sources.json`。

## 项目结构

```text
Tech-radar/
├── README.md
├── docs/
│   └── homepage-preview.gif      # 正式站首页高清动态预览
├── scripts/
│   └── capture-homepage-preview.cjs
├── .github/workflows/
│   └── capture-homepage-preview.yml
├── site/
│   ├── index.html             # 2026-11-27 首页快照
│   ├── archive/               # 11 月 17–26 日历史日报
│   ├── calendar-lunar.js
│   └── *.css / *.js
├── source/
│   ├── nov27-final.html       # 当期生产页面源码
│   ├── nov27-final-build.js   # 当期构建入口
│   ├── nov27-final-release.js # 图片校验、归档与发布检查
│   ├── EXPORT-MANIFEST.json   # 最新 production deployment 文件清单
│   ├── vercel.json
│   └── 历史刊期及构建脚本
└── vercel.json
```

## 本地浏览

```bash
git clone https://github.com/Koko08071/Tech-radar.git
cd Tech-radar
python -m http.server 8000 --directory site
```

打开 http://localhost:8000 。静态快照包含页面、脚本与历史归档；第三方图片保留网络来源，需要互联网连接，不保证完全离线运行。

## 每日发布与核验

- **06:00（北京时间）**：每日新品研究、页面制作、归档、构建与 Vercel Production 发布。
- **06:30（北京时间）**：独立核验当天刊期、图片、归档与正式域名；若主任务漏发或内容不完整，自动补发。
- 只有 Production 部署为 READY、正式域名 HTTP 200、当天内容和关键图片可访问，才算发布成功。
- **每次更新（含日更、UI 微调、功能修复）均同步 GitHub `main`**：首页快照、实际生产源码、构建脚本、配置、部署清单和 README；不得只更新 Vercel。
- 首页视觉或交互改版后，GitHub Actions 自动录制正式站 7 秒循环动图（优先 1440 × 810、12 fps，按 25 MB 上限自适应编码），更新 `docs/homepage-preview.gif` 并同步 README；不再用静态截图代替动态背景。
- 自动任务由 ChatGPT 自动化执行，不是本仓库内的 GitHub Actions 定时爬虫；不发送邮件。

## Vercel 部署

正式网站：[tech-radar-daily.vercel.app](https://tech-radar-daily.vercel.app/)。生产项目使用独立的 Vercel 构建入口；本仓库保留静态快照、每日源码和构建脚本。不要直接将根目录静态配置切换为生产项目的唯一构建来源，以免覆盖历史发布流程。

## 源码恢复说明

当前生产部署已同步至 `source/EXPORT-MANIFEST.json`。历史恢复过程中有两个旧文件未纳入公开源码：`issue23-images.js` 需要进一步检查，`fogg-zh-annotated.webp` 需要核实素材再分发许可。当前 11 月 27 日刊期已通过可用构建脚本完成 Production 发布；后续继续保留原始来源与许可记录。

## 图片与版权

产品图片、摄影作品、品牌标识及理论插图的权利归各自权利人；保留原始来源链接，未经许可不要将第三方图像作为独立素材再分发。日历依赖 lunar-javascript，按其上游许可使用。视觉参考：[Langflow](https://www.langflow.org/) 与 Apple 玻璃材质设计。
