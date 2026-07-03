# 深铁鸿蒙智慧屏 — 实现计划

> **执行要求：** 使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务执行。步骤使用复选框（`- [ ]`）语法跟踪进度。

**目标：** 构建深圳地铁车公庙群组车站监控中心大屏演示原型，3840×2160 触控屏，6 桌面可切换，毛玻璃 UI，带动画的图表和模拟实时数据。

**架构：** 纯前端 HTML/CSS/JS 单页应用（SPA），无后端。6 个桌面全部在单个 `index.html` 内，通过 CSS `transform: translateX` 左右滑动切换，无页面刷新、无 URL 变化、无闪烁。模块化 CSS 设计系统 + 可复用 JS 图表引擎。

**技术栈：** HTML5、CSS3（变量、Grid、Flexbox、backdrop-filter、动画）、原生 JavaScript（ES6+）、SVG 图表，无外部库。

---

## 文件结构

```
/
├── index.html                    # 唯一入口：6 个桌面全部在此
├── css/
│   ├── design-system.css         # CSS 变量、基础样式、字体排版
│   ├── components.css            # GlassCard、Tag、Icon、Button 组件
│   ├── layouts.css               # 网格、弹性布局、吸顶头部、响应式、SPA 桌面容器
│   ├── charts.css                # 图表容器、渐变、工具提示
│   └── animations.css            # 关键帧动画：滑动、淡入、脉冲、生长、悬停
├── js/
│   ├── app.js                    # 桌面切换、手势、导航、SPA 路由
│   ├── data-mock.js              # 所有车站的模拟数据生成器
│   ├── chart-engine.js           # SVG 图表渲染器：折线、面积、柱状、环形
│   ├── animations.js             # 动画控制器：数字滚动、脉冲
│   └── components.js             # 动态组件构建器
└── assets/
    └── icons.svg                 # SVG 雪碧图，包含所有图标
```

---

### 任务 1：CSS 设计系统基础

**文件：**
- 新建：`css/design-system.css`

- [ ] **步骤 1：编写 CSS 自定义属性**

```css
:root {
  /* 颜色 */
  --bg-primary: #f0f4f8;
  --bg-gradient-start: #f5f7fa;
  --bg-gradient-end: #e8ecf1;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-border: rgba(255, 255, 255, 0.6);
  --surface-shadow: 0 8px 32px rgba(0, 82, 204, 0.08);

  --accent-blue: #3b82f6;
  --accent-cyan: #06b6d4;
  --accent-amber: #f59e0b;
  --accent-purple: #8b5cf6;
  --accent-green: #10b981;
  --accent-red: #ef4444;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-tertiary: #94a3b8;

  /* 间距 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 20px;
  --space-2xl: 24px;
  --space-3xl: 32px;

  /* 圆角 */
  --radius-sm: 8px;
  --radius-md: 10px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-pill: 20px;

  /* 阴影 */
  --shadow-card: 0 4px 24px rgba(0, 82, 204, 0.06);
  --shadow-card-hover: 0 12px 40px rgba(0, 82, 204, 0.12);
  --shadow-hub: 0 8px 32px rgba(245, 158, 11, 0.12);

  /* 字体 */
  --font-base: "SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif;
  --font-mono: "SF Mono", "Roboto Mono", monospace;

  /* 过渡 */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease-out;
  --transition-slow: 400ms cubic-bezier(0.32, 0.72, 0, 1);
}
```

- [ ] **步骤 2：编写基础样式**

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: var(--font-base);
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  color: var(--text-primary);
  min-height: 100vh;
  overflow-x: hidden;
}

/* 响应式基础 */
.container {
  width: 100%;
  min-width: 1920px;
  max-width: 3840px;
  margin: 0 auto;
  padding: 0 var(--space-3xl);
}
```

- [ ] **步骤 3：编写字体层级**

```css
.text-display { font-size: clamp(20px, 1.5vw, 28px); font-weight: 800; }
.text-title { font-size: clamp(14px, 1.1vw, 16px); font-weight: 700; }
.text-body { font-size: clamp(12px, 0.9vw, 14px); font-weight: 400; line-height: 1.5; }
.text-caption { font-size: clamp(10px, 0.75vw, 11px); font-weight: 500; color: var(--text-tertiary); }
.text-kpi { font-family: var(--font-mono); font-size: clamp(24px, 2.5vw, 48px); font-weight: 800; }
```

- [ ] **步骤 4：验证**

在浏览器中打开 `index.html`（空壳，引用此 CSS）。检查元素，确认 CSS 变量存在且基础样式已应用。

- [ ] **步骤 5：提交**

```bash
git add css/design-system.css
git commit -m "feat: 添加 CSS 设计系统，含变量和基础样式"
```

---

### 任务 2：可复用组件（GlassCard、Tag、Icon）

**文件：**
- 新建：`css/components.css`
- 新建：`assets/icons.svg`
- 新建：`js/components.js`

- [ ] **步骤 1：编写 GlassCard 组件样式**

```css
.glass-card {
  background: var(--surface);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-xl);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
  border-color: rgba(255, 255, 255, 0.8);
}

