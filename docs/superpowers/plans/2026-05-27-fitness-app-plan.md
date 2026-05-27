# 健身 App 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个基于 Web 的综合健身工具，支持用户注册登录、运动记录、动作库浏览和训练日记查看。

**Architecture:** 纯前端 HTML/CSS/JS + Supabase 云后端。浏览器直接调用 Supabase SDK 完成认证、数据读写。无构建工具，无服务器代码。移动端优先，深色主题。

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript, Supabase (Auth + Database), 部署到 Vercel

---

## 文件结构

```
fitness-app/
├── index.html              # 首页仪表盘
├── login.html              # 登录/注册页
├── workout.html            # 运动记录页
├── exercises.html          # 动作库页
├── diary.html              # 训练日记页
├── css/
│   └── style.css           # 全局样式（深色主题、移动端布局）
├── js/
│   └── app.js              # Supabase 初始化 + 通用工具函数
├── favicon.ico             # 网站图标（不需要）
```

---

### Task 1: 创建项目并配置 Supabase

**Files:**
- Create: `js/app.js`
- Create: `css/style.css`

#### 步骤说明

> **注意：** Supabase 项目创建需要在浏览器中手动操作，无法通过命令行完成。

- [ ] **Step 1: 创建项目目录结构**

```bash
mkdir -p "C:/Users/wanghongwei/fitness-app/css" "C:/Users/wanghongwei/fitness-app/js"
```

- [ ] **Step 2: 注册 Supabase 并创建项目**

在浏览器中打开 https://supabase.com ，用 GitHub 账号注册登录。
点击 "New project"，填写：
- Name: `fitness-app`
- Database Password: 设置一个你记得住的密码
- Region: 选离你最近的区域（亚洲选 Northeast Asia 或 Southeast Asia）
- 点击 "Create project"，等待 2 分钟让数据库启动

- [ ] **Step 3: 获取 Supabase 连接信息**

在 Supabase 项目面板左侧菜单 → 点击齿轮图标 "Settings" → 点击 "API"。
记录以下两个值（后面会用到）：
- **Project URL**: 类似 `https://xxxxxxxxxxxx.supabase.co`
- **anon public key**: 一长串字符串，以 `eyJ` 开头

- [ ] **Step 4: 创建数据库表**

在 Supabase 面板 → 左侧 "SQL Editor" → 点击 "New query"，粘贴以下 SQL 并点击 "Run":

```sql
-- 动作库表
CREATE TABLE exercises (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  muscle_group text NOT NULL,
  description text DEFAULT '',
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- 训练记录表
CREATE TABLE workout_records (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  exercise_id uuid REFERENCES exercises(id) NOT NULL,
  sets int NOT NULL,
  reps int NOT NULL,
  weight_kg float DEFAULT 0,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- 启用行级安全策略（RLS）
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_records ENABLE ROW LEVEL SECURITY;

-- exercises 表：所有人都能读，只有登录用户能新增
CREATE POLICY "Anyone can read exercises" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert exercises" ON exercises
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- workout_records 表：用户只能读写自己的记录
CREATE POLICY "Users can read own records" ON workout_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON workout_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON workout_records
  FOR DELETE USING (auth.uid() = user_id);
```

- [ ] **Step 5: 插入预设动作数据**

在 SQL Editor 新建一个 query，粘贴以下 SQL 并运行:

