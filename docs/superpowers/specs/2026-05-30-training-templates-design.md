# 训练计划模板 — 设计文档

## 概述

在训练页整合计划模板功能，支持从预设模板库选择或自建模板，一键加载动作列表开始训练。新增组间休息计时器。

## 设计决策

| 决策 | 选择 | 参考依据 |
|------|------|----------|
| 模板范围 | 预设模板库 + 用户自建 | Keep 模式，预设降低门槛，自建满足个性化 |
| 模板内容 | 动作列表 + 组数/次数/间歇/备注 | 实用优先，不设重量目标（每次实际重量不同） |
| 入口位置 | 训练页顶部，不增导航 | 复用 workout.html，减少页面跳转 |
| 训练模式 | 逐个动作引导 + 组间倒计时 | 训练中手机放旁边，一眼看到当前状态 |

## 数据库

### 新建表

```sql
CREATE TABLE workout_templates (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users,
  name        text NOT NULL,
  is_preset   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

CREATE TABLE template_exercises (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id   uuid REFERENCES workout_templates ON DELETE CASCADE,
  exercise_id   uuid REFERENCES exercises,
  sort_order    int DEFAULT 0,
  sets          int NOT NULL DEFAULT 3,
  reps          int NOT NULL DEFAULT 10,
  rest_seconds  int DEFAULT 60,
  notes         text
);
```

- `user_id` 为 NULL 表示预设模板，所有用户可见
- `template_id ON DELETE CASCADE` 删除模板时联动删除动作
- RLS：预设模板所有人可读，自建模板只有创建者可读写

## 预设模板数据

3 个经典计划，每个含 4 个动作。

## 页面改动

仅 `workout.html` + `css/style.css`。

模板选择栏 → 动作列表（多动作、可删、可添加）→ 保存模板按钮 → 开始训练按钮 → 训练模式（当前动作 + 计时器）。
