# 深铁鸿蒙 | 车公庙群组车站监控中心 — 设计文档

## 1. 项目概述

纯前端 HTML/CSS/JS 演示原型，无后端，所有数据为模拟数据。用于 3840×2160 触控大屏展示，支持 6 桌面切换。

**核心目标**：高级感、简约、精致、视觉冲击力强的监控大屏 demo。

---

## 2. 视觉设计系统

### 2.1 色彩体系（冰晶蓝白主题）

| Token | 色值 | 用途 |
|-------|------|------|
| `--bg-primary` | `#f0f4f8` | 页面主背景（极浅蓝灰） |
| `--bg-gradient-start` | `#f5f7fa` | 渐变背景起点 |
| `--bg-gradient-end` | `#e8ecf1` | 渐变背景终点 |
| `--surface` | `rgba(255,255,255,0.72)` | 卡片面板底色（毛玻璃） |
| `--surface-border` | `rgba(255,255,255,0.6)` | 卡片边框 |
| `--surface-shadow` | `0 8px 32px rgba(0,82,204,0.08)` | 卡片阴影 |
| `--accent-blue` | `#3b82f6` | 主色调 |
| `--accent-cyan` | `#06b6d4` | 辅助色 |
| `--accent-amber` | `#f59e0b` | 高亮/主控站 |
| `--accent-purple` | `#8b5cf6` | 乘降量/其他 |
| `--accent-green` | `#10b981` | 正常/成功 |
| `--accent-red` | `#ef4444` | 告警/延误 |
| `--text-primary` | `#0f172a` | 主文字（极深灰蓝） |
| `--text-secondary` | `#475569` | 次要文字 |
| `--text-tertiary` | `#94a3b8` | 辅助文字 |

### 2.2 字体规范

- **主字体**：`"SF Pro Display", "PingFang SC", "Microsoft YaHei", system-ui, sans-serif`
- **数字字体**：`"SF Mono", "Roboto Mono", monospace`（用于 KPI 数值、时间、车次号）
- **层级**：
  - 页面标题：28px / font-weight: 800
  - 卡片标题：16px / font-weight: 700
  - KPI 大数值：36-48px / font-weight: 800 / 等宽字体
  - 正文：13-14px / font-weight: 400-500
  - 标签/辅助：11-12px / font-weight: 500

### 2.3 圆角系统

- **大面板/卡片**：`border-radius: 16px`
- **中等卡片/视频窗口**：`border-radius: 12px`
- **小模块/按钮**：`border-radius: 10px`
- **标签（Tag/Pill）**：`border-radius: 20px`（全圆角胶囊）
- **数据点/图标容器**：`border-radius: 10px`

### 2.4 阴影与层级

- **卡片默认**：`0 4px 24px rgba(0,82,204,0.06)`
- **卡片 Hover**：`0 12px 40px rgba(0,82,204,0.12)` + `transform: translateY(-2px)`
- **主控站卡片**：`0 8px 32px rgba(245,158,11,0.12)` + 2px 金色边框
- **Sticky Header**：`0 2px 16px rgba(0,0,0,0.04)`

### 2.5 毛玻璃效果（Liquid Glass）

```css
backdrop-filter: blur(20px) saturate(180%);
background: rgba(255,255,255,0.72);
border: 1px solid rgba(255,255,255,0.6);
```

---

## 3. 布局规范

### 3.1 基础画布

- **设计基准**：3840×2160（16:9）
- **内容区**：水平 padding 32px，垂直方向可滚动
- **Sticky Header**：高度约 110px，固定顶部，内容滚动时始终可见

### 3.2 自适应策略

```css
/* 基准：3840px */
.container {
  width: 100vw;
  min-width: 1920px;
  max-width: 3840px;
  margin: 0 auto;
}

/* 使用 CSS Grid + Flexbox，避免固定像素 */
.station-cards {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(12px, 1vw, 20px);
}

/* 字体使用 clamp 响应式 */
.kpi-value {
  font-size: clamp(24px, 2.5vw, 48px);
}
```

