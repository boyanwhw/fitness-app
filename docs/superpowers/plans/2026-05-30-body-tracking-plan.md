# 身体数据追踪 — 实现计划

> 使用 superpowers:executing-plans 按任务实施

**目标：** 在首页仪表盘嵌入身体数据追踪 Hero 卡（紫罗兰渐变风格）

**架构：** 纯前端 HTML/CSS/JS + Supabase，只改 index.html 和 style.css，复用现有 js/app.js

**技术栈：** Chart.js v4 + Supabase JS SDK

---

### 任务 1：CSS 样式 — 紫罗兰变量 + Hero 卡 + 表单动画

**文件：** `css/style.css`（在现有内容末尾追加）

- [ ] 添加 5 个 CSS 变量：`--violet`, `--violet-light`, `--violet-dim`, `--violet-bg`, `--violet-border`
- [ ] 添加 `.body-hero` 主卡片样式（渐变背景、圆角 12px、紫色边框）
- [ ] 添加 `.body-hero .hero-weight` 大体数字样式（36px 粗体）
- [ ] 添加 `.body-hero .hero-sub` 辅助指标行
- [ ] 添加 `.body-hero .circ-list` 围度横排样式
- [ ] 添加 `.body-form` 表单展开/收起（max-height 0 → 200px 过渡）
- [ ] 添加 mini chart 容器 `.chart-mini`（高度 60px）
- [ ] 添加大图容器 `.chart-full`（高度 250px）
- [ ] 添加空状态 `.body-empty` 样式
- [ ] 提交

### 任务 2：HTML + JS — Hero 卡结构 + 数据逻辑

**文件：** `index.html`（在统计卡片和快捷操作之间插入 Hero 卡区域）

- [ ] 添加 Hero 卡 HTML（体重大数字 + 体脂率 + 围度横排 + 记录按钮）
- [ ] 添加空状态 HTML（初始隐藏）
- [ ] 添加表单 HTML（初始隐藏，体重必填 + 体脂率/围度选填）
- [ ] 添加 Chart.js canvas（迷你 trend 图 + 大图）
- [ ] 添加 loadBodyData() 函数：查最新记录 + 30 天趋势 → 渲染
- [ ] 添加表单展开/收起逻辑
- [ ] 添加保存逻辑（insert → 刷新）
- [ ] 添加 Chart.js 初始化 + 时间切换逻辑
- [ ] 提交

### 任务 3：数据库 — 建表 + RLS

- [ ] 在 Supabase SQL Editor 执行建表 SQL
- [ ] 验证 RLS 生效
