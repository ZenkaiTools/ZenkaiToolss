// ===== TAB SWITCHING =====
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(tabName) {
  navItems.forEach(item => {
    if (item.dataset.tab === tabName) item.classList.add('active');
    else item.classList.remove('active');
  });
  tabContents.forEach(content => {
    if (content.id === 'tab-' + tabName) content.classList.add('active');
    else content.classList.remove('active');
  });
  const main = document.querySelector('.app-main');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  try { localStorage.setItem('zenkai_active_tab', tabName); } catch(e) {}
}
window.switchTab = switchTab;

// Klik nav
navItems.forEach(item => {
  item.addEventListener('click', () => {
    switchTab(item.dataset.tab);
  });
});

// Restore tab terakhir
try {
  const savedTab = localStorage.getItem('zenkai_active_tab');
  if (savedTab && document.getElementById('tab-' + savedTab)) {
    switchTab(savedTab);
  }
} catch(e) {}

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  try {
    const savedTheme = localStorage.getItem('zenkai_theme');
    if (savedTheme === 'light') document.body.classList.add('light');
  } catch(e) {}

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    try { localStorage.setItem('zenkai_theme', isLight ? 'light' : 'dark'); } catch(e) {}
    const svg = themeToggle.querySelector('svg');
    if (svg) {
      if (isLight) {
        svg.innerHTML = '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>';
      } else {
        svg.innerHTML = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
      }
    }
  });
}

// ===== HASH ROUTING =====
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('tab-' + hash)) {
    switchTab(hash);
  }
});

if (window.location.hash) {
  const hash = window.location.hash.replace('#', '');
  if (document.getElementById('tab-' + hash)) {
    setTimeout(() => switchTab(hash), 100);
  }
}

// ===== SWIPE GESTURE =====
let touchStartX = 0;
let touchStartY = 0;
const main = document.querySelector('.app-main');
const TABS_ORDER = ['beranda', 'produk', 'tools', 'tentang', 'sosial'];

if (main) {
  main.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  main.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) < 60) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return;
    const currentIdx = TABS_ORDER.indexOf(activeNav.dataset.tab);
    if (currentIdx === -1) return;
    let nextIdx;
    if (dx < 0) nextIdx = currentIdx + 1;
    else nextIdx = currentIdx - 1;
    if (nextIdx < 0 || nextIdx >= TABS_ORDER.length) return;
    switchTab(TABS_ORDER[nextIdx]);
  }, { passive: true });
}

// ===== LOG =====
console.log('%c Zenkai ', 'background:#ff1f4b;color:#fff;font-weight:900;padding:4px 8px;border-radius:4px;font-family:monospace', 'Bukan asisten. Bukan teman. Alat.');