- **最小适配宽度**：1920px（FHD），低于此宽度提示"请使用大屏设备"
- **缩放机制**：使用 viewport 相对单位（vw/vh）+ CSS Grid，核心内容在 1920~3840 范围内自动适配
- **高密度屏幕**：使用 `devicePixelRatio` 保证图表清晰

### 3.3 间距与密度

- **卡片内部 padding**：20-24px（不要挤到 16px 以下）
- **模块之间 gap**：16-20px
- **卡片内子元素间距**：12-16px
- **文字行高**：1.4~1.5（中文阅读舒适）
- **拒绝拥挤**：每个信息块周围留出足够呼吸空间，宁可减少信息量也要保证疏密有致

---

## 4. 页面结构（6 桌面）

| 桌面 | 内容 | 文件 |
|------|------|------|
| 桌面 1 | 群组概览（5站卡片 + 拓扑 + KPI + 视频轮播） | `index.html` |
| 桌面 2 | 车公庙站详情 | `station-chegongmiao.html` |
| 桌面 3 | 香蜜湖站详情 | `station-xiangmihu.html` |
| 桌面 4 | 购物公园站详情 | `station-shoppingpark.html` |
| 桌面 5 | 竹子林站详情 | `station-zhuzilin.html` |
| 桌面 6 | 侨城东站详情 | `station-qiaochengeast.html` |

---

## 5. 图标规范

### 5.1 统一风格

- **全部使用 SVG Line Icon**，线宽 1.5-2px，stroke-linecap/linejoin 为 round
- **禁止混用 emoji**、禁止混用填充图标和线条图标
- **图标尺寸**：
  - 面板标题图标：18×18px
  - 卡片内小图标：16×16px
  - KPI 图标容器：40×40px（图标本身 20×20px）

### 5.2 图标清单

| 用途 | SVG 描述 |
|------|----------|
| 进站 | 向左箭头折线 |
| 出站 | 向右箭头折线 |
| 乘降/电梯 | 电梯箱 + 上下箭头 |
| 视频监控 | 摄像机（polygon + rect） |
| 线路拓扑 | 太阳/放射状（circle + 8 条线） |
| 设备/工具 | 扳手（wrench） |
| 告警 | 三角形感叹号 |
| 环境/叶子 | 三叶草形状 |
| 能耗/闪电 | 闪电 bolt |
| 客流/人群 | 双人轮廓 |
| 温度 | 温度计 |
| 湿度 | 水滴 |
| CO₂ | 风向符号 |
| PM2.5 | 口罩/颗粒 |
| 日历/时间 | 时钟 |
| 返回/箭头 | 左箭头 |
| 列车 | 地铁车头正面 |

---

## 6. 卡片与标签规范

### 6.1 标签（Tag/Pill）样式

大量使用标签来呈现状态、分类、等级：

```css
.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
}

.tag-green {
  background: rgba(16,185,129,0.12);
  color: #059669;
}

.tag-red {
  background: rgba(239,68,68,0.12);
  color: #dc2626;
}

.tag-amber {
  background: rgba(245,158,11,0.12);
  color: #d97706;
}

.tag-blue {
  background: rgba(59,130,246,0.12);
  color: #2563eb;
}
```

**使用场景**：
- 车站状态：正常（绿）、缓行（琥珀）、拥挤（红）
- 列车拥挤度：舒适（绿）、轻度拥挤（琥珀）、拥挤（橙）、严重拥挤（红）
- 列车准点状态：准点（绿）、延误（红）
- 告警等级：严重（红）、警告（琥珀）、信息（蓝）
- 设备状态：运行中（绿）、故障（红）、警告（琥珀）
- 环境等级：优（绿）、良（蓝）

### 6.2 卡片内容密度原则

