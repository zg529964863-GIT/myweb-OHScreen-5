const Animations = {
  /**
   * 数字滚动（老虎机效果）
   * @param {HTMLElement} element — 目标元素
   * @param {number} target — 目标数值
   * @param {number} duration — 动画时长（毫秒）
   */
  countUp(element, target, duration = 800) {
    const start = parseInt(element.textContent.replace(/[^0-9]/g, '')) || 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  },

  /**
   * 脉冲高亮
   * @param {HTMLElement} element — 目标元素
   */
  pulse(element) {
    element.classList.remove('animate-pulse');
    void element.offsetWidth; // 强制重排
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), 600);
  },

  /**
   * 子元素交错淡入
   * @param {HTMLElement} container — 容器元素
   */
  staggerIn(container) {
    container.classList.add('stagger-children');
  },

  /**
   * 线条绘制动画（SVG）
   * @param {SVGPolylineElement} polylineElement — SVG polyline 元素
   */
  drawLine(polylineElement) {
    const length = polylineElement.getTotalLength();
    polylineElement.style.setProperty('--line-length', length);
    polylineElement.style.strokeDasharray = length;
    polylineElement.style.strokeDashoffset = length;
    polylineElement.style.animation = 'drawLine 800ms ease-out forwards';
  },

  /**
   * 触发所有图表线条绘制动画
   * @param {string} containerId — 图表容器 ID
   */
  animateChartLines(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const polylines = container.querySelectorAll('polyline');
    polylines.forEach((line, index) => {
      setTimeout(() => this.drawLine(line), index * 150);
    });
  }
};

window.Animations = Animations;