```sql
INSERT INTO exercises (name, muscle_group, description) VALUES
  ('杠铃卧推', '胸', '平躺在卧推凳上，双手握住杠铃，从胸部向上推起至手臂伸直'),
  ('哑铃飞鸟', '胸', '仰卧在平凳上，双手各持哑铃向两侧打开，再合拢'),
  ('俯卧撑', '胸', '双手撑地与肩同宽，身体保持直线，弯曲手臂下放胸部接近地面再推起'),
  ('引体向上', '背', '双手握住单杠，身体悬垂，用背部力量将身体拉起至下巴过杠'),
  ('杠铃划船', '背', '身体前倾，双手握住杠铃，将杠铃沿大腿方向上拉至腹部'),
  ('高位下拉', '背', '坐在器械前，双手宽握横杆，将横杆下拉至胸前'),
  ('杠铃深蹲', '腿', '将杠铃放在斜方肌上，下蹲至大腿与地面平行后站起'),
  ('腿举', '腿', '坐在腿举机上，双脚蹬住踏板，弯曲膝盖后将踏板推起'),
  ('哑铃弯举', '手臂', '站立双手各持哑铃，上臂固定，弯曲肘部将哑铃举起'),
  ('三头臂屈伸', '手臂', '双手撑在凳子边缘，身体悬空，弯曲手臂下放身体再推起'),
  ('杠铃推举', '肩', '坐姿或站姿，将杠铃从肩部推举至头顶上方'),
  ('哑铃侧平举', '肩', '站立双手各持哑铃，手臂微屈从身体两侧抬起至肩高'),
  ('平板支撑', '核心', '俯卧用前臂和脚尖支撑身体，保持身体成一条直线'),
  ('卷腹', '核心', '仰卧膝盖弯曲，用腹部力量将上背部抬离地面'),
  ('罗马尼亚硬拉', '腿', '双手持杠铃，保持背部挺直，臀部后移将杠铃沿腿部下放再拉起'),
  ('哑铃耸肩', '肩', '站立双手各持哑铃，保持手臂伸直，耸肩将哑铃提起'),
  ('坐姿划船', '背', '坐在划船机上，双手握住把手，将把手拉向腹部'),
  ('腿弯举', '腿', '俯卧在腿弯举机上，用大腿后侧力量将负重向上弯举'),
  ('杠铃弯举', '手臂', '站立双手握住杠铃，上臂固定，弯曲肘部将杠铃举起'),
  ('悬垂举腿', '核心', '悬挂在单杠上，用腹部力量将双腿抬起至与地面平行');
```

- [ ] **Step 6: 创建 Supabase 初始化文件**

创建 `js/app.js`:

```javascript
// Supabase 初始化 - 把下面的值替换成你在 Step 3 记录的实际值
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_KEY = '你的anon-public-key';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 检查用户是否已登录
async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 退出登录
async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

// 获取当前用户，未登录则跳转到登录页
async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}
```

- [ ] **Step 7: 创建全局样式**

创建 `css/style.css`:

```css
/* === 基础重置 === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* === 颜色变量（深色主题）=== */
:root {
  --bg: #0f0f0f;
  --bg-card: #1a1a1a;
  --bg-input: #252525;
  --accent: #00c853;
  --accent-hover: #00e676;
  --text: #ffffff;
  --text-2: #999999;
  --border: #2a2a2a;
  --danger: #ff5252;
  --radius: 12px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  line-height: 1.5;
}

/* === 容器 === */
.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 16px 100px;
}

/* === 顶部导航栏 === */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
}
.topbar h1 {
  font-size: 20px;
  font-weight: 700;
}

/* === 底部导航栏 === */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 480px;
  display: flex;
  justify-content: space-around;
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 10px 0;
  z-index: 10;
}
.bottom-nav a {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-2);
  text-decoration: none;
  font-size: 11px;
  padding: 4px 16px;
  border-radius: 8px;
  transition: color 0.15s;
}
.bottom-nav a.active {
  color: var(--accent);
}
.bottom-nav a .nav-icon {
  font-size: 22px;
}

/* === 卡片 === */
.card {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 16px;
  margin-bottom: 12px;
}

/* === 按钮 === */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border: none;
  border-radius: var(--radius);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;
  text-decoration: none;
  color: var(--text);
  width: 100%;
}
.btn-primary {
  background: var(--accent);
  color: #000;
}
.btn-primary:hover {
  background: var(--accent-hover);
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--border);
}
.btn-outline:hover {
  background: var(--bg-input);
}
.btn-danger {
  background: var(--danger);
  color: #fff;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  width: auto;
}

/* === 表单 === */
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  color: var(--text-2);
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 16px;
  outline: none;
  transition: border-color 0.15s;
}
.form-group input:focus,
.form-group select:focus {
  border-color: var(--accent);
}

/* === 统计数字 === */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.stat-item {
  background: var(--bg-card);
  border-radius: var(--radius);
  padding: 20px 16px;
  text-align: center;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent);
}
.stat-label {
  font-size: 13px;
  color: var(--text-2);
  margin-top: 4px;
}

/* === 训练列表 === */
.workout-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border);
}
.workout-item:last-child {
  border-bottom: none;
}
.workout-name {
  font-weight: 600;
}
.workout-detail {
  font-size: 13px;
  color: var(--text-2);
}

/* === 肌群标签 === */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.tag {
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--bg-input);
  color: var(--text-2);
  font-size: 13px;
  cursor: pointer;
  border: 1px solid var(--border);
  transition: all 0.15s;
}
.tag.active {
  background: var(--accent);
  color: #000;
  border-color: var(--accent);
}

/* === 空状态 === */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-2);
}
.empty-state .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}
.empty-state p {
  font-size: 15px;
}

/* === 加载动画 === */
.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* === 工具类 === */
.mt-8 { margin-top: 8px; }
.mt-16 { margin-top: 16px; }
.mb-8 { margin-bottom: 8px; }
.mb-16 { margin-bottom: 16px; }
.text-center { text-align: center; }
.text-2 { color: var(--text-2); }
.flex-between { display: flex; justify-content: space-between; align-items: center; }
```