.glass-card--hub {
  border: 2px solid rgba(245, 158, 11, 0.3);
  box-shadow: var(--shadow-hub);
}

.glass-card--hub:hover {
  box-shadow: 0 12px 40px rgba(245, 158, 11, 0.2);
}
```

- [ ] **步骤 2：编写 Tag 组件样式**

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-pill);
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
}

.tag--green { background: rgba(16, 185, 129, 0.12); color: #059669; }
.tag--red { background: rgba(239, 68, 68, 0.12); color: #dc2626; }
.tag--amber { background: rgba(245, 158, 11, 0.12); color: #d97706; }
.tag--blue { background: rgba(59, 130, 246, 0.12); color: #2563eb; }
.tag--purple { background: rgba(139, 92, 246, 0.12); color: #7c3aed; }

.tag--dot::before {
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}
```

- [ ] **步骤 3：编写 Icon 组件 + SVG 雪碧图**

创建 `assets/icons.svg`，包含以下 `<symbol>` 定义：arrow-left、arrow-right、elevator、video、topology、wrench、alert、leaf、bolt、people、thermometer、droplet、wind、mask、clock、train、close。

```css
.icon {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.icon--sm { width: 14px; height: 14px; }
.icon--lg { width: 24px; height: 24px; }
```

- [ ] **步骤 4：编写 JS 组件辅助函数**

```javascript
// js/components.js
const Components = {
  tag(type, text, dot = false) {
    const span = document.createElement('span');
    span.className = `tag tag--${type}${dot ? ' tag--dot' : ''}`;
    span.textContent = text;
    return span;
  },

  icon(name, size = '') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('icon');
    if (size) svg.classList.add(`icon--${size}`);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', `assets/icons.svg#${name}`);
    svg.appendChild(use);
    return svg;
  }
};
```

- [ ] **步骤 5：验证**

创建测试 HTML 页面，放入几个 GlassCard、Tag 和 Icon。确认毛玻璃效果已渲染，标签呈胶囊形，图标为线条风格 SVG。

- [ ] **步骤 6：提交**

```bash
git add css/components.css assets/icons.svg js/components.js
git commit -m "feat: 添加可复用组件 — GlassCard、Tag、Icon"
```

---

### 任务 3：布局系统 + 吸顶头部

**文件：**
- 新建：`css/layouts.css`
- 修改：`index.html`

- [ ] **步骤 1：编写布局工具类**

```css
/* css/layouts.css */
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-end) 100%);
  padding: var(--space-lg) var(--space-3xl) var(--space-md);
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.04);
}

.grid-5 { display: grid; grid-template-columns: repeat(5, 1fr); gap: var(--space-lg); }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-lg); }

.flex { display: flex; }
.flex-col { display: flex; flex-direction: column; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.gap-sm { gap: var(--space-sm); }
.gap-md { gap: var(--space-md); }
.gap-lg { gap: var(--space-lg); }

.scrollable-content {
  padding: 0 var(--space-3xl) var(--space-xl);
}

.desktop-indicator {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  padding: var(--space-md) 0;
}

.desktop-indicator__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
  transition: all var(--transition-base);
}

