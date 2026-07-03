class ChartEngine {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Chart container #${containerId} not found`);
      return;
    }
    this.width = this.container.clientWidth || 800;
    this.height = options.height || 200;
    this.padding = { top: 10, right: 10, bottom: 30, left: 50 };
    this.svg = null;
    this.defs = null;
  }

  // 创建 SVG 元素
  createSVG() {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('width', '100%');
    this.svg.setAttribute('height', this.height);
    this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
    this.svg.style.overflow = 'visible';

    this.defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    this.svg.appendChild(this.defs);

    this.container.appendChild(this.svg);
    return this.svg;
  }

  // 创建面积渐变
  createGradient(id, color, topOpacity = 0.35) {
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', id);
    gradient.setAttribute('x1', '0');
    gradient.setAttribute('y1', '0');
    gradient.setAttribute('x2', '0');
    gradient.setAttribute('y2', '1');

    const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', color);
    stop1.setAttribute('stop-opacity', topOpacity);

    const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '60%');
    stop2.setAttribute('stop-color', color);
    stop2.setAttribute('stop-opacity', '0.08');

    const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop3.setAttribute('offset', '100%');
    stop3.setAttribute('stop-color', color);
    stop3.setAttribute('stop-opacity', '0');

    gradient.appendChild(stop1);
    gradient.appendChild(stop2);
    gradient.appendChild(stop3);
    this.defs.appendChild(gradient);
  }

  // 数据归一化
  normalize(data, minVal, maxVal) {
    const min = minVal !== undefined ? minVal : Math.min(...data);
    const max = maxVal !== undefined ? maxVal : Math.max(...data);
    const range = max - min || 1;
    const chartHeight = this.height - this.padding.top - this.padding.bottom;
    return data.map(v => this.height - this.padding.bottom - ((v - min) / range) * chartHeight);
  }

  // 绘制网格线
  drawGrid(maxVal = 100, minVal = 0) {
    const chartHeight = this.height - this.padding.top - this.padding.bottom;
    const gridCount = 4;

    for (let i = 0; i <= gridCount; i++) {
      const y = this.padding.top + (chartHeight / gridCount) * i;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', this.padding.left);
      line.setAttribute('y1', y);
      line.setAttribute('x2', this.width - this.padding.right);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#e2e8f0');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,4');
      this.svg.appendChild(line);

      const value = maxVal - ((maxVal - minVal) / gridCount) * i;
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', this.padding.left - 8);
      text.setAttribute('y', y + 4);
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('fill', '#94a3b8');
      text.setAttribute('font-size', '11');
      text.setAttribute('font-family', 'var(--font-base)');
      text.textContent = Math.round(value);
      this.svg.appendChild(text);
    }
  }

  // 生成贝塞尔曲线路径（catmull-rom 转换为三次贝塞尔）
  generateSplinePath(points) {
    if (points.length < 2) return '';

    const pts = points.map(p => {
      const [x, y] = p.split(',').map(Number);
      return { x, y };
    });

    // 处理边界：首尾点添加控制点
    if (pts.length === 2) {
      return `M ${pts[0].x},${pts[0].y} L ${pts[1].x},${pts[1].y}`;
    }

    const tension = 0.5; // 越小越平滑
    let path = `M ${pts[0].x},${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      // Catmull-Rom 控制点计算
      const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
      const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
      const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
      const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }

    return path;
  }

  // 多线面积图
  renderMultiLine(seriesList, labels) {
    if (!this.container) return;
    this.createSVG();

    const chartWidth = this.width - this.padding.left - this.padding.right;
    const allValues = seriesList.flatMap(s => s.data);
    const maxVal = Math.max(...allValues) * 1.1;
    const minVal = 0;

    // 绘制网格
    this.drawGrid(maxVal, minVal);

    // 绘制每条线
    seriesList.forEach((series, index) => {
      const yValues = this.normalize(series.data, minVal, maxVal);
      const xStep = chartWidth / (series.data.length - 1);

      // 生成路径点
      const points = series.data.map((_, i) => {
        const x = this.padding.left + i * xStep;
        const y = yValues[i];
        return `${x},${y}`;
      });

      // 创建渐变
      const gradientId = `gradient-${index}`;
      this.createGradient(gradientId, series.color);

      // 面积路径（闭合到底部，平滑曲线）
      const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const bottomY = this.height - this.padding.bottom;
      const startX = points[0].split(',')[0];
      const endX = points[points.length - 1].split(',')[0];

      // 面积路径 = 移动到左下角 + 沿曲线走 + 到右下角 + 闭合
      const splinePath = this.generateSplinePath(points);
      const areaD = `M ${startX},${bottomY} L ${splinePath.replace(/^M /, '')} L ${endX},${bottomY} Z`;
      areaPath.setAttribute('d', areaD);
      areaPath.setAttribute('fill', `url(#${gradientId})`);
      areaPath.setAttribute('filter', 'drop-shadow(0 4px 12px ' + series.color + '40)');
      this.svg.appendChild(areaPath);

      // 线条（平滑曲线）
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', this.generateSplinePath(points));
      line.setAttribute('fill', 'none');
      line.setAttribute('stroke', series.color);
      line.setAttribute('stroke-width', '2.5');
      line.setAttribute('stroke-linecap', 'round');
      line.setAttribute('stroke-linejoin', 'round');
      if (series.dashed) {
        line.setAttribute('stroke-dasharray', '6,4');
      }
      this.svg.appendChild(line);

      // 数据点（隐藏，hover 时显示）
      series.data.forEach((_, i) => {
        const x = this.padding.left + i * xStep;
        const y = yValues[i];
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', 'white');
        dot.setAttribute('stroke', series.color);
        dot.setAttribute('stroke-width', '2');
        dot.setAttribute('class', 'chart-dot');
        this.svg.appendChild(dot);
      });
    });

    // X 轴标签
    if (labels) {
      const xStep = chartWidth / (labels.length - 1);
      labels.forEach((label, i) => {
        const x = this.padding.left + i * xStep;
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', this.height - 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', '#94a3b8');
        text.setAttribute('font-size', '11');
        text.setAttribute('font-family', 'var(--font-base)');
        text.textContent = label;
        this.svg.appendChild(text);
      });
    }

    // 添加底部基线
    const baseLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    baseLine.setAttribute('x1', this.padding.left);
    baseLine.setAttribute('y1', this.height - this.padding.bottom);
    baseLine.setAttribute('x2', this.width - this.padding.right);
    baseLine.setAttribute('y2', this.height - this.padding.bottom);
    baseLine.setAttribute('stroke', '#e2e8f0');
    baseLine.setAttribute('stroke-width', '1');
    this.svg.appendChild(baseLine);
  }
}

window.ChartEngine = ChartEngine;