- [ ] **Step 8: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git init
git add .
git commit -m "feat: 项目初始化 - Supabase 配置、全局样式、数据库表结构"
```

---

### Task 2: 登录/注册页面

**Files:**
- Create: `login.html`

- [ ] **Step 1: 创建 login.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>登录 - 健身助手</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="container" style="display:flex;flex-direction:column;justify-content:center;min-height:100vh;padding-bottom:20px;">
    <div style="text-align:center;margin-bottom:40px;">
      <div style="font-size:48px;margin-bottom:12px;">💪</div>
      <h1 style="font-size:28px;">健身助手</h1>
      <p class="text-2 mt-8">记录每一次进步</p>
    </div>

    <div class="card">
      <!-- 登录表单 -->
      <form id="loginForm">
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" id="loginEmail" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" id="loginPassword" placeholder="输入密码" required minlength="6">
        </div>
        <button type="submit" class="btn btn-primary">登 录</button>
      </form>

      <div style="text-align:center;margin:16px 0;color:var(--text-2);">— 或者 —</div>

      <!-- 注册表单 -->
      <form id="registerForm">
        <div class="form-group">
          <label>注册新账号</label>
          <input type="email" id="regEmail" placeholder="your@email.com" required>
        </div>
        <div class="form-group">
          <input type="password" id="regPassword" placeholder="设置密码（至少6位）" required minlength="6">
        </div>
        <button type="submit" class="btn btn-outline">注 册</button>
      </form>
    </div>

    <p id="msg" class="text-center mt-16" style="min-height:24px;"></p>
  </div>

  <script>
    // Supabase 初始化
    const SUPABASE_URL = 'https://你的项目ID.supabase.co';
    const SUPABASE_KEY = '你的anon-public-key';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const msg = document.getElementById('msg');

    function showMsg(text, isError) {
      msg.textContent = text;
      msg.style.color = isError ? 'var(--danger)' : 'var(--accent)';
    }

    // 登录
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        showMsg('登录失败: ' + error.message, true);
      } else {
        window.location.href = 'index.html';
      }
    });

    // 注册
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('regEmail').value;
      const password = document.getElementById('regPassword').value;

      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        showMsg('注册失败: ' + error.message, true);
      } else {
        showMsg('注册成功！请查看邮箱确认（如未收到可忽略，直接登录即可）', false);
      }
    });
  </script>
</body>
</html>
```

- [ ] **Step 2: 替换 Supabase 配置**

在 `login.html` 中找到这两行，替换成你的实际值：
```javascript
const SUPABASE_URL = 'https://你的项目ID.supabase.co';   // 改成你的 Project URL
const SUPABASE_KEY = '你的anon-public-key';               // 改成你的 anon key
```

