  // ─── Ground Lease Chart ───────────────────────────────────
  const leaseData = [
    { date: "Jun 1, 2025",  value: 0 },
    { date: "Jul 1, 2025",  value: 0 },
    { date: "Oct 1, 2025",  value: 0 },
    { date: "Jan 1, 2026",  value: 375000 },
    { date: "Apr 1, 2026",  value: 375000 },
    { date: "Jul 1, 2026",  value: 562500 },
    { date: "Oct 1, 2026",  value: 562500 },
    { date: "Jan 1, 2027",  value: 562500 },
    { date: "Apr 1, 2027",  value: 562500 },
    { date: "Jul 1, 2027",  value: 618750 },
    { date: "Oct 1, 2027",  value: 618750 },
    { date: "Jan 1, 2028",  value: 618750 },
    { date: "Apr 1, 2028",  value: 618750 },
    { date: "Jul 1, 2028",  value: 680625 },
    { date: "Oct 1, 2028",  value: 680625 },
    { date: "Jan 1, 2029",  value: 680625 },
    { date: "Apr 1, 2029",  value: 680625 },
  ];
  const maxLease = Math.max(...leaseData.map(d => d.value));
  const MIN_BAR_H = 4; // px for $0 bars

  function formatDollars(v) {
    if (v === 0) return "$0";
    return "$" + v.toLocaleString('en-US');
  }

  const leaseChart = document.getElementById('leaseChart');
  const leaseTooltip = document.getElementById('leaseTooltip');
  const chartHeight = 255; // matches CSS height minus bottom border

  leaseData.forEach((item, i) => {
    const bar = document.createElement('div');
    bar.className = 'lease-bar' + (item.value === 0 ? ' zero' : '');
    const pct = item.value === 0 ? 0 : (item.value / maxLease);
    const px = item.value === 0 ? MIN_BAR_H : Math.max(MIN_BAR_H, Math.round(pct * chartHeight));
    bar.style.height = px + 'px';
    bar.dataset.value = item.value;
    bar.dataset.date = item.date;

    if (item.value > 0) {
      const showTip = (e) => {
        // position tooltip relative to chart wrap
        const wrap = leaseChart.parentElement;
        const wrapRect = wrap.getBoundingClientRect();
        const barRect = bar.getBoundingClientRect();
        const left = barRect.left - wrapRect.left + barRect.width / 2;
        const top  = barRect.top  - wrapRect.top  - 4;

        leaseTooltip.innerHTML =
          `<div class="lease-tooltip-date">${item.date}</div>` +
          `<div class="lease-tooltip-val">${formatDollars(item.value)}</div>`;
        leaseTooltip.style.left = left + 'px';
        leaseTooltip.style.top  = top + 'px';
        leaseTooltip.style.transform = 'translate(-50%, -100%)';
        leaseTooltip.classList.add('visible');
        // highlight
        document.querySelectorAll('.lease-bar').forEach(b => b.classList.remove('active'));
        bar.classList.add('active');
      };
      const hideTip = () => {
        leaseTooltip.classList.remove('visible');
        bar.classList.remove('active');
      };
      bar.addEventListener('mouseenter', showTip);
      bar.addEventListener('mouseleave', hideTip);
      bar.addEventListener('click', (e) => {
        if (leaseTooltip.classList.contains('visible')) { hideTip(); } else { showTip(e); }
      });
    }
    leaseChart.appendChild(bar);
  });

  // Expand table
  const leaseExpandBtn = document.getElementById('leaseExpandBtn');
  const leaseTableEl   = document.getElementById('leaseTable');
  const leaseExpandIcon = document.getElementById('leaseExpandIcon');
  const leaseTableBody = document.getElementById('leaseTableBody');

  // Populate table
  leaseData.forEach(item => {
    const tr = document.createElement('tr');
    if (item.value === 0) tr.className = 'zero-row';
    tr.innerHTML = `<td>${item.date}</td><td>${formatDollars(item.value)}</td>`;
    leaseTableBody.appendChild(tr);
  });

  leaseExpandBtn.addEventListener('click', () => {
    const open = leaseTableEl.style.display !== 'none';
    leaseTableEl.style.display = open ? 'none' : 'block';
    leaseExpandIcon.style.transform = open ? 'rotate(0deg)' : 'rotate(180deg)';
  });

  // ─── Cash Flow Chart ──────────────────────────────────────
  const cfData = [
    { date: "May 1, 2025",  value: -35000000, type: "initial" },
    { date: "Jun 1, 2025",  value: 0,         type: "zero" },
    { date: "Jul 1, 2025",  value: 0,         type: "zero" },
    { date: "Oct 1, 2025",  value: 0,         type: "zero" },
    { date: "Jan 1, 2026",  value: 250000,    type: "income" },
    { date: "Apr 1, 2026",  value: 250000,    type: "income" },
    { date: "Jul 1, 2026",  value: 250000,    type: "income" },
    { date: "Oct 1, 2026",  value: 250000,    type: "income" },
    { date: "Jan 1, 2027",  value: 375000,    type: "income" },
    { date: "Apr 1, 2027",  value: 375000,    type: "income" },
    { date: "Jul 1, 2027",  value: 375000,    type: "income" },
    { date: "Oct 1, 2027",  value: 375000,    type: "income" },
    { date: "Jan 1, 2028",  value: 437500,    type: "income" },
    { date: "Apr 1, 2028",  value: 437500,    type: "income" },
    { date: "Jul 1, 2028",  value: 437500,    type: "income" },
    { date: "Oct 1, 2028",  value: 437500,    type: "income" },
    { date: "Jan 1, 2029",  value: 1000000,   type: "income" },
    { date: "Apr 1, 2029",  value: 1000000,   type: "income" },
    { date: "May 1, 2029",  value: 46936663,  type: "exit" },
  ];

  // Color by value tier
  function cfColor(item) {
    if (item.type === "initial") return "#e5e5e5";
    if (item.type === "zero")    return "#e5e5e5";
    if (item.type === "exit")    return "#1b4332";
    const v = item.value;
    if (v <= 250000) return "rgba(181,145,58,0.4)";
    if (v <= 375000) return "rgba(181,145,58,0.6)";
    if (v <= 437500) return "rgba(181,145,58,0.8)";
    return "#b5913a";
  }

  // Two-scale: income bars scale vs $1M max → max 35% of chart height
  // exit bar = 100%
  const CF_CHART_H = 240; // px (matching CSS height minus padding)
  const CF_INCOME_MAX = 1000000;
  const CF_INCOME_H_FRACTION = 0.35;

  function cfBarHeight(item) {
    if (item.type === "initial" || item.type === "zero") return 4;
    if (item.type === "exit") return CF_CHART_H;
    return Math.round((item.value / CF_INCOME_MAX) * CF_INCOME_H_FRACTION * CF_CHART_H);
  }

  function formatCF(item) {
    if (item.value === 0) return "$0";
    if (item.value < 0)   return "(" + "$" + Math.abs(item.value).toLocaleString('en-US') + ")";
    return "$" + item.value.toLocaleString('en-US');
  }

  const cfChart  = document.getElementById('cfChart');
  const cfTooltip = document.getElementById('cfTooltip');

  cfData.forEach((item) => {
    const bar = document.createElement('div');
    bar.className = 'cf-bar' + (item.type === 'zero' ? ' zero' : '') + (item.type === 'initial' ? ' initial zero' : '');
    bar.style.height = cfBarHeight(item) + 'px';
    bar.style.background = cfColor(item);
    bar.style.flexShrink = '0';

    const isInteractive = item.type !== 'zero' && item.type !== 'initial';

    if (isInteractive || item.type === 'initial') {
      const showTip = () => {
        const wrap = cfChart.parentElement;
        const wrapRect = wrap.getBoundingClientRect();
        const barRect  = bar.getBoundingClientRect();
        const left = barRect.left - wrapRect.left + barRect.width / 2;
        const top  = barRect.top  - wrapRect.top  - 8;

        const valClass = item.type === 'exit' ? 'exit' : item.value < 0 ? 'negative' : 'positive';
        cfTooltip.innerHTML =
          `<div class="cf-tooltip-date">${item.date}</div>` +
          `<div class="cf-tooltip-val ${valClass}">${formatCF(item)}</div>`;
        cfTooltip.style.left = left + 'px';
        cfTooltip.style.top  = top + 'px';
        cfTooltip.style.transform = 'translate(-50%, -100%)';
        cfTooltip.classList.add('visible');
        document.querySelectorAll('.cf-bar').forEach(b => b.classList.remove('active'));
        bar.classList.add('active');
      };
      const hideTip = () => {
        cfTooltip.classList.remove('visible');
        bar.classList.remove('active');
      };
      bar.style.cursor = 'pointer';
      bar.addEventListener('mouseenter', showTip);
      bar.addEventListener('mouseleave', hideTip);
    }
    cfChart.appendChild(bar);
  });

  // ─── Nav scroll effect
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.style.borderBottomColor = window.scrollY > 10 ? '#e5e5e5' : 'transparent';
  });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navDrawer = document.getElementById('navDrawer');
  hamburger.addEventListener('click', () => {
    navDrawer.classList.toggle('open');
  });

  // Close drawer on link click
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', () => navDrawer.classList.remove('open'));
  });

  // Accordion
  function toggleAccordion(header) {
    const body = header.nextElementSibling;
    const icon = header.querySelector('.accordion-icon');
    if (!body) return;
    const isOpen = body.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('open'));
    // Open clicked if it was closed
    if (!isOpen) {
      body.classList.add('open');
      if (icon) icon.classList.add('open');
    }
  }

  // Form submit
  document.querySelector('.form-submit').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.querySelector('input[type="text"]').value;
    const accredited = document.getElementById('accredited').checked;
    if (!accredited) {
      alert('Please confirm you are an accredited investor.');
      return;
    }
    alert('Thank you' + (name ? ', ' + name : '') + '. Your request has been received. Our team will be in touch shortly.');
  });

  // ─── Map Lightbox ─────────────────────────────────────────
  (function () {
    const lightbox  = document.getElementById('mapLightbox');
    const stage     = document.getElementById('lightboxStage');
    const lbImg     = document.getElementById('lightboxImg');
    const lbWrap    = document.getElementById('lbImgWrap');
    const lbPinScreen = document.getElementById('lbPinScreen');
    const trigger   = document.getElementById('projectMapImg');
    const triggers  = document.querySelectorAll('[data-lightbox]');
    const closeBtn  = document.getElementById('lightboxClose');
    const btnZoomIn = document.getElementById('lbZoomIn');
    const btnZoomOut= document.getElementById('lbZoomOut');
    const btnReset  = document.getElementById('lbReset');

    // tx/ty are offsets from center (transform-origin: center center)
    let scale = 1, tx = 0, ty = 0, fitScale = 1;
    let dragging = false, dragStartX = 0, dragStartY = 0;
    const MAX_SCALE = 8, ZOOM_STEP = 0.3;

    // Update screen-space positions of lightbox pins so they track the image
    function updateLbPins() {
      const r = stage.getBoundingClientRect();
      const cx = r.width  / 2;
      const cy = r.height / 2;
      const w  = lbImg.naturalWidth;
      const h  = lbImg.naturalHeight;
      lbPinScreen.querySelectorAll('.lb-pin').forEach(pin => {
        const px = parseFloat(pin.dataset.px);
        const py = parseFloat(pin.dataset.py);
        // Image-center-relative coords, then apply current transform
        const sx = cx + tx + (px - 0.5) * w * scale;
        const sy = cy + ty + (py - 0.5) * h * scale;
        pin.style.left = sx + 'px';
        pin.style.top  = sy + 'px';
      });
    }

    function applyTransform() {
      lbWrap.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      updateLbPins();
    }

    function computeFitScale() {
      const r = stage.getBoundingClientRect();
      const pad = 48;
      return Math.min(
        (r.width  - pad * 2) / lbImg.naturalWidth,
        (r.height - pad * 2) / lbImg.naturalHeight
      );
    }

    function resetView() {
      scale = fitScale; tx = 0; ty = 0;
      applyTransform();
    }

    // Zoom toward a specific point in stage coordinates (cx, cy relative to stage center)
    function zoomAt(newScale, cx, cy) {
      newScale = Math.min(MAX_SCALE, Math.max(fitScale * 0.8, newScale));
      // Keep the image point under (cx, cy) fixed
      tx = cx - (cx - tx) * (newScale / scale);
      ty = cy - (cy - ty) * (newScale / scale);
      scale = newScale;
      applyTransform();
    }

    function stageCenterOffset(clientX, clientY) {
      const r = stage.getBoundingClientRect();
      return { x: clientX - (r.left + r.width / 2), y: clientY - (r.top + r.height / 2) };
    }

    function open(src, showPins) {
      lbImg.src = src;
      lbPinScreen.style.display = showPins ? '' : 'none';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      function initView() {
        lbWrap.style.width  = lbImg.naturalWidth  + 'px';
        lbWrap.style.height = lbImg.naturalHeight + 'px';
        fitScale = computeFitScale();
        resetView();
      }
      if (lbImg.naturalWidth && lbImg.src === src) {
        initView();
      } else {
        lbImg.onload = initView;
      }
    }

    function close() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    triggers.forEach(el => el.addEventListener('click', () => open(el.src, 'lightboxPins' in el.dataset)));
    // also wire up any trigger added via direct id (defensive)
    closeBtn.addEventListener('click', close);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox || e.target === stage) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Button zoom toward center
    btnZoomIn.addEventListener('click',  () => zoomAt(scale + ZOOM_STEP, 0, 0));
    btnZoomOut.addEventListener('click', () => zoomAt(scale - ZOOM_STEP, 0, 0));
    btnReset.addEventListener('click',   resetView);

    // Scroll to zoom toward cursor
    stage.addEventListener('wheel', (e) => {
      e.preventDefault();
      const { x, y } = stageCenterOffset(e.clientX, e.clientY);
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      zoomAt(scale + delta, x, y);
    }, { passive: false });

    // Mouse drag to pan
    stage.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      dragging = true;
      dragStartX = e.clientX - tx;
      dragStartY = e.clientY - ty;
      stage.classList.add('dragging');
    });
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      tx = e.clientX - dragStartX;
      ty = e.clientY - dragStartY;
      applyTransform();
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
      stage.classList.remove('dragging');
    });

    // Touch: single-finger pan, two-finger pinch zoom
    let lastDist = null, lastMidX = 0, lastMidY = 0;
    stage.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        dragging = true;
        dragStartX = e.touches[0].clientX - tx;
        dragStartY = e.touches[0].clientY - ty;
      } else if (e.touches.length === 2) {
        dragging = false;
        lastDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        lastMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        lastMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    }, { passive: true });
    stage.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && dragging) {
        tx = e.touches[0].clientX - dragStartX;
        ty = e.touches[0].clientY - dragStartY;
        applyTransform();
      } else if (e.touches.length === 2 && lastDist !== null) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        const { x, y } = stageCenterOffset(midX, midY);
        zoomAt(scale * (dist / lastDist), x, y);
        lastDist = dist; lastMidX = midX; lastMidY = midY;
      }
    }, { passive: false });
    stage.addEventListener('touchend', () => { dragging = false; lastDist = null; });
  })();
