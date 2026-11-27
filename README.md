# 科技新品雷达 · Tech Radar

[![在线体验](https://img.shields.io/badge/在线体验-Tech%20Radar-398dff?style=flat-square)](https://tech-radar-daily.vercel.app/)
![每日更新](https://img.shields.io/badge/每日发布-06%3A00%20CST-398dff?style=flat-square)
![技术栈](https://img.shields.io/badge/HTML%20%2F%20CSS%20%2F%20JavaScript-Vercel-182c43?style=flat-square)

**[打开正式网站 →](https://tech-radar-daily.vercel.app/)**

面向产品经理、开发者、创客与科技爱好者的中文科技日报。聚焦全球真实科技新品、重要版本更新、产品体验与设计思考，提供来源链接、真实产品配图及历史刊期。

## 最新刊期 · 2026.11.27

本期精选 6 项产品与技术更新，覆盖印度、日本和中国：

- **vivo X500 Series**：印度发布，重点关注长焦追踪与高帧率视频能力。
- **vivo WATCH GT 2**：vivo 在印度推出首款智能手表。
- **ALLDOCUBE iPlay 80H**：日本上市的 11 英寸 Android 17 平板。
- **DataCanvas Physical AI Factory**：连接数据、模型、仿真、真机验证与运营部署。
- **浙江人形 SPIRE 2.0**：Navi 数据、环境表征、动作策略与技能库协同。
- **EngineAI Awaken 消防巡检方案**：将任务理解、导航、操作和检测用于消防设施巡检。

本期「现在就试」：OpenSCAD、n8n。Product Thinking 每日课程：服务蓝图（Service Blueprint），以机器人消防巡检为案例拆解用户动作、前台触点、后台流程与支撑系统。

## 视觉与功能

- 全屏每日科技主题摄影背景，首页保留真实图片细节。
- 深色与浅色两套独立主题，支持响应式布局。
- 新品分类筛选、产品来源链接、工具体验入口、Tech Insights、Product Thinking。
- 历史日报按日期归档，日历可跳转历史刊期。
- 首页不展示额外副标题，突出刊期和主标题。

本期背景摄影：[Freek Wolsink · Pexels](https://www.pexels.com/photo/industrial-robot-arm-in-a-manufacturing-facility-34207359/)。产品配图优先采用官方图片；使用媒体图片时在页面标注图片来源。具体图片地址和来源记录在 `/assets/2026-11-27-image-sources.json`。

## 项目结构

```text
Tech-radar/
├── README.md
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
- 每次发布同步 GitHub 的首页源码、构建脚本、`vercel.json`、`EXPORT-MANIFEST.json` 和 README。
- 自动任务由 ChatGPT 自动化执行，不是本仓库内的 GitHub Actions 定时爬虫；不发送邮件。

## Vercel 部署

正式网站：[tech-radar-daily.vercel.app](https://tech-radar-daily.vercel.app/)。生产项目使用独立的 Vercel 构建入口；本仓库保留静态快照、每日源码和构建脚本。不要直接将根目录静态配置切换为生产项目的唯一构建来源，以免覆盖历史发布流程。

## 源码恢复说明

当前生产部署已同步至 `source/EXPORT-MANIFEST.json`。历史恢复过程中有两个旧文件未纳入公开源码：`issue23-images.js` 需要进一步检查，`fogg-zh-annotated.webp` 需要核实素材再分发许可。当前 11 月 27 日刊期已通过可用构建脚本完成 Production 发布；后续继续保留原始来源与许可记录。

## 图片与版权

产品图片、摄影作品、品牌标识及理论插图的权利归各自权利人；保留原始来源链接，未经许可不要将第三方图像作为独立素材再分发。日历依赖 lunar-javascript，按其上游许可使用。视觉参考：[Langflow](https://www.langflow.org/) 与 Apple 玻璃材质设计。