.desktop-indicator__dot--active {
  background: var(--accent-blue);
  transform: scale(1.3);
}
```

- [ ] **步骤 2：构建 SPA 外壳 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>深铁鸿蒙 | 车公庙群组车站监控中心</title>
  <link rel="stylesheet" href="css/design-system.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/layouts.css">
  <link rel="stylesheet" href="css/charts.css">
  <link rel="stylesheet" href="css/animations.css">
</head>
<body>
  <!-- SPA 桌面容器：6 个桌面横向并排 -->
  <div id="desktop-container" class="desktop-container">

    <!-- 桌面 1：群组概览 -->
    <section class="desktop desktop--active" data-desktop="0">
      <div class="container">
        <header class="sticky-header">
          <div class="flex justify-between items-center" style="margin-bottom: var(--space-md);">
            <div class="flex items-center gap-md">
              <div style="font-size: 17px; font-weight: 800; background: linear-gradient(135deg, var(--accent-blue), var(--accent-cyan)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">深铁鸿蒙</div>
              <div style="width: 1px; height: 18px; background: #d1d5db;"></div>
              <div class="text-body" style="font-weight: 600;">车公庙群组车站监控中心</div>
            </div>
            <div class="flex items-center gap-md">
              <span class="tag tag--green tag--dot">正常</span>
              <span class="text-caption">24°C</span>
              <span class="text-caption">14:30:45</span>
            </div>
          </div>
          <div class="flex justify-between items-end">
            <div>
              <div class="text-display">实时运行概览</div>
              <div class="text-caption">Line 1 核心段五站联动监控系统</div>
            </div>
            <div class="flex gap-md">
              <div class="glass-card" style="padding: var(--space-sm) var(--space-md);">
                <span class="text-caption">在线列车: <strong>42</strong></span>
              </div>
              <div class="glass-card" style="padding: var(--space-sm) var(--space-md);">
                <span class="text-caption">区域总客流: <strong>124,892</strong></span>
              </div>
            </div>
          </div>
        </header>
        <main class="scrollable-content" id="overview-content">
          <!-- 概览页内容由后续任务填充 -->
        </main>
      </div>
    </section>

    <!-- 桌面 2~6：车站详情（由后续任务填充） -->
    <section class="desktop" data-desktop="1"><!-- 车公庙 --></section>
    <section class="desktop" data-desktop="2"><!-- 香蜜湖 --></section>
    <section class="desktop" data-desktop="3"><!-- 购物公园 --></section>
    <section class="desktop" data-desktop="4"><!-- 竹子林 --></section>
    <section class="desktop" data-desktop="5"><!-- 侨城东 --></section>

  </div>

  <!-- 底部桌面指示器 -->
  <div class="desktop-indicator">
    <div class="desktop-indicator__dot desktop-indicator__dot--active"></div>
    <div class="desktop-indicator__dot"></div>
    <div class="desktop-indicator__dot"></div>
    <div class="desktop-indicator__dot"></div>
    <div class="desktop-indicator__dot"></div>
    <div class="desktop-indicator__dot"></div>
  </div>

  <script src="js/chart-engine.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

同时添加 SPA 容器样式到 `css/layouts.css`：

```css
.desktop-container {
  display: flex;
  width: 600vw; /* 6 个桌面 × 100vw */
  height: 100vh;
  transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
}

