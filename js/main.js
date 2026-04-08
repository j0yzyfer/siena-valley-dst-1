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
