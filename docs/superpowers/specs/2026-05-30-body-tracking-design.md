# 身体数据追踪 — 设计文档

## 概述

在健身助手 App 的首页仪表盘嵌入身体数据追踪功能。用户可以记录体重、体脂率和围度数据，查看趋势图表。

## 设计决策

| 决策 | 选择 | 参考依据 |
|------|------|----------|
| 视觉风格 | 紫罗兰渐变（#a78bfa / #818cf8） | 高级感、与健身 App 主流绿色形成差异化 |
| 嵌入位置 | 首页仪表盘统计卡片下方 | 减少导航复杂度，打开 App 就能看到 |
| 图表库 | Chart.js v4（CDN: esm.sh） | 交互好（hover 提示、动画），体量小 |
| 录入方式 | Hero 卡内展开表单 | 顺手不打断浏览，参考 Whoop 的 inline 交互 |
| 布局 | Hero 数字型 | 一个大体重数字做锚点 + 迷你趋势 + 围度横排 |
| 围度项 | 固定 5 项（胸/腰/臀/臂/腿） | 参考 Apple Health，全显但可选填 |
| 指标 | 体重 + 体脂率（不含 BMI） | BMI 需要身高数据，增加复杂度但价值有限 |

## 数据库

### 新建 `body_measurements` 表

```sql
CREATE TABLE body_measurements (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users NOT NULL,
  weight_kg    float NOT NULL,
  body_fat_pct float,
  chest_cm     float,
  waist_cm     float,
  hip_cm       float,
  arm_cm       float,
  thigh_cm     float,
  measured_at  date NOT NULL DEFAULT CURRENT_DATE,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own measurements"
  ON body_measurements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own measurements"
  ON body_measurements FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

- 一次测量一行，除 `weight_kg` 外全部可选
- `measured_at` 用 `date` 类型，按天查询趋势方便
- RLS 启用，用户隔离

## 页面结构

首页仪表盘从上到下：

```
Topbar
统计卡片（2x2，不变）
身体数据 Hero 卡          <- 新增
  ├─ 体重 Hero 数字（最大）+ 体脂率
  ├─ 迷你 Chart.js 趋势线（最近 30 天）
  ├─ 5 项围度横排（胸/腰/臀/臂/腿）
  └─ 表单展开区域（初始隐藏）
Chart.js 趋势图（大图，7/30/90 天切换）
快捷操作（不变）
最近训练（不变）
BottomNav（不变）
```

## Hero 卡交互

1. **有数据时** — 显示最新记录的体重数字 + 迷你趋势 + 围度横排 + 「+ 记录」按钮
2. **空状态（首次使用）** — 紫罗兰色调空卡片，居中显示「还没有身体数据」+ 「记录第一次测量」引导按钮
3. **点击「+ 记录」** — 卡片下方平滑展开表单（CSS max-height 过渡），自动聚焦体重输入框
4. **保存** — 调用 Supabase insert，成功后收起表单，刷新数据和趋势图
5. **迷你趋势图** — Hero 卡内嵌小号 Chart.js（只显示 30 天体重折线，无坐标轴，纯装饰趋势感）
6. **大图区域** — Hero 卡下方的完整 Chart.js 图表，带坐标轴、hover 提示、7天/30天/90天切换按钮

## 文件改动范围

```
改 index.html        — Hero 卡 HTML + 表单 + 图表 canvas + inline JS
改 css/style.css     — 紫罗兰变量 + Hero 卡样式 + 表单展开动画
不动 js/app.js       — 复用已有 supabase 实例
不动 workout.html    — 无关联
不动 diary.html      — 无关联
不动 exercises.html  — 无关联
不动 login.html      — 无关联
```

外部依赖：Chart.js v4 通过 esm.sh CDN 加载

## CSS 新增变量

```css
:root {
  --violet:        #a78bfa;
  --violet-light:  #c4b5fd;
  --violet-dim:    #7c6aaa;
  --violet-bg:     rgba(139, 92, 246, 0.08);
  --violet-border: rgba(139, 92, 246, 0.12);
}
```

## 数据流

```
用户打开首页
  -> requireAuth()
  -> 查询 body_measurements
     (WHERE user_id, ORDER BY measured_at DESC LIMIT 1)
  -> 有数据: 渲染 Hero 卡 | 无数据: 渲染空状态
  -> 查询近 30 天体重数据 -> 渲染迷你 Chart.js

用户点「+ 记录」
  -> CSS 展开表单
  -> 填写体重（必填）+ 体脂率/围度（可选）
  -> 保存 -> supabase.from('body_measurements').insert(...)
  -> 收起表单、重新查询、刷新 Hero 卡和图表

用户点时间按钮（7/30/90 天）
  -> 重新查询 body_measurements -> Chart.js 更新数据
```
