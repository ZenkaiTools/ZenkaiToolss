// ===== TAB SWITCHING =====
const navItems = document.querySelectorAll('.nav-item');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(tabName) {
  // Update nav active
  navItems.forEach(item => {
    if (item.dataset.tab === tabName) item.classList.add('active');
    else item.classList.remove('active');
  });
  // Update content active
  tabContents.forEach(content => {
    if (content.id === 'tab-' + tabName) content.classList.add('active');
    else content.classList.remove('active');
  });
  // Scroll ke atas
  const main = document.querySelector('.app-main');
  if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
  // Simpan tab terakhir di localStorage
  try { localStorage.setItem('zenkai_active_tab', tabName); } catch(e) {}
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    switchTab(item.dataset.tab);
  });
});

// ===== RESTORE TAB TERAKHIR =====
try {
  const savedTab = localStorage.getItem('zenkai_active_tab');
  if (savedTab && document.getElementById('tab-' + savedTab)) {
    switchTab(savedTab);
  }
} catch(e) {}

// ===== FAQ TOGGLE =====
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');
  // Tutup semua FAQ dulu
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  // Buka yang diklik kalau sebelumnya ketutup
  if (!wasOpen) item.classList.add('open');
}
window.toggleFaq = toggleFaq;

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  // Load tema terakhir
  try {
    const savedTheme = localStorage.getItem('zenkai_theme');
    if (savedTheme === 'light') document.body.classList.add('light');
  } catch(e) {}

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light');
    const isLight = document.body.classList.contains('light');
    try { localStorage.setItem('zenkai_theme', isLight ? 'light' : 'dark'); } catch(e) {}
    // Update icon
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

// ===== HASH ROUTING (opsional: buka tab dari URL) =====
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && document.getElementById('tab-' + hash)) {
    switchTab(hash);
  }
});

// Kalau ada hash di URL saat load
if (window.location.hash) {
  const hash = window.location.hash.replace('#', '');
  if (document.getElementById('tab-' + hash)) {
    setTimeout(() => switchTab(hash), 100);
  }
}

// ===== SWIPE GESTURE (opsional: geser kiri/kanan buat ganti tab) =====
let touchStartX = 0;
let touchStartY = 0;
const main = document.querySelector('.app-main');
const TABS_ORDER = ['beranda', 'fitur', 'harga', 'faq', 'kontak'];

if (main) {
  main.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  main.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    // Cuma kalau gerakan horizontal (bukan scroll vertikal)
    if (Math.abs(dx) < 60) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    // Cari tab aktif sekarang
    const activeNav = document.querySelector('.nav-item.active');
    if (!activeNav) return;
    const currentIdx = TABS_ORDER.indexOf(activeNav.dataset.tab);
    if (currentIdx === -1) return;
    let nextIdx;
    if (dx < 0) nextIdx = currentIdx + 1; // swipe kiri → next
    else nextIdx = currentIdx - 1; // swipe kanan → prev
    if (nextIdx < 0 || nextIdx >= TABS_ORDER.length) return;
    switchTab(TABS_ORDER[nextIdx]);
  }, { passive: true });
}

// ===== LOG =====
console.log('%c Zenkai ', 'background:#ff1f4b;color:#fff;font-weight:900;padding:4px 8px;border-radius:4px;', 'App loaded. Bukan asisten. Alat.');