- [ ] **Step 3: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add login.html
git commit -m "feat: 登录/注册页面"
```

---

### Task 3: 首页仪表盘

**Files:**
- Create: `js/app.js`
- Create: `index.html`

- [ ] **Step 1: 创建 js/app.js（更新版，合并 Supabase 初始化）**

```javascript
const SUPABASE_URL = 'https://你的项目ID.supabase.co';
const SUPABASE_KEY = '你的anon-public-key';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function signOut() {
  await supabase.auth.signOut();
  window.location.href = 'login.html';
}

async function requireAuth() {
  const user = await checkAuth();
  if (!user) {
    window.location.href = 'login.html';
    return null;
  }
  return user;
}
```

- [ ] **Step 2: 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>健身助手</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="topbar">
    <h1>💪 健身助手</h1>
    <button class="btn btn-sm btn-outline" onclick="signOut()">退出</button>
  </div>

  <div class="container">
    <!-- 统计卡片 -->
    <div class="stat-grid mb-16">
      <div class="stat-item">
        <div class="stat-value" id="monthCount">--</div>
        <div class="stat-label">本月训练次数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="todayCount">--</div>
        <div class="stat-label">今日记录数</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="totalExercises">--</div>
        <div class="stat-label">动作库动作</div>
      </div>
      <div class="stat-item">
        <div class="stat-value" id="streakDays">--</div>
        <div class="stat-label">连续训练天数</div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <h3 style="margin-bottom:12px;">快捷操作</h3>
    <a href="workout.html" class="btn btn-primary mb-8">🏋️ 开始训练</a>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <a href="exercises.html" class="btn btn-outline">📚 动作库</a>
      <a href="diary.html" class="btn btn-outline">📝 训练日记</a>
    </div>

    <!-- 最近训练 -->
    <h3 style="margin:24px 0 12px;">最近训练</h3>
    <div id="recentWorkouts"></div>
  </div>

  <!-- 底部导航 -->
  <nav class="bottom-nav">
    <a href="index.html" class="active">
      <span class="nav-icon">📊</span>首页
    </a>
    <a href="workout.html">
      <span class="nav-icon">🏋️</span>训练
    </a>
    <a href="exercises.html">
      <span class="nav-icon">📚</span>动作库
    </a>
    <a href="diary.html">
      <span class="nav-icon">📝</span>日记
    </a>
  </nav>

  <script src="js/app.js"></script>
  <script>
    async function loadDashboard() {
      const user = await requireAuth();
      if (!user) return;

      // 本月训练次数
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const { count: monthCount } = await supabase
        .from('workout_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());
      document.getElementById('monthCount').textContent = monthCount || 0;

      // 今日记录数
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('workout_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());
      document.getElementById('todayCount').textContent = todayCount || 0;

      // 动作库总数
      const { count: exerciseCount } = await supabase
        .from('exercises')
        .select('*', { count: 'exact', head: true });
      document.getElementById('totalExercises').textContent = exerciseCount || 0;

      // 连续训练天数（简化版：查最近7天有记录的天数）
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data: recentRecords } = await supabase
        .from('workout_records')
        .select('created_at')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const uniqueDays = new Set();
      (recentRecords || []).forEach(r => {
        uniqueDays.add(r.created_at.split('T')[0]);
      });

      // 从今天往回数连续天数
      let streak = 0;
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dayStr = d.toISOString().split('T')[0];
        if (uniqueDays.has(dayStr)) streak++;
        else break;
      }
      document.getElementById('streakDays').textContent = streak;

      // 最近训练
      const { data: recent } = await supabase
        .from('workout_records')
        .select('id, sets, reps, weight_kg, created_at, exercises!inner(name, muscle_group)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const container = document.getElementById('recentWorkouts');
      if (!recent || recent.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>还没有训练记录</p><a href="workout.html" class="btn btn-primary mt-16">开始第一次训练</a></div>';
        return;
      }

      container.innerHTML = recent.map(r => `
        <div class="workout-item">
          <div>
            <div class="workout-name">${r.exercises.name}</div>
            <div class="workout-detail">${r.sets}组 × ${r.reps}次 ${r.weight_kg ? r.weight_kg + 'kg' : ''}</div>
          </div>
          <div class="text-2" style="font-size:12px;">${new Date(r.created_at).toLocaleDateString('zh-CN')}</div>
        </div>
      `).join('');
    }

    loadDashboard();
  </script>
</body>
</html>
```