- **同一卡片内的信息层级用间距区分**，不要用太多分割线
- **相关数据组合在一起**，不相关数据分开卡片
- **KPI 数字要大、标签要小**，形成强烈对比
- **图表区域占卡片 60~70%**，图例和标题占 30~40%
- **避免一行塞超过 3 个同级信息块**

---

## 7. 数据可视化规范

### 7.1 图表通用样式（高级感）

所有图表必须达到**演示级视觉品质**，拒绝简陋的折线/柱状：

- **坐标轴**：灰色细线 `#e2e8f0`，刻度文字 11px `#94a3b8`
- **网格线**：虚线 `stroke-dasharray: 4,4` 或极浅实线 `#f1f5f9`，不抢主体视觉
- **数据曲线**：2.5px 实线，带 `stroke-linecap: round`、`stroke-linejoin: round`
- **面积填充**：**线性渐变（从主色到透明）+ 底部发光辉光**，不是简单纯色填充
  ```css
  .area-fill {
    fill: url(#gradient-blue);
    filter: drop-shadow(0 4px 12px rgba(59,130,246,0.25));
  }
  ```
- **柱状图**：圆角顶部（`rx: 4, ry: 4`），柱体使用**纵向线性渐变**（顶部亮色到底部深色），带 subtle 外发光
- **数据点**：hover 时显示 8px 圆点 + 外圈光环，平时隐藏
- **Tooltip**：毛玻璃面板，圆角 10px，带指向箭头，显示精确数值

### 7.1a 面积图高级渐变规范

每条曲线的面积填充必须使用 SVG 线性渐变：

```svg
<defs>
  <linearGradient id="gradient-blue" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.35"/>
    <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
  </linearGradient>
</defs>
```

- 渐变方向：从上到下
- 顶部透明度：0.3~0.4（与曲线色呼应）
- 底部透明度：0（完全透明融入背景）
- 曲线下方叠加一层 `drop-shadow` 制造发光感

### 7.1b 状态图/仪表盘样式

- 设备健康度、告警统计等状态图表使用**环形进度条（donut chart）**或**渐变柱状图**
- 环形条：渐变描边（从浅蓝到深蓝），背景轨道使用 `rgba(0,0,0,0.04)`
- 柱状图：参考用户提供的效果，使用圆角柱体 + 纵向渐变 + 顶部高亮 + subtle glow

### 7.2 客流趋势图（3线）

- 进站：蓝色 `#3b82f6`
- 出站：青色 `#06b6d4`
- 乘降量：紫色虚线 `#8b5cf6`（`stroke-dasharray: 6,4`）
- 下方 KPI：进站/出站/乘降量三列，带图标容器

### 7.3 24h 能耗曲线（4线）

- 动力：蓝色
- 照明：琥珀
- 商业：青色
- 其他：紫色
- 全宽展示，横轴 00:00~24:00

---

## 8. 动效与交互规范

### 8.1 桌面切换动画

- **触发**：左右滑动手势（touch）或键盘方向键
- **动画**：当前桌面向左/右滑出（`translateX ±100%`），新桌面从反方向滑入
- **时长**：400ms
- **缓动**：`cubic-bezier(0.32, 0.72, 0, 1)`（iOS 风格弹簧感）
- **指示器**：底部 6 个圆点，当前桌面放大 + 高亮

### 8.2 数据刷新动画

- **数字变化**：odometer 效果，数字像老虎机一样快速滚动后定格
- **图表更新**：新数据点从右侧"生长"进入，带 `stroke-dashoffset` 描边动画
- **状态变化**：背景色 pulse（从浅色闪到更亮再回落），时长 600ms
- **频率**：模拟每 5~10 秒刷新一次

### 8.3 卡片 Hover 效果

- **微上浮**：`translateY(-3px)`
- **阴影扩散**：从 `0 4px 24px` 到 `0 12px 40px`
- **边框高亮**：边框颜色变亮 10%
- **时长**：200ms
- **缓动**：`ease-out`

