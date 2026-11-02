document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. KONFIGURASI & HELPERS
    // =========================================
    const SUPA_URL = 'https://chcfvbqyygtkfcvhywoa.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2Z2YnF5eWd0a2Zjdmh5d29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjYxNDAsImV4cCI6MjEwNjQ0MjE0MH0.VjsHm2lIVs--biNLF-ku6K3AyIbUVXylyFY77xjaajM';
    const OWNER_TOKEN_KEY = 'zenkai_owner_token';

    const COMING_SOON_TOOLS = ['stalkmlbb', 'stalkpubg', 'stalkcodm', 'stalkgenshin', 'twitter', 'imghd'];

    const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const setBtnLoading = (btn, loading, label = 'Proses') => {
        if (!btn) return;
        btn.disabled = loading;
        btn.classList.toggle('loading', loading);
        btn.innerText = loading ? 'Memproses...' : label;
    };

    const isReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.showToast = (msg) => {
        const c = document.getElementById('toast-container');
        if (!c) return;
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        c.appendChild(t);
        setTimeout(() => {
            t.style.opacity = '0';
            t.style.transition = '0.3s';
            setTimeout(() => t.remove(), 300);
        }, 2500);
    };

    window.tampilkanAlert = (title, msg, buttons) => {
        const alertEl = document.getElementById('custom-alert');
        if (!alertEl) { alert(msg); return; }
        document.getElementById('alert-title').innerText = title;
        document.getElementById('alert-msg').innerText = msg;
        const btnContainer = document.getElementById('alert-btns');
        btnContainer.innerHTML = '';

        buttons.forEach(btn => {
            const b = document.createElement('button');
            b.innerText = btn.label;
            b.style.cssText = `flex:1; padding:12px; border:2px solid var(--border); border-radius:8px; font-weight:bold; cursor:pointer; font-family:var(--font-main);`;
            b.style.background = btn.type === 'primary' ? 'var(--primary)' : '#ff3333';
            b.style.color = btn.type === 'primary' ? '#000' : '#fff';
            b.setAttribute('onclick', btn.action);
            btnContainer.appendChild(b);
        });

        alertEl.style.display = 'flex';
    };

    // =========================================
    // 2. SPLASH SCREEN VIDEO & AUDIO
    // =========================================
    const welcomeVideo = document.getElementById('welcome-video');
    const authGate = document.getElementById('auth-gate');

    window.masukKeWeb = () => {
        if (welcomeVideo) {
            welcomeVideo.pause();
            welcomeVideo.muted = true;
        }
        if (authGate) {
            authGate.style.opacity = '0';
            authGate.style.transform = 'scale(1.05)';
            authGate.style.transition = '0.8s ease';
            setTimeout(() => {
                authGate.style.display = 'none';
                document.body.style.overflow = '';
            }, 800);
        }
        setTimeout(showWaPopupOnce, 1500);
    };

    window.aktifkanSuara = () => {
        if (welcomeVideo) {
            welcomeVideo.muted = false;
            welcomeVideo.play();
        }
        const btn = document.getElementById('btn-unmute');
        if (btn) btn.style.display = 'none';
    };

    if (welcomeVideo) {
        welcomeVideo.play().catch(() => {});
        welcomeVideo.addEventListener('ended', () => {
            window.masukKeWeb();
        });
    }

    // =========================================
    // 2b. POPUP WHATSAPP CHANNEL
    // =========================================
    const waPopup = document.getElementById('wa-popup');
    const WA_POPUP_KEY = 'zenkai_wa_popup_shown';

    window.closeWaPopup = () => {
        if (!waPopup) return;
        waPopup.classList.remove('active');
        try { localStorage.setItem(WA_POPUP_KEY, Date.now().toString()); } catch(e) {}
    };

    function showWaPopupOnce() {
        if (!waPopup) return;
        const lastShown = parseInt(localStorage.getItem(WA_POPUP_KEY) || '0');
        const ONE_DAY = 24 * 60 * 60 * 1000;
        if (Date.now() - lastShown < ONE_DAY) return;
        waPopup.classList.add('active');
    }

    if (waPopup) {
        waPopup.addEventListener('click', (e) => {
            if (e.target.id === 'wa-popup') window.closeWaPopup();
        });
    }

    // =========================================
    // 3. BEBAS AKSES (NAMA USER)
    // =========================================
    const welcome = document.getElementById('welcome-username');
    if (welcome) welcome.innerText = 'User';

    if (localStorage.getItem(OWNER_TOKEN_KEY)) {
        const navOwner = document.getElementById('nav-owner');
        if (navOwner) navOwner.style.display = 'flex';
    }

    // =========================================
    // 4. TEMA & NAVIGASI
    // =========================================
    const savedTheme = localStorage.getItem('zenkai_theme') || 'cyber';
    document.body.setAttribute('data-theme', savedTheme);

    window.setTheme = (themeName) => {
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('zenkai_theme', themeName);
        showToast(`Tema diubah ke ${themeName.toUpperCase()}`);
    };

    window.switchPage = (pageId, btn) => {
        const current = document.querySelector('.page.active');
        const target = document.getElementById('page-' + pageId);
        if (!target || current === target) return;

        if (current) {
            current.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            current.style.opacity = '0';
            current.style.transform = 'translateY(-8px)';
            setTimeout(() => {
                current.classList.remove('active');
                current.style.opacity = '';
                current.style.transform = '';
            }, 200);
        }

        setTimeout(() => {
            target.classList.add('active');
            target.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            target.style.opacity = '0';
            target.style.transform = 'translateY(8px)';
            requestAnimationFrame(() => {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            });
            window.scrollTo({ top: 0, behavior: isReducedMotion() ? 'auto' : 'smooth' });
        }, 200);

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (btn) btn.classList.add('active');
    };

    window.filterCategory = (category, btn) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        document.querySelectorAll('.tool-card').forEach(card => {
            const cat = card.getAttribute('data-category');
            const show = category === 'all' || !cat || cat === category;
            card.style.display = show ? 'flex' : 'none';
        });
    };

    // =========================================
    // 5. DEVICE, BATERAI, JAM
    // =========================================
    function updateTime() {
        const now = new Date();
        const c = document.getElementById('clock-now');
        if (c) c.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateTime, 1000); updateTime();

    const ua = navigator.userAgent;
    let dev = "Desktop";
    if (/android/i.test(ua)) dev = "Android";
    else if (/iPad|iPhone|iPod/.test(ua)) dev = "iOS";
    const dEl = document.getElementById('device-name');
    if (dEl) dEl.innerText = dev;

    if (navigator.getBattery) {
        navigator.getBattery().then(b => {
            const bEl = document.getElementById('battery-level');
            if (bEl) {
                bEl.innerText = Math.round(b.level * 100) + "%";
                b.addEventListener('levelchange', () => {
                    bEl.innerText = Math.round(b.level * 100) + "%";
                });
            }
        }).catch(() => {});
    } else {
        const bEl = document.getElementById('battery-level');
        if (bEl) bEl.innerText = 'N/A';
    }

    // =========================================
    // 6. MUSIK WIDGET
    // =========================================
    const bgm = document.getElementById('bgm');
    const icPlay = document.getElementById('ic-play');
    const icPause = document.getElementById('ic-pause');
    let isPlaying = false;
    let currentSong = 0;

    const playlist = [
        { src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793393742446.mp3" },
        { src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793393794063.mp3" },
        { src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793394292663.mp3" },
        { src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/TULUS%20-%20Teh%20Hijau%20(Official%20Lyric%20Video).mp3" }
    ];

    window.loadSong = (index) => {
        currentSong = index;
        if (bgm) bgm.src = playlist[index].src;
    };

    window.toggleMusic = () => {
        if (!bgm) return;
        if (!isPlaying) {
            if (!bgm.currentSrc && !bgm.src) loadSong(0);
            bgm.volume = 0.5;
            bgm.play().then(() => {
                isPlaying = true;
                if (icPlay) icPlay.style.display = 'none';
                if (icPause) icPause.style.display = 'block';
            }).catch(() => showToast('Klik sekali lagi untuk memutar musik'));
        } else {
            bgm.pause();
            isPlaying = false;
            if (icPlay) icPlay.style.display = 'block';
            if (icPause) icPause.style.display = 'none';
        }
    };

    window.nextSong = () => {
        currentSong = (currentSong + 1) % playlist.length;
        loadSong(currentSong);
        if (isPlaying && bgm) bgm.play().catch(() => {});
    };

    window.prevSong = () => {
        currentSong = (currentSong - 1 + playlist.length) % playlist.length;
        loadSong(currentSong);
        if (isPlaying && bgm) bgm.play().catch(() => {});
    };

    if (bgm) {
        bgm.onended = () => { if (isPlaying) nextSong(); };
        loadSong(0);
    }

    window.resetData = () => {
        tampilkanAlert(
            "Hapus Cache",
            "Yakin mau hapus cache dan muat ulang web? Tema & login owner tetap tersimpan.",
            [
                { label: "Batal", action: "document.getElementById('custom-alert').style.display='none'", type: "cancel" },
                { label: "Hapus", action: "hapusCacheAman()", type: "primary" }
            ]
        );
    };

    window.hapusCacheAman = () => {
        const keep = {
            zenkai_theme: localStorage.getItem('zenkai_theme'),
            zenkai_owner_token: localStorage.getItem(OWNER_TOKEN_KEY)
        };
        sessionStorage.clear();
        localStorage.clear();
        if (keep.zenkai_theme) localStorage.setItem('zenkai_theme', keep.zenkai_theme);
        if (keep.zenkai_owner_token) localStorage.setItem(OWNER_TOKEN_KEY, keep.zenkai_owner_token);
        location.reload();
    };

    // =========================================
    // 7. MODAL BOTTOM SHEET
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');

    window.closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        if (window.activeTimerInterval) clearInterval(window.activeTimerInterval);
        setTimeout(() => { if (modalContent) modalContent.innerHTML = ''; }, 300);
    };
    window.closeModalOnOverlay = (e) => {
        if (e.target.id === 'tool-modal') closeModal();
    };

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (modal && modal.classList.contains('active')) closeModal();
            if (waPopup && waPopup.classList.contains('active')) window.closeWaPopup();
        }
    });

    const closeSvg = `<button class="modal-close press" onclick="closeModal()" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('tool-card')) {
            e.preventDefault(); e.target.click();
        }
    });

    // =========================================
    // 8. SEARCH & VISUAL FILTER
    // =========================================
    const sInput = document.getElementById('search-tools');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const allBtn = document.querySelector('.cat-btn[onclick*="\'all\'"]');
            if (allBtn) {
                document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
                allBtn.classList.add('active');
            }
            document.querySelectorAll('.tool-card').forEach(card => {
                const titleEl = card.querySelector('h4');
                const title = titleEl ? titleEl.innerText.toLowerCase() : '';
                card.style.display = title.includes(term) ? 'flex' : 'none';
            });
        });
    }

    COMING_SOON_TOOLS.forEach(toolName => {
        const card = document.querySelector(`.tool-card[onclick="openTool('${toolName}')"]`);
        if (card) card.classList.add('soon');
    });

    // =========================================
    // 9. SISTEM SETTINGS & MAINTENANCE
    // =========================================
    async function fetchSettings() {
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_settings' })
            });
            const result = await res.json();
            if (result.status && result.data) applySettings(result.data);
        } catch (e) {}
    }
    setInterval(fetchSettings, 60000);
    fetchSettings();

    function applySettings(setting) {
        const isOwner = !!localStorage.getItem(OWNER_TOKEN_KEY);

        if (setting.is_maintenance && !isOwner) {
            if (!window.mtTimer && !sessionStorage.getItem('maintenance_triggered')) {
                window.mtTimer = true;
                let cd = 10;

                const w = document.createElement('div');
                w.id = 'mt-warn';
                w.style = 'position:fixed; inset:0; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); color:#fff; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; font-family:var(--font-main); padding:20px;';

                w.innerHTML = `
                    <div style="background:rgba(24, 24, 27, 0.95); border:1px solid rgba(255, 51, 51, 0.5); padding:30px 20px; border-radius:12px; max-width:320px; width:100%; box-shadow:0 0 40px rgba(255, 51, 51, 0.2); text-align:center; position:relative; overflow:hidden;">
                        <div style="position:absolute; top:0; left:0; width:100%; height:2px; background:#ff3333; box-shadow:0 0 10px #ff3333; animation:scanline 2s linear infinite;"></div>
                        <h2 style="color:#ff3333; margin-bottom:5px; font-family:monospace; font-size:18px; letter-spacing:2px; text-shadow:0 0 10px rgba(255,51,51,0.5);">SYSTEM LOCK</h2>
                        <p style="font-size:11px; color:#a1a1aa; margin-bottom:20px; font-family:monospace;">SHUTDOWN IN <b id="mt-cd" style="color:#ff3333; font-size:18px;">10</b> SECONDS</p>
                        <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                            <div id="mt-bar" style="height:100%; width:0%; background:#ff3333; transition:width 1s linear; box-shadow:0 0 10px #ff3333;"></div>
                        </div>
                    </div>
                `;
                document.body.appendChild(w);
                setTimeout(() => { const bar = document.getElementById('mt-bar'); if(bar) bar.style.width = '100%'; }, 50);

                const int = setInterval(() => {
                    cd--;
                    const el = document.getElementById('mt-cd');
                    if (el) el.innerText = cd;
                    if (cd <= 0) {
                        clearInterval(int);
                        w.remove();
                        const ms = document.getElementById('maintenance-screen');
                        if (ms) ms.style.display = 'flex';
                        sessionStorage.setItem('maintenance_triggered', 'true');
                    }
                }, 1000);
            } else {
                const ms = document.getElementById('maintenance-screen');
                if (ms) ms.style.display = 'flex';
            }
        } else {
            const ms = document.getElementById('maintenance-screen');
            if (ms) ms.style.display = 'none';
            window.mtTimer = false;
            const w = document.getElementById('mt-warn'); if (w) w.remove();
            sessionStorage.removeItem('maintenance_triggered');
        }

        if (setting.site_title) { const t = document.querySelector('.logo-text h1'); if (t) t.innerText = setting.site_title; }

        const bc = document.getElementById('broadcast-banner');
        if (bc) {
            if (setting.broadcast_text) {
                const bt = document.getElementById('broadcast-text');
                if (bt) bt.innerText = setting.broadcast_text;
                bc.style.display = 'block';
            } else bc.style.display = 'none';
        }

        const dPages = setting.disabled_pages ? setting.disabled_pages.split(',') : [];
        document.querySelectorAll('.nav-item').forEach(b => {
            const m = (b.getAttribute('onclick')||'').match(/switchPage\('(.*?)'/);
            if (m && dPages.includes(m[1])) { b.style.opacity='0.3'; b.style.pointerEvents='none'; }
            else { b.style.opacity='1'; b.style.pointerEvents='auto'; }
        });

        const dTools = setting.disabled_tools ? setting.disabled_tools.split(',') : [];
        window.currentDisabledTools = dTools;

        document.querySelectorAll('.tool-card').forEach(c => {
            const m = (c.getAttribute('onclick')||'').match(/openTool\('(.*?)'\)/);
            if (!m) return;
            const toolName = m[1];
            if (dTools.includes(toolName)) {
                c.classList.add('maintenance-mode');
            } else {
                c.classList.remove('maintenance-mode');
            }
        });
    }

    // =========================================
    // 10. PINTU RAHASIA OWNER
    // =========================================
    let clicks = 0;
    document.querySelector('.logo-area')?.addEventListener('click', () => {
        clicks++; setTimeout(() => { clicks = 0; }, 1000);
        if (clicks === 5) { clicks = 0; bukaPintuRahasia(); }
    });

    window.bukaPanelOwnerLangsung = async () => {
        const token = localStorage.getItem(OWNER_TOKEN_KEY);
        if (!token) return bukaPintuRahasia();
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'verify_token', owner_token: token })
            });
            const data = await res.json();
            if (data.status) {
                const btnOwner = document.getElementById('nav-owner');
                window.switchPage('owner', btnOwner);
                window.tampilkanPanelRahasia();
            } else {
                localStorage.removeItem(OWNER_TOKEN_KEY);
                bukaPintuRahasia();
            }
        } catch (e) {
            showToast("Gagal verifikasi owner.");
        }
    };

    function bukaPintuRahasia() {
        if (document.getElementById('owner-modal')) document.getElementById('owner-modal').remove();
        document.body.insertAdjacentHTML('beforeend', `
            <div id="owner-modal" style="position:fixed; inset:0; background:rgba(0,0,0,0.9); z-index:100000; display:flex; align-items:center; justify-content:center;">
                <div style="background:var(--bg); padding:20px; border-radius:12px; border:3px solid var(--border); width:90%; max-width:340px; text-align:center;">
                    <h2 style="color:var(--primary); font-family:var(--font-head); margin-bottom:15px;">SYSTEM OVERRIDE</h2>
                    <input type="password" id="owner-pass" placeholder="Passcode" style="width:100%; padding:12px; margin-bottom:15px; border-radius:8px; border:2px solid var(--border); background:var(--card-bg); color:var(--text); text-align:center;">
                    <div style="display:flex; gap:10px;">
                        <button onclick="document.getElementById('owner-modal').remove()" style="flex:1; padding:10px; background:#ff3333; color:#fff; border:none; border-radius:6px; font-weight:bold;">Batal</button>
                        <button onclick="verifikasiOwner()" style="flex:1; padding:10px; background:var(--primary); color:#000; border:none; border-radius:6px; font-weight:bold;">Masuk</button>
                    </div>
                </div>
            </div>
        `);
    }

    let loginAttempts = 0;
    let loginLockUntil = 0;

    window.verifikasiOwner = async () => {
        const now = Date.now();
        if (now < loginLockUntil) {
            const sisa = Math.ceil((loginLockUntil - now) / 1000);
            return showToast(`Terlalu banyak percobaan. Coba lagi dalam ${sisa}s.`);
        }
        const pass = document.getElementById('owner-pass').value;
        if (!pass) return showToast('Masukkan passcode!');
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pass, action: 'login' })
            });
            const data = await res.json();
            if (data.status && data.owner_token) {
                loginAttempts = 0;
                localStorage.setItem(OWNER_TOKEN_KEY, data.owner_token);
                document.getElementById('owner-modal')?.remove();
                showToast("Akses Owner Diberikan!");
                const navOwner = document.getElementById('nav-owner');
                if (navOwner) navOwner.style.display = 'flex';
                setTimeout(() => {
                    const btnOwner = document.getElementById('nav-owner');
                    window.switchPage('owner', btnOwner);
                    window.tampilkanPanelRahasia();
                }, 500);
            } else {
                loginAttempts++;
                if (loginAttempts >= 3) {
                    loginLockUntil = Date.now() + 60000;
                    loginAttempts = 0;
                    showToast("Terlalu banyak salah. Tunggu 60 detik.");
                } else {
                    showToast(`Passcode Salah! (${3 - loginAttempts}x lagi)`);
                }
            }
        } catch(e) {
            showToast("Error koneksi ke server.");
        }
    };

    let mySession = localStorage.getItem('zenkai_sess');
    if (!mySession) {
        mySession = 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 10);
        localStorage.setItem('zenkai_sess', mySession);
    }
    setInterval(() => {
        fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'heartbeat', session_id: mySession })
        }).catch(()=>{});
    }, 30000);

    // =========================================
    // PANEL RAHASIA OWNER (UI BARU)
    // =========================================
    window.tampilkanPanelRahasia = async () => {
        const container = document.getElementById('owner-page-content');
        if (!container) return;
        container.innerHTML = '<div class="loader"></div>';
        let set = { site_title: '', broadcast_text: '', is_maintenance: false, disabled_pages: '', disabled_tools: '' };
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_settings' }) });
            const data = await res.json();
            if (data.status && data.data) set = data.data;
        } catch(e) {}

        const disabledPagesArr = set.disabled_pages ? set.disabled_pages.split(',') : [];
        const disabledToolsArr = set.disabled_tools ? set.disabled_tools.split(',') : [];
        const listTools = ['tiktok', 'instagram', 'facebook', 'pinterest', 'youtube', 'komik', 'stalktt', 'stalkroblox', 'qr', 'imgtojpg', 'username', 'artinama', 'password', 'zodiak', 'base64', 'umur', 'tempmail', 'nik', 'spotify', 'iplookup', 'removebg', 'linkvertise'];
        const listPages = ['fun', 'setting', 'info'];

        let toolsHtml = listTools.map(t => `
            <label style="display:flex; align-items:center; justify-content:space-between; background:var(--card-bg); padding:10px 12px; border-radius:8px; border:2px solid var(--border); cursor:pointer; font-size:11px; font-weight:bold; transition:0.2s;">
                <span>${t.toUpperCase()}</span>
                <input type="checkbox" class="tool-chk" value="${t}" ${disabledToolsArr.includes(t) ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
            </label>
        `).join('');

        let pagesHtml = listPages.map(p => `
            <label style="display:flex; align-items:center; justify-content:space-between; background:var(--card-bg); padding:10px 12px; border-radius:8px; border:2px solid var(--border); cursor:pointer; font-size:11px; font-weight:bold; transition:0.2s;">
                <span>${p.toUpperCase()}</span>
                <input type="checkbox" class="page-chk" value="${p}" ${disabledPagesArr.includes(p) ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--primary); cursor:pointer;">
            </label>
        `).join('');

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:20px;">
                <div style="background:var(--bg); padding:15px; border-radius:12px; border:2px solid var(--border);">
                    <h3 style="font-family:var(--font-head); font-size:16px; color:var(--primary); margin-bottom:12px; display:flex; align-items:center; gap:8px;">⚙️ Pengaturan Umum</h3>
                    <label style="font-size:10px; font-weight:800; opacity:0.7; text-transform:uppercase; letter-spacing:1px;">Judul Web</label>
                    <input type="text" id="own-title" value="${escapeHTML(set.site_title || 'ZenkaiTools')}" style="width:100%; padding:12px; margin-top:5px; margin-bottom:15px; border:2px solid var(--border); border-radius:8px; background:var(--card-bg); color:var(--text); font-size:13px;">
                    <label style="font-size:10px; font-weight:800; opacity:0.7; text-transform:uppercase; letter-spacing:1px;">Broadcast Banner</label>
                    <input type="text" id="own-broadcast" value="${escapeHTML(set.broadcast_text || '')}" placeholder="Kosongkan untuk mematikan" style="width:100%; padding:12px; margin-top:5px; border:2px solid var(--border); border-radius:8px; background:var(--card-bg); color:var(--text); font-size:13px;">
                </div>
                <div style="background:rgba(255,51,51,0.1); padding:15px; border-radius:12px; border:2px dashed #ff3333;">
                    <label style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
                        <div>
                            <b style="font-size:14px; color:#ff3333; display:block;">Mode Maintenance</b>
                            <span style="font-size:11px; opacity:0.8;">Kunci semua akses web sementara waktu.</span>
                        </div>
                        <input type="checkbox" id="own-mt" ${set.is_maintenance ? 'checked' : ''} style="width:24px; height:24px; accent-color:#ff3333; cursor:pointer;">
                    </label>
                </div>
                <div style="background:var(--bg); padding:15px; border-radius:12px; border:2px solid var(--border);">
                    <h3 style="font-family:var(--font-head); font-size:16px; color:var(--primary); margin-bottom:12px;">🚫 Nonaktifkan Tools</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${toolsHtml}</div>
                </div>
                <div style="background:var(--bg); padding:15px; border-radius:12px; border:2px solid var(--border);">
                    <h3 style="font-family:var(--font-head); font-size:16px; color:var(--primary); margin-bottom:12px;">🔒 Kunci Halaman</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${pagesHtml}</div>
                </div>
                <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px; margin-bottom:20px;">
                    <button onclick="simpanSettingOwner(event)" class="action-btn press" style="padding:16px; font-size:14px; background:var(--primary); color:#000; border:2px solid var(--border); border-radius:12px; font-weight:900; box-shadow:0 4px 0 var(--border);">💾 SIMPAN PERUBAHAN</button>
                    <button onclick="forceRefreshUser()" class="action-btn press" style="padding:16px; font-size:14px; background:#a855f7; color:#fff; border:2px solid var(--border); border-radius:12px; font-weight:900; box-shadow:0 4px 0 var(--border);">🔄 PAKSA REFRESH USER</button>
                </div>
            </div>
        `;
    };

    window.simpanSettingOwner = async (e) => {
        const btn = e?.target || document.activeElement;
        const oldText = btn?.innerText || 'SIMPAN';
        if (btn) { btn.innerText = 'Menyimpan...'; btn.disabled = true; }

        const checkedTools = Array.from(document.querySelectorAll('.tool-chk:checked')).map(cb => cb.value).join(',');
        const checkedPages = Array.from(document.querySelectorAll('.page-chk:checked')).map(cb => cb.value).join(',');

        const payload = {
            action: 'update_settings',
            owner_token: localStorage.getItem(OWNER_TOKEN_KEY),
            site_title: document.getElementById('own-title').value,
            broadcast_text: document.getElementById('own-broadcast').value,
            disabled_pages: checkedPages,
            disabled_tools: checkedTools,
            is_maintenance: document.getElementById('own-mt').checked
        };

        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.status) {
                showToast("Pengaturan disimpan!");
                fetchSettings();
            } else {
                showToast("Gagal: " + (data.message || 'Token invalid'));
            }
        } catch(err) {
            showToast("Error koneksi ke server.");
        }
        if (btn) { btn.innerText = oldText; btn.disabled = false; }
    };

    window.forceRefreshUser = async () => {
        tampilkanAlert("Force Refresh", "Yakin mau maksa semua user buat refresh?", [
            { label: "Batal", action: "document.getElementById('custom-alert').style.display='none'", type: "cancel" },
            { label: "Lanjut", action: "eksekusiForceRefresh()", type: "primary" }
        ]);
    };

    window.eksekusiForceRefresh = async () => {
        document.getElementById('custom-alert').style.display = 'none';
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'force_refresh',
                    owner_token: localStorage.getItem(OWNER_TOKEN_KEY)
                })
            });
            const data = await res.json();
            if (data.status) showToast("Sinyal Force Refresh terkirim!");
            else showToast("Gagal: " + (data.message || 'Token invalid'));
        } catch(e) {
            showToast("Error koneksi.");
        }
    };

    // =========================================
    // 11. FUNGSI OPEN TOOL
    // =========================================
    window.openTool = (tool) => {
        if (!modal || !modalContent) return;

        const currentDisabledTools = window.currentDisabledTools || [];
        if (currentDisabledTools.includes(tool)) {
            modal.classList.add('active');
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Tool Maintenance</h3>
                <span class="desc-text" style="color: #ff3333; border-color: #ff3333; background: rgba(255, 51, 51, 0.1);">🚧 SEDANG MAINTENANCE 🚧</span>
                <p style="text-align: center; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">Fitur ini sedang dinonaktifkan sementara oleh Admin.</p>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-align: center; text-decoration: none; background: #00ff9d;">Pantau Update di WhatsApp</a>
            `;
            return;
        }

        modal.classList.add('active');

        if (COMING_SOON_TOOLS.includes(tool)) {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Coming Soon</h3>
                <span class="desc-text">Fitur ini sedang dalam tahap pengembangan. Nantikan update-nya di Channel WhatsApp kami ya!</span>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-align: center; text-decoration: none; background: #00ff9d;">Pantau Update</a>
            `;
            return;
        }

        else if (tool === 'komik') {
            modalContent.innerHTML = `
                ${closeSvg}
                <div style="background:var(--bg); min-height: 80vh; padding-bottom: 20px; font-family: var(--font-main);">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:15px; padding: 0 5px;">
                        <div>
                            <h3 style="font-family:var(--font-head); color:var(--text); font-size:22px; margin:0; letter-spacing:1px;">KATALOG</h3>
                            <p style="font-size:10px; color:var(--primary); margin:0; font-weight:bold; letter-spacing:2px;">ZENKAI COMICS</p>
                        </div>
                    </div>
                    <div style="position:relative; margin-bottom:20px;">
                        <input type="text" id="komik-q" placeholder="Cari judul komik..." style="width:100%; padding:14px 14px 14px 45px; border:none; border-radius:12px; background:var(--card-bg); color:var(--text); font-size:13px; outline:none; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border:2px solid var(--border);">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="position:absolute; left:15px; top:50%; transform:translateY(-50%); width:18px; height:18px; opacity:0.5;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    </div>
                    <div id="komik-res"></div>
                </div>
            `;
            
            const input = document.getElementById('komik-q');
            const box = document.getElementById('komik-res');

            const loadKatalog = async (query) => {
                box.innerHTML = '<div class="loader"></div>';
                try {
                    let bodyData = {};
                    if (query) {
                        bodyData = { action: 'search', q: query };
                    } else {
                        bodyData = { action: 'latest' };
                    }

                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik-jere`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bodyData)
                    });
                    const data = await res.json();
                    
                    const komikList = data.results || []; 

                    if (komikList.length === 0) {
                        box.innerHTML = '<p class="error-msg">Komik tidak ditemukan.</p>';
                        return;
                    }

                    let html = `<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px 10px;">`;
                    
                    komikList.forEach(manga => {
                        const title = (manga.title || 'Tanpa Judul').replace(/^Komik\s+/i, '');
                        const cover = manga.cover || 'https://via.placeholder.com/150';
                        const slug = manga.slug; 
                        const t = escapeHTML(title);
                        
                        html += `
                            <div class="komik-card-jere" data-title="${t}" data-slug="${slug}" style="cursor:pointer; display:flex; flex-direction:column; gap:6px;">
                                <div style="position:relative; width:100%; aspect-ratio:3/4; border-radius:8px; overflow:hidden; background:#222;">
                                    <img src="${cover}" referrerpolicy="no-referrer" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                                </div>
                                <h4 style="font-size:11px; font-weight:800; color:var(--text); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin:0;">${t}</h4>
                            </div>
                        `;
                    });
                    html += `</div>`;
                    box.innerHTML = html;

                    box.querySelectorAll('.komik-card-jere').forEach(el => {
                        el.addEventListener('click', () => {
                            bukaDetail(el.dataset.title, el.dataset.slug);
                        });
                    });

                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; 
                }
            };

            const bukaDetail = async (title, slug) => {
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik-jere`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'detail', slug: slug })
                    });
                    const data = await res.json();
                    
                    if (!data.status) throw new Error('Gagal mengambil detail');
                    const detail = data.result || data.data;
                    
                    const chapters = detail.chapters || detail.chapter_list || detail.list_chapters || []; 
                    
                    let html = `
                        <div style="margin-bottom:20px;">
                            <button onclick="openTool('komik')" class="press" style="background:var(--card-bg); border:2px solid var(--border); width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:15px;">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
                            </button>
                            
                            <div style="display:flex; gap:15px;">
                                <img src="${detail.cover || detail.thumbnail || 'https://via.placeholder.com/150'}" style="width:100px; height:130px; object-fit:cover; border-radius:8px; border:2px solid var(--border);">
                                <div>
                                    <h3 style="font-family:var(--font-head); font-size:20px; color:var(--text); margin:0 0 5px 0;">${escapeHTML(title)}</h3>
                                    <p style="font-size:11px; color:var(--text); opacity:0.8; line-height:1.4; max-height: 100px; overflow-y: auto;">${escapeHTML(detail.sinopsis || detail.synopsis || detail.description || 'Tidak ada sinopsis.')}</p>
                                </div>
                            </div>
                        </div>
                        <h4 style="margin-bottom:10px; font-size:14px;">Daftar Chapter:</h4>
                        <div style="display:flex; flex-direction:column; gap:8px; max-height: 300px; overflow-y:auto;">
                    `;

                    if (chapters.length === 0) {
                        // JEMBATAN AJAIB: Judul Jere dilempar ke MangaDex
                        html += `<p style="font-size: 11px; opacity: 0.7; margin-bottom: 10px;">Klik tombol di bawah untuk membaca komik ini (Server Baca):</p>`;
                        html += `<button class="action-btn press" onclick="bacaDariMangaDex('${escapeHTML(title)}')" style="background:var(--primary); color:#000;">Baca Komik</button>`;
                        
                        // Fallback link web asli dibiarin
                        html += `<p style="font-size: 11px; opacity: 0.7; margin-top: 10px; text-align: center;">Atau kunjungi web aslinya:</p>`;
                        html += `<a href="https://komikindo.ch/komik/${slug}/" target="_blank" class="action-btn" style="background:var(--card-bg); color:var(--text); text-decoration:none; display:block;">Buka di Web Asli</a>`;
                    } else {
                        chapters.forEach(ch => {
                            const chTitle = ch.title || ch.chapter || 'Chapter';
                            const chSlug = ch.slug || ch.link;
                            html += `
                                <div class="press" onclick="bacaKomik('${escapeHTML(title)}', '${escapeHTML(chSlug)}')" style="display:flex; align-items:center; gap:10px; background:var(--card-bg); border:2px solid var(--border); padding:10px 15px; border-radius:8px; cursor:pointer;">
                                    <div style="flex:1;">
                                        <h5 style="margin:0; font-size:12px; font-weight:800; color:var(--text);">${escapeHTML(chTitle)}</h5>
                                    </div>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
                                </div>
                            `;
                        });
                    }

                    html += `</div>`;
                    box.innerHTML = html;

                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal memuat detail: ${escapeHTML(e.message)}</p>`; 
                }
            };

            window.bacaKomik = async (title, slug) => {
                const box = document.getElementById('komik-res');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik-jere`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'stream', slug: slug })
                    });
                    const data = await res.json();
                    
                    const images = data.result?.pages || []; 
                    
                    if (images.length === 0) throw new Error('Gambar tidak ditemukan / Server Stream sedang down');

                    let html = `<h4 style="margin-bottom:10px; text-align:center;">${escapeHTML(title)}</h4>`;
                    html += `<div style="display:flex; flex-direction:column; gap:5px;">`;
                    images.forEach(imgUrl => {
                        html += `<img src="${imgUrl}" referrerpolicy="no-referrer" style="width:100%; border-radius:4px; min-height:100px; background:#111;" loading="lazy" onerror="this.style.display='none'">`;
                    });
                    html += `</div>`;
                    html += `<button class="action-btn press" onclick="openTool('komik')" style="margin-top:15px; background:#ff3333;">Kembali ke Katalog</button>`;
                    box.innerHTML = html;

                } catch (e) { 
                    box.innerHTML = `
                        <div style="text-align:center; padding: 20px;">
                            <p class="error-msg">${escapeHTML(e.message)}</p>
                            <button onclick="openTool('komik')" class="action-btn" style="margin-top:15px;">Kembali</button>
                        </div>
                    `; 
                }
            };

            loadKatalog(''); 
            
            let timeout = null;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    loadKatalog(e.target.value.trim());
                }, 800);
            });
        }
        else if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>TikTok DL</h3>
                <span class="desc-text">Download video TikTok tanpa watermark. Cukup paste link videonya.</span>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result"></div>
            `;
            const btn = document.getElementById('btn-dl-tt');
            btn.onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                if (!url) return showToast('Masukkan link dulu!');
                if (!/tiktok\.com|vt\.tiktok\.com/i.test(url)) return showToast('Link harus dari TikTok!');
                setBtnLoading(btn, true);
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-pinterest`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'tiktok', url: url })
                    });
                    const data = await res.json();
                    if (data.code !== 0) throw new Error('Gagal mengambil video');
                    const vid = data.data.hdplay || data.data.play;
                    box.innerHTML = `
                        <video style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);" src="${escapeHTML(vid)}" controls></video>
                        <button class="action-btn" id="btn-save-tt">Simpan ke Galeri</button>
                    `;
                    document.getElementById('btn-save-tt').onclick = async () => {
                        const saveBtn = document.getElementById('btn-save-tt');
                        setBtnLoading(saveBtn, true, 'Menyimpan...');
                        try {
                            const dlRes = await fetch(`${SUPA_URL}/functions/v1/zen-pinterest`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ download_url: vid })
                            });
                            if (!dlRes.ok) throw new Error('Gagal download');
                            const blob = await dlRes.blob();
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `tt-${Date.now()}.mp4`;
                            a.click();
                            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                            showToast('Tersimpan!');
                        } catch (e) { showToast('Gagal simpan, coba lagi.'); }
                        setBtnLoading(saveBtn, false, 'Simpan ke Galeri');
                    };
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Proses Video');
            };
        }
        else if (tool === 'instagram') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Instagram DL</h3>
                <span class="desc-text">Download video/foto dari Post atau Reels Instagram.</span>
                <input type="text" id="ig-url" placeholder="Paste link Instagram...">
                <button class="action-btn" id="btn-dl-ig">Ambil Media</button>
                <div id="ig-result"></div>
            `;
            const btn = document.getElementById('btn-dl-ig');
            btn.onclick = async () => {
                const url = document.getElementById('ig-url').value.trim();
                const box = document.getElementById('ig-result');
                if (!url) return showToast('Masukkan link dulu!');
                setBtnLoading(btn, true);
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-instagram`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Postingan tidak ditemukan');

                    let htmlContent = '';
                    const mediaArray = data.result?.media || data.media || [];
                    mediaArray.forEach((media, index) => {
                        if (media.type === 'video') {
                            htmlContent += `
                                <video style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);" src="${escapeHTML(media.url)}" controls></video>
                                <a href="${escapeHTML(media.url)}" target="_blank" class="action-btn" style="text-align:center; text-decoration:none; background:#00ff9d;">Download Video</a>
                            `;
                        } else {
                            htmlContent += `
                                <img src="${escapeHTML(media.url)}" style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                                <a href="${escapeHTML(media.url)}" target="_blank" class="action-btn" style="margin-bottom:15px; font-size:12px;">Download Foto ${index+1}</a>
                            `;
                        }
                    });

                    if (htmlContent === '') throw new Error('Media tidak ditemukan');
                    box.innerHTML = htmlContent;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Ambil Media');
            };
        }
        else if (tool === 'facebook') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Facebook DL</h3>
                <span class="desc-text">Download video dari Facebook.</span>
                <input type="text" id="fb-url" placeholder="Paste link Facebook...">
                <button class="action-btn" id="btn-dl-fb">Ambil Video</button>
                <div id="fb-result"></div>
            `;
            const btn = document.getElementById('btn-dl-fb');
            btn.onclick = async () => {
                const url = document.getElementById('fb-url').value.trim();
                const box = document.getElementById('fb-result');
                if (!url) return showToast('Masukkan link dulu!');
                setBtnLoading(btn, true);
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-api`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            provider: 'sairi',
                            endpoint: 'download/facebook',
                            params: { url: url }
                        })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Video tidak ditemukan');

                    const vidUrl = data.result.hd || data.result.video;
                    box.innerHTML = `
                        <video style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);" src="${escapeHTML(vidUrl)}" controls></video>
                        <a href="${escapeHTML(vidUrl)}" target="_blank" class="action-btn" style="text-align:center; text-decoration:none; background:#00ff9d;">Download Video</a>
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Ambil Video');
            };
        }
        else if (tool === 'pinterest') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Pinterest DL</h3>
                <span class="desc-text">Pilih mau download video atau gambarnya.</span>
                <input type="text" id="pin-url" placeholder="Paste link Pinterest (pin.it/...)">
                <button class="action-btn" id="btn-pin">Ambil Media</button>
                <div id="pin-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            const btn = document.getElementById('btn-pin');
            let currentVideoUrl = "";
            let currentImageUrl = "";
            btn.onclick = async () => {
                const url = document.getElementById('pin-url').value.trim();
                const box = document.getElementById('pin-res');
                if (!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Mengambil...');
                box.innerHTML = '<div class="loader"></div>';
                currentVideoUrl = "";
                currentImageUrl = "";
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-pinterest`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url })
                    });
                    const data = await res.json();
                    if (data.status === false || data.error) throw new Error(data.error || 'Konten tidak ditemukan');
                    const pinDataObj = data.data?.d1?.data?.v3GetPinQueryv2?.data || data.data?.d2?.data?.v3GetPinQueryv2?.data;
                    if (!pinDataObj) throw new Error('Struktur data tidak dikenali');
                    if (pinDataObj.videos) {
                        if (pinDataObj.videos.videoList?.v720P?.url) currentVideoUrl = pinDataObj.videos.videoList.v720P.url;
                        else if (pinDataObj.videos.videoUrls && Array.isArray(pinDataObj.videos.videoUrls)) {
                            const mp4Url = pinDataObj.videos.videoUrls.find(u => u.includes('.mp4'));
                            if (mp4Url) currentVideoUrl = mp4Url;
                        }
                    }
                    if (pinDataObj.images_orig?.url) currentImageUrl = pinDataObj.images_orig.url;
                    else if (pinDataObj.images_736x?.url) currentImageUrl = pinDataObj.images_736x.url;
                    let htmlContent = '';
                    if (currentVideoUrl) htmlContent += `<video src="${escapeHTML(currentVideoUrl)}" controls style="width:100%; border-radius:8px; border:3px solid var(--border); margin-bottom: 15px;"></video>`;
                    else if (currentImageUrl) htmlContent += `<img src="${escapeHTML(currentImageUrl)}" style="width:100%; border-radius:8px; border:3px solid var(--border); margin-bottom: 15px;">`;
                    htmlContent += `
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="action-btn" id="btn-dl-vid" style="background:#00ff9d; margin-bottom:0;">🎬 DOWNLOAD VIDEO</button>
                            <button class="action-btn" id="btn-dl-img" style="background:var(--primary); margin-bottom:0;">🖼️ DOWNLOAD GAMBAR</button>
                        </div>
                    `;
                    box.innerHTML = htmlContent;
                    document.getElementById('btn-dl-vid').onclick = async (e) => {
                        if (!currentVideoUrl) return showToast('Link ini tidak memiliki video.');
                        const saveBtn = e.target;
                        setBtnLoading(saveBtn, true, 'Menyimpan...');
                        try {
                            const dlRes = await fetch(`${SUPA_URL}/functions/v1/zen-pinterest`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ download_url: currentVideoUrl })
                            });
                            if (!dlRes.ok) throw new Error('Gagal');
                            const blob = await dlRes.blob();
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `pin-vid-${Date.now()}.mp4`;
                            a.click();
                            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                            showToast('Video Tersimpan!');
                        } catch (error) { showToast('Gagal simpan video.'); }
                        setBtnLoading(saveBtn, false, '🎬 DOWNLOAD VIDEO');
                    };
                    document.getElementById('btn-dl-img').onclick = async (e) => {
                        if (!currentImageUrl) return showToast('Gambar tidak ditemukan.');
                        const saveBtn = e.target;
                        setBtnLoading(saveBtn, true, 'Menyimpan...');
                        try {
                            const dlRes = await fetch(`${SUPA_URL}/functions/v1/zen-pinterest`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ download_url: currentImageUrl })
                            });
                            if (!dlRes.ok) throw new Error('Gagal');
                            const blob = await dlRes.blob();
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `pin-img-${Date.now()}.jpg`;
                            a.click();
                            setTimeout(() => URL.revokeObjectURL(a.href), 2000);
                            showToast('Gambar Tersimpan!');
                        } catch (error) { showToast('Gagal simpan gambar.'); }
                        setBtnLoading(saveBtn, false, '🖼️ DOWNLOAD GAMBAR');
                    };
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Ambil Media');
            };
        }
        else if (tool === 'youtube') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>YouTube DL</h3>
                <span class="desc-text">Pilih mau download Audio (MP3) atau Video (MP4).</span>
                <input type="text" id="yt-url" placeholder="Paste link YouTube...">

                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button id="btn-type-mp3" onclick="pilihTipeYt('mp3')" class="action-btn" style="flex:1; background:var(--primary); color:#000; border:2px solid var(--border); box-shadow:0 4px 0 var(--border); margin:0;">🎵 MP3</button>
                    <button id="btn-type-mp4" onclick="pilihTipeYt('mp4')" class="action-btn" style="flex:1; background:var(--bg); color:var(--text); border:2px solid var(--border); box-shadow:0 4px 0 var(--border); margin:0;">🎬 MP4</button>
                </div>

                <button class="action-btn" id="btn-dl-yt">Proses</button>
                <div id="yt-result"></div>
            `;

            let tipeTerpilih = 'mp3'; 
            window.pilihTipeYt = (tipe) => {
                tipeTerpilih = tipe;
                const btnMp3 = document.getElementById('btn-type-mp3');
                const btnMp4 = document.getElementById('btn-type-mp4');
                if (tipe === 'mp3') {
                    btnMp3.style.background = 'var(--primary)'; btnMp3.style.color = '#000';
                    btnMp4.style.background = 'var(--bg)'; btnMp4.style.color = 'var(--text)';
                } else {
                    btnMp4.style.background = 'var(--primary)'; btnMp4.style.color = '#000';
                    btnMp3.style.background = 'var(--bg)'; btnMp3.style.color = 'var(--text)';
                }
            };

            const btn = document.getElementById('btn-dl-yt');
            btn.onclick = async () => {
                const url = document.getElementById('yt-url').value.trim();
                const box = document.getElementById('yt-result');
                if (!url) return showToast('Masukkan link YouTube dulu!');

                setBtnLoading(btn, true);
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-youtube`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: tipeTerpilih, url: url })
                    });

                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal download');

                    const result = data.result;

                    if (tipeTerpilih === 'mp3') {
                        box.innerHTML = `
                            <img src="${escapeHTML(result.thumbnail)}" style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                            <b>${escapeHTML(result.title)}</b><br>
                            <audio src="${escapeHTML(result.download)}" controls style="width:100%; margin-top:10px;"></audio>
                            <a href="${escapeHTML(result.download)}" target="_blank" class="action-btn" style="margin-top:10px; text-align:center; text-decoration:none; background:#00ff9d;">Simpan MP3</a>
                        `;
                    } else {
                        box.innerHTML = `
                            <video src="${escapeHTML(result.download)}" controls style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);"></video>
                            <b>${escapeHTML(result.title)}</b><br>
                            <a href="${escapeHTML(result.download)}" target="_blank" class="action-btn" style="margin-top:10px; text-align:center; text-decoration:none; background:#00ff9d;">Simpan MP4</a>
                        `;
                    }
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Proses');
            };
        }
        else if (tool === 'stalktt') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk TikTok</h3>
                <span class="desc-text">Cek statistik akun TikTok tanpa buka aplikasinya.</span>
                <input type="text" id="stalktt-user" placeholder="Username (tanpa @)">
                <button class="action-btn" id="btn-stt">Cari</button>
                <div id="stalktt-res" style="display:none; margin-top:15px; border:3px solid var(--border); padding:15px; border-radius:8px; text-align:left;"></div>
            `;
            const btn = document.getElementById('btn-stt');
            btn.onclick = async () => {
                const user = document.getElementById('stalktt-user').value.trim();
                const box = document.getElementById('stalktt-res');
                if (!user) return showToast('Masukkan username!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Cari');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tiktok`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: user })
                    });
                    const data = await res.json();
                    if (!data.status || !data.result) throw new Error('Akun tidak ditemukan atau private');
                    const d = data.result;
                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${escapeHTML(d.avatar.medium)}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> @${escapeHTML(d.username)}<br>
                        <b>Nama:</b> ${escapeHTML(d.nickname)}<br>
                        <b>Bio:</b> ${escapeHTML(d.bio || '-')}<br>
                        <b>Region:</b> ${escapeHTML(d.region || 'Tidak diketahui')}<br>
                        <hr style="border:1px dashed var(--border); margin:10px 0;">
                        <b>Followers:</b> ${escapeHTML(d.stats.followers.toLocaleString())}<br>
                        <b>Following:</b> ${escapeHTML(d.stats.following.toLocaleString())}<br>
                        <b>Total Likes:</b> ${escapeHTML(d.stats.likes.toLocaleString())}<br>
                        <b>Total Video:</b> ${escapeHTML(d.stats.videos.toLocaleString())}<br>
                        <b>Status:</b> ${d.private_account ? '🔒 Private' : '🌐 Public'}
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'stalkroblox') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Roblox</h3>
                <span class="desc-text">Lacak profil Roblox player lain via Server Zenkai.</span>
                <input type="text" id="stalkrbx-user" placeholder="Username Roblox">
                <button class="action-btn" id="btn-srbx">Cari</button>
                <div id="stalkrbx-res" style="display:none; margin-top:15px; border:3px solid var(--border); padding:15px; border-radius:8px; text-align:left;"></div>
            `;
            const btn = document.getElementById('btn-srbx');
            btn.onclick = async () => {
                const user = document.getElementById('stalkrbx-user').value.trim();
                const box = document.getElementById('stalkrbx-res');
                if (!user) return showToast('Masukkan username!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Cari');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-roblox`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ username: user })
                    });
                    const data = await res.json();
                    if (!data.status || !data.data) throw new Error(data.error || 'Akun tidak ditemukan');
                    const d = data.data;
                    const tglDibuat = new Date(d.created).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${escapeHTML(d.avatar)}" style="width:100px; height:100px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> @${escapeHTML(d.username)}<br>
                        <b>Display Name:</b> ${escapeHTML(d.display_name)}<br>
                        <b>Bio:</b> ${escapeHTML(d.description || '-')}<br>
                        <b>Dibuat:</b> ${tglDibuat}<br>
                        <hr style="border:1px dashed var(--border); margin:10px 0;">
                        <b>Friends:</b> ${escapeHTML(d.stats.friends.toLocaleString())}<br>
                        <b>Followers:</b> ${escapeHTML(d.stats.followers.toLocaleString())}<br>
                        <b>Following:</b> ${escapeHTML(d.stats.following.toLocaleString())}<br>
                        <b>Status:</b> ${d.is_banned ? '🔴 Banned' : (d.verified ? '✅ Verified' : '🟢 Normal')}
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>QR Code</h3>
                <span class="desc-text">Ubah teks, link website, atau nomor WA jadi gambar QR Code.</span>
                <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools">
                <button class="action-btn" id="btn-qr">Generate QR</button>
                <div style="text-align:center; margin-top:15px;"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZenkaiTools" style="max-width:100%; border-radius:8px; border:3px solid var(--border);"></div>
            `;
            document.getElementById('btn-qr').onclick = () => {
                const txt = document.getElementById('qr-text').value || "ZenkaiTools";
                document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(txt)}`;
            };
        }
        else if (tool === 'imgtojpg') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Image to JPG</h3>
                <span class="desc-text">Ubah format gambar (PNG/WebP) jadi JPG.</span>
                <input type="file" id="jpg-in" accept="image/*">
                <div id="jpg-res" style="display:none; text-align:center;">
                    <img id="jpg-preview" style="max-width:100%; border-radius:8px; border:3px solid var(--border); margin-bottom:10px;">
                    <a id="jpg-dl" class="action-btn" download="gambar.jpg">Download JPG</a>
                </div>
            `;
            document.getElementById('jpg-in').onchange = (e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width; canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        document.getElementById('jpg-res').style.display = 'block';
                        document.getElementById('jpg-preview').src = dataUrl;
                        document.getElementById('jpg-dl').href = dataUrl;
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
        }
        else if (tool === 'username') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Username Gen</h3>
                <span class="desc-text">Bingung cari username? Generate aja di sini.</span>
                <input type="text" id="user-name" placeholder="Nama kamu (cth: andika)">
                <button class="action-btn" id="btn-user">Generate</button>
                <div id="user-res" style="display:none; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-user').onclick = () => {
                const name = document.getElementById('user-name').value.trim() || "user";
                const rand = Math.floor(Math.random() * 9999);
                const suffix = Math.random() > 0.5 ? "._" : "_";
                const b = document.getElementById('user-res');
                b.style.display = 'block';
                b.innerHTML = `@${escapeHTML(name)}${suffix}${rand}<br><span style="font-size:12px; opacity:0.7;">(Klik generate lagi buat ganti)</span>`;
            };
        }
        else if (tool === 'artinama') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Arti Nama</h3>
                <span class="desc-text">Cari tahu arti dan asal-usul dari sebuah nama.</span>
                <input type="text" id="nama-in" placeholder="Ketik nama...">
                <button class="action-btn" id="btn-nama">Cari Arti</button>
                <div id="nama-res" style="display:none; text-align:left; line-height:1.6; border:3px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-nama').onclick = () => {
                const nama = document.getElementById('nama-in').value.trim().toLowerCase();
                if (!nama) return showToast('Masukkan nama!');
                const b = document.getElementById('nama-res');
                const database = {
                    "andika": "Pemuda yang tampan dan cerdas (Jawa).",
                    "budi": "Berakal, cerdas, dan berjiwa pemimpin (Sansekerta).",
                    "putri": "Anak perempuan yang cantik dan lembut (Indonesia).",
                    "siti": "Wanita yang mulia dan dihormati (Arab).",
                    "tulus": "Ikhlas dan tulus dalam bertindak (Jawa).",
                    "zacky": "Cerdas dan penuh berkah (Arab).",
                    "zenkai": "Semangat pantang menyerah (Jepang)."
                };
                b.style.display = 'block';
                if (database[nama]) {
                    b.innerHTML = `<b>Arti Nama ${escapeHTML(nama.toUpperCase())}:</b><br><br>${escapeHTML(database[nama])}`;
                } else {
                    b.innerHTML = `Maaf, arti nama <b>${escapeHTML(nama)}</b> belum ada di database. Silakan coba nama lain.`;
                }
            };
        }
        else if (tool === 'password') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Password Gen</h3>
                <span class="desc-text">Buat password acak 16 karakter yang susah ditebak.</span>
                <button class="action-btn" id="btn-pass">Generate Password</button>
                <div id="pass-res" style="display:none; font-size:20px; font-weight:800; color:var(--primary); text-align:center; margin-top:15px; border:3px dashed var(--border); padding:15px; border-radius:8px; word-break:break-all; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-pass').onclick = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                let pass = "";
                const arr = new Uint32Array(16);
                crypto.getRandomValues(arr);
                for (let i = 0; i < 16; i++) pass += chars.charAt(arr[i] % chars.length);
                const b = document.getElementById('pass-res');
                b.style.display = 'block'; b.innerText = pass;
            };
        }
        else if (tool === 'zodiak') {
            let tgls = ''; for (let i = 1; i <= 31; i++) tgls += `<div onclick="setZ('tgl',${i},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${i}</div>`;
            let blns = ''; const b = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
            b.forEach((nm, i) => blns += `<div onclick="setZ('bln',${i+1},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${nm}</div>`);

            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Cek Zodiak</h3>
                <span class="desc-text">Pilih tanggal lahir lu, langsung ketahuan zodiaknya.</span>
                <div style="display:flex; gap:10px; margin-bottom:15px; justify-content:center;">
                    <div style="flex:1; position:relative;">
                        <button class="action-btn" onclick="toggleList('tgl')" id="btn-tgl" style="margin-bottom:0;">Tgl</button>
                        <div id="list-tgl" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--card-bg); border:2px solid var(--border); border-radius:8px; max-height:150px; overflow-y:auto; z-index:10; margin-top:5px;">${tgls}</div>
                    </div>
                    <div style="flex:2; position:relative;">
                        <button class="action-btn" onclick="toggleList('bln')" id="btn-bln" style="margin-bottom:0;">Bulan</button>
                        <div id="list-bln" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--card-bg); border:2px solid var(--border); border-radius:8px; max-height:150px; overflow-y:auto; z-index:10; margin-top:5px;">${blns}</div>
                    </div>
                </div>
                <button class="action-btn" onclick="cekZodiak()">Cek Sekarang</button>
                <div id="z-res" style="display:none; text-align:center; font-size:20px; margin-top:15px; font-weight:bold;"></div>
            `;
            window.zTgl = null; window.zBln = null;
            window.toggleList = (t) => {
                document.getElementById('list-tgl').style.display = 'none';
                document.getElementById('list-bln').style.display = 'none';
                const el = document.getElementById('list-' + t);
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            };
            window.setZ = (t, v, el) => {
                if (t === 'tgl') { window.zTgl = v; document.getElementById('btn-tgl').innerText = v; }
                if (t === 'bln') { window.zBln = v; document.getElementById('btn-bln').innerText = el.innerText; }
                document.getElementById('list-tgl').style.display = 'none';
                document.getElementById('list-bln').style.display = 'none';
            };
            window.cekZodiak = () => {
                if (!window.zTgl || !window.zBln) return showToast('Pilih dulu!');
                const t = window.zTgl, bl = window.zBln;
                const maxDays = [31,29,31,30,31,30,31,31,30,31,30,31][bl-1];
                if (t > maxDays) return showToast(`Tanggal ${t} tidak valid untuk bulan ini!`);

                let z = "";
                if ((bl == 1 && t >= 20) || (bl == 2 && t <= 18)) z = "Aquarius ♒";
                else if ((bl == 2 && t >= 19) || (bl == 3 && t <= 20)) z = "Pisces ♓";
                else if ((bl == 3 && t >= 21) || (bl == 4 && t <= 19)) z = "Aries ♈";
                else if ((bl == 4 && t >= 20) || (bl == 5 && t <= 20)) z = "Taurus ♉";
                else if ((bl == 5 && t >= 21) || (bl == 6 && t <= 20)) z = "Gemini ♊";
                else if ((bl == 6 && t >= 21) || (bl == 7 && t <= 22)) z = "Cancer ♋";
                else if ((bl == 7 && t >= 23) || (bl == 8 && t <= 22)) z = "Leo ♌";
                else if ((bl == 8 && t >= 23) || (bl == 9 && t <= 22)) z = "Virgo ♍";
                else if ((bl == 9 && t >= 23) || (bl == 10 && t <= 22)) z = "Libra ♎";
                else if ((bl == 10 && t >= 23) || (bl == 11 && t <= 21)) z = "Scorpio ♏";
                else if ((bl == 11 && t >= 22) || (bl == 12 && t <= 21)) z = "Sagittarius ♐";
                else z = "Capricorn ♑";

                const res = document.getElementById('z-res');
                res.style.display = 'block';
                res.innerHTML = `Zodiak: <b style="color:var(--primary); font-size:24px; display:block;">${z}</b>`;
            };
        }
        else if (tool === 'base64') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Base64</h3>
                <span class="desc-text">Encode teks jadi kode rahasia, atau decode balik ke teks asli.</span>
                <textarea id="b64-in" rows="3" placeholder="Teks..."></textarea>
                <div style="display:flex;gap:10px; justify-content:center;">
                    <button class="action-btn" id="btn-enc" style="flex:1;">Encode</button>
                    <button class="action-btn" id="btn-dec" style="flex:1;">Decode</button>
                </div>
                <div id="b64-res" style="display:none; margin-top:15px; word-break:break-all; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            const doB64 = (type) => {
                const v = document.getElementById('b64-in').value;
                const b = document.getElementById('b64-res');
                if (!v) return showToast('Isi teks!');
                b.style.display = 'block';
                try {
                    if (type === 'enc') {
                        const bytes = new TextEncoder().encode(v);
                        let bin = '';
                        bytes.forEach(x => bin += String.fromCharCode(x));
                        b.innerText = btoa(bin);
                    } else {
                        const bin = atob(v);
                        const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
                        b.innerText = new TextDecoder().decode(bytes);
                    }
                } catch (e) { b.innerText = 'Gagal memproses.'; }
            };
            document.getElementById('btn-enc').onclick = () => doB64('enc');
            document.getElementById('btn-dec').onclick = () => doB64('dec');
        }
        else if (tool === 'umur') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Hitung Umur</h3>
                <span class="desc-text">Hitung umur berdasarkan tanggal lahir.</span>
                <input type="date" id="umur-in">
                <button class="action-btn" id="btn-umur">Hitung</button>
                <div id="umur-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-umur').onclick = () => {
                const v = document.getElementById('umur-in').value;
                if (!v) return showToast('Pilih tanggal!');
                const tglLahir = new Date(v);
                const hariIni = new Date();
                let umur = hariIni.getFullYear() - tglLahir.getFullYear();
                const m = hariIni.getMonth() - tglLahir.getMonth();
                if (m < 0 || (m === 0 && hariIni.getDate() < tglLahir.getDate())) { umur--; }
                const b = document.getElementById('umur-res');
                b.style.display = 'block'; b.innerText = `Umur Lo: ${umur} Tahun`;
            };
        }
        else if (tool === 'alightmotion') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Alight Motion</h3>
                <span class="desc-text">Bypass akun Premium Alight Motion secara gratis. Ikuti tutorial di bawah ini.</span>
                <div style="text-align:left; font-size:11px; background:rgba(0,0,0,0.05); padding:12px; border-radius:8px; margin-bottom:15px; border:2px dashed var(--border); line-height:1.5;">
                    <b style="color:var(--primary);">📌 TUTORIAL:</b><br>
                    1. Buka Aplikasi Alight Motion.<br>
                    2. Login pakai <b>Email atau Google</b>.<br>
                    3. Masukkan email yang sama di bawah.<br>
                    4. Generate &amp; cek Inbox/Spam.<br>
                    5. Klik link verifikasi. Aplikasi otomatis Premium! ✅
                </div>
                <input type="email" id="am-email" placeholder="Ketik email aktif lu...">
                <button class="action-btn" id="btn-am">Generate Link</button>
                <div id="am-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
                <div style="font-size:9px; opacity:0.6; margin-top:15px; text-align:center;">⚠️ Gunakan dengan bijak.</div>
            `;
            const btn = document.getElementById('btn-am');
            btn.onclick = async () => {
                const email = document.getElementById('am-email').value.trim();
                const box = document.getElementById('am-res');
                if (!email) return showToast('Masukkan email dulu bro!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Generate Link');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/amprem`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email })
                    });
                    const data = await res.json();
                    if (data.status === false || data.error) throw new Error(data.message || 'Gagal');
                    box.innerHTML = `<p class="success-msg">Berhasil Terkirim! ✅<br><span style="font-size:11px; font-weight:normal;">Cek Inbox/Spam di <b>${escapeHTML(email)}</b>.</span></p>`;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Generate Link');
            };
        }
        else if (tool === 'tempmail') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Temp Mail</h3>
                <span class="desc-text">Bikin email sementara (dummy) buat verifikasi. Aman dari spam dan nggak perlu daftar.</span>
                <button class="action-btn" id="btn-tm">Buat Email</button>
                <div id="tm-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-tm');
            btn.onclick = async () => {
                const box = document.getElementById('tm-res');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Buat Email');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'tempmail_create', params: {} })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal');
                    box.innerHTML = `<p style="font-size:12px; margin-bottom:10px;">Email Lu:</p><b style="font-size:16px; color:var(--primary); word-break:break-all;">${escapeHTML(data.result.email)}</b><br><p style="font-size:11px; opacity:0.8; margin-top:5px;">(Token: ${escapeHTML(data.result.token)})</p>`;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Buat Email');
            };
        }
        else if (tool === 'nik') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>NIK Parser</h3>
                <span class="desc-text">Bongkar data dari NIK KTP. Cek Provinsi, Kabupaten, Tanggal Lahir, Zodiak, dan Usia.</span>
                <input type="text" id="nik-input" placeholder="Masukkan 16 digit NIK..." inputmode="numeric" maxlength="16">
                <button class="action-btn" id="btn-nik">Lacak NIK</button>
                <div id="nik-res" style="display:none; margin-top:15px; text-align:left; border:3px dashed var(--border); padding:15px; border-radius:8px; font-size:12px; line-height:1.6; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-nik');
            btn.onclick = async () => {
                const nik = document.getElementById('nik-input').value.trim();
                const box = document.getElementById('nik-res');
                if (!nik) return showToast('Masukkan NIK!');
                if (!/^\d{16}$/.test(nik)) return showToast('NIK harus 16 digit angka!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Lacak NIK');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'nik', params: { nik: nik } })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.error || 'NIK tidak valid');
                    const d = data.data.data;
                    box.innerHTML = `
                        <b>NIK:</b> ${escapeHTML(d.nik || nik)}<br>
                        <b>Provinsi:</b> ${escapeHTML(d.provinsi || '-')}<br>
                        <b>Kabupaten:</b> ${escapeHTML(d.kabupaten || '-')}<br>
                        <b>Kecamatan:</b> ${escapeHTML(d.kecamatan || '-')}<br>
                        <b>Kelamin:</b> ${escapeHTML(d.kelamin || '-')}<br>
                        <b>Tgl Lahir:</b> ${escapeHTML(d.tempat_lahir || '-')}<br>
                        <b>Zodiak:</b> ${escapeHTML(d.zodiak || '-')}<br>
                        <b>Usia:</b> ${escapeHTML(d.usia || '-')}
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Lacak NIK');
            };
        }
        else if (tool === 'spotify') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Spotify DL</h3>
                <span class="desc-text">Download lagu dari Spotify jadi MP3. Dengerin lagu favorit tanpa kuota.</span>
                <input type="text" id="sp-url" placeholder="Paste link Spotify...">
                <button class="action-btn" id="btn-sp">Download</button>
                <div id="sp-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-sp');
            btn.onclick = async () => {
                const url = document.getElementById('sp-url').value.trim();
                const box = document.getElementById('sp-res');
                if (!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Download');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'spotify', params: { url: url } })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal');
                    const s = data.data;
                    box.innerHTML = `
                        <img src="${escapeHTML(s.cover)}" style="width:100px; height:100px; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                        <b>${escapeHTML(s.title)}</b><br>
                        <p style="font-size:11px; opacity:0.8;">${escapeHTML(s.artist)} • ${escapeHTML(s.album || '-')}</p>
                        <audio src="${escapeHTML(s.download_mp3)}" controls style="width:100%; margin-top:10px;"></audio>
                        <a href="${escapeHTML(s.download_mp3)}" class="action-btn" style="margin-top:10px; display:block; text-decoration:none;" download>Simpan MP3</a>
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Download');
            };
        }
        else if (tool === 'iplookup') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>IP Lookup Pro</h3>
                <span class="desc-text">Lacak IP publik via Server Zenkai. Cek asal kota, negara, ISP, dan organisasi.</span>
                <input type="text" id="ip-input" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" id="btn-ip">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; border:3px dashed var(--border); padding:15px; border-radius:8px; font-size:12px; line-height:1.6; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-ip');
            btn.onclick = async () => {
                const ip = document.getElementById('ip-input').value.trim();
                const box = document.getElementById('ip-res');
                if (!ip) return showToast('Masukkan IP!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Lacak');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'iplookup', params: { ip: ip } })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal');
                    const r = data.result;
                    box.innerHTML = `
                        <b>IP:</b> ${escapeHTML(r.ip)}<br>
                        <b>Kota:</b> ${escapeHTML(r.city || '-')}<br>
                        <b>Provinsi:</b> ${escapeHTML(r.region_name || '-')}<br>
                        <b>Negara:</b> ${escapeHTML(r.country || '-')} (${escapeHTML(r.country_code || '-')})<br>
                        <b>ISP:</b> ${escapeHTML(r.isp || '-')}<br>
                        <b>Org:</b> ${escapeHTML(r.org || '-')}
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Lacak');
            };
        }
        else if (tool === 'removebg') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Remove Background</h3>
                <span class="desc-text">Upload gambar dari galeri untuk dihapus background-nya secara otomatis.</span>
                <input type="file" id="rb-file" accept="image/*">
                <button class="action-btn" id="btn-rb">Proses Gambar</button>
                <div id="rb-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-rb');
            btn.onclick = async () => {
                const fileInput = document.getElementById('rb-file');
                const file = fileInput.files[0];
                const box = document.getElementById('rb-res');

                if (!file) return showToast('Pilih gambar dulu!');

                box.style.display = 'block';
                setBtnLoading(btn, true, 'Mengunggah...');
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const reader = new FileReader();
                    reader.onload = async (e) => {
                        const base64Image = e.target.result;

                        try {
                            const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools`, {
                                method: 'POST', headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ path: 'removebg', params: { image: base64Image } })
                            });
                            const data = await res.json();
                            if (!data.status) throw new Error(data.message || 'Gagal memproses gambar');

                            box.innerHTML = `
                                <img src="${escapeHTML(data.image_url)}" style="max-width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                                <a href="${escapeHTML(data.image_url)}" target="_blank" rel="noopener" class="action-btn" style="display:block; text-decoration:none;">Buka Gambar HD</a>
                            `;
                        } catch (err) {
                            box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(err.message)}</p>`;
                        }
                        setBtnLoading(btn, false, 'Proses Gambar');
                    };
                    reader.readAsDataURL(file);
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                    setBtnLoading(btn, false, 'Proses Gambar');
                }
            };
        }
        else if (tool === 'ai-chat') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>AI Chat</h3>
                <span class="desc-text">Tanya apa aja ke AI pintar (DeepSeek).</span>
                <textarea id="ai-prompt" rows="3" placeholder="Ketik pertanyaanmu di sini..."></textarea>
                <button class="action-btn" id="btn-ai">Tanya AI</button>
                <div id="ai-res" style="display:none; margin-top:15px; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg); text-align:left; line-height:1.6;"></div>
            `;
            const btn = document.getElementById('btn-ai');
            btn.onclick = async () => {
                const text = document.getElementById('ai-prompt').value.trim();
                const box = document.getElementById('ai-res');
                if (!text) return showToast('Ketik pertanyaan dulu!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Berpikir...');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/chat-ai`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: text })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal memproses AI');
                    box.innerHTML = `<b>AI:</b><br><br>${escapeHTML(data.result.answer || data.answer).replace(/\n/g, '<br>')}`;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Tanya AI');
            };
        }
        else if (tool === 'ai-image') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>AI Image</h3>
                <span class="desc-text">Buat gambar dari teks (Bahasa Inggris lebih bagus).</span>
                <input type="text" id="ai-img-prompt" placeholder="Cth: cute orange cat, digital art">
                <button class="action-btn" id="btn-ai-img">Generate Gambar</button>
                <div id="ai-img-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            const btn = document.getElementById('btn-ai-img');
            btn.onclick = async () => {
                const prompt = document.getElementById('ai-img-prompt').value.trim();
                const box = document.getElementById('ai-img-res');
                if (!prompt) return showToast('Ketik deskripsi gambar!');
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Membuat...');
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/chat-ai`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: prompt, type: 'image' })
                    });

                    if (!res.ok) {
                        let errMsg = `HTTP ${res.status}`;
                        try { const j = await res.json(); errMsg = j.message || errMsg; } catch {}
                        throw new Error(errMsg);
                    }

                    const contentType = res.headers.get('content-type') || '';
                    if (contentType.includes('image/')) {
                        const blob = await res.blob();
                        const imgUrl = URL.createObjectURL(blob);
                        box.innerHTML = `<img src="${imgUrl}" style="width:100%; border-radius:8px; border:3px solid var(--border);" onload="URL.revokeObjectURL(this.src)">`;
                    } else {
                        const data = await res.json();
                        if (data.image_url) {
                            box.innerHTML = `<img src="${escapeHTML(data.image_url)}" style="width:100%; border-radius:8px; border:3px solid var(--border);">`;
                        } else {
                            throw new Error(data.message || 'Gagal membuat gambar');
                        }
                    }
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Generate Gambar');
            };
        }
        else {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Coming Soon</h3>
                <span class="desc-text">Fitur "${escapeHTML(tool)}" sedang dalam tahap pengembangan atau belum tersedia.</span>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-align: center; text-decoration: none; background: #00ff9d;">Pantau Update</a>
            `;
        }
    };

    // =========================================
    // JEMBATAN: JERE (KATALOG) -> MANGADEX (BACA)
    // =========================================
    window.bacaDariMangaDex = async (title) => {
        const box = document.getElementById('komik-res');
        box.innerHTML = `<div class="loader"></div><p style="text-align:center; font-size:12px;">Mencari "${escapeHTML(title)}" di server baca...</p>`;
        
        try {
            // 1. Cari judul komik dari Jere ke MangaDex
            const mdRes = await fetch(`${SUPA_URL}/functions/v1/zen-komik`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'search', q: title })
            });
            const mdData = await mdRes.json();

            // 2. Kalau ketemu, buka list chapter MangaDex
            if (mdData.data && mdData.data.length > 0) {
                // Ambil ID komik pertama yang paling relevan
                const mangaId = mdData.data[0].id;
                window.bukaChapterKomik(mdData.data[0].id, title);
            } else {
                // 3. Kalau nggak ketemu, baru kasih tau user
                box.innerHTML = `
                    <div style="text-align:center; padding: 20px;">
                        <p class="error-msg">Komik "${escapeHTML(title)}" tidak ditemukan di server baca. Coba cari judul lain atau baca di web asli.</p>
                        <button onclick="openTool('komik')" class="action-btn" style="margin-top:15px;">Kembali ke Katalog</button>
                    </div>
                `;
            }
        } catch (err) {
            box.innerHTML = `<p class="error-msg">Gagal konek ke server baca.</p>`;
        }
    };

    // =========================================
    // FUNGSI KOMIK MANGADEX (DIPANGGIL DARI JEMBATAN)
    // =========================================
    window.bukaChapterKomik = async (mangaId, title) => {
        const box = document.getElementById('komik-res');
        box.innerHTML = '<div class="loader"></div>';
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'chapters', mangaId: mangaId })
            });
            const data = await res.json();
            
            if (!data.data || data.data.length === 0) throw new Error('Chapter komik belum tersedia di server.');
            
            let html = `
                <div style="display:flex; gap:15px; margin-bottom:20px; align-items:flex-start;">
                    <button onclick="openTool('komik')" class="press" style="background:var(--card-bg); border:2px solid var(--border); width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div>
                        <h3 style="font-family:var(--font-head); font-size:20px; color:var(--text); margin:0 0 5px 0; line-height:1.2;">${escapeHTML(title)}</h3>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="font-size:10px; font-weight:bold; background:var(--primary); color:#000; padding:3px 8px; border-radius:4px;">ZENKAI SERVER</span>
                            <span style="font-size:11px; color:var(--text); opacity:0.6;">${data.data.length} Chapters</span>
                        </div>
                    </div>
                </div>
                <div style="display:flex; flex-direction:column;">
            `;
            
            data.data.forEach((ch) => {
                const chNum = ch.attributes.chapter || '?';
                const chTitle = ch.attributes.title || '';
                const date = new Date(ch.attributes.publishAt).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'});
                
                html += `
                    <div class="press" onclick="bacaGambarKomik('${escapeHTML(ch.id)}', '${escapeHTML(chNum)}')" style="display:flex; align-items:center; padding:15px 10px; border-bottom:1px solid var(--border); cursor:pointer; transition:0.2s;">
                        <div style="width:35px; height:35px; background:var(--card-bg); border:2px solid var(--border); border-radius:8px; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:12px; flex-shrink:0; color:var(--text);">
                            ${chNum}
                        </div>
                        <div style="margin-left:15px; flex:1;">
                            <h5 style="margin:0; font-size:13px; font-weight:800; color:var(--text);">Chapter ${chNum}</h5>
                            <p style="margin:2px 0 0 0; font-size:10px; color:var(--text); opacity:0.6;">${date} ${chTitle ? '• ' + escapeHTML(chTitle) : ''}</p>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
                    </div>
                `;
            });
            
            html += `</div>`;
            box.innerHTML = html;
            
        } catch (e) { 
            box.innerHTML = `
                <div style="text-align:center; padding:40px 20px;">
                    <div style="font-size:40px; margin-bottom:10px;">😔</div>
                    <p class="error-msg">${escapeHTML(e.message)}</p>
                    <button onclick="openTool('komik')" class="action-btn" style="margin-top:20px;">Kembali ke Katalog</button>
                </div>
            `; 
        }
    };

    window.bacaGambarKomik = async (chapterId, chNum) => {
        const box = document.getElementById('komik-res');
        box.innerHTML = '<div class="loader"></div>';
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'images', chapterId: chapterId })
            });
            const data = await res.json();

            const baseUrl = data.baseUrl;
            const hash = data.chapter?.hash;
            const images = data.chapter?.data;

            if (!baseUrl || !hash || !images) throw new Error('Gagal mengambil gambar chapter');

            let html = `<h4 style="margin-bottom:10px; text-align:center;">Chapter ${escapeHTML(chNum)}</h4>`;
            html += `<div style="display:flex; flex-direction:column; gap:5px;">`;
            images.forEach(img => {
                const rawUrl = `${baseUrl}/data/${hash}/${img}`;
                html += `<img src="${rawUrl}" referrerpolicy="no-referrer" style="width:100%; border-radius:4px; min-height:100px; background:#111;" loading="lazy" onerror="this.style.display='none'">`;
            });
            html += `</div>`;

            html += `<button class="action-btn press" onclick="closeModal()" style="margin-top:15px; background:#ff3333;">Tutup</button>`;
            box.innerHTML = html;
        } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
    };

}); // <- PENUTUP DOMContentLoaded, JANGAN DIHAPUS