- [ ] **Step 3: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add index.html js/app.js
git commit -m "feat: 首页仪表盘 - 统计概览和快捷入口"
```

---

### Task 4: 动作库页面

**Files:**
- Create: `exercises.html`

- [ ] **Step 1: 创建 exercises.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>动作库 - 健身助手</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="topbar">
    <h1>📚 动作库</h1>
  </div>

  <div class="container">
    <!-- 肌群筛选 -->
    <div class="tags" id="muscleTags">
      <span class="tag active" data-group="all">全部</span>
      <span class="tag" data-group="胸">胸</span>
      <span class="tag" data-group="背">背</span>
      <span class="tag" data-group="腿">腿</span>
      <span class="tag" data-group="肩">肩</span>
      <span class="tag" data-group="手臂">手臂</span>
      <span class="tag" data-group="核心">核心</span>
    </div>

    <!-- 动作列表 -->
    <div id="exerciseList"></div>
  </div>

  <nav class="bottom-nav">
    <a href="index.html"><span class="nav-icon">📊</span>首页</a>
    <a href="workout.html"><span class="nav-icon">🏋️</span>训练</a>
    <a href="exercises.html" class="active"><span class="nav-icon">📚</span>动作库</a>
    <a href="diary.html"><span class="nav-icon">📝</span>日记</a>
  </nav>

  <script src="js/app.js"></script>
  <script>
    let allExercises = [];
    let currentGroup = 'all';

    async function loadExercises() {
      await requireAuth();
      const { data } = await supabase
        .from('exercises')
        .select('*')
        .order('muscle_group')
        .order('name');
      allExercises = data || [];
      renderExercises();
    }

    function renderExercises() {
      const filtered = currentGroup === 'all'
        ? allExercises
        : allExercises.filter(e => e.muscle_group === currentGroup);

      const container = document.getElementById('exerciseList');
      if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📭</div><p>该肌群还没有动作</p></div>';
        return;
      }

      // 按肌群分组
      const groups = {};
      filtered.forEach(e => {
        if (!groups[e.muscle_group]) groups[e.muscle_group] = [];
        groups[e.muscle_group].push(e);
      });

      container.innerHTML = Object.entries(groups).map(([group, exercises]) => `
        <div class="mb-16">
          <h3 style="color:var(--accent);margin-bottom:8px;">${group}</h3>
          ${exercises.map(e => `
            <div class="card" style="cursor:pointer;" onclick="showDetail('${e.id}')">
              <div class="workout-name">${e.name}</div>
              <div class="workout-detail mt-8">${e.description || '暂无说明'}</div>
            </div>
          `).join('')}
        </div>
      `).join('');
    }

    function showDetail(id) {
      const ex = allExercises.find(e => e.id === id);
      if (ex) {
        alert(`${ex.name}\n\n肌群: ${ex.muscle_group}\n说明: ${ex.description || '暂无'}`);
      }
    }

    // 标签切换
    document.getElementById('muscleTags').addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) {
        document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentGroup = e.target.dataset.group;
        renderExercises();
      }
    });

    loadExercises();
  </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add exercises.html
git commit -m "feat: 动作库页面 - 按肌群筛选浏览"
```

---

### Task 5: 运动记录页面

**Files:**
- Create: `workout.html`