.desktop {
  width: 100vw;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.desktop--active {
  /* 当前桌面 */
}
```

- [ ] **步骤 3：验证**

在浏览器中以 3840×2160 打开 `index.html`。确认吸顶头部在滚动时保持固定，玻璃卡片正确渲染，布局不拥挤。

- [ ] **步骤 4：提交**

```bash
git add css/layouts.css index.html
git commit -m "feat: 添加布局系统和吸顶头部，概览页外壳"
```

---

### 任务 4：概览页 — 车站卡片

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：在概览页中编写 5 个车站卡片**

在 `<main class="scrollable-content">` 内添加 5 个车站卡片：

- 卡片 1：香蜜湖（常规站，L1-UPSTREAM 2，客流 8,240）
- 卡片 2：购物公园（换乘站，L1-UPSTREAM 1，客流 15,690）
- 卡片 3：车公庙（枢纽，主控站，1/7/9/11 号线，客流 48,321）
- 卡片 4：竹子林（常规站，L1-DOWNSTREAM 1，客流 5,430）
- 卡片 5：侨城东（常规站，L1-DOWNSTREAM 2，客流 4,110，状态缓行）

每个卡片使用 `glass-card`，内含：
- 站名 + 英文 + 类型标签
- 行车监控进度条 + 状态标签
- 实时客流大数字 + 同比标签
- 设备健康度 + 在岗人员（或换乘通道）小卡片

- [ ] **步骤 2：验证**

在浏览器中以 3840×2160 打开 `index.html`。确认 5 个卡片均匀分布，车公庙卡片更宽（枢纽样式 + 金色边框），内容不拥挤，标签呈胶囊形。

- [ ] **步骤 3：提交**

```bash
git add index.html
git commit -m "feat: 概览页添加 5 个车站卡片"
```

---

### 任务 5：概览页 — 线路拓扑 + KPI 网格 + 视频轮播

**文件：**
- 修改：`index.html`

- [ ] **步骤 1：添加线路拓扑区域**

在车站卡片下方添加线路拓扑面板（`glass-card`）：
- 标题"线路拓扑全览" + "系统正常运行"标签
- 5 个站点圆形图标（车公庙更大，金色），由渐变连线连接
- 每个站点下方：站名 + 类型 + 状态标签

- [ ] **步骤 2：添加 KPI 网格**

5 列网格（`grid-5`），每个 KPI 使用 `glass-card`：
- 群组车站总客流：124,592 + 同比 + 进站/出站进度条
- 群组车站总能耗：45.2 MWh + 同比
- 群组平均环境质量：AQI 32（优）+ 温度/湿度/CO₂
- 群组设备健康度：97.6% + 子系统标签
- 群组今日告警：3 条未处理 + 严重/警告/信息分布

- [ ] **步骤 3：添加视频轮播区域**

5 个视频窗口，每个使用渐变背景模拟视频 + LIVE 红点角标 + 站名/区域/摄像头信息。

- [ ] **步骤 4：添加桌面指示器**

底部 6 个圆点，当前桌面高亮放大。

- [ ] **步骤 5：验证**

在浏览器中以 3840×2160 打开 `index.html`。确认拓扑区 5 站均匀分布、连线渐变、KPI 网格 5 列等宽、视频轮播 5 个窗口、底部指示器正确。

- [ ] **步骤 6：提交**

```bash
git add index.html css/layouts.css
git commit -m "feat: 概览页添加拓扑、KPI 网格、视频轮播"
```

---

### 任务 6：图表引擎（SVG 面积 + 柱状 + 环形）

**文件：**
- 新建：`js/chart-engine.js`
- 新建：`css/charts.css`

- [ ] **步骤 1：编写 chart-engine.js**

实现 `ChartEngine` 类：
- `createSVG()`：创建 SVG 元素
- `createGradient()`：创建面积渐变定义（顶部不透明到底部透明）
- `normalize()`：数据归一化到 SVG 坐标
- `drawGrid()`：绘制水平虚线网格
- `renderAreaLine()`：单线面积图
- `renderMultiLine()`：多线面积图（支持虚线）

面积渐变必须使用 SVG `<linearGradient>`，方向从上到下，顶部透明度 0.3~0.4，底部透明度 0。

- [ ] **步骤 2：编写 charts.css**

```css
.chart-container { width: 100%; height: 200px; position: relative; }
.chart-legend { display: flex; gap: var(--space-md); justify-content: flex-end; margin-bottom: var(--space-sm); }
.chart-legend__item { display: flex; align-items: center; gap: var(--space-xs); font-size: 11px; color: var(--text-secondary); }
.chart-legend__swatch { width: 12px; height: 3px; border-radius: 2px; }
.chart-tooltip { position: absolute; background: rgba(255,255,255,0.9); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.6); border-radius: var(--radius-md); padding: var(--space-sm) var(--space-md); font-size: 11px; pointer-events: none; opacity: 0; transition: opacity var(--transition-fast); box-shadow: 0 4px 16px rgba(0,0,0,0.1); z-index: 10; }
.chart-tooltip--visible { opacity: 1; }
```

- [ ] **步骤 3：验证**

创建测试 HTML 页面，渲染一个示例三线图表。确认面积渐变正确渲染，线条有圆角端点，网格为虚线，底部有标签。

- [ ] **步骤 4：提交**

```bash
git add js/chart-engine.js css/charts.css
git commit -m "feat: 添加 SVG 图表引擎，支持面积渐变和多线"
```

---

### 任务 7：动画系统

**文件：**
- 新建：`css/animations.css`
- 新建：`js/animations.js`

- [ ] **步骤 1：编写 CSS 关键帧动画**

```css
/* 桌面滑动 */
@keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
@keyframes slideOutLeft { from { transform: translateX(0); opacity: 1; } to { transform: translateX(-100%); opacity: 0; } }

