class App {
  constructor() {
    this.currentDesktop = 0;
    this.totalDesktops = 6;
    this.container = document.getElementById('desktop-container');
    this.dots = document.querySelectorAll('.desktop-indicator__dot');
    this.chartsInitialized = {};

    this.init();
  }

  init() {
    this.setupTouchGesture();
    this.setupKeyboardNavigation();
    this.setupAutoRefresh();
    this.setupVideoModals();
    this.startVideoRotation();
    this.disableContextMenu();
    this.startClock();

    // 页面加载完成后预加载所有图表
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.preloadAllCharts());
    } else {
      this.preloadAllCharts();
    }
  }

  /**
   * 切换到指定桌面
   */
  navigate(targetIndex) {
    if (targetIndex < 0 || targetIndex >= this.totalDesktops) return;

    this.container.style.transform = `translateX(-${targetIndex * 100}vw)`;
    this.currentDesktop = targetIndex;
    this.updateIndicator();

    // 调试：检查目标桌面内容
    const targetDesktop = document.querySelector(`[data-desktop="${targetIndex}"]`);
    if (targetDesktop) {
      const container = targetDesktop.querySelector('.container');
      console.log('[Debug] Desktop', targetIndex, 'container height:', container?.offsetHeight, 'scrollHeight:', container?.scrollHeight);
    }
  }

  /**
   * 更新底部指示器
   */
  updateIndicator() {
    this.dots.forEach((dot, index) => {
      dot.classList.toggle('desktop-indicator__dot--active', index === this.currentDesktop);
    });
  }

  /**
   * 触摸 + 鼠标滑动手势
   */
  setupTouchGesture() {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    const minSwipeDistance = 80;

    const handleStart = (clientX, clientY) => {
      startX = clientX;
      startY = clientY;
      isDragging = true;
    };

    const handleEnd = (clientX) => {
      if (!isDragging) return;
      isDragging = false;

      const diffX = clientX - startX;

      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          // 向右滑 → 上一页
          this.navigate(this.currentDesktop - 1);
        } else {
          // 向左滑 → 下一页
          this.navigate(this.currentDesktop + 1);
        }
      }
    };

    // 触摸事件
    document.addEventListener('touchstart', (e) => {
      handleStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      if (diffX > diffY && diffX > 20) {
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', (e) => {
      handleEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // 鼠标事件（桌面端）
    document.addEventListener('mousedown', (e) => {
      handleStart(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });

    document.addEventListener('mouseup', (e) => {
      handleEnd(e.clientX);
    });

    document.addEventListener('mouseleave', () => {
      isDragging = false;
    });
  }

  /**
   * 键盘导航
   */
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.navigate(this.currentDesktop - 1);
      } else if (e.key === 'ArrowRight') {
        this.navigate(this.currentDesktop + 1);
      }
    });
  }

  /**
   * 自动刷新模拟数据
   */
  setupAutoRefresh() {
    setInterval(() => {
      this.refreshMockData();
    }, 8000);
  }

  /**
   * 刷新模拟数据（带动画）
   */
  refreshMockData() {
    // 刷新概览页 KPI 数字
    const kpiElements = document.querySelectorAll('[data-desktop="0"] .text-kpi');
    kpiElements.forEach(el => {
      const currentText = el.textContent.replace(/[^0-9]/g, '');
      const current = parseInt(currentText) || 0;
      const variation = Math.floor(current * 0.02 * (Math.random() - 0.5));
      const newValue = Math.max(0, current + variation);

      if (window.Animations) {
        window.Animations.countUp(el, newValue, 600);
      } else {
        el.textContent = newValue.toLocaleString();
      }
    });

    // 脉冲高亮更新的卡片
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach((card, index) => {
      if (Math.random() > 0.7) {
        setTimeout(() => {
          if (window.Animations) {
            window.Animations.pulse(card);
          }
        }, index * 100);
      }
    });
  }

  /**
   * 预加载所有桌面图表
   */
  preloadAllCharts() {
    // 当前桌面立即渲染
    this.initDesktopCharts(0);

    // 其余 5 个桌面分帧预加载，避免阻塞首屏
    const remaining = [1, 2, 3, 4, 5];
    remaining.forEach((idx, i) => {
      const delay = 500 + i * 300;
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => this.initDesktopCharts(idx), { timeout: delay });
      } else {
        setTimeout(() => this.initDesktopCharts(idx), delay);
      }
    });
  }

  /**
   * 初始化指定桌面的图表
   */
  initDesktopCharts(index) {
    if (this.chartsInitialized[index]) return;

    // 桌面 0（概览）暂无图表，后续如有可在此添加

    if (index === 1) {
      // 桌面 2：车公庙 — 客流趋势 + 24h 能耗
      const flowContainer = document.getElementById('passenger-flow-chart');
      if (flowContainer && window.ChartEngine) {
        const flowChart = new ChartEngine('passenger-flow-chart', { height: 220 });
        flowChart.renderMultiLine([
          { data: [80, 680, 350, 220, 380, 780, 320, 150, 60, 20], color: '#3b82f6' },
          { data: [60, 720, 380, 260, 320, 650, 420, 180, 70, 25], color: '#06b6d4' },
          { data: [140, 1400, 730, 480, 700, 1430, 740, 330, 130, 45], color: '#8b5cf6', dashed: true }
        ], ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']);
      }

      const energyContainer = document.getElementById('energy-curve-chart');
      if (energyContainer && window.ChartEngine) {
        const energyChart = new ChartEngine('energy-curve-chart', { height: 200 });
        energyChart.renderMultiLine([
          { data: [28, 26, 48, 175, 130, 95, 120, 195, 155, 98, 62, 32], color: '#3b82f6' },
          { data: [22, 20, 35, 105, 85, 78, 92, 115, 98, 68, 42, 25], color: '#f59e0b' },
          { data: [15, 14, 25, 62, 58, 55, 60, 65, 52, 38, 22, 16], color: '#06b6d4' },
          { data: [8, 7, 18, 55, 42, 28, 35, 62, 48, 25, 14, 9], color: '#8b5cf6' }
        ], ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00', '23:00', '24:00']);
      }
    }

    if (index === 2) {
      // 桌面 3：香蜜湖
      const flowContainer = document.getElementById('passenger-flow-chart-xiangmihu');
      if (flowContainer && window.ChartEngine) {
        const flowChart = new ChartEngine('passenger-flow-chart-xiangmihu', { height: 220 });
        flowChart.renderMultiLine([
          { data: [50, 420, 180, 120, 200, 380, 160, 80, 30, 10], color: '#3b82f6' },
          { data: [40, 350, 200, 140, 180, 340, 220, 90, 40, 15], color: '#06b6d4' },
          { data: [90, 770, 380, 260, 380, 720, 380, 170, 70, 25], color: '#8b5cf6', dashed: true }
        ], ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']);
      }

      const energyContainer = document.getElementById('energy-curve-chart-xiangmihu');
      if (energyContainer && window.ChartEngine) {
        const energyChart = new ChartEngine('energy-curve-chart-xiangmihu', { height: 200 });
        energyChart.renderMultiLine([
          { data: [16, 15, 26, 72, 58, 46, 64, 92, 78, 50, 30, 18], color: '#3b82f6' },
          { data: [12, 11, 18, 42, 38, 34, 45, 56, 48, 32, 20, 13], color: '#f59e0b' },
          { data: [9, 8, 14, 30, 28, 26, 31, 35, 30, 22, 15, 10], color: '#06b6d4' },
          { data: [5, 4, 9, 22, 17, 13, 19, 28, 21, 12, 8, 5], color: '#8b5cf6' }
        ], ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00', '23:00', '24:00']);
      }
    }

    if (index === 3) {
      // 桌面 4：购物公园
      const flowContainer = document.getElementById('passenger-flow-chart-shoppingpark');
      if (flowContainer && window.ChartEngine) {
        const flowChart = new ChartEngine('passenger-flow-chart-shoppingpark', { height: 220 });
        flowChart.renderMultiLine([
          { data: [60, 520, 280, 320, 380, 680, 420, 200, 80, 25], color: '#3b82f6' },
          { data: [50, 480, 320, 280, 340, 580, 520, 240, 90, 30], color: '#06b6d4' },
          { data: [110, 1000, 600, 600, 720, 1260, 940, 440, 170, 55], color: '#8b5cf6', dashed: true }
        ], ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']);
      }

      const energyContainer = document.getElementById('energy-curve-chart-shoppingpark');
      if (energyContainer && window.ChartEngine) {
        const energyChart = new ChartEngine('energy-curve-chart-shoppingpark', { height: 200 });
        energyChart.renderMultiLine([
          { data: [22, 20, 36, 118, 105, 132, 116, 158, 172, 138, 86, 32], color: '#3b82f6' },
          { data: [18, 16, 28, 72, 78, 98, 92, 112, 120, 96, 58, 24], color: '#f59e0b' },
          { data: [13, 12, 20, 48, 52, 66, 62, 72, 76, 60, 36, 16], color: '#06b6d4' },
          { data: [7, 6, 13, 38, 34, 48, 42, 58, 68, 52, 28, 10], color: '#8b5cf6' }
        ], ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00', '23:00', '24:00']);
      }
    }

    if (index === 4) {
      // 桌面 5：竹子林
      const flowContainer = document.getElementById('passenger-flow-chart-zhuzilin');
      if (flowContainer && window.ChartEngine) {
        const flowChart = new ChartEngine('passenger-flow-chart-zhuzilin', { height: 220 });
        flowChart.renderMultiLine([
          { data: [40, 380, 160, 100, 180, 320, 140, 70, 25, 8], color: '#3b82f6' },
          { data: [30, 450, 200, 120, 160, 280, 180, 80, 35, 12], color: '#06b6d4' },
          { data: [70, 830, 360, 220, 340, 600, 320, 150, 60, 20], color: '#8b5cf6', dashed: true }
        ], ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']);
      }

      const energyContainer = document.getElementById('energy-curve-chart-zhuzilin');
      if (energyContainer && window.ChartEngine) {
        const energyChart = new ChartEngine('energy-curve-chart-zhuzilin', { height: 200 });
        energyChart.renderMultiLine([
          { data: [10, 9, 18, 58, 42, 38, 50, 82, 62, 34, 20, 12], color: '#3b82f6' },
          { data: [8, 7, 14, 38, 30, 28, 35, 52, 42, 25, 15, 9], color: '#f59e0b' },
          { data: [6, 5, 10, 24, 20, 18, 22, 32, 26, 18, 12, 7], color: '#06b6d4' },
          { data: [4, 3, 8, 22, 16, 12, 18, 32, 22, 12, 7, 4], color: '#8b5cf6' }
        ], ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00', '23:00', '24:00']);
      }
    }

    if (index === 5) {
      // 桌面 6：侨城东
      const flowContainer = document.getElementById('passenger-flow-chart-qiaochengeast');
      if (flowContainer && window.ChartEngine) {
        const flowChart = new ChartEngine('passenger-flow-chart-qiaochengeast', { height: 220 });
        flowChart.renderMultiLine([
          { data: [25, 240, 100, 70, 120, 220, 90, 45, 18, 6], color: '#3b82f6' },
          { data: [20, 280, 120, 80, 110, 190, 120, 55, 22, 8], color: '#06b6d4' },
          { data: [45, 520, 220, 150, 230, 410, 210, 100, 40, 14], color: '#8b5cf6', dashed: true }
        ], ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00']);
      }

      const energyContainer = document.getElementById('energy-curve-chart-qiaochengeast');
      if (energyContainer && window.ChartEngine) {
        const energyChart = new ChartEngine('energy-curve-chart-qiaochengeast', { height: 200 });
        energyChart.renderMultiLine([
          { data: [12, 11, 22, 66, 50, 42, 56, 78, 68, 40, 24, 13], color: '#3b82f6' },
          { data: [9, 8, 16, 42, 34, 31, 39, 50, 45, 28, 18, 10], color: '#f59e0b' },
          { data: [7, 6, 12, 28, 24, 22, 26, 34, 30, 20, 14, 8], color: '#06b6d4' },
          { data: [4, 3, 8, 24, 18, 14, 20, 30, 24, 13, 8, 4], color: '#8b5cf6' }
        ], ['00:00', '02:00', '04:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00', '23:00', '24:00']);
      }
    }

    this.chartsInitialized[index] = true;
  }

  /**
   * 视频轮播：每 5 秒切换下一个视频，错开时间并带淡入淡出
   */
  startVideoRotation() {
    const videos = document.querySelectorAll('.monitor-video');
    if (!videos.length) return;

    videos.forEach((video, index) => {
      const list = JSON.parse(video.dataset.videos || '[]');
      if (list.length <= 1) return;

      // 每个视频错开 1 秒开始轮播
      const staggerDelay = index * 1000;

      setTimeout(() => {
        setInterval(() => {
          try {
            // 柔和过渡：模糊+变暗，避免完全黑屏
            video.style.filter = 'blur(4px) brightness(0.5)';
            video.style.opacity = '0.6';

            setTimeout(() => {
              let idx = parseInt(video.dataset.index, 10) || 0;
              idx = (idx + 1) % list.length;
              video.src = list[idx];
              video.dataset.index = idx;
              video.load();
              video.play().catch(() => {});

              // 恢复清晰
              video.style.filter = 'none';
              video.style.opacity = '1';

              // 同步更新卡片 caption
              const card = video.closest('.monitor-card');
              if (card) {
                const captionEl = card.querySelector('.text-caption');
                if (captionEl) {
                  const currentText = captionEl.textContent || '';
                  const stationName = currentText.split(' · ')[0] || '';
                  const location = this.getVideoLocationName(video.src);
                  const suffix = idx > 0 ? (idx + 1) : '';
                  captionEl.textContent = stationName ? `${stationName} · ${location}${suffix}` : `${location}${suffix}`;
                }
              }

              // 如果弹窗打开且关联的是当前视频，同步更新弹窗标题
              this.updateModalTitleIfNeeded(video, idx);
            }, 250);
          } catch (e) {
            // ignore
          }
        }, 5000);
      }, staggerDelay);
    });
  }

  /**
   * 根据视频文件名获取位置名称
   */
  getVideoLocationName(src) {
    const map = {
      'hall': '站厅',
      'platform': '站台',
      'transfer': '换乘通道',
      'entrance': '出入口',
      'import': '进口',
      'escalator': '扶梯'
    };
    const filename = src.split('/').pop().replace(/\d+\.mp4$/, '');
    return map[filename] || '监控画面';
  }

  /**
   * 如果弹窗打开且关联当前视频，更新弹窗标题
   */
  updateModalTitleIfNeeded(video, index) {
    if (!this.videoModal?.classList.contains('video-modal--open')) return;
    if (this.activeSourceVideo !== video) return;

    const stationName = this.activeStationName || '';
    const location = this.getVideoLocationName(video.src);
    const suffix = index > 0 ? (index + 1) : '';
    const title = stationName ? `${stationName} · ${location}${suffix}` : `${location}${suffix}`;

    if (this.modalTitle) this.modalTitle.textContent = title;
  }

  /**
   * 视频弹窗设置
   */
  setupVideoModals() {
    this.videoModal = document.getElementById('video-modal');
    this.modalVideo = document.getElementById('modal-video');
    this.modalTitle = document.getElementById('modal-title');
    if (!this.videoModal) return;

    // 关闭按钮
    document.getElementById('video-modal-close')?.addEventListener('click', () => this.closeVideoModal());

    // 点击遮罩关闭
    this.videoModal.addEventListener('click', (e) => {
      if (e.target === this.videoModal) this.closeVideoModal();
    });

    // 为所有监控卡片绑定点击
    document.querySelectorAll('.monitor-card').forEach(card => {
      card.addEventListener('click', () => {
        const video = card.querySelector('.monitor-video');
        if (!video) return;

        const caption = card.querySelector('.text-caption')?.textContent || '监控画面';
        const stationName = caption.split(' · ')[0] || '';
        const idx = parseInt(video.dataset.index, 10) || 0;
        const src = video.currentSrc || video.querySelector('source')?.src || '';
        const location = this.getVideoLocationName(src);
        const suffix = idx > 0 ? (idx + 1) : '';
        const title = stationName ? `${stationName} · ${location}${suffix}` : `${location}${suffix}`;

        this.openVideoModal(src, title, video, stationName);
      });
    });

    // 为车站页面的视频占位符也绑定点击
    document.querySelectorAll('.video-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        const videoName = cell.querySelector('.text-caption')?.textContent || '监控画面';
        const desktop = cell.closest('.desktop');
        const stationName = desktop?.querySelector('.desktop-title .text-display')?.textContent || '';
        const title = stationName ? `${stationName} · ${videoName.replace(/\s*CAM-\d+/, '')}` : videoName;
        this.openVideoModal('assets/videos/hall1.mp4', title, null, stationName);
      });
    });
  }

  openVideoModal(src, title, sourceVideo = null, stationName = '') {
    this.activeSourceVideo = sourceVideo;
    this.activeStationName = stationName;
    if (this.modalVideo) {
      this.modalVideo.src = src;
      this.modalVideo.play().catch(() => {});
    }
    if (this.modalTitle) this.modalTitle.textContent = title;
    this.videoModal.classList.add('video-modal--open');
  }

  closeVideoModal() {
    this.videoModal.classList.remove('video-modal--open');
    this.activeSourceVideo = null;
    this.activeStationName = '';
    if (this.modalVideo) {
      this.modalVideo.pause();
      this.modalVideo.src = '';
    }
  }

  /**
   * 禁用右键菜单
   */
  disableContextMenu() {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }

  /**
   * 启动实时时钟
   */
  startTrafficScroll() {
    document.querySelectorAll('.traffic-scroll').forEach(container => {
      const inner = container.querySelector('div');
      if (!inner) return;
      const screens = inner.querySelectorAll('.grid-2');
      if (screens.length <= 1) return;

      let current = 0;
      setInterval(() => {
        current = (current + 1) % screens.length;
        inner.style.transform = `translateY(-${current * (100 / screens.length)}%)`;
      }, 5000);
    });
  }

  startClock() {
    const timeEl = document.getElementById('header-time');
    if (!timeEl) return;

    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.textContent = `${h}:${m}:${s}`;
    };

    update();
    setInterval(update, 1000);
  }
}

// 启动应用
window.app = new App();