- [ ] **Step 1: 创建 workout.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>训练 - 健身助手</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="topbar">
    <h1>🏋️ 开始训练</h1>
  </div>

  <div class="container">
    <!-- 选择动作 -->
    <div class="form-group">
      <label>选择动作</label>
      <select id="exerciseSelect">
        <option value="">-- 请选择训练动作 --</option>
      </select>
    </div>

    <!-- 训练参数 -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
      <div class="form-group">
        <label>组数</label>
        <input type="number" id="setsInput" value="3" min="1" max="20">
      </div>
      <div class="form-group">
        <label>次数</label>
        <input type="number" id="repsInput" value="10" min="1" max="100">
      </div>
    </div>

    <div class="form-group">
      <label>重量（kg，可选）</label>
      <input type="number" id="weightInput" placeholder="留空表示自重训练" step="0.5" min="0">
    </div>

    <div class="form-group">
      <label>备注（可选）</label>
      <input type="text" id="notesInput" placeholder="如：状态不错、最后一组力竭...">
    </div>

    <button class="btn btn-primary" onclick="saveRecord()">💾 保存记录</button>
    <p id="saveMsg" class="text-center mt-8" style="min-height:24px;"></p>

    <!-- 本次训练记录 -->
    <h3 style="margin:24px 0 12px;">本次训练记录</h3>
    <div id="sessionRecords"></div>
  </div>

  <nav class="bottom-nav">
    <a href="index.html"><span class="nav-icon">📊</span>首页</a>
    <a href="workout.html" class="active"><span class="nav-icon">🏋️</span>训练</a>
    <a href="exercises.html"><span class="nav-icon">📚</span>动作库</a>
    <a href="diary.html"><span class="nav-icon">📝</span>日记</a>
  </nav>

  <script src="js/app.js"></script>
  <script>
    let user = null;
    let sessionRecords = [];

    async function initPage() {
      user = await requireAuth();
      if (!user) return;

      // 加载动作列表到下拉框
      const { data: exercises } = await supabase
        .from('exercises')
        .select('*')
        .order('muscle_group')
        .order('name');

      const select = document.getElementById('exerciseSelect');
      // 按肌群分组
      const groups = {};
      (exercises || []).forEach(e => {
        if (!groups[e.muscle_group]) groups[e.muscle_group] = [];
        groups[e.muscle_group].push(e);
      });

      select.innerHTML = '<option value="">-- 请选择训练动作 --</option>';
      Object.entries(groups).forEach(([group, exs]) => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = group;
        exs.forEach(e => {
          const opt = document.createElement('option');
          opt.value = e.id;
          opt.textContent = e.name;
          optgroup.appendChild(opt);
        });
        select.appendChild(optgroup);
      });

      // 加载本次会话记录
      loadSessionRecords();
    }

    async function saveRecord() {
      const exerciseId = document.getElementById('exerciseSelect').value;
      const sets = parseInt(document.getElementById('setsInput').value);
      const reps = parseInt(document.getElementById('repsInput').value);
      const weight = parseFloat(document.getElementById('weightInput').value) || 0;
      const notes = document.getElementById('notesInput').value;

      if (!exerciseId) {
        showMsg('请先选择训练动作', true);
        return;
      }
      if (!sets || !reps) {
        showMsg('请填写组数和次数', true);
        return;
      }

      const { error } = await supabase.from('workout_records').insert({
        user_id: user.id,
        exercise_id: exerciseId,
        sets: sets,
        reps: reps,
        weight_kg: weight,
        notes: notes
      });

      if (error) {
        showMsg('保存失败: ' + error.message, true);
      } else {
        showMsg('保存成功！', false);
        document.getElementById('notesInput').value = '';
        document.getElementById('weightInput').value = '';
        loadSessionRecords();
      }
    }

    async function loadSessionRecords() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data } = await supabase
        .from('workout_records')
        .select('id, sets, reps, weight_kg, notes, created_at, exercises!inner(name, muscle_group)')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      sessionRecords = data || [];
      const container = document.getElementById('sessionRecords');

      if (sessionRecords.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>今天还没有训练记录</p></div>';
        return;
      }

      container.innerHTML = sessionRecords.map(r => `
        <div class="card">
          <div class="flex-between">
            <div>
              <div class="workout-name">${r.exercises.name}</div>
              <div class="workout-detail">${r.sets}组 × ${r.reps}次 ${r.weight_kg ? r.weight_kg + 'kg' : '自重'}</div>
              ${r.notes ? `<div class="workout-detail">📝 ${r.notes}</div>` : ''}
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteRecord('${r.id}')">删除</button>
          </div>
        </div>
      `).join('');
    }

    async function deleteRecord(id) {
      if (!confirm('确定要删除这条记录吗？')) return;
      await supabase.from('workout_records').delete().eq('id', id);
      loadSessionRecords();
    }

    function showMsg(text, isError) {
      const el = document.getElementById('saveMsg');
      el.textContent = text;
      el.style.color = isError ? 'var(--danger)' : 'var(--accent)';
      setTimeout(() => { el.textContent = ''; }, 3000);
    }

    initPage();
  </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add workout.html