### 8.4 图表加载动画

- **入场**：从 `opacity: 0, scale: 0.98` 到 `opacity: 1, scale: 1`
- **描边绘制**：折线从左侧逐渐绘制到右侧（`stroke-dasharray` + `stroke-dashoffset` 动画）
- **面积填充**：描边完成后，面积从下往上淡入
- **时长**：800ms，带 150ms 交错延迟

### 8.5 视频监控交互

- **点击**：当前视频卡片放大至屏幕中央 70% 大小，背景遮罩（`rgba(0,0,0,0.6)` + `backdrop-filter: blur(8px)`）
- **动画**：从原位置 scale 放大 + 居中，400ms，弹簧缓动
- **关闭**：点击遮罩或右上角 X 按钮，反向动画退出
- **轮播**：每 5 秒自动切换视频画面（模拟）

### 8.6 标签/按钮点击反馈

- **按压**：`scale(0.97)`，时长 100ms
- **释放**：回弹到正常

---

## 9. 组件清单

### 9.1 全局组件

- `StickyHeader`：系统栏 + 页面标题 + 状态徽章
- `DesktopIndicator`：底部 6 桌面指示器
- `GlassCard`：毛玻璃卡片容器（可配置圆角、阴影、边框）
- `Tag`：胶囊标签（多色态）
- `Icon`：统一 SVG 图标组件

### 9.2 概览页组件

- `StationCard`：5 站信息卡片（常规/换乘/主控三种变体）
- `LineTopology`：线路拓扑图（5 站点 + 连接线 + 状态标签）
- `KPIGrid`：5 列 KPI 指标区
- `VideoCarousel`：5 视频窗口轮播区

### 9.3 车站详情页组件

- `VideoGrid`：2×2 视频监控矩阵
- `PassengerFlowChart`：三线客流趋势图 + 下方三 KPI
- `TrainStatus`：列车动态卡片列表
- `EnvironmentPanel`：环境数据（站均/站台/站厅切换）
- `EnergyChart`：24h 分时能耗曲线
- `EnergyBreakdown`：能耗分类占比
- `AlertPanel`：告警统计 + 列表
- `EquipmentMatrix`：5 类设备健康网格
- `AlertLog`：历史告警日志表格

---

## 10. 文件结构

```
/
├── index.html                 # 桌面1：概览页
├── station-chegongmiao.html   # 桌面2：车公庙
├── station-xiangmihu.html     # 桌面3：香蜜湖
├── station-shoppingpark.html  # 桌面4：购物公园
├── station-zhuzilin.html      # 桌面5：竹子林
├── station-qiaochengeast.html # 桌面6：侨城东
├── css/
│   ├── design-system.css      # 色彩/字体/圆角/阴影变量
│   ├── components.css         # 卡片/标签/图标/按钮
│   ├── layouts.css            # 网格/自适应/sticky
│   ├── animations.css         # 所有动效关键帧
│   └── charts.css             # 图表样式
├── js/
│   ├── app.js                 # 桌面切换/路由/手势
│   ├── data-mock.js           # 模拟数据生成
│   ├── charts.js              # SVG 图表渲染
│   ├── animations.js          # 动效控制
│   └── components.js          # 组件渲染
└── assets/
    └── icons/                 # SVG 图标文件
```

---

## 11. 实现优先级

1. **P0**：设计系统（变量 + 基础组件）+ 概览页（桌面1）
2. **P0**：车公庙详情页（桌面2）作为详情页模板
3. **P1**：桌面切换动画 + 手势交互
4. **P1**：数据刷新动画（odometer + pulse + 图表生长）
5. **P1**：其余 4 个车站详情页（基于模板复制 + 数据替换）
6. **P2**：视频监控点击放大
7. **P2**：Hover 效果精细化调参