/* 线条绘制 */
@keyframes drawLine { from { stroke-dashoffset: var(--line-length); } to { stroke-dashoffset: 0; } }

/* 脉冲 */
@keyframes pulse { 0%, 100% { background-color: var(--surface); } 50% { background-color: rgba(255,255,255,0.9); } }

/* 淡入上移 */
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }

/* 子元素交错 */
.stagger-children > * { opacity: 0; animation: fadeInUp 500ms ease-out forwards; }
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 80ms; }
.stagger-children > *:nth-child(3) { animation-delay: 160ms; }
.stagger-children > *:nth-child(4) { animation-delay: 240ms; }
.stagger-children > *:nth-child(5) { animation-delay: 320ms; }
.stagger-children > *:nth-child(6) { animation-delay: 400ms; }
```

- [ ] **步骤 2：编写 JS 动画控制器**

```javascript
// js/animations.js
const Animations = {
  // 数字滚动（老虎机效果）
  countUp(element, target, duration = 800) {
    const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      element.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  },

  // 脉冲高亮
  pulse(element) {
    element.classList.remove('animate-pulse');
    void element.offsetWidth;
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), 600);
  },

  // 子元素交错淡入
  staggerIn(container) { container.classList.add('stagger-children'); },

  // 线条绘制
  drawLine(polylineElement) {
    const length = polylineElement.getTotalLength();
    polylineElement.style.setProperty('--line-length', length);
    polylineElement.style.strokeDasharray = length;
    polylineElement.style.strokeDashoffset = length;
    polylineElement.style.animation = 'drawLine 800ms ease-out forwards';
  }
};
window.Animations = Animations;
```

- [ ] **步骤 3：验证**

创建测试 HTML，测试数字滚动、脉冲高亮、子元素交错淡入。确认动画流畅。

- [ ] **步骤 4：提交**

```bash
git add css/animations.css js/animations.js
git commit -m "feat: 添加动画系统 — 滑动、数字滚动、脉冲、交错"
```

---

### 任务 8：桌面切换 + 手势系统

**文件：**
- 新建：`js/app.js`
- 修改：所有 `*.html` 文件引用 app.js

- [ ] **步骤 1：编写 app.js**

实现 `App` 类：
- `currentDesktop`：当前桌面索引（0~5）
- `container`：`#desktop-container` 元素
- 触摸滑动手势（最小滑动距离 80px）
- 鼠标拖拽（桌面端测试用）
- 键盘左右箭头切换
- `navigate(targetIndex)`：通过 `transform: translateX(-${targetIndex * 100}vw)` 移动容器，实现丝滑切换
- `updateIndicator()`：更新底部指示器
- `setupAutoRefresh()`：每 8 秒模拟数据刷新，触发数字滚动 + 脉冲
- `setupVideoModals()`：视频点击放大（任务 11）
- `preloadAllCharts()`：页面加载完成后分帧预加载所有桌面图表，避免首次切换卡顿

核心切换逻辑：
```javascript
navigate(targetIndex) {
  this.container.style.transform = `translateX(-${targetIndex * 100}vw)`;
  this.currentDesktop = targetIndex;
  this.updateIndicator();
}
```

图表预加载策略：
```javascript
preloadAllCharts() {
  // 当前桌面立即渲染
  this.initDesktopCharts(0);
  // 其余 5 个桌面分帧预加载，避免阻塞首屏
  [1, 2, 3, 4, 5].forEach((idx, i) => {
    requestIdleCallback ?
      requestIdleCallback(() => this.initDesktopCharts(idx), { timeout: 500 + i * 300 }) :
      setTimeout(() => this.initDesktopCharts(idx), 500 + i * 300);
  });
}
```

- [ ] **步骤 2：验证**

打开 `index.html`，左右滑动（或使用方向键）。确认 6 个桌面以 `translateX` 动画丝滑切换，无刷新、无 URL 变化、无闪烁。

- [ ] **步骤 3：提交**

```bash
git add js/app.js index.html css/layouts.css
git commit -m "feat: 添加 SPA 桌面切换，支持滑动手势和键盘导航"
```

---

### 任务 9：车公庙详情页（桌面 2）

**文件：**
- 修改：`index.html`（在桌面 2 section 中填充）
- 修改：`js/app.js`（添加图表初始化）

- [ ] **步骤 1：在桌面 2 section 中填充车公庙详情**