git commit -m "feat: 运动记录页面 - 选择动作并记录组数/次数/重量"
```

---

### Task 6: 训练日记页面

**Files:**
- Create: `diary.html`

- [ ] **Step 1: 创建 diary.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>训练日记 - 健身助手</title>
  <link rel="stylesheet" href="css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <div class="topbar">
    <h1>📝 训练日记</h1>
  </div>

  <div class="container">
    <!-- 日期筛选 -->
    <div class="form-group">
      <label>查看日期</label>
      <input type="date" id="dateFilter">
    </div>

    <button class="btn btn-outline mb-16" onclick="showAll()">📅 显示全部记录</button>

    <!-- 日记列表 -->
    <div id="diaryList"></div>
  </div>

  <nav class="bottom-nav">
    <a href="index.html"><span class="nav-icon">📊</span>首页</a>
    <a href="workout.html"><span class="nav-icon">🏋️</span>训练</a>
    <a href="exercises.html"><span class="nav-icon">📚</span>动作库</a>
    <a href="diary.html" class="active"><span class="nav-icon">📝</span>日记</a>
  </nav>

  <script src="js/app.js"></script>
  <script>
    let user = null;
    let allRecords = [];

    async function initPage() {
      user = await requireAuth();
      if (!user) return;

      // 默认日期设为今天
      document.getElementById('dateFilter').value = new Date().toISOString().split('T')[0];

      // 日期选择变化时筛选
      document.getElementById('dateFilter').addEventListener('change', (e) => {
        filterByDate(e.target.value);
      });

      await showAll();
    }

    async function showAll() {
      const { data } = await supabase
        .from('workout_records')
        .select('id, sets, reps, weight_kg, notes, created_at, exercises!inner(name, muscle_group)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      allRecords = data || [];
      renderRecords(allRecords);
    }

    function filterByDate(dateStr) {
      const filtered = allRecords.filter(r => r.created_at.startsWith(dateStr));
      renderRecords(filtered, dateStr);
    }

    function renderRecords(records, dateStr) {
      const container = document.getElementById('diaryList');

      if (records.length === 0) {
        container.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>${dateStr ? dateStr + ' 没有训练记录' : '还没有训练记录'}</p><a href="workout.html" class="btn btn-primary mt-16">去训练</a></div>`;
        return;
      }

      // 按日期分组
      const grouped = {};
      records.forEach(r => {
        const day = r.created_at.split('T')[0];
        if (!grouped[day]) grouped[day] = [];
        grouped[day].push(r);
      });

      container.innerHTML = Object.entries(grouped).map(([day, dayRecords]) => {
        const totalSets = dayRecords.reduce((sum, r) => sum + r.sets, 0);
        const exerciseNames = [...new Set(dayRecords.map(r => r.exercises.name))];
        const dateLabel = new Date(day).toLocaleDateString('zh-CN', {
          month: 'long', day: 'numeric', weekday: 'short'
        });

        return `
          <div class="card mb-16">
            <div class="flex-between mb-8">
              <h3 style="color:var(--accent);">${dateLabel}</h3>
              <span class="text-2">${totalSets} 组</span>
            </div>
            <div class="text-2 mb-8" style="font-size:13px;">训练了 ${exerciseNames.join('、')}</div>
            ${dayRecords.map(r => `
              <div class="workout-item">
                <div>
                  <div class="workout-name">${r.exercises.name}</div>
                  <div class="workout-detail">${r.sets}组 × ${r.reps}次 ${r.weight_kg ? r.weight_kg + 'kg' : '自重'}</div>
                  ${r.notes ? `<div class="workout-detail">📝 ${r.notes}</div>` : ''}
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteRecord('${r.id}')">删除</button>
              </div>
            `).join('')}
          </div>
        `;
      }).join('');
    }

    async function deleteRecord(id) {
      if (!confirm('确定要删除这条记录吗？')) return;
      await supabase.from('workout_records').delete().eq('id', id);

      // 重新加载
      allRecords = allRecords.filter(r => r.id !== id);
      const dateFilter = document.getElementById('dateFilter').value;
      const filtered = allRecords.filter(r => r.created_at.startsWith(dateFilter));
      renderRecords(filtered, dateFilter);
    }

    initPage();
  </script>
