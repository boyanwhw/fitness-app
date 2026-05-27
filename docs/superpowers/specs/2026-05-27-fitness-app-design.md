# 综合健身 App 设计文档

## 概述

一个基于 Web 的综合健身工具，支持运动记录、动作库、训练日记功能。先做网页版，后续可扩展为手机 App。

## 技术方案

- **前端**: HTML + CSS + JavaScript（原生，无框架）
- **后端/云服务**: Supabase（认证 + 数据库 + 文件存储）
- **部署**: Vercel / Netlify 静态托管

## 功能范围

### P0（第一版必须完成）

1. **用户注册/登录** — 邮箱注册，Supabase Auth 提供
2. **运动记录** — 选择动作 → 输入组数/次数/重量 → 保存到数据库
3. **动作库** — 预设常用健身动作，支持按肌群筛选
4. **训练日记** — 按天查看历史记录，显示本月训练次数

### P1（后续迭代）

5. 身体数据追踪（体重、体脂率、围度趋势图）
6. 训练计划模板

### P2（远期规划）

7. 饮食记录
8. 成就系统

## 页面结构

| 页面 | 路径 | 功能 |
|------|------|------|
| 登录/注册 | login.html | Supabase Auth 邮箱登录 |
| 首页仪表盘 | index.html | 今日概览、快捷入口 |
| 运动记录 | workout.html | 开始训练，记录组数/次数/重量 |
| 动作库 | exercises.html | 浏览和管理训练动作 |
| 训练日记 | diary.html | 历史记录查看、简单统计 |

## 数据库设计

### exercises 表（动作库）
- id: uuid (主键)
- name: text（动作名称，如"杠铃卧推"）
- muscle_group: text（目标肌群：胸/背/腿/肩/手臂/核心）
- description: text（动作说明）
- image_url: text（动作图示，可选）

### workout_records 表（训练记录）
- id: uuid (主键)
- user_id: uuid（关联用户）
- exercise_id: uuid（关联动作）
- sets: int（组数）
- reps: int（次数）
- weight_kg: float（重量，可选）
- notes: text（备注，可选）
- created_at: timestamptz（记录时间）

### body_measurements 表（身体数据，P1）
- id: uuid (主键)
- user_id: uuid
- weight_kg: float
- body_fat_pct: float（可选）
- measured_at: date

## 数据流

```
用户操作页面 → JS 调用 Supabase SDK → Supabase 处理 → 返回结果 → 页面更新
```

- 认证流程：用户提交邮箱密码 → Supabase Auth 验证 → 返回登录状态 → 跳转首页
- 记录流程：用户填写训练数据 → JS 调用 insert → Supabase 写入数据库 → 刷新日记页
- 查询流程：页面加载 → JS 调用 select → Supabase 返回数据 → 渲染到表格/列表

## UI 风格

- 简洁实用风格，深色主题
- 移动端优先设计（最大宽度 480px 居中）
- 大按钮、大字体，方便训练时操作
- 底部导航栏切换页面