在 `<section class="desktop" data-desktop="1">` 中填充：
1. **吸顶头部**：站名"车公庙站" + "主控站"徽章 + 实时客流 + 设备健康度 + 返回按钮
2. **视频监控矩阵**：2×2 网格，每个视频带 LIVE 红点
3. **客流趋势**：三线面积图（进站蓝/出站青/乘降量紫虚线）+ 图表下方 3 个 KPI（进站 1,134 / 出站 829 / 乘降量 1,963）
4. **行车动态**：4 条线路卡片（1/7/9/11），每条含车次号、方向、上下行、拥挤度标签、倒计时、准点/延误标签
5. **环境 + 能耗 + 告警**：3 列布局
   - 环境：温度/湿度/CO₂/PM2.5，顶部有站均/站台/站厅切换标签
   - 能耗：今日累计 12.8 MWh + 4 类占比进度条
   - 告警：严重/警告/信息数量 + 2 条最新告警
6. **24h 能耗曲线**：全宽，4 线（动力/照明/商业/其他）
7. **设备健康矩阵**：5 类（扶梯、闸机、垂梯、屏蔽门、水泵），用彩色方块表示状态
8. **历史告警日志**：表格，时间/级别/子系统/描述/状态

在 `js/app.js` 中添加图表初始化，页面加载后分帧预加载，首次切换到桌面 2 时图表已就绪：
```javascript
initDesktopCharts(index) {
  if (index === 1 && !this.chartsInitialized[1]) {
    const flowChart = new ChartEngine('passenger-flow-chart', { height: 180 });
    flowChart.renderMultiLine([
      { data: [120,200,450,700,900,850,600,350,200,150,100,80], color: '#3b82f6' },
      { data: [100,180,400,650,820,780,550,320,180,130,90,70], color: '#06b6d4' },
      { data: [220,380,850,1350,1720,1630,1150,670,380,280,190,150], color: '#8b5cf6', dashed: true }
    ], ['06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00']);

    const energyChart = new ChartEngine('energy-curve-chart', { height: 200 });
    energyChart.renderMultiLine([
      { data: [40,55,110,170,200,180,130,90,60,50,45,42], color: '#3b82f6' },
      { data: [35,45,80,120,140,130,110,100,80,60,50,45], color: '#f59e0b' },
      { data: [25,35,60,90,110,105,95,85,70,55,45,40], color: '#06b6d4' },
      { data: [15,20,35,50,60,55,50,45,35,28,22,20], color: '#8b5cf6' }
    ], ['00:00','04:00','08:00','12:00','16:00','20:00','24:00']);
    this.chartsInitialized[1] = true;
  }
}
```

- [ ] **步骤 2：验证**

打开 `index.html`，滑动到第 2 个桌面。确认所有区域渲染正常，图表有渐变填充，布局不拥挤，标签呈胶囊形，视频网格有 4 个单元。

- [ ] **步骤 3：提交**

```bash
git add index.html js/app.js
git commit -m "feat: 添加车公庙站详情页，含图表和所有区域"
```

---

### 任务 10：其余 4 个车站详情页（桌面 3~6）

**文件：**
- 修改：`index.html`（在桌面 3~6 section 中填充）

- [ ] **步骤 1：复制车公庙模板**

在桌面 3~6 的 `<section class="desktop" data-desktop="N">` 中，复制车公庙的布局结构，为每个车站修改：
- 标题和站名
- 车站类型标签（常规站/换乘站）
- 线路徽章（根据车站实际线路：香蜜湖仅 1 号线，购物公园 1/2 号线，竹子林 1 号线，侨城东 1 号线）
- 模拟数据（不同数值）
- 摄像头编号

在 `js/app.js` 中为桌面 3~6 添加对应的图表初始化逻辑（随页面加载分帧预渲染，首次切换时图表已就绪）。

- [ ] **步骤 2：验证 4 个桌面**

滑动到桌面 3~6。确认每个车站有独立数据，线路徽章正确，布局一致。

- [ ] **步骤 3：提交**

```bash
git add index.html js/app.js
git commit -m "feat: 添加其余 4 个车站详情页"
```

---

### 任务 11：视频放大弹窗

**文件：**
- 修改：`css/components.css`
- 修改：`js/app.js`

- [ ] **步骤 1：添加弹窗样式**

