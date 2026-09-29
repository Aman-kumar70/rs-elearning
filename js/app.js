/* ================================================================
   Remote Sensing & Image Processing — Interactive Guide
   Shared App Script — two-track nav, reveal animations
   ================================================================ */

const RS_TRACK = [
  { file: 'pages/remote-sensing/fundamentals.html',   short: 'Fundamentals',   title: 'What Is Remote Sensing?',        num: 'RS.1' },
  { file: 'pages/remote-sensing/signatures.html',     short: 'Signatures',     title: 'Spectral Signatures',            num: 'RS.2' },
  { file: 'pages/remote-sensing/platforms.html',      short: 'Platforms',      title: 'Orbits & Scanning',               num: 'RS.3' },
  { file: 'pages/remote-sensing/resolution.html',     short: 'Resolution',     title: 'The Four Resolutions',            num: 'RS.4' },
  { file: 'pages/remote-sensing/interpretation.html', short: 'Interpretation', title: 'Reading a Satellite Image',       num: 'RS.5' },
  { file: 'pages/remote-sensing/missions-data.html',  short: 'Missions & Data',title: 'Satellites & Free Data',          num: 'RS.6' },
];

const IP_TRACK = [
  { file: 'pages/image-processing/basics.html',         short: 'Digital Images', title: 'What Is a Digital Image?',       num: 'IP.1' },
  { file: 'pages/image-processing/preprocessing.html',  short: 'Preprocessing',  title: 'Radiometric & Geometric Correction', num: 'IP.2' },
  { file: 'pages/image-processing/enhancement.html',    short: 'Enhancement',    title: 'Contrast, Filtering & Indices',   num: 'IP.3' },
  { file: 'pages/image-processing/classification.html', short: 'Classification', title: 'Turning Pixels Into Classes',     num: 'IP.4' },
  { file: 'pages/image-processing/python-lab.html',     short: 'Python Lab',     title: 'A Real NDVI + Classification Workflow', num: 'IP.5' },
];

const ALL_PAGES = [
  { file: 'index.html', short: 'Home', title: 'Home', num: null, track: null },
  ...RS_TRACK.map(p => ({ ...p, track: 'rs' })),
  ...IP_TRACK.map(p => ({ ...p, track: 'ip' })),
  { file: 'pages/applications.html', short: 'Applications', title: 'Real-World Applications', num: null, track: null },
  { file: 'pages/quiz.html', short: 'Quiz', title: 'Knowledge Check', num: null, track: null },
];

function currentPageFile() {
  const p = window.location.pathname.split('/').pop() || 'index.html';
  return p === '' ? 'index.html' : p;
}

function buildDropdown(track, label, cls) {
  const current = currentPageFile();
  const hasCurrent = track.some(p => p.file === current);
  const items = track.map(p => `
    <a href="${p.file}" class="${p.file === current ? 'current' : ''}">
      <span class="dn-num">${p.num}</span>${p.short}
    </a>`).join('');
  return `
    <div class="nav-group ${hasCurrent ? 'has-current' : ''}">
      <span class="nav-group-label">${label}</span>
      <div class="nav-dropdown">${items}</div>
    </div>`;
}

function buildNav() {
  const current = currentPageFile();
  const homeCls = current === 'index.html' ? 'current' : '';
  const appCls = current === 'pages/applications.html' ? 'current' : '';
  const quizCls = current === 'pages/quiz.html' ? 'current' : '';
  return `
    <nav class="site-nav" id="siteNav">
      <a class="nav-logo" href="index.html">RS·IP GUIDE</a>
      <div class="nav-links">
        <a href="index.html" class="${homeCls}">Home</a>
        ${buildDropdown(RS_TRACK, 'Remote Sensing')}
        ${buildDropdown(IP_TRACK, 'Image Processing')}
        <a href="pages/applications.html" class="${appCls}">Applications</a>
        <a href="pages/quiz.html" class="nav-quiz ${quizCls}">Quiz</a>
      </div>
    </nav>`;
}

function buildFooter() {
  return `
    <footer class="site-footer">
      <p>
        Remote Sensing &amp; Digital Image Processing — Interactive Guide<br>
        Built from IIRS-ISRO lecture material (Dr. Hina Pande · Shri Vinay Kumar · Ms. Minakshi Kumar · Dr. Poonam S. Tiwari) and NASA ARSET fundamentals<br>
        Figures credited inline are reproduced from the source lecture decks for educational use · Diagrams &amp; code are original to this guide
      </p>
    </footer>`;
}

function buildPrevNext() {
  const current = currentPageFile();
  const combined = [{file:'index.html'}, ...RS_TRACK, ...IP_TRACK, {file:'pages/applications.html'}, {file:'pages/quiz.html'}];
  const idx = combined.findIndex(p => p.file === current);
  if (idx === -1) return '';
  const prev = idx > 0 ? ALL_PAGES.find(p => p.file === combined[idx-1].file) : null;
  const next = idx < combined.length - 1 ? ALL_PAGES.find(p => p.file === combined[idx+1].file) : null;
  let html = '<div class="page-nav">';
  html += prev ? `<a class="prev" href="${prev.file}"><span class="pn-label">Previous</span><span class="pn-title">${prev.title}</span></a>` : '<span></span>';
  html += next ? `<a class="next" href="${next.file}"><span class="pn-label">Next</span><span class="pn-title">${next.title}</span></a>` : '<span></span>';
  html += '</div>';
  return html;
}

function injectChrome() {
  document.body.insertAdjacentHTML('afterbegin', buildNav());
  document.body.insertAdjacentHTML('beforeend', buildPrevNext() + buildFooter());

  window.addEventListener('scroll', () => {
    const nav = document.getElementById('siteNav');
    if (!nav) return;
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '100px 0px 100px 0px' });

  // Immediate visibility check for above-the-fold or near-viewport sections
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 150) {
      el.classList.add('visible');
    } else {
      revealObserver.observe(el);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectChrome);
} else {
  injectChrome();
}

window.RS_TRACK = RS_TRACK;
window.IP_TRACK = IP_TRACK;
window.currentPageFile = currentPageFile;