</body>
</html>
```

- [ ] **Step 2: 提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add diary.html
git commit -m "feat: 训练日记页面 - 按日期查看历史记录"
```

---

### Task 7: 收尾工作 - 统一 Supabase 配置 + 最终验证

**Files:**
- Modify: `login.html`（移除内联 Supabase 初始化，改用 js/app.js）

- [ ] **Step 1: 更新 login.html 的脚本部分**

将 `login.html` 底部的 `<script>` 标签内容替换为：

```html
<script src="js/app.js"></script>
<script>
  const msg = document.getElementById('msg');

  function showMsg(text, isError) {
    msg.textContent = text;
    msg.style.color = isError ? 'var(--danger)' : 'var(--accent)';
  }

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      showMsg('登录失败: ' + error.message, true);
    } else {
      window.location.href = 'index.html';
    }
  });

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      showMsg('注册失败: ' + error.message, true);
    } else {
      showMsg('注册成功！请查看邮箱确认（如未收到可忽略，直接登录即可）', false);
    }
  });
</script>
```

同时移除 `login.html` 开头的 `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>`，因为 app.js 前面已经加载了。

- [ ] **Step 2: 创建 .gitignore**

```bash
echo ".superpowers/" > ".gitignore"
```

- [ ] **Step 3: 最终提交**

```bash
cd "C:/Users/wanghongwei/fitness-app"
git add login.html js/app.js .gitignore
git commit -m "chore: 统一 Supabase 配置到 js/app.js，添加 .gitignore"
```

- [ ] **Step 4: 打开浏览器测试**

在浏览器中打开 `C:/Users/wanghongwei/fitness-app/login.html`

测试清单：
1. 注册新账号
2. 用新账号登录
3. 首页看到统计数据（初始为 0）
4. 进入动作库看到 20 个预设动作
5. 进入训练页，选择动作并保存一条记录
6. 回到首页看到统计数据更新
7. 进入日记页查看记录

---

### Task 8: 部署到 Vercel（可选）

- [ ] **Step 1: 注册 Vercel**

打开 https://vercel.com ，用 GitHub 账号登录。

- [ ] **Step 2: 导入项目**

点击 "Add New" → "Project" → 选择你的 GitHub 仓库 → 点击 "Deploy"

Vercel 会自动检测这是静态 HTML 项目，无需任何配置。

- [ ] **Step 3: 设置 Supabase 重定向 URL**

部署后你会得到一个域名（如 `https://fitness-app.vercel.app`）。
在 Supabase 面板 → Authentication → URL Configuration → 将你的 Vercel 域名加入 "Redirect URLs"。

---

## 自检清单

- [x] 每个页面都有对应的 HTML 文件
- [x] 统一的深色主题样式
- [x] Supabase 认证集成（登录/注册/鉴权）
- [x] 数据库表结构 + RLS 安全策略
- [x] 所有页面都有底部导航栏
- [x] 移动端响应式布局（max-width: 480px）
- [x] 预设 20 个常用健身动作
- [x] 训练记录支持组数/次数/重量/备注
- [x] 日记按日期分组展示