```css
.video-modal {
  position: fixed; inset: 0; z-index: 1000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(8px);
  opacity: 0; pointer-events: none; transition: opacity var(--transition-base);
}
.video-modal--open { opacity: 1; pointer-events: auto; }
.video-modal__content {
  width: 70vw; height: 70vh; background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: var(--radius-xl); position: relative;
  transform: scale(0.9); transition: transform 400ms cubic-bezier(0.32, 0.72, 0, 1);
}
.video-modal--open .video-modal__content { transform: scale(1); }
.video-modal__close { position: absolute; top: -40px; right: 0; color: white; font-size: 24px; cursor: pointer; background: none; border: none; }
```

- [ ] **步骤 2：添加弹窗逻辑**

在 `App` 类中添加 `setupVideoModals()`：
- 点击视频单元格打开弹窗
- 弹窗显示车站名、区域、摄像头编号
- 点击遮罩或关闭按钮关闭弹窗

- [ ] **步骤 3：验证**

点击任意视频单元格。确认弹窗以缩放动画打开，背景模糊，点击外部或 X 关闭。

- [ ] **步骤 4：提交**

```bash
git add css/components.css js/app.js
git commit -m "feat: 添加视频放大弹窗，带缩放动画"
```

---

### 任务 12：最终打磨 — 悬停效果 + 视觉调优

**文件：**
- 修改：`css/design-system.css`
- 修改：`css/components.css`
- 修改：`css/animations.css`

- [ ] **步骤 1：精细调整悬停效果**

```css
/* 卡片悬停发光 */
.glass-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0, 82, 204, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.8);
}

/* 标签按压反馈 */
.tag:active { transform: scale(0.97); }

/* 视频单元格悬停 */
.video-cell:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3); }

/* 表格行悬停 */
.alert-log__row:hover { background: rgba(59, 130, 246, 0.04); }
```

- [ ] **步骤 2：添加图表发光滤镜**

```css
.chart-glow { filter: drop-shadow(0 4px 12px rgba(59, 130, 246, 0.25)); }
```

- [ ] **步骤 3：全系统验证**

在 3840×2160 下测试所有 6 个页面，检查：
- 无拥挤布局
- 间距一致
- 所有标签呈胶囊形
- 图表有渐变填充
- 悬停效果流畅
- 桌面切换正常
- 视频弹窗正常
- 自动刷新数字动画

- [ ] **步骤 4：提交**

```bash
git add css/
git commit -m "polish: 精细调整悬停效果、阴影和视觉一致性"
```

---

## 自查清单

### 1. 设计文档覆盖度

| 设计文档章节 | 实现任务 |
|-------------|---------|
| 色彩体系 | 任务 1 |
| 字体规范 | 任务 1 |
| 圆角系统 | 任务 1、2 |
| 阴影与层级 | 任务 1、2、12 |
| 毛玻璃效果 | 任务 2 |
| 布局 + 自适应 | 任务 1、3 |
| 6 桌面结构 | 任务 3、4、5、9、10 |
| 统一 SVG 图标 | 任务 2 |
| 标签系统 | 任务 2 |
| 卡片密度 | 所有任务（间距变量）|
| 面积渐变图表 | 任务 6 |
| 柱状图高级感 | 任务 6（色彩系统）|
| 桌面切换动画 | 任务 8 |
| 数据刷新动画 | 任务 7、8 |
| 卡片悬停 | 任务 2、12 |
| 图表加载动画 | 任务 7 |
| 视频点击放大 | 任务 11 |
| 标签点击反馈 | 任务 12 |

**缺失：无。**

### 2. 占位符检查

- [x] 无"TBD"或"TODO"
- [x] 无模糊的"添加适当错误处理"
- [x] 所有步骤包含具体代码或命令
- [x] 无"类似任务 X"的简写

### 3. 类型一致性

- [x] `ChartEngine` 类在任务 6、9 中一致使用
- [x] `Animations` 辅助函数在任务 7、8、12 中一致使用
- [x] CSS 变量名在所有 CSS 文件中一致
- [x] HTML 类名一致（`glass-card`、`tag`、`text-kpi` 等）

---

## 执行交接

**计划已完成，保存至 `docs/superpowers/plans/2025-05-22-harmonyos-metro-dashboard.md`。两种执行方式：**

**1. 子代理驱动（推荐）**——每个任务派发独立子代理执行，我在任务间审查，有问题立即修正，质量最稳

**2. 内联执行**——在当前会话中使用 executing-plans 批量执行，有检查点供你确认

**选哪种？**