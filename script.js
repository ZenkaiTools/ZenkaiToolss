document.addEventListener('DOMContentLoaded', () => {

    const SUPA_URL = 'https://chcfvbqyygtkfcvhywoa.supabase.co';
    const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2Z2YnF5eWd0a2Zjdmh5d29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjYxNDAsImV4cCI6MjEwNjQ0MjE0MH0.VjsHm2lIVs--biNLF-ku6K3AyIbUVXylyFY77xjaajM';
    const OWNER_TOKEN_KEY = 'zenkai_owner_token';

    const COMING_SOON_TOOLS = ['stalkpubg', 'stalkcodm', 'stalkgenshin', 'twitter', 'imghd'];

    const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

    const setBtnLoading = (btn, loading, label = 'Proses') => {
        if (!btn) return;
        if (!btn.dataset.originalLabel) btn.dataset.originalLabel = label;
        btn.disabled = loading;
        btn.classList.toggle('loading', loading);
        btn.innerText = loading ? 'Memproses...' : (btn.dataset.originalLabel || label);
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
            b.style.background = btn.type === 'primary' ? 'var(--accent)' : 'var(--bg-base)';
            b.style.color = btn.type === 'primary' ? 'var(--accent-ink)' : 'var(--text-primary)';
            b.style.border = btn.type === 'primary' ? 'none' : '1px solid var(--border-strong)';
            b.setAttribute('onclick', btn.action);
            btnContainer.appendChild(b);
        });

        alertEl.style.display = 'flex';
    };

    const welcomeVideo = document.getElementById('welcome-video');
    const authGate = document.getElementById('auth-gate');

    window.masukKeWeb = () => {
        if (welcomeVideo) {
            welcomeVideo.pause();
            welcomeVideo.muted = true;
        }
        if (authGate) {
            authGate.style.opacity = '0';
            authGate.style.transition = 'opacity 300ms ease';
            setTimeout(() => {
                authGate.style.display = 'none';
                authGate.remove();
                document.body.style.overflow = '';
            }, 300);
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

    const waPopup = document.getElementById('wa-popup');

    window.closeWaPopup = () => {
        if (!waPopup) return;
        waPopup.classList.remove('active');
    };

    function showWaPopupOnce() {
        if (!waPopup) return;
        waPopup.classList.add('active');
    }

    if (waPopup) {
        waPopup.addEventListener('click', (e) => {
            if (e.target.id === 'wa-popup') window.closeWaPopup();
        });
    }

    const welcome = document.getElementById('welcome-username');
    if (welcome) welcome.innerText = 'User';

    if (localStorage.getItem(OWNER_TOKEN_KEY)) {
        const navOwner = document.getElementById('nav-owner');
        if (navOwner) navOwner.style.display = 'flex';
    }

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

        if (modal && modal.classList.contains('active')) closeModal();

        if (current) current.classList.remove('active');
        target.classList.add('active');

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (btn) btn.classList.add('active');

        window.scrollTo({ top: 0, behavior: isReducedMotion() ? 'auto' : 'smooth' });
    };

    window.filterCategory = (category, btn) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');

        let visibleCount = 0;
        document.querySelectorAll('.tool-card').forEach(card => {
            const cat = card.getAttribute('data-category');
            const show = category === 'all' || !cat || cat === category;
            card.style.display = show ? 'flex' : 'none';
            if (show) visibleCount++;
        });

        document.querySelectorAll('.list-divider').forEach(divider => {
            divider.style.display = (category !== 'all') ? 'none' : 'flex';
        });
    };

    window.toggleAnimation = (checkbox) => {
        if (checkbox.checked) {
            document.body.classList.add('reduce-motion');
            localStorage.setItem('zenkai_reduce_motion', 'true');
            showToast('Mode hemat baterai aktif');
        } else {
            document.body.classList.remove('reduce-motion');
            localStorage.setItem('zenkai_reduce_motion', 'false');
            showToast('Mode hemat baterai nonaktif');
        }
    };

    window.ubahVolume = (val) => {
        const bgm = document.getElementById('bgm');
        if (bgm) bgm.volume = val / 100;
        const label = document.getElementById('vol-label');
        if (label) label.innerText = val + '%';
        localStorage.setItem('zenkai_volume', val);
    };

    window.forceCekUpdate = () => {
        showToast('Memeriksa pembaruan...');
        setTimeout(() => {
            location.reload();
        }, 1000);
    };

    if (localStorage.getItem('zenkai_reduce_motion') === 'true') {
        document.body.classList.add('reduce-motion');
        const toggle = document.getElementById('toggle-anim');
        if (toggle) toggle.checked = true;
    }
    const savedVol = localStorage.getItem('zenkai_volume') || '50';
    const volSlider = document.getElementById('vol-slider');
    if (volSlider) volSlider.value = savedVol;
    const volLabel = document.getElementById('vol-label');
    if (volLabel) volLabel.innerText = savedVol + '%';

    function updateTime() {
        const now = new Date();
        const c = document.getElementById('clock-now');
        if (c) c.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateTime, 1000); updateTime();

    setTimeout(() => {
        const cards = document.querySelectorAll('.tool-list .tool-card');
        let count = 0;
        cards.forEach(c => {
            if (!c.classList.contains('soon')) count++;
        });

        let rounded = Math.floor(count / 5) * 5;
        if (rounded === 0 && count > 0) rounded = count;
        const finalText = rounded + '+';

        const elWelcome = document.getElementById('total-tools-count');
        if (elWelcome) elWelcome.innerText = finalText;

        const elInfo = document.getElementById('info-total-tools');
        if (elInfo) elInfo.innerText = finalText;
    }, 500);

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
            const savedV = localStorage.getItem('zenkai_volume') || '50';
            bgm.volume = savedV / 100;
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
            zenkai_owner_token: localStorage.getItem(OWNER_TOKEN_KEY),
            zenkai_volume: localStorage.getItem('zenkai_volume'),
            zenkai_reduce_motion: localStorage.getItem('zenkai_reduce_motion')
        };
        sessionStorage.clear();
        localStorage.clear();
        if (keep.zenkai_theme) localStorage.setItem('zenkai_theme', keep.zenkai_theme);
        if (keep.zenkai_owner_token) localStorage.setItem(OWNER_TOKEN_KEY, keep.zenkai_owner_token);
        if (keep.zenkai_volume) localStorage.setItem('zenkai_volume', keep.zenkai_volume);
        if (keep.zenkai_reduce_motion) localStorage.setItem('zenkai_reduce_motion', keep.zenkai_reduce_motion);
        location.reload();
    };

    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');

    window.closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        if (window.activeTimerInterval) {
            clearInterval(window.activeTimerInterval);
            window.activeTimerInterval = null;
        }
        if (window.__komikScrollHandler && window.__komikScrollTarget) {
            window.__komikScrollTarget.removeEventListener('scroll', window.__komikScrollHandler);
            window.__komikScrollHandler = null;
            window.__komikScrollTarget = null;
        }
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

    const closeSvg = `<button class="btn-icon modal-close" onclick="closeModal()" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('tool-card')) {
            e.preventDefault(); e.target.click();
        }
    });

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
            document.querySelectorAll('.list-divider').forEach(divider => {
                divider.style.display = 'none';
            });
        });
    }

    COMING_SOON_TOOLS.forEach(toolName => {
        const card = document.querySelector(`.tool-card[onclick="openTool('${toolName}')"]`);
        if (card) card.classList.add('soon');
    });

    async function fetchSettings() {
        if (document.hidden) return;
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
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) fetchSettings();
    });
    fetchSettings();

    function applySettings(setting) {
        const isOwner = !!localStorage.getItem(OWNER_TOKEN_KEY);

        window.geminiLimit = setting.gemini_limit || 1;

        if (setting.is_maintenance && !isOwner) {
            const ms = document.getElementById('maintenance-screen');
            if (ms) ms.style.display = 'flex';
        } else {
            const ms = document.getElementById('maintenance-screen');
            if (ms) ms.style.display = 'none';
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
        window.currentVipTools = setting.vip_tools ? setting.vip_tools.split(',') : [];

        document.querySelectorAll('.tool-card').forEach(c => {
            const m = (c.getAttribute('onclick')||'').match(/openTool\('(.*?)'\)/);
            if (!m) return;
            const toolName = m[1];

            const oldBadge = c.querySelector('.badge-maintenance');
            if (oldBadge) oldBadge.remove();

            if (dTools.includes(toolName)) {
                c.classList.add('maintenance-mode');
                const badge = document.createElement('div');
                badge.className = 'badge-maintenance';
                badge.innerText = 'MAINTENANCE';
                const infoDiv = c.querySelector('.t-info');
                if (infoDiv) infoDiv.appendChild(badge);
            } else {
                c.classList.remove('maintenance-mode');
            }

            if (window.currentVipTools.includes(toolName)) {
                if (!c.querySelector('.vip-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'vip-badge';
                    badge.innerText = 'VIP';
                    c.querySelector('.t-info h4').appendChild(badge);
                }
            } else {
                const existingBadge = c.querySelector('.vip-badge');
                if (existingBadge) existingBadge.remove();
            }
        });

        const komikBanner = document.getElementById('tool-komik');
        if (komikBanner) {
            const isKomikDisabled = dTools.includes('komik');
            if (isKomikDisabled) {
                komikBanner.classList.add('soon-banner');
                komikBanner.style.opacity = '0.5';
                komikBanner.style.pointerEvents = 'none';
            } else {
                komikBanner.classList.remove('soon-banner');
                komikBanner.style.opacity = '1';
                komikBanner.style.pointerEvents = 'auto';
            }
        }
    }

    let clicks = 0;
    document.querySelector('.logo-area')?.addEventListener('click', () => {
        clicks++; setTimeout(() => { clicks = 0; }, 1000);
        if (clicks === 5) { clicks = 0; bukaPintuRahasia(); }
    });

    function bukaPintuRahasia() {
        if (document.getElementById('owner-modal')) document.getElementById('owner-modal').remove();
        document.body.insertAdjacentHTML('beforeend', `
            <div id="owner-modal" class="modal-overlay" style="display:flex;">
                <div class="modal-box">
                    <h2>Akses Owner</h2>
                    <p>Masukkan passcode untuk melanjutkan.</p>
                    <input type="password" id="owner-pass" placeholder="Passcode" style="text-align:center;">
                    <div style="display:flex; gap:10px;">
                        <button onclick="document.getElementById('owner-modal').remove()" class="btn btn-ghost" style="flex:1;">Batal</button>
                        <button onclick="verifikasiOwner()" class="btn btn-primary" style="flex:1;">Masuk</button>
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
                showToast("Akses Owner Diberikan");
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

    window.tampilkanPanelRahasia = async () => {
        const container = document.getElementById('owner-page-content');
        if (!container) return;
        container.innerHTML = '<div class="loader"></div>';
        let set = { site_title: '', broadcast_text: '', is_maintenance: false, disabled_pages: '', disabled_tools: '', vip_tools: '', gemini_limit: 1 };
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'get_settings' }) });
            const data = await res.json();
            if (data.status && data.data) set = data.data;
        } catch(e) {}

        const disabledPagesArr = set.disabled_pages ? set.disabled_pages.split(',') : [];
        const disabledToolsArr = set.disabled_tools ? set.disabled_tools.split(',') : [];
        const vipToolsArr = set.vip_tools ? set.vip_tools.split(',') : [];

        const listTools = [];
        document.querySelectorAll('.tool-card').forEach(card => {
            const onclickAttr = card.getAttribute('onclick') || '';
            const match = onclickAttr.match(/openTool\('(.*?)'\)/);
            if (match && match[1]) {
                const toolName = match[1];
                if (toolName !== 'support' && toolName !== 'vip') listTools.push(toolName);
            }
        });

        const listPages = ['fun', 'setting', 'info'];

        let toolsHtml = listTools.map(t => `
            <div class="own-tool-item">
                <span class="own-tool-name">${t.toUpperCase()}</span>
                <div style="display:flex; gap:12px;">
                    <label class="own-check">
                        <input type="checkbox" class="tool-chk" value="${t}" ${disabledToolsArr.includes(t) ? 'checked' : ''}> Off
                    </label>
                    <label class="own-check" style="color:var(--accent);">
                        <input type="checkbox" class="vip-chk" value="${t}" ${vipToolsArr.includes(t) ? 'checked' : ''}> VIP
                    </label>
                </div>
            </div>
        `).join('');

        let pagesHtml = listPages.map(p => `
            <label class="own-page-check">
                <span>${p.toUpperCase()}</span>
                <input type="checkbox" class="page-chk" value="${p}" ${disabledPagesArr.includes(p) ? 'checked' : ''}>
            </label>
        `).join('');

        container.innerHTML = `
            <div style="display:flex; flex-direction:column; gap:15px;">
                <div class="own-tabs">
                    <button class="own-tab active" onclick="switchOwnerTab('tab-umum', this)">Umum</button>
                    <button class="own-tab" onclick="switchOwnerTab('tab-vip', this)">VIP</button>
                    <button class="own-tab" onclick="switchOwnerTab('tab-tools', this)">Alat</button>
                    <button class="own-tab" onclick="switchOwnerTab('tab-pages', this)">Halaman</button>
                </div>

                <div id="tab-umum" class="own-content" style="display:block;">
                    <h3>Pengaturan Umum</h3>
                    <label class="own-label">Judul Web</label>
                    <input type="text" id="own-title" class="own-input" value="${escapeHTML(set.site_title || 'ZenkaiTools')}">

                    <label class="own-label">Broadcast Banner</label>
                    <input type="text" id="own-broadcast" class="own-input" value="${escapeHTML(set.broadcast_text || '')}" placeholder="Kosongkan untuk mematikan">

                    <label class="own-label">Limit Gemini (Per Hari)</label>
                    <input type="number" id="own-gemini-limit" class="own-input" value="${set.gemini_limit || 1}" min="1">

                    <div class="own-danger-box">
                        <label style="display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
                            <div>
                                <b style="font-size:14px; display:block;">Mode Maintenance</b>
                                <span style="font-size:12px; color:var(--text-secondary);">Kunci semua akses web.</span>
                            </div>
                            <input type="checkbox" id="own-mt" ${set.is_maintenance ? 'checked' : ''} style="width:20px; height:20px; accent-color:var(--danger); cursor:pointer;">
                        </label>
                    </div>
                </div>

                <div id="tab-vip" class="own-content" style="display:none;">
                    <h3 style="color:var(--accent);">Manajemen VIP</h3>
                    <p style="font-size:12px; color:var(--text-secondary); margin-bottom:10px;">Klik untuk reset kode VIP biar bisa dipakai ulang.</p>
                    <button class="btn btn-ghost" onclick="loadVipCodes()" style="margin-bottom:10px; font-size:14px;">Muat Daftar Kode VIP</button>
                    <div id="vip-list-container" style="max-height: 250px; overflow-y: auto;"></div>
                </div>

                <div id="tab-tools" class="own-content" style="display:none;">
                    <h3>Nonaktifkan & VIP Alat</h3>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">${toolsHtml}</div>
                </div>

                <div id="tab-pages" class="own-content" style="display:none;">
                    <h3>Kunci Halaman</h3>
                    <div class="own-pages-grid">${pagesHtml}</div>
                </div>

                <div style="display:flex; flex-direction:column; gap:10px; margin-top:10px; margin-bottom:20px;">
                    <button onclick="simpanSettingOwner(event)" class="btn btn-primary">Simpan Perubahan</button>
                    <button onclick="forceRefreshUser()" class="btn btn-ghost">Paksa Refresh User</button>
                </div>
            </div>
        `;
    };

    window.switchOwnerTab = (tabId, btn) => {
        document.querySelectorAll('.own-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.own-tab').forEach(el => el.classList.remove('active'));
        document.getElementById(tabId).style.display = 'block';
        btn.classList.add('active');
    };

    window.loadVipCodes = async () => {
        const container = document.getElementById('vip-list-container');
        if (!container) return;
        container.innerHTML = '<div class="loader"></div>';

        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'list_vip_codes', owner_token: localStorage.getItem(OWNER_TOKEN_KEY) })
            });
            const result = await res.json();

            if (!result.status) throw new Error(result.message || 'Gagal memuat');
            const data = result.data || [];

            let html = `<button onclick="generateVipCode(event)" class="btn btn-primary" style="font-size:14px; margin-bottom:15px;">Buat Kode VIP Baru</button>`;

            if (data.length === 0) {
                html += '<p style="font-size:12px; text-align:center; color:var(--text-secondary);">Belum ada kode VIP.</p>';
                container.innerHTML = html;
                return;
            }

            data.forEach(v => {
                const badge = v.is_used ? 'TERPAKAI' : 'TERSEDIA';
                const date = v.used_at ? new Date(v.used_at).toLocaleString('id-ID') : '-';
                const badgeColor = v.is_used ? 'rgba(255, 61, 110, 0.2)' : 'rgba(61, 224, 160, 0.2)';
                const badgeText = v.is_used ? 'var(--danger)' : 'var(--success)';

                html += `
                    <div class="vip-code-item">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                            <b class="vip-code-val">${escapeHTML(v.code)}</b>
                            <span style="font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px; background:${badgeColor}; color:${badgeText}; letter-spacing:0.05em;">${badge}</span>
                        </div>
                        ${v.is_used ? `<p style="font-size:11px; color:var(--text-secondary); margin-bottom:8px;">Dipakai: ${escapeHTML(date)}</p>` : ''}
                        <div style="display:flex; gap:6px;">
                            <button data-copy-code="${escapeHTML(v.code)}" class="btn btn-ghost btn-copy-vip" style="flex:1; padding:6px; font-size:12px;">Salin</button>
                            ${v.is_used ? `<button data-reset-id="${Number(v.id)}" class="btn btn-reset-vip" style="flex:1; padding:6px; font-size:12px; background:var(--danger); color:#fff;">Reset</button>` : ''}
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;

            container.querySelectorAll('.btn-copy-vip').forEach(btn => {
                btn.addEventListener('click', () => window.copyToClipboard(btn.dataset.copyCode));
            });
            container.querySelectorAll('.btn-reset-vip').forEach(btn => {
                btn.addEventListener('click', () => window.resetVipCode(Number(btn.dataset.resetId)));
            });
        } catch(e) {
            container.innerHTML = `<p style="font-size:12px; color:var(--danger);">Error: ${escapeHTML(e.message)}</p>`;
        }
    };

    window.generateVipCode = async (e) => {
        const btn = e.target;
        const oldText = btn.innerText;
        btn.innerText = 'Membuat...';
        btn.disabled = true;
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'create_vip_code', owner_token: localStorage.getItem(OWNER_TOKEN_KEY) })
            });
            const data = await res.json();
            if (!data.status) throw new Error(data.message);
            showToast(`Kode dibuat: ${data.code}`);
            loadVipCodes();
        } catch (e) {
            showToast('Gagal buat kode: ' + e.message);
            btn.innerText = oldText;
            btn.disabled = false;
        }
    };

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            showToast(`Kode disalin: ${text}`);
        }).catch(() => {
            const temp = document.createElement('textarea');
            temp.value = text;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            temp.remove();
            showToast(`Kode disalin: ${text}`);
        });
    };

    window.resetVipCode = (id) => {
        tampilkanAlert("Reset Kode VIP", "Yakin mau reset kode ini? Kode bisa dipakai lagi.", [
            { label: "Batal", action: "document.getElementById('custom-alert').style.display='none'", type: "cancel" },
            { label: "Reset", action: `eksekusiResetVip(${Number(id)})`, type: "primary" }
        ]);
    };

    window.eksekusiResetVip = async (id) => {
        document.getElementById('custom-alert').style.display = 'none';
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset_vip_code', owner_token: localStorage.getItem(OWNER_TOKEN_KEY), id })
            });
            const data = await res.json();
            if (!data.status) throw new Error(data.message || 'Gagal reset');
            showToast('Kode VIP berhasil direset');
            loadVipCodes();
        } catch (e) {
            showToast('Gagal reset: ' + e.message);
        }
    };

    window.simpanSettingOwner = async (e) => {
        const btn = e?.target || document.activeElement;
        const oldText = btn?.innerText || 'Simpan';
        if (btn) { btn.innerText = 'Menyimpan...'; btn.disabled = true; }

        const checkedTools = Array.from(document.querySelectorAll('.tool-chk:checked')).map(cb => cb.value).join(',');
        const checkedPages = Array.from(document.querySelectorAll('.page-chk:checked')).map(cb => cb.value).join(',');
        const checkedVipTools = Array.from(document.querySelectorAll('.vip-chk:checked')).map(cb => cb.value).join(',');

        const payload = {
            action: 'update_settings',
            owner_token: localStorage.getItem(OWNER_TOKEN_KEY),
            site_title: document.getElementById('own-title').value,
            broadcast_text: document.getElementById('own-broadcast').value,
            disabled_pages: checkedPages,
            disabled_tools: checkedTools,
            vip_tools: checkedVipTools,
            is_maintenance: document.getElementById('own-mt').checked,
            gemini_limit: document.getElementById('own-gemini-limit').value
        };

        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.status) {
                showToast("Pengaturan disimpan");
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
        tampilkanAlert("Paksa Refresh", "Yakin mau maksa semua user buat refresh?", [
            { label: "Batal", action: "document.getElementById('custom-alert').style.display='none'", type: "cancel" },
            { label: "Lanjut", action: "eksekusiForceRefresh()", type: "primary" }
        ]);
    };

    window.eksekusiForceRefresh = async () => {
        document.getElementById('custom-alert').style.display = 'none';
        try {
            const res = await fetch(`${SUPA_URL}/functions/v1/zen-owner`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'force_refresh', owner_token: localStorage.getItem(OWNER_TOKEN_KEY) })
            });
            const data = await res.json();
            if (data.status) showToast("Sinyal Refresh terkirim");
            else showToast("Gagal: " + (data.message || 'Token invalid'));
        } catch(e) {
            showToast("Error koneksi.");
        }
    };

    window.toggleFavorit = (title, slug, cover) => {
        let favorit = JSON.parse(localStorage.getItem('zenkai_favorit') || '[]');
        const index = favorit.findIndex(f => f.slug === slug);
        if (index > -1) {
            favorit.splice(index, 1);
            showToast('Dihapus dari Favorit');
        } else {
            favorit.push({ title, slug, cover, time: Date.now() });
            showToast('Ditambahkan ke Favorit');
        }
        localStorage.setItem('zenkai_favorit', JSON.stringify(favorit));
    };

    window.cekFavorit = (slug) => {
        const favorit = JSON.parse(localStorage.getItem('zenkai_favorit') || '[]');
        return favorit.some(f => f.slug === slug);
    };

    window.openTool = (tool) => {
        if (!modal || !modalContent) return;

        const currentDisabledTools = window.currentDisabledTools || [];
        if (currentDisabledTools.includes(tool)) {
            modal.classList.add('active');
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Sedang Perawatan</h3>
                <span class="desc-text">Fitur ini sedang dinonaktifkan sementara.</span>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration:none;">Pantau Info di WhatsApp</a>
            `;
            return;
        }

        const vipTools = window.currentVipTools || [];
        const isVip = localStorage.getItem('zenkai_vip') === 'true';
        const vipUntil = localStorage.getItem('zenkai_vip_until');
        const isVipValid = isVip && vipUntil && new Date(vipUntil) > new Date();

        if (vipTools.includes(tool) && !isVipValid) {
            modal.classList.add('active');
            modalContent.innerHTML = `
                ${closeSvg}
                <div style="text-align:center; padding: 20px 0;">
                    <h3 style="font-size: 22px; color: var(--accent); margin-bottom: 10px;">Akses VIP</h3>
                    <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 25px;">
                        Fitur ini hanya tersedia untuk pengguna VIP.
                    </p>
                    <button class="btn btn-primary" onclick="openTool('vip')">Lihat Paket VIP</button>
                </div>
            `;
            return;
        }

        modal.classList.add('active');

        if (COMING_SOON_TOOLS.includes(tool)) {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Segera Hadir</h3>
                <span class="desc-text">Fitur ini sedang dalam tahap pengembangan.</span>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration:none;">Pantau Info</a>
            `;
            return;
        }

        else if (tool === 'support') {
            modalContent.innerHTML = `
                ${closeSvg}
                <div style="padding: 10px 0;">
                    <h3 style="font-size: 22px; margin-bottom: 5px; text-align: center;">Dukung Server</h3>
                    <p style="font-size: 12px; color: var(--text-secondary); text-align: center; margin-bottom: 20px;">Bantu jaga biaya operasional API</p>

                    <div style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px; background: var(--bg-surface); padding: 16px; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                        <p style="margin-bottom: 12px;">
                            Web ini dibangun dari nol agar kamu bisa mengakses berbagai alat tanpa terganggu iklan pop-up.
                        </p>
                        <p style="margin-bottom: 0; color: var(--text-primary);">
                            Jika web ini bermanfaat, kamu bisa membantu biaya Server & API bulanan agar layanan ini tetap berjalan.
                        </p>
                    </div>

                    <a href="https://sociabuzz.com/zenkai72/tribe" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-decoration: none; display: flex; margin-bottom: 15px;">
                        Beri Dukungan
                    </a>
                </div>
            `;
        }
        else if (tool === 'vip') {
            const isVip = localStorage.getItem('zenkai_vip') === 'true';
            const vipUntil = localStorage.getItem('zenkai_vip_until');
            let daysLeft = 0;

            if (isVip && vipUntil) {
                const diff = new Date(vipUntil) - new Date();
                daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
                if (daysLeft <= 0) {
                    localStorage.removeItem('zenkai_vip');
                    localStorage.removeItem('zenkai_vip_until');
                }
            }

            const isVipFinal = localStorage.getItem('zenkai_vip') === 'true';

            modalContent.innerHTML = `
                ${closeSvg}
                <h3>${isVipFinal ? 'Status VIP' : 'Paket VIP'}</h3>

                ${isVipFinal ? `
                    <div style="background: var(--bg-surface); border: 1px solid var(--accent); padding: 20px; border-radius: var(--radius-md); text-align: center; margin-bottom: 20px;">
                        <h4 style="font-size: 20px; color: var(--accent); margin: 0;">VIP AKTIF</h4>
                        <p style="font-size: 14px; color: var(--text-primary); margin-top: 5px;">Sisa Waktu: ${daysLeft} Hari Lagi</p>
                    </div>
                    <p style="text-align:center; font-size:13px; color: var(--text-secondary); margin-bottom:20px;">Berakhir: ${new Date(vipUntil).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <button class="btn btn-ghost" onclick="localStorage.removeItem('zenkai_vip'); localStorage.removeItem('zenkai_vip_until'); closeModal(); showToast('Status VIP dicabut.');" style="color: var(--danger); border-color: var(--danger);">Logout VIP</button>
                ` : `
                    <div class="desc-text" style="text-align: left; margin-bottom: 15px;">
                        Buka akses tanpa batas ke semua fitur premium Zenkai Tools.
                    </div>

                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); padding: 16px; border-radius: var(--radius-sm); margin-bottom: 15px;">
                        <table style="width:100%; border-collapse: collapse; font-size: 14px;">
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <th style="text-align:left; padding-bottom:10px; color:var(--text-secondary); font-weight:normal;">Fitur</th>
                                <th style="text-align:center; padding-bottom:10px; color:var(--text-secondary); font-weight:normal;">Biasa</th>
                                <th style="text-align:center; padding-bottom:10px; color:var(--accent);">VIP</th>
                            </tr>
                            <tr>
                                <td style="padding:10px 0; border-bottom: 1px solid var(--border-color);">Akses Tools Dasar</td>
                                <td style="text-align:center; border-bottom: 1px solid var(--border-color);">Ya</td>
                                <td style="text-align:center; color:var(--accent); border-bottom: 1px solid var(--border-color);">Ya</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0; border-bottom: 1px solid var(--border-color);">Fitur Ekstra</td>
                                <td style="text-align:center; border-bottom: 1px solid var(--border-color); color:var(--text-muted);">-</td>
                                <td style="text-align:center; color:var(--accent); border-bottom: 1px solid var(--border-color);">Ya</td>
                            </tr>
                            <tr>
                                <td style="padding:10px 0;">Prioritas Server</td>
                                <td style="text-align:center; color:var(--text-muted);">-</td>
                                <td style="text-align:center; color:var(--accent);">Ya</td>
                            </tr>
                        </table>
                    </div>

                    <p style="font-size: 14px; font-weight: 700; margin-bottom: 10px;">Pilih Paket VIP:</p>
                    <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:15px;">
                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:14px; font-weight:500;">7 Hari</span>
                            <span style="font-size:15px; font-weight:700; color:var(--accent);">Rp 10.000</span>
                        </div>
                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:14px; font-weight:500;">20 Hari</span>
                            <span style="font-size:15px; font-weight:700; color:var(--accent);">Rp 15.000</span>
                        </div>
                        <div style="background:var(--bg-surface); border:1px solid var(--accent); padding:12px; border-radius:var(--radius-sm); display:flex; justify-content:space-between; align-items:center;">
                            <span style="font-size:14px; font-weight:500;">30 Hari (Paling Laris)</span>
                            <span style="font-size:15px; font-weight:700; color:var(--accent);">Rp 20.000</span>
                        </div>
                    </div>

                    <a href="https://sociabuzz.com/zenkai72/tribe" target="_blank" class="btn btn-primary" style="text-decoration: none; margin-bottom:15px;">Bayar via Sociabuzz</a>

                    <p style="font-size: 13px; text-align: center; margin-bottom: 15px; color: var(--text-secondary);">
                        Setelah bayar, kirim bukti ke WhatsApp Admin:<br>
                        <a href="https://wa.me/6285352831643" target="_blank" style="color:var(--accent); font-weight:bold; text-decoration:none;">085352831643</a><br>
                        untuk dapet kode VIP.
                    </p>

                    <input type="text" id="vip-code-input" placeholder="Masukkan Kode VIP (ZENKAI-XXXX)" style="text-align:center; text-transform:uppercase;">
                    <button class="btn btn-primary" onclick="aktivasiVip()">Tukar Kode</button>
                    <div id="vip-activation-res" style="margin-top: 15px;"></div>
                `}
            `;

            window.aktivasiVip = async () => {
                const code = document.getElementById('vip-code-input').value.trim().toUpperCase();
                if (!code) return showToast('Masukkan kode dulu!');

                const btn = document.querySelector('#modal-content button[onclick="aktivasiVip()"]');
                const resBox = document.getElementById('vip-activation-res');
                setBtnLoading(btn, true, 'Memverifikasi...');

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-vip`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'activate', code: code })
                    });
                    const data = await res.json();

                    if (!data.status) {
                        setBtnLoading(btn, false, 'Tukar Kode');
                        return resBox.innerHTML = `<p class="error-msg" style="font-size:13px;">Gagal: ${escapeHTML(data.message)}</p>`;
                    }

                    localStorage.setItem('zenkai_vip', 'true');
                    localStorage.setItem('zenkai_vip_until', data.expiry);
                    localStorage.removeItem('zenkai_gemini_vip_usage');

                    closeModal();
                    showToast('VIP Aktif.');
                } catch (e) {
                    setBtnLoading(btn, false, 'Tukar Kode');
                    resBox.innerHTML = `<p class="error-msg" style="font-size:13px;">Error: ${escapeHTML(e.message)}</p>`;
                }
            };
        }
        else if (tool === 'ai-chat') {
            const limit = window.geminiLimit || 1;

            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Gemini Plus</h3>
                <span class="desc-text">Limit Harian Email: <b>${limit}x</b></span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    <b style="color:var(--text-primary);">Tutorial:</b><br>
                    1. Masukkan Email Google aktif.<br>
                    2. Klik Kirim Kode OTP.<br>
                    3. Cek Inbox/Spam email, salin 6 digit OTP.<br>
                    4. Masukkan OTP, lalu klik Klaim.<br>
                    5. Link Offer 12 Bulan akan muncul.
                </div>

                <div id="step-email">
                    <input type="email" id="gemini-email" placeholder="Masukkan email Google aktif...">
                    <button class="btn btn-primary" id="btn-send-otp">Kirim Kode OTP</button>
                </div>

                <div id="step-otp" style="display:none;">
                    <p style="font-size:13px; text-align:center; color:var(--text-secondary); margin-bottom:15px;">Cek Inbox/Spam email. Masukkan 6 digit kode OTP.</p>
                    <input type="text" id="gemini-otp" placeholder="Masukkan 6 digit OTP..." maxlength="6" inputmode="numeric" style="text-align:center; letter-spacing:5px; font-size:20px;">
                    <button class="btn btn-primary" id="btn-claim-otp">Klaim Akses</button>
                </div>

                <div id="gemini-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const emailInput = document.getElementById('gemini-email');
            const otpInput = document.getElementById('gemini-otp');
            const stepEmail = document.getElementById('step-email');
            const stepOtp = document.getElementById('step-otp');
            const resBox = document.getElementById('gemini-res');
            const btnSend = document.getElementById('btn-send-otp');
            const btnClaim = document.getElementById('btn-claim-otp');

            btnSend.onclick = async () => {
                const email = emailInput.value.trim();
                if (!email) return showToast('Masukkan email dulu!');

                setBtnLoading(btnSend, true, 'Mengirim OTP...');
                resBox.style.display = 'block';
                resBox.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-gemini`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'send', email: email })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Gagal mengirim OTP');

                    stepEmail.style.display = 'none';
                    stepOtp.style.display = 'block';
                    resBox.innerHTML = `<p class="success-msg" style="font-size:14px;">OTP Terkirim!<br><span style="font-weight:normal;">Cek Inbox/Spam email <b>${escapeHTML(email)}</b>.</span></p>`;
                    showToast('Kode OTP Terkirim');
                } catch (e) {
                    resBox.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btnSend, false, 'Kirim Kode OTP');
            };

            btnClaim.onclick = async () => {
                const email = emailInput.value.trim();
                const otp = otpInput.value.trim();
                if (!otp || otp.length < 6) return showToast('Masukkan 6 digit OTP!');

                setBtnLoading(btnClaim, true, 'Memverifikasi...');
                resBox.style.display = 'block';
                resBox.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-gemini`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'claim', email: email, otp: otp })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Gagal klaim');

                    const offerLink = data.result?.offerLink || '#';
                    const guideText = data.result?.guide || 'Buka link offer di browser dengan login akun Google target.';

                    stepOtp.style.display = 'none';
                    resBox.innerHTML = `
                        <div style="text-align:left;">
                            <p class="success-msg" style="font-size:14px; margin-bottom:15px;">Berhasil Diklaim</p>

                            <p style="font-size:13px; margin-bottom:5px; font-weight:bold;">Panduan:</p>
                            <p style="font-size:13px; color:var(--text-secondary); margin-bottom:15px;">${escapeHTML(guideText)}</p>

                            <a href="${escapeHTML(offerLink)}" target="_blank" class="btn btn-primary" style="text-decoration:none;">
                                Buka Link Offer
                            </a>
                        </div>
                    `;
                    showToast('Akses Gemini Plus Berhasil');
                } catch (e) {
                    resBox.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btnClaim, false, 'Klaim Akses');
            };
        }
        else if (tool === 'spamotp') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Spam OTP</h3>
                <span class="desc-text">Fitur uji coba pengiriman OTP.</span>
                <input type="text" id="spam-nomor" placeholder="Masukkan Nomor Target..." inputmode="numeric">
                <button class="btn btn-primary" id="btn-spam">Proses</button>
                <div id="spam-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-spam');
            btn.onclick = async () => {
                const nomor = document.getElementById('spam-nomor').value.trim();
                const box = document.getElementById('spam-res');
                if (!nomor) return showToast('Masukkan nomor dulu!');

                setBtnLoading(btn, true, 'Memproses...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-spam`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nomor: nomor })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Gagal');

                    const r = data.result;
                    let html = `<div style="text-align:left; font-size:14px;">`;
                    html += `<p style="color:var(--success); font-weight:bold; margin-bottom:10px;">Selesai dalam ${r.time_elapsed_seconds}s</p>`;
                    html += `<p>Target: <b>${escapeHTML(r.target)}</b></p>`;
                    html += `<p>Berhasil: <b style="color:var(--success);">${r.success}</b> | Gagal: <b style="color:var(--danger);">${r.failed}</b></p>`;

                    if (r.delivered_list.length > 0) {
                        html += `<p style="margin-top:10px; font-weight:bold; color:var(--success);">OTP MASUK:</p>`;
                        r.delivered_list.forEach(item => {
                            html += `<div style="background:var(--bg-base); padding:8px; margin-top:4px; border-radius:4px; border:1px solid var(--border-color);">${escapeHTML(item)}</div>`;
                        });
                    }
                    html += `</div>`;
                    box.innerHTML = html;
                    showToast('Proses Selesai');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Proses');
            };
        }
        else if (tool === 'wa-bot') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>WA Automator</h3>
                <span class="desc-text">Otomatisasi Reaksi & Polling Channel WhatsApp.</span>

                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button id="tab-react" onclick="switchWaTab('react')" class="btn btn-primary" style="flex:1; margin:0; padding:10px; font-size:14px;">Auto React</button>
                    <button id="tab-vote" onclick="switchWaTab('vote')" class="btn btn-ghost" style="flex:1; margin:0; padding:10px; font-size:14px;">Auto Vote</button>
                </div>

                <div id="area-react">
                    <input type="text" id="wa-url-react" placeholder="Paste link postingan WA...">
                    <input type="text" id="wa-reaction" placeholder="Emoji (cth: 🔥,❤️,😲)" value="🔥">
                    <button class="btn btn-primary" id="btn-wa-react">Kirim Reaksi</button>
                </div>

                <div id="area-vote" style="display:none;">
                    <input type="text" id="wa-url-vote" placeholder="Paste link polling WA...">
                    <input type="text" id="wa-pesan" placeholder="Teks opsi (cth: Setuju, Iya)">
                    <button class="btn btn-primary" id="btn-wa-vote">Kirim Vote</button>
                </div>

                <div id="wa-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            window.switchWaTab = (tab) => {
                const btnR = document.getElementById('tab-react');
                const btnV = document.getElementById('tab-vote');
                const areaR = document.getElementById('area-react');
                const areaV = document.getElementById('area-vote');

                if (tab === 'react') {
                    btnR.className = 'btn btn-primary'; btnR.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnV.className = 'btn btn-ghost'; btnV.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    areaR.style.display = 'block'; areaV.style.display = 'none';
                } else {
                    btnV.className = 'btn btn-primary'; btnV.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnR.className = 'btn btn-ghost'; btnR.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    areaR.style.display = 'none'; areaV.style.display = 'block';
                }
            };

            const btnReact = document.getElementById('btn-wa-react');
            const btnVote = document.getElementById('btn-wa-vote');
            const resBox = document.getElementById('wa-res');

            btnReact.onclick = async () => {
                const url = document.getElementById('wa-url-react').value.trim();
                const reaction = document.getElementById('wa-reaction').value.trim();
                if (!url) return showToast('Masukkan link dulu!');

                setBtnLoading(btnReact, true, 'Mengirim...');
                resBox.style.display = 'block';
                resBox.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-whatsapp`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'react', url: url, reaction: reaction })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.result) {
                        throw new Error(data.message || 'Gagal mengirim reaksi');
                    }

                    const r = data.result;
                    resBox.innerHTML = `
                        <div style="text-align:left; font-size:14px;">
                            <p style="color:var(--success); font-weight:bold; margin-bottom:5px;">Reaksi Terkirim</p>
                            <p>Target: <a href="${escapeHTML(r.target)}" target="_blank" style="color:var(--accent); word-break:break-all;">${escapeHTML(r.target)}</a></p>
                            <p>Emoji: <b>${escapeHTML(r.reaction)}</b></p>
                        </div>
                    `;
                    showToast('Reaksi Berhasil');
                } catch (e) {
                    resBox.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btnReact, false, 'Kirim Reaksi');
            };

            btnVote.onclick = async () => {
                const url = document.getElementById('wa-url-vote').value.trim();
                const pesan = document.getElementById('wa-pesan').value.trim();
                if (!url) return showToast('Masukkan link polling dulu!');
                if (!pesan) return showToast('Masukkan teks opsi polling!');

                setBtnLoading(btnVote, true, 'Mengirim...');
                resBox.style.display = 'block';
                resBox.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-whatsapp`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'votech', url: url, pesan: pesan })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.result) {
                        throw new Error(data.message || 'Gagal mengirim vote');
                    }

                    const r = data.result;
                    resBox.innerHTML = `
                        <div style="text-align:left; font-size:14px;">
                            <p style="color:var(--success); font-weight:bold; margin-bottom:5px;">Vote Terkirim</p>
                            <p>Opsi: <b>${escapeHTML(r.pesan)}</b></p>
                            <hr style="border:none; border-top:1px solid var(--border-color); margin:8px 0;">
                            <p>Sukses: <b style="color:var(--success);">${r.success}</b> | Gagal: <b style="color:var(--danger);">${r.failed}</b></p>
                        </div>
                    `;
                    showToast('Vote Berhasil');
                } catch (e) {
                    resBox.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btnVote, false, 'Kirim Vote');
            };
        }
        else if (tool === 'netflix') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Netflix Generator</h3>
                <span class="desc-text">Dapatkan akses akun Netflix Premium secara instan.</span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    <b style="color:var(--text-primary);">Panduan:</b><br>
                    1. Klik Generate Akun di bawah.<br>
                    2. Pilih salah satu Link Auto-Login.<br>
                    3. Jika diminta verifikasi email, gunakan mode Incognito.<br>
                    4. Jika gagal, coba opsi Buka di Desktop.<br>
                    5. Nikmati filmnya.
                </div>

                <button class="btn btn-primary" id="btn-nf">Generate Akun</button>

                <div id="nf-res" style="display:none; margin-top:15px; text-align:left; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-nf');
            const box = document.getElementById('nf-res');

            btn.onclick = async () => {
                setBtnLoading(btn, true, 'Mencari Akun...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-netflix`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' }
                    });
                    const data = await res.json();

                    if (data.status === false || !data.data) {
                        throw new Error(data.message || 'Kuota habis atau API down.');
                    }

                    const d = data.data;
                    const details = d.details;

                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:15px;">
                            <h3 style="font-size:20px; margin:0;">Netflix Premium</h3>
                            <p style="font-size:13px; color:var(--text-secondary);">Expired: <b>${escapeHTML(d.expires)}</b></p>
                        </div>

                        <div style="background:var(--bg-base); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm); margin-bottom:15px; font-size:14px; line-height:1.6;">
                            <b>Email:</b> ${escapeHTML(details.Email)}<br>
                            <b>Plan:</b> ${escapeHTML(details.Plan)}<br>
                            <b>Negara:</b> ${escapeHTML(details.Country)}<br>
                            <b>Profile:</b> ${escapeHTML(details.Profile)}
                        </div>

                        <p style="font-size:14px; font-weight:bold; margin-bottom:8px;">Pilih Link Auto-Login:</p>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                            <a href="${escapeHTML(d.links.desktop)}" target="_blank" class="btn btn-ghost" style="text-decoration:none; margin-bottom:0;">Buka di Desktop</a>
                            <a href="${escapeHTML(d.links.mobile)}" target="_blank" class="btn btn-ghost" style="text-decoration:none; margin-bottom:0;">Buka di HP</a>
                            <a href="${escapeHTML(d.links.tv)}" target="_blank" class="btn btn-ghost" style="text-decoration:none; margin-bottom:0;">Buka di Smart TV</a>
                        </div>

                        <button class="btn btn-ghost" id="btn-copy-nf-raw" style="margin-top:15px; margin-bottom:0;">Salin Link Utama</button>
                    `;
                    const copyBtn = document.getElementById('btn-copy-nf-raw');
                    if (copyBtn) copyBtn.addEventListener('click', () => window.copyToClipboard(d.raw_url));
                    showToast('Akun Berhasil Digenerate');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Generate Akun');
            };
        }
        else if (tool === 'webbuilder') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>WebBuilder</h3>
                <span class="desc-text">Generate Source Code Website (Portfolio / Downloader)</span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    1. Pilih Tipe Website.<br>
                    2. Pilih Tema.<br>
                    3. Klik Generate, lalu download ZIP.
                </div>

                <div class="custom-select-wrapper">
                    <div class="custom-select" id="custom-wb-type" onclick="toggleCustomSelect('custom-wb-type')">
                        <div class="custom-select-trigger">
                            <span>Portfolio</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    <div class="custom-options">
                        <div class="custom-option active" data-value="portfolio" onclick="selectCustomOption('custom-wb-type', 'portfolio', 'Portfolio')">Portfolio</div>
                        <div class="custom-option" data-value="downloader" onclick="selectCustomOption('custom-wb-type', 'downloader', 'Downloader')">Downloader</div>
                    </div>
                </div>

                <div class="custom-select-wrapper">
                    <div class="custom-select" id="custom-wb-theme" onclick="toggleCustomSelect('custom-wb-theme')">
                        <div class="custom-select-trigger">
                            <span>Tema 1 - Midnight</span>
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>
                    <div class="custom-options">
                        <div class="custom-option active" data-value="1" onclick="selectCustomOption('custom-wb-theme', '1', 'Tema 1 - Midnight')">Tema 1 - Midnight</div>
                        <div class="custom-option" data-value="2" onclick="selectCustomOption('custom-wb-theme', '2', 'Tema 2 - Neon')">Tema 2 - Neon</div>
                        <div class="custom-option" data-value="3" onclick="selectCustomOption('custom-wb-theme', '3', 'Tema 3 - Minimalist')">Tema 3 - Minimalist</div>
                    </div>
                </div>

                <button class="btn btn-primary" id="btn-wb">Generate</button>
                <div id="wb-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            window.toggleCustomSelect = (id) => {
                const el = document.getElementById(id);
                const opts = el.nextElementSibling;
                const isActive = opts.style.display === 'block';
                document.querySelectorAll('.custom-options').forEach(o => o.style.display = 'none');
                if (!isActive) opts.style.display = 'block';
            };

            window.selectCustomOption = (id, value, label) => {
                const el = document.getElementById(id);
                el.querySelector('.custom-select-trigger span').innerText = label;
                el.dataset.value = value;
                el.nextElementSibling.style.display = 'none';
            };

            if (!window.__wbOutsideClickBound) {
                window.__wbOutsideClickBound = true;
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.custom-select-wrapper')) {
                        document.querySelectorAll('.custom-options').forEach(o => o.style.display = 'none');
                    }
                });
            }

            const btn = document.getElementById('btn-wb');
            btn.onclick = async () => {
                const type = document.getElementById('custom-wb-type').dataset.value || 'portfolio';
                const theme = document.getElementById('custom-wb-theme').dataset.value || '1';
                const box = document.getElementById('wb-res');

                setBtnLoading(btn, true, 'Membangun...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-webbuilder`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ type: type, theme: theme })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.result) throw new Error(data.message || 'Gagal generate');

                    const r = data.result;
                    box.innerHTML = `
                        <div style="text-align:left; font-size:14px;">
                            <p style="color:var(--success); font-weight:bold; margin-bottom:10px;">Website Berhasil Dibuat</p>
                            <p>Tipe: <b>${escapeHTML(r.type)}</b></p>
                            <p>Total File: ${r.total_files}</p>
                            <p style="font-size:12px; color:var(--text-secondary); margin-top:5px;">${escapeHTML(r.note)}</p>
                        </div>
                        <a href="${escapeHTML(r.download_url)}" target="_blank" class="btn btn-primary" style="text-decoration:none; margin-top:10px; margin-bottom:0;">Download Source (ZIP)</a>
                    `;
                    showToast('Website Berhasil Digenerate');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Generate');
            };
        }
        else if (tool === 'cfsource') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>CF-Source Scraper</h3>
                <span class="desc-text">Bypass Cloudflare & ambil Source Code HTML.</span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--danger); line-height:1.6; color:var(--text-secondary);">
                    <b style="color:var(--danger);">Peringatan:</b><br>
                    Tool ini hanya untuk riset keamanan & edukasi. Dilarang menggunakan untuk mencuri data atau meretas situs!
                </div>

                <input type="text" id="cf-url" placeholder="Masukkan URL Website (cth: https://example.com)">
                <button class="btn btn-primary" id="btn-cf">Scrape</button>

                <div id="cf-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-cf');
            btn.onclick = async () => {
                const url = document.getElementById('cf-url').value.trim();
                const box = document.getElementById('cf-res');
                if (!url) return showToast('Masukkan URL dulu!');

                setBtnLoading(btn, true, 'Scraping...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-cfsource`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.data) throw new Error(data.message || 'Gagal Scrape');

                    const htmlCode = data.data.html;

                    box.innerHTML = `
                        <p style="color:var(--success); font-weight:bold; margin-bottom:10px; font-size:14px;">Berhasil Scrape</p>
                        <textarea id="cf-code" readonly style="width:100%; height:200px; background:var(--bg-base); color:var(--text-primary); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:10px; font-family:monospace; font-size:12px; resize:vertical; outline:none; margin-bottom:10px;">${escapeHTML(htmlCode)}</textarea>
                        <div style="display:flex; gap:10px;">
                            <button class="btn btn-primary" id="btn-copy-cf" style="flex:1; margin:0;">Copy Code</button>
                            <a id="dl-html" class="btn btn-ghost" style="flex:1; margin:0; text-decoration:none;">Save HTML</a>
                        </div>
                    `;

                    document.getElementById('btn-copy-cf').addEventListener('click', () => {
                        const codeEl = document.getElementById('cf-code');
                        window.copyToClipboard(codeEl.value);
                    });

                    const blob = new Blob([htmlCode], { type: 'text/html' });
                    const urlBlob = URL.createObjectURL(blob);
                    document.getElementById('dl-html').href = urlBlob;
                    document.getElementById('dl-html').download = `scraped-${Date.now()}.html`;

                    showToast('Scrape Berhasil');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Scrape');
            };
        }
        else if (tool === 'fakedana') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Fake Saldo DANA</h3>
                <span class="desc-text">Bikin gambar SS saldo DANA buat prank temen lu!</span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    1. Masukkan nominal (tanpa titik/koma, misal: 1000000).<br>
                    2. Klik Generate.<br>
                    3. Tekan & tahan gambar untuk menyimpan.<br>
                    <i>*Hanya untuk hiburan/prank.</i>
                </div>

                <input type="number" id="dana-nominal" placeholder="Masukkan Nominal (cth: 1000000)" inputmode="numeric">
                <button class="btn btn-primary" id="btn-dana">Generate</button>

                <div id="dana-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-dana');
            btn.onclick = async () => {
                const nominal = document.getElementById('dana-nominal').value.trim();
                const box = document.getElementById('dana-res');
                if (!nominal) return showToast('Masukkan nominal!');

                setBtnLoading(btn, true, 'Memproses...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-dana`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nominal: nominal })
                    });

                    if (!res.ok) throw new Error('Gagal memproses gambar');

                    const contentType = res.headers.get('content-type') || '';
                    if (!contentType.includes('image/')) {
                        let errMsg = 'Gagal memproses gambar';
                        try { const j = await res.json(); errMsg = j.message || errMsg; } catch {}
                        throw new Error(errMsg);
                    }

                    const blob = await res.blob();
                    const imgUrl = URL.createObjectURL(blob);

                    box.innerHTML = `
                        <p style="color:var(--success); font-weight:bold; margin-bottom:10px; font-size:14px;">Berhasil Dibuat</p>
                        <img src="${imgUrl}" style="width:100%; max-width:300px; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:10px;">
                        <a href="${imgUrl}" download="fake-dana-${nominal}.png" class="btn btn-primary" style="text-decoration:none; margin-bottom:0;">Download Gambar</a>
                    `;
                    showToast('Gambar Berhasil Dibuat');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Generate');
            };
        }
        else if (tool === 'cinema') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Zenkai Cinema</h3>
                <span class="desc-text">Nonton Drama China (Dracinema) Sub Indo</span>

                <div style="display:flex; gap:8px; margin-bottom:15px;">
                    <button id="tab-cinema-home" onclick="switchCinemaTab('home')" class="btn btn-primary" style="flex:1; margin:0; padding:10px; font-size:14px;">Home</button>
                    <button id="tab-cinema-search" onclick="switchCinemaTab('search')" class="btn btn-ghost" style="flex:1; margin:0; padding:10px; font-size:14px;">Cari</button>
                </div>

                <div id="area-cinema-home">
                    <div id="cinema-res" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;"></div>
                </div>

                <div id="area-cinema-search" style="display:none;">
                    <input type="text" id="cinema-q" placeholder="Cari judul drama china...">
                    <button class="btn btn-primary" id="btn-cinema-search">Cari Drama</button>
                    <div id="cinema-search-res" style="display:flex; flex-wrap:wrap; gap:10px; justify-content:center;"></div>
                </div>
            `;

            window.switchCinemaTab = (tab) => {
                const btnH = document.getElementById('tab-cinema-home');
                const btnS = document.getElementById('tab-cinema-search');
                const areaH = document.getElementById('area-cinema-home');
                const areaS = document.getElementById('area-cinema-search');

                if (tab === 'home') {
                    btnH.className = 'btn btn-primary'; btnH.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnS.className = 'btn btn-ghost'; btnS.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    areaH.style.display = 'block'; areaS.style.display = 'none';
                } else {
                    btnS.className = 'btn btn-primary'; btnS.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnH.className = 'btn btn-ghost'; btnH.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    areaH.style.display = 'none'; areaS.style.display = 'block';
                }
            };

            const renderCinemaCards = (arr, containerId) => {
                const el = document.getElementById(containerId);
                if (!el) return;
                if (arr.length === 0) {
                    el.innerHTML = `<p style="width:100%; text-align:center; color:var(--text-secondary); font-size:14px;">Tidak ada drama ditemukan.</p>`;
                    return;
                }
                let html = '';
                arr.forEach((d, idx) => {
                    html += `
                        <div data-cinema-idx="${idx}" data-slug="${escapeHTML(d.slug)}" data-title="${escapeHTML(d.title || d.name)}" data-cover="${escapeHTML(d.cover || '')}" class="cinema-card" style="width: calc(33.33% - 7px); cursor:pointer; display:flex; flex-direction:column; gap:5px;">
                            <div style="position:relative; width:100%; aspect-ratio:3/4; border-radius:var(--radius-sm); overflow:hidden; border:1px solid var(--border-color); background:var(--bg-surface);">
                                ${d.cover ? `<img src="${escapeHTML(d.cover)}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">` : ''}
                            </div>
                            <h4 style="font-size:12px; font-weight:500; line-height:1.3; margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${escapeHTML(d.title || d.name)}</h4>
                        </div>
                    `;
                });
                el.innerHTML = html;

                el.querySelectorAll('.cinema-card').forEach(card => {
                    card.addEventListener('click', () => {
                        window.bukaDetailCinema(card.dataset.slug, card.dataset.title, card.dataset.cover);
                    });
                });
            };

            const loadCinemaHome = async () => {
                const box = document.getElementById('cinema-res');
                box.innerHTML = '<div class="loader" style="width:100%;"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-cinema`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'home' })
                    });
                    const data = await res.json();
                    if (!data.status || !data.result) throw new Error('Gagal memuat');
                    renderCinemaCards(data.result.movies || data.result.dramas || [], 'cinema-res');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg" style="width:100%;">Gagal: ${escapeHTML(e.message)}</p>`;
                }
            };

            window.bukaDetailCinema = async (slug, title, cover) => {
                const box = document.getElementById('cinema-res');
                const searchBox = document.getElementById('cinema-search-res');

                if (box) box.innerHTML = '<div class="loader"></div>';
                if (searchBox) searchBox.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-cinema`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'detail', url: slug })
                    });
                    const data = await res.json();
                    if (!data.status || !data.result) throw new Error('Gagal ambil detail');

                    const d = data.result;
                    const synopsis = d.synopsis || 'Tidak ada sinopsis.';
                    const episodes = d.episodes || [];

                    let html = `
                        <div style="display:flex; gap:15px; margin-bottom:20px; text-align:left;">
                            ${cover ? `<img src="${escapeHTML(cover)}" style="width:100px; height:140px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--border-color);">` : ''}
                            <div style="flex:1;">
                                <h4 style="font-size:16px; font-weight:700; margin:0 0 5px 0; line-height:1.2;">${escapeHTML(title)}</h4>
                                <p style="font-size:13px; line-height:1.5; color:var(--text-secondary); max-height:100px; overflow-y:auto; margin:0;">${escapeHTML(synopsis)}</p>
                            </div>
                        </div>
                        <h4 style="text-align:left; font-size:14px; font-weight:700; margin-bottom:10px; border-bottom:1px solid var(--border-color); padding-bottom:8px;">Daftar Episode (${episodes.length})</h4>
                        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px;" class="cinema-episode-list">
                    `;

                    if (episodes.length === 0) {
                        html += `<p style="grid-column:1/-1; font-size:13px; color:var(--text-secondary);">Belum ada episode.</p>`;
                    } else {
                        episodes.forEach(ep => {
                            html += `
                                <div data-ep-url="${escapeHTML(ep.url)}" data-ep-title="${escapeHTML(title)} - ${escapeHTML(ep.title)}" class="cinema-episode" style="background:var(--bg-surface); border:1px solid var(--border-color); padding:8px; border-radius:4px; text-align:center; cursor:pointer; font-size:13px; font-weight:500; transition:background 150ms;">
                                    ${ep.number}
                                </div>
                            `;
                        });
                    }
                    html += `</div>`;

                    const activeBox = (searchBox && searchBox.style.display !== 'none') ? searchBox : box;
                    if (activeBox) activeBox.innerHTML = html;

                    activeBox.querySelectorAll('.cinema-episode').forEach(el => {
                        el.addEventListener('click', () => window.tontonCinema(el.dataset.epUrl, el.dataset.epTitle));
                    });

                } catch(e) {
                    const msg = `<p class="error-msg" style="width:100%;">Gagal: ${escapeHTML(e.message)}</p>`;
                    if (box && box.style.display !== 'none') box.innerHTML = msg;
                    if (searchBox && searchBox.style.display !== 'none') searchBox.innerHTML = msg;
                }
            };

            window.tontonCinema = async (url, title) => {
                const box = document.getElementById('cinema-res');
                const searchBox = document.getElementById('cinema-search-res');
                const activeBox = (searchBox && searchBox.style.display !== 'none') ? searchBox : box;

                activeBox.innerHTML = '<div class="loader"></div><p style="font-size:13px; text-align:center; color:var(--text-secondary); margin-top:10px;">Menyiapkan video...</p>';
                try {
                    const fullUrl = url.startsWith('http') ? url : `https://dracinema.com${url}`;

                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-cinema`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'stream', url: fullUrl })
                    });
                    const data = await res.json();

                    let videoHtml = '';
                    if (data.status && data.result && data.result.videoSources && data.result.videoSources.length > 0) {
                        const vidUrl = data.result.videoSources[0].url || data.result.videoSources[0];
                        videoHtml = `<video src="${escapeHTML(vidUrl)}" controls autoplay style="width:100%; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:10px;"></video>`;
                    } else {
                        videoHtml = `
                            <div style="background:var(--bg-surface); border:1px solid var(--danger); padding:15px; border-radius:var(--radius-sm); text-align:center;">
                                <p style="font-size:14px; margin-bottom:15px; color:var(--text-primary);">Server tidak menyediakan link video langsung.</p>
                                <a href="${escapeHTML(fullUrl)}" target="_blank" class="btn btn-primary" style="text-decoration:none; margin-bottom:0;">Tonton di Web Asli</a>
                            </div>
                        `;
                    }

                    activeBox.innerHTML = `
                        <button id="btn-cinema-back" class="btn btn-ghost" style="font-size:13px; padding:8px; margin-bottom:15px;">Kembali</button>
                        <h4 style="font-size:15px; font-weight:700; margin-bottom:10px; text-align:center;">${escapeHTML(title)}</h4>
                        ${videoHtml}
                    `;
                    const backBtn = document.getElementById('btn-cinema-back');
                    if (backBtn) backBtn.addEventListener('click', () => window.openTool('cinema'));
                } catch(e) {
                    activeBox.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
            };

            const btnSearch = document.getElementById('btn-cinema-search');
            const inputSearch = document.getElementById('cinema-q');

            btnSearch.onclick = async () => {
                const q = inputSearch.value.trim();
                if (!q) return showToast('Masukkan judul!');
                const box = document.getElementById('cinema-search-res');
                box.innerHTML = '<div class="loader" style="width:100%;"></div>';
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-cinema`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'search', query: q })
                    });
                    const data = await res.json();
                    if (!data.status || !data.result) throw new Error('Gagal mencari');
                    renderCinemaCards(data.result || [], 'cinema-search-res');
                } catch(e) {
                    box.innerHTML = `<p class="error-msg" style="width:100%;">Gagal: ${escapeHTML(e.message)}</p>`;
                }
            };

            loadCinemaHome();
        }
        else if (tool === 'vidgen') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>AI Video Generator</h3>
                <span class="desc-text">Buat video dari teks (Text-to-Video AI)</span>

                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    Gunakan Bahasa Inggris untuk hasil yang lebih baik.<br>
                    Rasio 9:16 untuk TikTok/Reels, 16:9 untuk YouTube.
                </div>

                <textarea id="vid-prompt" placeholder="Contoh: A futuristic city with flying cars at night, cinematic..." rows="3"></textarea>

                <select id="vid-ratio" style="width:100%; padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background:var(--bg-base); color:var(--text-primary); margin-bottom:15px; font-family:var(--font-body); font-size:14px; outline:none;">
                    <option value="9:16">9:16 (TikTok/Reels)</option>
                    <option value="16:9">16:9 (YouTube)</option>
                    <option value="1:1">1:1 (Feed IG)</option>
                </select>

                <button class="btn btn-primary" id="btn-vidgen">Generate Video</button>

                <div id="vid-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-vidgen');
            btn.onclick = async () => {
                const prompt = document.getElementById('vid-prompt').value.trim();
                const ratio = document.getElementById('vid-ratio').value;
                const box = document.getElementById('vid-res');
                if (!prompt) return showToast('Masukkan prompt dulu!');

                setBtnLoading(btn, true, 'Membuat Video...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-vidgen`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: prompt, ratio: ratio })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.data || !data.data.url) {
                        throw new Error(data.message || 'Gagal generate video.');
                    }

                    const vidUrl = data.data.url;
                    box.innerHTML = `
                        <p style="color:var(--success); font-weight:bold; margin-bottom:10px; font-size:14px;">Video Berhasil Dibuat</p>
                        <video src="${escapeHTML(vidUrl)}" controls style="width:100%; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:10px;"></video>
                        <a href="${escapeHTML(vidUrl)}" target="_blank" class="btn btn-primary" style="text-decoration:none; margin-bottom:0;">Download Video</a>
                    `;
                    showToast('Video Berhasil Digenerate');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Generate Video');
            };
        }
        else if (tool === 'terabox') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Terabox Downloader</h3>
                <span class="desc-text">Download file dari Terabox tanpa install aplikasi</span>

                <input type="text" id="terabox-url" placeholder="Paste link Terabox...">
                <button class="btn btn-primary" id="btn-terabox">Ambil File</button>

                <div id="terabox-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-terabox');
            btn.onclick = async () => {
                const url = document.getElementById('terabox-url').value.trim();
                const box = document.getElementById('terabox-res');
                if (!url) return showToast('Masukkan link Terabox!');

                setBtnLoading(btn, true, 'Memproses...');
                box.style.display = 'block';

                let timerCount = 0;
                box.innerHTML = `
                    <div class="loader"></div>
                    <p id="tb-status" style="font-size:13px; color:var(--accent); font-weight:bold; margin-top:10px;">Menghubungkan ke server...</p>
                    <p style="font-size:12px; color:var(--text-secondary); margin-top:5px;">(Waktu tunggu: <span id="tb-timer">0</span>s)</p>
                `;

                const timerInterval = setInterval(() => {
                    timerCount++;
                    const timerEl = document.getElementById('tb-timer');
                    const statusEl = document.getElementById('tb-status');
                    if (timerEl) timerEl.innerText = timerCount;

                    if (timerCount === 5 && statusEl) statusEl.innerText = "Membaca link Terabox...";
                    if (timerCount === 15 && statusEl) statusEl.innerText = "Mengambil data dari server...";
                    if (timerCount === 30 && statusEl) statusEl.innerText = "Hampir selesai...";
                }, 1000);
                window.activeTimerInterval = timerInterval;

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-terabox`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url })
                    });
                    const data = await res.json();
                    clearInterval(timerInterval);
                    window.activeTimerInterval = null;

                    const files = data.data?.response || data.result?.response || [];
                    if (files.length === 0) throw new Error('File tidak ditemukan atau link invalid.');

                    let html = `<p style="color:var(--success); font-weight:bold; margin-bottom:10px; font-size:14px;">Ditemukan ${files.length} File</p>`;

                    files.forEach((f, i) => {
                        html += `
                            <div style="background:var(--bg-base); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm); margin-bottom:10px; text-align:left;">
                                <div style="display:flex; gap:10px; margin-bottom:10px;">
                                    <img src="${escapeHTML(f.thumbnail)}" style="width:60px; height:60px; border-radius:6px; object-fit:cover; border:1px solid var(--border-color);">
                                    <div style="flex:1; overflow:hidden;">
                                        <p style="font-size:13px; font-weight:bold; margin:0 0 4px 0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(f.file_name)}</p>
                                        <p style="font-size:12px; color:var(--text-secondary); margin:0;">Size: ${escapeHTML(f.file_size)}</p>
                                    </div>
                                </div>
                                <div style="display:flex; gap:8px;">
                                    ${f.fast_stream_url ? `<a href="${escapeHTML(f.fast_stream_url)}" target="_blank" class="btn btn-ghost" style="flex:1; font-size:13px; padding:8px; margin:0; text-decoration:none;">Stream</a>` : ''}
                                    <a href="${escapeHTML(f.download_url)}" target="_blank" class="btn btn-primary" style="flex:1; font-size:13px; padding:8px; margin:0; text-decoration:none;">Download</a>
                                </div>
                            </div>
                        `;
                    });

                    box.innerHTML = html;
                    showToast('File Berhasil Diambil');
                } catch (e) {
                    clearInterval(timerInterval);
                    window.activeTimerInterval = null;
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Ambil File');
            };
        }
        else if (tool === 'linkvertise') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Bypass Link</h3>
                <span class="desc-text">Tembus Shortlink (Linkvertise, Bicolink, SFL, dll)</span>

                <input type="text" id="bypass-url" placeholder="Paste link shortlink di sini...">
                <button class="btn btn-primary" id="btn-bypass">Bypass</button>

                <div id="bypass-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btn = document.getElementById('btn-bypass');
            btn.onclick = async () => {
                const url = document.getElementById('bypass-url').value.trim();
                const box = document.getElementById('bypass-res');
                if (!url) return showToast('Masukkan link dulu!');

                setBtnLoading(btn, true, 'Memproses...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-bypass`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.result) {
                        throw new Error(data.message || 'Gagal bypass. Link mungkin tidak didukung.');
                    }

                    const r = data.result;
                    box.innerHTML = `
                        <div style="text-align:left; font-size:14px;">
                            <p style="color:var(--success); font-weight:bold; margin-bottom:10px;">Berhasil di-Bypass</p>
                            <p style="color:var(--text-secondary); margin-bottom:5px;">Platform: <b>${escapeHTML(r.platform)}</b></p>

                            <div style="background:var(--bg-base); padding:12px; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:15px; margin-top:10px;">
                                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:2px;">Link Asli:</p>
                                <p style="word-break:break-all; font-size:13px; margin-bottom:10px;">${escapeHTML(r.original_url)}</p>

                                <p style="font-size:12px; color:var(--text-secondary); margin-bottom:2px;">Link Hasil Bypass:</p>
                                <p style="word-break:break-all; font-size:13px; color:var(--accent); font-weight:bold;">${escapeHTML(r.bypassed_url)}</p>
                            </div>
                        </div>

                        <a href="${escapeHTML(r.bypassed_url)}" target="_blank" class="btn btn-primary" style="text-decoration:none; margin-bottom:10px;">Buka Link</a>
                        <button class="btn btn-ghost" id="btn-copy-bypass" style="margin-bottom:0;">Salin Link</button>
                    `;
                    const copyBtn = document.getElementById('btn-copy-bypass');
                    if (copyBtn) copyBtn.addEventListener('click', () => window.copyToClipboard(r.bypassed_url));
                    showToast('Link Berhasil Di-bypass');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Bypass');
            };
        }
        else if (tool === 'artinama') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Arti Nama</h3>
                <span class="desc-text">Cari arti nama berdasarkan database Primbon Jawa.</span>
                <input type="text" id="nama-in" placeholder="Ketik nama...">
                <button class="btn btn-primary" id="btn-nama">Cari</button>
                <div id="nama-res" style="display:none; text-align:left; line-height:1.6; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); margin-top:15px; background:var(--bg-surface);"></div>
            `;
            const btn = document.getElementById('btn-nama');
            btn.onclick = async () => {
                const nama = document.getElementById('nama-in').value.trim();
                const box = document.getElementById('nama-res');
                if (!nama) return showToast('Masukkan nama!');

                setBtnLoading(btn, true, 'Mencari...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-artinama`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ nama: nama })
                    });
                    const data = await res.json();

                    if (data.status === false || !data.data) throw new Error(data.message || 'Nama tidak ditemukan');

                    box.innerHTML = `
                        <p style="font-weight:700; color:var(--accent); margin-bottom:10px; font-size:15px;">Nama: ${escapeHTML(data.data.nama)}</p>
                        <p style="font-size:14px; white-space:pre-wrap;">${escapeHTML(data.data.arti)}</p>
                        <hr style="border:none; border-top:1px solid var(--border-color); margin:15px 0;">
                        <p style="font-size:12px; color:var(--text-secondary); font-style:italic;">${escapeHTML(data.data.catatan)}</p>
                    `;
                    showToast('Arti nama ditemukan');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'youtube') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>YouTube Downloader</h3>
                <span class="desc-text">Download video atau audio dari YouTube.</span>

                <input type="text" id="yt-url" placeholder="Paste link YouTube...">

                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <button id="btn-type-mp3" onclick="pilihTipeYt('mp3')" class="btn btn-primary" style="flex:1; margin:0; padding:10px; font-size:14px;">MP3</button>
                    <button id="btn-type-mp4" onclick="pilihTipeYt('mp4')" class="btn btn-ghost" style="flex:1; margin:0; padding:10px; font-size:14px;">MP4</button>
                </div>

                <button class="btn btn-primary" id="btn-dl-yt">Proses</button>
                <div id="yt-result" style="margin-top:15px;"></div>
            `;

            let tipeTerpilih = 'mp3';
            window.pilihTipeYt = (tipe) => {
                tipeTerpilih = tipe;
                const btnMp3 = document.getElementById('btn-type-mp3');
                const btnMp4 = document.getElementById('btn-type-mp4');
                if (tipe === 'mp3') {
                    btnMp3.className = 'btn btn-primary'; btnMp3.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnMp4.className = 'btn btn-ghost'; btnMp4.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                } else {
                    btnMp4.className = 'btn btn-primary'; btnMp4.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
                    btnMp3.className = 'btn btn-ghost'; btnMp3.style.cssText = 'flex:1; margin:0; padding:10px; font-size:14px;';
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
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-ytv2`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ url: url, format: tipeTerpilih })
                    });

                    const data = await res.json();
                    if (data.status === false || !data.result) throw new Error(data.message || 'Gagal download');

                    const r = data.result;

                    if (tipeTerpilih === 'mp3') {
                        box.innerHTML = `
                            <img src="${escapeHTML(r.thumbnail)}" style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);">
                            <b style="font-size:14px;">${escapeHTML(r.title)}</b><br>
                            <audio src="${escapeHTML(r.download)}" controls style="width:100%; margin-top:10px;"></audio>
                            <a href="${escapeHTML(r.download)}" target="_blank" class="btn btn-primary" style="margin-top:10px; text-decoration:none;">Simpan MP3</a>
                        `;
                    } else {
                        box.innerHTML = `
                            <video src="${escapeHTML(r.download)}" controls style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);"></video>
                            <b style="font-size:14px;">${escapeHTML(r.title)}</b><br>
                            <a href="${escapeHTML(r.download)}" target="_blank" class="btn btn-primary" style="margin-top:10px; text-decoration:none;">Simpan MP4</a>
                        `;
                    }
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btn, false, 'Proses');
            };
        }
        else if (tool === 'komik') {
            modalContent.innerHTML = `
                ${closeSvg}
                <div style="background:var(--bg-base); min-height: 100vh; padding-bottom: 20px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; padding: 0 15px; margin-bottom: 15px; margin-top: 5px;">
                        <div style="display:flex; align-items:center; gap:10px;">
                            <div style="background:var(--accent); color:var(--accent-ink); padding:6px; border-radius:6px; font-weight:900; font-size:18px; font-family:var(--font-display);">Z</div>
                            <div>
                                <h3 style="color:var(--text-primary); font-size:20px; margin:0;">Zenkai Comics</h3>
                                <p style="font-size:11px; color:var(--text-secondary); margin:0; font-weight:500;">BACA KOMIK GRATIS</p>
                            </div>
                        </div>
                    </div>

                    <div style="padding: 0 15px; margin-bottom: 20px;">
                        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5; margin:0;">
                            Platform baca komik online (Manga, Manhwa, Manhua) Bahasa Indonesia terlengkap dan terupdate setiap hari secara gratis.
                        </p>
                    </div>

                    <div style="display:flex; gap:8px; margin-bottom:20px; padding: 0 15px;">
                        <button id="tab-terbaru" onclick="switchKomikTab('terbaru', this)" class="btn btn-primary" style="flex:1; padding:10px; font-size:13px; margin:0;">Beranda</button>
                        <button id="tab-semua" onclick="switchKomikTab('semua', this)" class="btn btn-ghost" style="flex:1; padding:10px; font-size:13px; margin:0;">Katalog</button>
                        <button id="tab-favorit" onclick="switchKomikTab('favorit', this)" class="btn btn-ghost" style="flex:1; padding:10px; font-size:13px; margin:0;">Favorit</button>
                    </div>

                    <div style="position:relative; margin-bottom:20px; padding: 0 15px;">
                        <input type="text" id="komik-q" placeholder="Cari judul manga, manhwa..." style="width:100%; padding:12px 14px; border:1px solid var(--border-color); border-radius:var(--radius-sm); background:var(--bg-surface); color:var(--text-primary); font-size:14px; outline:none;">
                    </div>

                    <div id="komik-res" style="padding: 0 15px;"></div>

                    <div id="komik-load-more" style="display:none; text-align:center; padding: 20px 0;">
                        <div class="loader"></div>
                    </div>
                </div>
            `;

            const input = document.getElementById('komik-q');
            const box = document.getElementById('komik-res');
            const loadMoreEl = document.getElementById('komik-load-more');

            let currentTab = 'terbaru';
            let currentPage = 1;
            let isLoading = false;
            let hasMore = true;

            const getTipeKomik = (typeString, titleString = '') => {
                let typeCache = JSON.parse(localStorage.getItem('zenkai_type_cache') || '{}');
                if (titleString && typeCache[titleString]) {
                    const t = typeCache[titleString].toLowerCase();
                    if (t.includes('manhwa')) return { label: 'MANHWA', color: 'var(--accent)' };
                    if (t.includes('manhua')) return { label: 'MANHUA', color: '#EF4444' };
                    if (t.includes('manga')) return { label: 'MANGA', color: '#3B82F6' };
                }

                if (typeString) {
                    const t = typeString.toLowerCase();
                    if (t.includes('manhwa')) return { label: 'MANHWA', color: 'var(--accent)' };
                    if (t.includes('manhua')) return { label: 'MANHUA', color: '#EF4444' };
                    if (t.includes('manga')) return { label: 'MANGA', color: '#3B82F6' };
                }

                const t = (titleString || '').toLowerCase();
                const manhwaKeywords = ['manager kim', 'youngest', 'bloodthirsty', 'heavenly', 'northern', 'shepherd', 'reborn as', 'awakening', 'lookism', 'temporarily', 'fostering', 'grand duke', 'hunared', 'regression', 'regressor', 'player', 'tower', 'guild', 'hunter', 'princess'];
                const manhuaKeywords = ['martial', 'immortal', 'cultivation', 'sovereign', 'god', 'technique', 'senki', 'jinx', 'demonic', 'magic', 'sword', 'hundred', 'academic', 'system', 'villain', 'master', 'class', 'transition', 'flame', 'global'];

                for (const kw of manhwaKeywords) if (t.includes(kw)) return { label: 'MANHWA', color: 'var(--accent)' };
                for (const kw of manhuaKeywords) if (t.includes(kw)) return { label: 'MANHUA', color: '#EF4444' };

                return { label: 'MANGA', color: '#3B82F6' };
            };

            window.switchKomikTab = (tab, btn) => {
                currentTab = tab;
                currentPage = 1;
                hasMore = true;
                document.querySelectorAll('#modal-content .btn').forEach(b => { if(b.id && b.id.startsWith('tab-')) { b.className = 'btn btn-ghost'; b.style.cssText = 'flex:1; padding:10px; font-size:13px; margin:0;'; } });
                if (btn) { btn.className = 'btn btn-primary'; btn.style.cssText = 'flex:1; padding:10px; font-size:13px; margin:0;'; }
                box.innerHTML = '';
                loadKatalog(input.value.trim());
            };

            const loadKatalog = async (query) => {
                if (isLoading || !hasMore) return;
                isLoading = true;

                if (currentPage === 1) {
                    box.innerHTML = '<div class="loader" style="margin-top:30px;"></div>';
                } else {
                    loadMoreEl.style.display = 'block';
                }

                if (currentTab === 'favorit' && !query) {
                    loadMoreEl.style.display = 'none';
                    const favoritList = JSON.parse(localStorage.getItem('zenkai_favorit') || '[]');

                    if (favoritList.length === 0) {
                        box.innerHTML = `
                            <div style="text-align:center; padding: 40px 20px;">
                                <h4 style="font-size:15px; font-weight:700; margin-bottom:5px;">Belum Ada Favorit</h4>
                                <p style="font-size:13px; color:var(--text-secondary);">Jelajahi katalog dan tekan tombol favorit untuk menyimpan komik.</p>
                            </div>
                        `;
                    } else {
                        let htmlFav = `<h4 style="font-size:15px; margin-bottom:15px; font-weight:700; color:var(--text-primary);">Daftar Favorit Kamu</h4>`;
                        htmlFav += `<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px 10px;">`;

                        favoritList.forEach(f => {
                            const tipe = getTipeKomik(f.type || '', f.title);
                            htmlFav += `
                                <div class="fav-item-detail" data-title="${escapeHTML(f.title)}" data-slug="${escapeHTML(f.slug)}" style="cursor:pointer; display:flex; flex-direction:column; gap:8px;">
                                    <div style="position:relative; width:100%; aspect-ratio:3/4; border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-surface); border:1px solid var(--border-color);">
                                        <img src="${escapeHTML(f.cover)}" style="width:100%; height:100%; object-fit:cover;" loading="lazy">
                                        <span style="position:absolute; top:0; left:0; font-size:9px; font-weight:700; background:${tipe.color}; color:#000; padding:2px 6px; border-radius:0 0 6px 0;">${tipe.label}</span>
                                    </div>
                                    <h4 style="font-size:12px; font-weight:500; color:var(--text-primary); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin:0;">${escapeHTML(f.title)}</h4>
                                </div>
                            `;
                        });
                        htmlFav += `</div>`;
                        box.innerHTML = htmlFav;

                        box.querySelectorAll('.fav-item-detail').forEach(el => {
                            el.addEventListener('click', () => window.bukaDetail(el.dataset.title, el.dataset.slug));
                        });
                    }
                    isLoading = false;
                    return;
                }

                try {
                    let bodyData = {};
                    if (query) {
                        bodyData = { action: 'search', q: query, page: currentPage };
                    } else {
                        bodyData = {
                            action: currentTab === 'terbaru' ? 'latest' : 'daftar',
                            page: currentPage
                        };
                    }

                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik-jere`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bodyData)
                    });
                    const data = await res.json();
                    const komikList = data.results || [];

                    if (komikList.length === 0) {
                        hasMore = false;
                        loadMoreEl.style.display = 'none';
                        if (currentPage === 1) box.innerHTML = '<p class="error-msg" style="margin-top:20px;">Komik tidak ditemukan.</p>';
                        isLoading = false;
                        return;
                    }

                    const lastRead = localStorage.getItem('zenkai_last_read');
                    let historyHtml = '';
                    if (lastRead && !query && currentTab === 'terbaru' && currentPage === 1) {
                        const h = JSON.parse(lastRead);
                        historyHtml = `
                            <div style="margin-bottom: 25px;">
                                <h4 style="font-size:14px; margin-bottom:12px; font-weight:700; color:var(--text-primary);">Lanjut Baca</h4>
                                <div class="history-card" data-title="${escapeHTML(h.comicTitle)}" data-slug="${escapeHTML(h.slug)}" style="background:var(--bg-surface); border:1px solid var(--accent); padding:15px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:space-between; cursor:pointer;">
                                    <div style="display:flex; align-items:center; gap:12px;">
                                        <div style="background:var(--bg-base); color:var(--accent); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                                        </div>
                                        <div>
                                            <h5 style="font-size:14px; margin:0 0 4px 0; font-weight:700; line-height:1.2; display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;">${escapeHTML(h.comicTitle)}</h5>
                                            <p style="font-size:12px; margin:0; color:var(--accent); font-weight:500;">${escapeHTML(h.chapterTitle)}</p>
                                        </div>
                                    </div>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" stroke-width="2" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
                                </div>
                            </div>
                        `;
                    }

                    let titleSection = '';
                    if (currentPage === 1) {
                        if (query) titleSection = `<h4 style="font-size:14px; margin-bottom:15px; font-weight:700;">Hasil Pencarian "${escapeHTML(query)}"</h4>`;
                        else if (currentTab === 'terbaru') {
                            titleSection = `
                                <div style="margin-bottom:15px;">
                                    <h4 style="font-size:14px; font-weight:700; margin-bottom:5px;">Update Terbaru</h4>
                                    <p style="font-size:11px; color:var(--text-secondary); line-height:1.4;">
                                        <i>*Label tipe komik mungkin belum akurat.</i>
                                    </p>
                                </div>
                            `;
                        }
                        else titleSection = `<h4 style="font-size:14px; margin-bottom:15px; font-weight:700;">Semua Komik</h4>`;
                    }

                    let html = '';
                    let gridContainerId = 'komik-grid-container';
                    if (currentPage === 1) {
                        html = historyHtml + titleSection + `<div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:15px 10px;" id="${gridContainerId}">`;
                    }

                    komikList.forEach(manga => {
                        const title = (manga.title || 'Tanpa Judul').replace(/^Komik\s+/i, '');
                        const cover = manga.cover || 'https://via.placeholder.com/150';
                        const slug = manga.slug;
                        const tipe = getTipeKomik(manga.type, title);

                        html += `
                            <div class="komik-card-jere" data-title="${escapeHTML(title)}" data-slug="${escapeHTML(slug)}" style="cursor:pointer; display:flex; flex-direction:column; gap:8px;">
                                <div style="position:relative; width:100%; aspect-ratio:3/4; border-radius:var(--radius-sm); overflow:hidden; background:var(--bg-surface); border:1px solid var(--border-color);">
                                    <img src="${cover}" referrerpolicy="no-referrer" style="width:100%; height:100%; object-fit:cover;" loading="lazy" onerror="this.style.display='none'">
                                    <span style="position:absolute; top:0; left:0; font-size:9px; font-weight:700; background:${tipe.color}; color:#000; padding:2px 6px; border-radius:0 0 6px 0;">${tipe.label}</span>
                                </div>
                                <h4 style="font-size:12px; font-weight:500; color:var(--text-primary); line-height:1.3; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; margin:0;">${escapeHTML(title)}</h4>
                            </div>
                        `;
                    });

                    if (currentPage === 1) {
                        html += `</div>`;
                        box.innerHTML = html;

                        const historyEl = box.querySelector('.history-card');
                        if (historyEl) {
                            historyEl.addEventListener('click', () => {
                                window.bacaKomik(historyEl.dataset.title, historyEl.dataset.slug);
                            });
                        }
                    } else {
                        const gridContainer = document.getElementById(gridContainerId);
                        if (gridContainer) {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html;
                            const newItems = tempDiv.querySelectorAll('.komik-card-jere');
                            newItems.forEach(item => gridContainer.appendChild(item));
                        }
                    }

                    box.querySelectorAll('.komik-card-jere').forEach(el => {
                        if (el.dataset.bound === '1') return;
                        el.dataset.bound = '1';
                        el.addEventListener('click', () => window.bukaDetail(el.dataset.title, el.dataset.slug));
                    });

                    if (data.hasNext === false || komikList.length < 10) {
                        hasMore = false;
                        loadMoreEl.style.display = 'none';
                    } else {
                        currentPage++;
                        loadMoreEl.style.display = 'none';
                    }

                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                isLoading = false;
            };

            const handleScroll = (e) => {
                const target = e.target;
                if (target.id === 'tool-modal' || target.classList.contains('bottom-sheet-content')) {
                    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 150) {
                        if (!isLoading && hasMore && currentTab !== 'favorit') {
                            loadKatalog(input.value.trim());
                        }
                    }
                }
            };

            if (window.__komikScrollHandler && window.__komikScrollTarget) {
                window.__komikScrollTarget.removeEventListener('scroll', window.__komikScrollHandler);
            }
            const modalBody = document.querySelector('.bottom-sheet-content');
            if (modalBody) {
                window.__komikScrollHandler = handleScroll;
                window.__komikScrollTarget = modalBody;
                modalBody.addEventListener('scroll', handleScroll);
            }

            window.bukaDetail = async (title, slug) => {
                box.innerHTML = '<div class="loader"></div>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-komik-jere`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'detail', slug: slug })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error('Gagal mengambil detail');
                    const detail = data.result || data.data;
                    const tipe = getTipeKomik(detail.type, title);

                    if (detail.type) {
                        let typeCache = JSON.parse(localStorage.getItem('zenkai_type_cache') || '{}');
                        typeCache[title] = detail.type;
                        localStorage.setItem('zenkai_type_cache', JSON.stringify(typeCache));
                    }

                    let chapters = [];
                    if (detail.chapters && detail.chapters.length > 0) {
                        chapters = detail.chapters.map(ch => ({
                            title: ch.title || 'Chapter',
                            slug: ch.slug || ch.link,
                            date: ch.date || ''
                        }));
                    } else if (detail.genres) {
                        let rawChapters = detail.genres;
                        chapters = rawChapters.filter(item => typeof item === 'string' && item.includes('Chapter')).map(ch => {
                            const numMatch = ch.match(/Chapter\s+([\d.]+)/i);
                            const num = numMatch ? numMatch[1] : ch.replace('Chapter ', '');
                            return { title: ch, slug: `${slug}-chapter-${num.replace('.', '-')}`, date: '' };
                        });
                    }

                    chapters.sort((a, b) => {
                        const numA = parseFloat(a.title.replace(/[^0-9.]/g, ''));
                        const numB = parseFloat(b.title.replace(/[^0-9.]/g, ''));
                        return numB - numA;
                    });

                    const isFav = cekFavorit(slug);
                    const lastRead = localStorage.getItem('zenkai_last_read');
                    let lanjutBacaBtn = '';
                    if (lastRead) {
                        const h = JSON.parse(lastRead);
                        if (h.comicTitle === title) {
                            lanjutBacaBtn = `
                                <button class="btn-lanjut btn btn-primary" data-title="${escapeHTML(h.comicTitle)}" data-slug="${escapeHTML(h.slug)}" style="margin-bottom:20px; font-size:14px;">
                                    Lanjut Chapter ${escapeHTML(h.chapterTitle.split('Chapter ')[1] || '')}
                                </button>
                            `;
                        }
                    }

                    let html = `
                        <button class="btn-back btn btn-ghost" style="width:40px; height:40px; padding:0; border-radius:50%; margin-bottom:20px;">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>

                        <div style="display:flex; gap:15px; margin-bottom:20px;">
                            <div style="position:relative;">
                                <img src="${detail.cover || detail.thumbnail || 'https://via.placeholder.com/150'}" style="width:110px; height:150px; object-fit:cover; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                                <span style="position:absolute; top:0; left:0; font-size:10px; font-weight:700; background:${tipe.color}; color:#000; padding:2px 8px; border-radius:6px 0 6px 0;">${tipe.label}</span>
                            </div>
                            <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
                                <h3 style="font-size:18px; margin:0 0 5px 0; line-height:1.2;">${escapeHTML(title)}</h3>
                                <p style="font-size:12px; color:var(--accent); font-weight:700; margin:0 0 15px 0;">Status: ${escapeHTML(detail.status || 'Berjalan')}</p>

                                <button class="btn-fav btn btn-ghost" data-title="${escapeHTML(title)}" data-slug="${escapeHTML(slug)}" data-cover="${escapeHTML(detail.cover || '')}" style="align-self:flex-start; padding:8px 16px; border-radius:20px; font-size:12px; ${isFav ? 'color:var(--accent); border-color:var(--accent);' : ''}">
                                    ${isFav ? 'Tersimpan' : '+ Favorit'}
                                </button>
                            </div>
                        </div>

                        <div style="background:var(--bg-surface); border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); margin-bottom:20px;">
                            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:0;">${escapeHTML(detail.sinopsis || detail.synopsis || detail.description || 'Tidak ada sinopsis.')}</p>
                        </div>

                        ${lanjutBacaBtn}

                        <h4 style="margin-bottom:15px; font-size:15px; font-weight:700; border-bottom:1px solid var(--border-color); padding-bottom:10px;">Daftar Chapter (${chapters.length})</h4>
                        <div style="display:flex; flex-direction:column; gap:8px;">
                    `;

                    if (chapters.length === 0) {
                        html += `<p class="error-msg">Belum ada chapter.</p>`;
                    } else {
                        chapters.forEach(ch => {
                            html += `
                                <div class="chapter-item btn btn-ghost" data-title="${escapeHTML(title)}" data-slug="${escapeHTML(ch.slug)}" style="display:flex; align-items:center; justify-content:space-between; text-align:left; padding:12px 15px; border-radius:var(--radius-sm);">
                                    <div>
                                        <h5 style="margin:0 0 4px 0; font-size:14px; font-weight:700; color:var(--text-primary);">${escapeHTML(ch.title)}</h5>
                                        <p style="margin:0; font-size:12px; color:var(--text-secondary);">${escapeHTML(ch.date || '')}</p>
                                    </div>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" width="16" height="16"><path d="M9 18l6-6-6-6"/></svg>
                                </div>
                            `;
                        });
                    }

                    html += `</div>`;
                    box.innerHTML = html;

                    box.querySelector('.btn-back').addEventListener('click', () => {
                        box.innerHTML = '';
                        currentPage = 1;
                        hasMore = true;
                        loadKatalog(input.value.trim());
                    });

                    const btnFav = box.querySelector('.btn-fav');
                    btnFav.addEventListener('click', function() {
                        const t = this.dataset.title;
                        const s = this.dataset.slug;
                        const c = this.dataset.cover;
                        toggleFavorit(t, s, c);

                        const isNowFav = cekFavorit(s);
                        this.style.color = isNowFav ? 'var(--accent)' : 'var(--text-primary)';
                        this.style.borderColor = isNowFav ? 'var(--accent)' : 'var(--border-strong)';
                        this.innerText = isNowFav ? 'Tersimpan' : '+ Favorit';
                    });

                    const btnLanjut = box.querySelector('.btn-lanjut');
                    if (btnLanjut) {
                        btnLanjut.addEventListener('click', () => window.bacaKomik(btnLanjut.dataset.title, btnLanjut.dataset.slug));
                    }

                    box.querySelectorAll('.chapter-item').forEach(el => {
                        el.addEventListener('click', () => window.bacaKomik(el.dataset.title, el.dataset.slug));
                    });

                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal memuat detail: ${escapeHTML(e.message)}</p>`;
                }
            };

            loadKatalog('');

            let timeout = null;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    currentPage = 1;
                    hasMore = true;
                    box.innerHTML = '';
                    loadKatalog(e.target.value.trim());
                }, 800);
            });
        }
        else if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>TikTok DL</h3>
                <span class="desc-text">Download video TikTok tanpa watermark.</span>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="btn btn-primary" id="btn-dl-tt">Proses</button>
                <div id="tt-result" style="margin-top:15px;"></div>
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

                    if (data.code !== 0 && !data.status) throw new Error('Gagal mengambil video');

                    const vid = data.data?.hdplay || data.data?.play || data.result?.url;
                    if (!vid) throw new Error('Link video tidak ditemukan');

                    box.innerHTML = `
                        <video style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);" src="${escapeHTML(vid)}" controls></video>
                        <button class="btn btn-primary" id="btn-save-tt">Simpan ke Galeri</button>
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
                            showToast('Tersimpan');
                        } catch (e) { showToast('Gagal simpan, coba lagi.'); }
                        setBtnLoading(saveBtn, false, 'Simpan ke Galeri');
                    };
                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; 
                }
                setBtnLoading(btn, false, 'Proses');
            };
        }
        else if (tool === 'instagram') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Instagram DL</h3>
                <span class="desc-text">Download video/foto dari Post atau Reels.</span>
                <input type="text" id="ig-url" placeholder="Paste link Instagram...">
                <button class="btn btn-primary" id="btn-dl-ig">Ambil Media</button>
                <div id="ig-result" style="margin-top:15px;"></div>
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

                    if (data.status === false) throw new Error(data.message || 'Postingan tidak ditemukan');

                    let htmlContent = '';
                    const mediaArray = data.result?.media || data.media || [];
                    
                    if (mediaArray.length === 0) throw new Error('Media tidak ditemukan');

                    mediaArray.forEach((media, index) => {
                        if (media.type === 'video') {
                            htmlContent += `
                                <video style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);" src="${escapeHTML(media.url)}" controls></video>
                                <a href="${escapeHTML(media.url)}" target="_blank" class="btn btn-primary" style="text-decoration:none;">Download Video</a>
                            `;
                        } else {
                            htmlContent += `
                                <img src="${escapeHTML(media.url)}" style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);">
                                <a href="${escapeHTML(media.url)}" target="_blank" class="btn btn-primary" style="margin-bottom:15px; text-decoration:none; font-size:13px;">Download Foto ${index+1}</a>
                            `;
                        }
                    });

                    box.innerHTML = htmlContent;
                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; 
                }
                setBtnLoading(btn, false, 'Ambil Media');
            };
        }
        else if (tool === 'facebook') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Facebook DL</h3>
                <span class="desc-text">Download video dari Facebook.</span>
                <input type="text" id="fb-url" placeholder="Paste link Facebook...">
                <button class="btn btn-primary" id="btn-dl-fb">Ambil Video</button>
                <div id="fb-result" style="margin-top:15px;"></div>
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
                        <video style="width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);" src="${escapeHTML(vidUrl)}" controls></video>
                        <a href="${escapeHTML(vidUrl)}" target="_blank" class="btn btn-primary" style="text-decoration:none;">Download Video</a>
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
                <button class="btn btn-primary" id="btn-pin">Ambil Media</button>
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
                    if (currentVideoUrl) htmlContent += `<video src="${escapeHTML(currentVideoUrl)}" controls style="width:100%; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom: 15px;"></video>`;
                    else if (currentImageUrl) htmlContent += `<img src="${escapeHTML(currentImageUrl)}" style="width:100%; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom: 15px;">`;
                    htmlContent += `
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button class="btn btn-primary" id="btn-dl-vid" style="margin-bottom:0;">Download Video</button>
                            <button class="btn btn-ghost" id="btn-dl-img" style="margin-bottom:0;">Download Gambar</button>
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
                            showToast('Video Tersimpan');
                        } catch (error) { showToast('Gagal simpan video.'); }
                        setBtnLoading(saveBtn, false, 'Download Video');
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
                            showToast('Gambar Tersimpan');
                        } catch (error) { showToast('Gagal simpan gambar.'); }
                        setBtnLoading(saveBtn, false, 'Download Gambar');
                    };
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Ambil Media');
            };
        }
        else if (tool === 'stalktt') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk TikTok</h3>
                <span class="desc-text">Cek statistik akun TikTok.</span>
                <input type="text" id="stalktt-user" placeholder="Username (tanpa @)">
                <button class="btn btn-primary" id="btn-stt">Cari</button>
                <div id="stalktt-res" style="display:none; margin-top:15px; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); text-align:left; background:var(--bg-surface);"></div>
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
                        <div style="text-align:center; margin-bottom:15px;">
                            <img src="${escapeHTML(d.avatar.medium)}" style="width:80px; height:80px; border-radius:50%; border:1px solid var(--border-color); object-fit:cover;">
                        </div>
                        <div style="font-size:14px; line-height:1.6;">
                            <b>Username:</b> @${escapeHTML(d.username)}<br>
                            <b>Nama:</b> ${escapeHTML(d.nickname)}<br>
                            <b>Bio:</b> ${escapeHTML(d.bio || '-')}<br>
                            <b>Region:</b> ${escapeHTML(d.region || 'Tidak diketahui')}<br>
                            <hr style="border:none; border-top:1px solid var(--border-color); margin:10px 0;">
                            <b>Followers:</b> ${escapeHTML(d.stats.followers.toLocaleString())}<br>
                            <b>Following:</b> ${escapeHTML(d.stats.following.toLocaleString())}<br>
                            <b>Likes:</b> ${escapeHTML(d.stats.likes.toLocaleString())}<br>
                            <b>Video:</b> ${escapeHTML(d.stats.videos.toLocaleString())}<br>
                            <b>Status:</b> ${d.private_account ? 'Private' : 'Public'}
                        </div>
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'stalkroblox') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Roblox</h3>
                <span class="desc-text">Lacak profil Roblox player lain.</span>
                <input type="text" id="stalkrbx-user" placeholder="Username Roblox">
                <button class="btn btn-primary" id="btn-srbx">Cari</button>
                <div id="stalkrbx-res" style="display:none; margin-top:15px; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); text-align:left; background:var(--bg-surface);"></div>
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
                        <div style="text-align:center; margin-bottom:15px;">
                            <img src="${escapeHTML(d.avatar)}" style="width:100px; height:100px; border-radius:50%; border:1px solid var(--border-color); object-fit:cover;">
                        </div>
                        <div style="font-size:14px; line-height:1.6;">
                            <b>Username:</b> @${escapeHTML(d.username)}<br>
                            <b>Display Name:</b> ${escapeHTML(d.display_name)}<br>
                            <b>Bio:</b> ${escapeHTML(d.description || '-')}<br>
                            <b>Dibuat:</b> ${tglDibuat}<br>
                            <hr style="border:none; border-top:1px solid var(--border-color); margin:10px 0;">
                            <b>Friends:</b> ${escapeHTML(d.stats.friends.toLocaleString())}<br>
                            <b>Followers:</b> ${escapeHTML(d.stats.followers.toLocaleString())}<br>
                            <b>Following:</b> ${escapeHTML(d.stats.following.toLocaleString())}<br>
                            <b>Status:</b> ${d.is_banned ? 'Banned' : (d.verified ? 'Verified' : 'Normal')}
                        </div>
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'stalkmlbb') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk MLBB</h3>
                <span class="desc-text">Lacak profil Mobile Legends.</span>
                <input type="number" id="ml-id" placeholder="User ID (cth: 134972929)">
                <input type="number" id="ml-zone" placeholder="Zone ID (cth: 2687)">
                <button class="btn btn-primary" id="btn-ml">Cari</button>
                <div id="ml-res" style="display:none; margin-top:15px; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); text-align:left; background:var(--bg-surface);"></div>
            `;
            const btn = document.getElementById('btn-ml');
            btn.onclick = async () => {
                const id = document.getElementById('ml-id').value.trim();
                const zone = document.getElementById('ml-zone').value.trim();
                const box = document.getElementById('ml-res');
                if (!id || !zone) return showToast('Isi ID dan Zone!');
                
                box.style.display = 'block';
                setBtnLoading(btn, true, 'Cari');
                box.innerHTML = '<div class="loader"></div>';
                
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools-v2`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'stalk_mlbb', id: id, zone: zone })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.message || 'Akun tidak ditemukan');
                    const d = data.result;
                    
                    box.innerHTML = `
                        <div style="font-size:14px; line-height:1.6;">
                            <b>Nickname:</b> ${escapeHTML(d.nickname)}<br>
                            <b>ID:</b> ${escapeHTML(d.id)}<br>
                            <b>Zone:</b> ${escapeHTML(d.zone)}<br>
                            <b>Region:</b> ${escapeHTML(d.region)}<br>
                            <b>Status:</b> ${escapeHTML(d.account_status)}
                        </div>
                    `;
                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; 
                }
                setBtnLoading(btn, false, 'Cari');
            };
        }
        else if (tool === 'alightmotion') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Alight Motion</h3>
                <span class="desc-text">Bypass akun Premium Alight Motion.</span>
                <div style="text-align:left; font-size:14px; background:var(--bg-surface); padding:16px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--border-color); line-height:1.6; color:var(--text-secondary);">
                    <b style="color:var(--text-primary);">Tutorial:</b><br>
                    1. Masukkan email aktif, klik <b>Kirim Link</b>.<br>
                    2. Cek Inbox/Spam Gmail.<br>
                    3. ⚠️ <b>JANGAN DI-KLIK LINK-NYA!</b> Tekan & tahan link, lalu pilih <b>Copy Link</b>.<br>
                    4. Balik ke web, <b>Paste</b> link tadi di bawah.<br>
                    5. Klik <b>Aktifkan Premium</b>. Akun lu langsung Premium!
                </div>
                
                <div id="am-step-1">
                    <input type="email" id="am-email" placeholder="Ketik email aktif lu...">
                    <button class="btn btn-primary" id="btn-am-send">Kirim Link</button>
                </div>

                <div id="am-step-2" style="display:none;">
                    <input type="text" id="am-link" placeholder="Paste link verifikasi dari Gmail di sini...">
                    <button class="btn btn-primary" id="btn-am-verif">Aktifkan Premium</button>
                </div>

                <div id="am-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;
            
            const btnSend = document.getElementById('btn-am-send');
            const btnVerif = document.getElementById('btn-am-verif');
            const box = document.getElementById('am-res');
            const step1 = document.getElementById('am-step-1');
            const step2 = document.getElementById('am-step-2');

            btnSend.onclick = async () => {
                const email = document.getElementById('am-email').value.trim();
                if (!email) return showToast('Masukkan email dulu!');
                box.style.display = 'block';
                setBtnLoading(btnSend, true, 'Mengirim...');
                box.innerHTML = '<div class="loader"></div>';
                
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools-v2`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'am_send', email: email })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal');
                    
                    step1.style.display = 'none';
                    step2.style.display = 'block';
                    box.innerHTML = `<p class="success-msg">Link terkirim ke <b>${escapeHTML(email)}</b>.<br>Buka Gmail, JANGAN DIKLIK. Copy link-nya, lalu paste di kolom atas.</p>`;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btnSend, false, 'Kirim Link');
            };

            btnVerif.onclick = async () => {
                const email = document.getElementById('am-email').value.trim();
                const link = document.getElementById('am-link').value.trim();
                if (!link) return showToast('Paste link verifikasi dulu!');
                box.style.display = 'block';
                setBtnLoading(btnVerif, true, 'Memverifikasi...');
                box.innerHTML = '<div class="loader"></div>';
                
                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-tools-v2`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'am_verif', email: email, link: link })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal verifikasi');
                    
                    box.innerHTML = `<p class="success-msg">Verifikasi Berhasil!<br>Akun <b>${escapeHTML(email)}</b> sudah menjadi <b>${escapeHTML(data.result?.status || 'Premium')}</b>.</p>`;
                    showToast('Akun Premium Aktif!');
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btnVerif, false, 'Aktifkan Premium');
            };
        }
        else if (tool === 'aiedit') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>AI Image Editor</h3>
                <span class="desc-text">Edit gambar pakai AI (GPT-Image). Tanpa batasan prompt!</span>

                <div style="margin-bottom:15px;">
                    <input type="file" id="ai-edit-file" accept="image/*" style="display:none;" onchange="document.getElementById('file-name-label').innerText = this.files[0] ? this.files[0].name : 'Pilih Gambar...';">
                    <button onclick="document.getElementById('ai-edit-file').click()" class="btn btn-ghost" style="width:100%; border-style:dashed; height:60px; flex-direction:column; gap:5px;">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" style="margin:0 auto;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        <span id="file-name-label" style="font-size:13px; font-weight:normal;">Pilih Gambar...</span>
                    </button>
                </div>

                <textarea id="ai-edit-prompt" rows="2" placeholder="Ketik instruksi edit... (Wajib)"></textarea>

                <button class="btn btn-primary" id="btn-ai-edit">Proses Edit</button>
                <div id="ai-edit-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
                <p style="font-size:12px; color:var(--danger); text-align:center; margin-top:15px;">Dilarang mengedit foto orang lain tanpa izin!</p>
            `;

            const btn = document.getElementById('btn-ai-edit');
            btn.onclick = async () => {
                const prompt = document.getElementById('ai-edit-prompt').value.trim();
                const fileInput = document.getElementById('ai-edit-file');
                const box = document.getElementById('ai-edit-res');

                if (!prompt) return showToast('Masukkan instruksi edit!');
                if (!fileInput.files[0]) return showToast('Pilih gambar dulu!');

                const imageBase64 = await new Promise((resolve) => {
                    const reader = new FileReader(); 
                    reader.onload = (e) => resolve(e.target.result); 
                    reader.readAsDataURL(fileInput.files[0]);
                });

                setBtnLoading(btn, true, 'Memproses AI...');
                box.style.display = 'block'; 
                box.innerHTML = '<div class="loader"></div><p style="font-size:13px; color:var(--text-secondary); margin-top:10px;">Tunggu 10-30 detik...</p>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-aiedit`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: prompt, image_base64: imageBase64, output_type: 'image' })
                    });
                    const data = await res.json();
                    
                    if (data.status === false) throw new Error(data.message || 'Gagal');

                    let finalImageUrl = data.data?.result || data.data || data.image_url;
                    if (!finalImageUrl) throw new Error('Gagal mendapatkan gambar');

                    const safeUrl = escapeHTML(finalImageUrl);

                    box.innerHTML = `
                        <p style="color:var(--success); font-weight:bold; margin-bottom:10px; font-size:14px;">Berhasil Diedit</p>
                        <img src="${safeUrl}" style="width:100%; border-radius:var(--radius-sm); border:1px solid var(--border-color); margin-bottom:10px;">
                        <a href="${safeUrl}" download="aiedit-${Date.now()}.png" target="_blank" class="btn btn-primary" style="text-decoration:none; margin-bottom:0;">Download / Buka</a>
                    `;
                    showToast('Gambar Berhasil Diedit');
                } catch (e) { 
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; 
                }
                setBtnLoading(btn, false, 'Proses Edit');
            };
        }
        else if (tool === 'notrack-chat') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>NoTrack AI</h3>
                <span class="desc-text">Chat AI tanpa sensor. Support kirim gambar & ingat percakapan.</span>
                <div id="nt-chat-box" style="display:flex; flex-direction:column; gap:10px; max-height:300px; overflow-y:auto; margin-bottom:15px; background:var(--bg-surface); padding:10px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
                    <div style="font-size:13px; color:var(--text-secondary); text-align:center;">Mulai percakapan...</div>
                </div>

                <div style="display:flex; gap:8px; margin-bottom:10px;">
                    <input type="file" id="nt-file" accept="image/*" style="display:none;" onchange="document.getElementById('nt-file-label').innerText = this.files[0] ? 'IMG' : '+';">
                    <button onclick="document.getElementById('nt-file').click()" id="nt-file-label" class="btn btn-ghost" style="width:45px; height:45px; padding:0; margin:0; font-size:18px;">+</button>
                    <input type="text" id="nt-input" placeholder="Tanya apa aja..." style="margin:0;" onkeypress="if(event.key === 'Enter') document.getElementById('btn-nt').click()">
                </div>

                <button class="btn btn-primary" id="btn-nt">Kirim Pesan</button>
            `;

            let ntSessionId = null;
            let ntChatId = null;
            const chatBox = document.getElementById('nt-chat-box');
            const btn = document.getElementById('btn-nt');

            const addMessage = (text, isUser) => {
                const div = document.createElement('div');
                div.style.cssText = `align-self: ${isUser ? 'flex-end' : 'flex-start'}; background: ${isUser ? 'var(--accent)' : 'var(--bg-base)'}; color: ${isUser ? 'var(--accent-ink)' : 'var(--text-primary)'}; padding: 10px 14px; border-radius: 12px; border-bottom-${isUser ? 'right' : 'left'}-radius: 2px; font-size: 14px; max-width: 85%; border: 1px solid var(--border-color); line-height: 1.5; white-space: pre-wrap;`;
                div.innerText = text;
                chatBox.appendChild(div);
                chatBox.scrollTop = chatBox.scrollHeight;
            };

            btn.onclick = async () => {
                const input = document.getElementById('nt-input');
                const fileInput = document.getElementById('nt-file');
                const prompt = input.value.trim();
                const file = fileInput.files[0];

                if (!prompt && !file) return showToast('Ketik pesan atau pilih gambar!');

                addMessage(prompt || '[Gambar dikirim]', true);
                input.value = '';
                fileInput.value = ''; document.getElementById('nt-file-label').innerText = '+';

                const loadingDiv = document.createElement('div');
                loadingDiv.innerHTML = '<div class="loader" style="width:16px; height:16px; border-width:2px; margin:0;"></div>';
                loadingDiv.style.cssText = `align-self: flex-start; background: var(--bg-base); padding: 10px; border-radius: 12px; border: 1px solid var(--border-color);`;
                chatBox.appendChild(loadingDiv); chatBox.scrollTop = chatBox.scrollHeight;

                setBtnLoading(btn, true, 'Memproses...');

                try {
                    let fileBase64 = null;
                    if (file) {
                        fileBase64 = await new Promise((resolve) => {
                            const reader = new FileReader(); reader.onload = (e) => resolve(e.target.result); reader.readAsDataURL(file);
                        });
                    }

                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-notrack`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: prompt, sessionId: ntSessionId, chatId: ntChatId, file_base64: fileBase64 })
                    });
                    const data = await res.json();

                    loadingDiv.remove();
                    if (data.status === false) throw new Error(data.message || 'Gagal');

                    if (data.data?.session) {
                        ntSessionId = data.data.session.sessionId;
                        ntChatId = data.data.session.chatId;
                    }

                    addMessage(data.data?.reply || 'Maaf, tidak ada balasan.', false);
                } catch (e) {
                    loadingDiv.remove();
                    addMessage(`Error: ${e.message}`, false);
                }
                setBtnLoading(btn, false, 'Kirim Pesan');
            };
        }
        else if (tool === 'bug-wa') {
            const isOwner = !!localStorage.getItem(OWNER_TOKEN_KEY);
            const isMaintenance = (window.currentDisabledTools || []).includes('bug-wa');
            const isVipOnly = (window.currentVipTools || []).includes('bug-wa');
            
            const isVip = localStorage.getItem('zenkai_vip') === 'true';
            const vipUntil = localStorage.getItem('zenkai_vip_until');
            const isVipValid = isVip && vipUntil && new Date(vipUntil) > new Date();

            if (isMaintenance && !isOwner) {
                modalContent.innerHTML = `
                    ${closeSvg}
                    <h3 style="color:var(--danger);">Fitur Maintenance</h3>
                    <span class="desc-text">Fitur ini sedang dinonaktifkan sementara oleh Owner.</span>
                    <button class="btn btn-primary" onclick="openTool('bug-wa')">Cek Ulang</button>
                `;
                return;
            }

            if (isVipOnly && !isVipValid && !isOwner) {
                modalContent.innerHTML = `
                    ${closeSvg}
                    <div style="text-align:center; padding: 20px 0;">
                        <h3 style="font-size: 22px; color: var(--danger); margin-bottom: 10px;">Akses VIP Terkunci</h3>
                        <p style="font-size: 14px; color: var(--text-secondary); margin-bottom: 25px;">Fitur ini dijadikan VIP Only oleh Owner.</p>
                        <button class="btn btn-primary" onclick="openTool('vip')">Lihat Paket VIP</button>
                    </div>
                `;
                return;
            }

            modalContent.innerHTML = `
                ${closeSvg}
                <h3 style="color:var(--danger);">☠️ WA Bug Exploit</h3>
                <span class="desc-text">Gunakan dengan risiko sendiri.</span>

                <div style="text-align:left; font-size:12px; background:rgba(255, 61, 110, 0.1); padding:12px; border-radius:var(--radius-sm); margin-bottom:15px; border:1px solid var(--danger); color:var(--text-secondary);">
                    <b>Note:</b> Proses mungkin memakan waktu 30-60 detik (membangunkan server). Jangan tutup modal ini!
                </div>

                <select id="bug-action" style="width:100%; padding:12px; margin-bottom:15px; background:var(--bg-base); color:white; border:1px solid var(--border-color); border-radius:var(--radius-sm);">
                    <option value="freeze_droid">Freeze Android</option>
                    <option value="crash_ios">Crash iOS</option>
                    <option value="spam_call">Spam Call</option>
                    <option value="crash_group">Crash Group</option>
                </select>

                <input type="text" id="bug-target" placeholder="No. WA (628xxx) / Link Grup (chat.whatsapp.com/...)" inputmode="text">

                <button class="btn btn-primary" id="btn-exec-bug" style="background:var(--danger); color:white; border:none; margin-top:10px;">Luncurkan Serangan</button>

                <div id="bug-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
            `;

            const btnExec = document.getElementById('btn-exec-bug');
            
            btnExec.onclick = async () => {
                const action = document.getElementById('bug-action').value;
                const target = document.getElementById('bug-target').value.trim();
                const box = document.getElementById('bug-res');

                if (!target) return showToast('Masukkan target!');

                setBtnLoading(btnExec, true, 'Menyerang...');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p style="font-size:12px; margin-top:10px; color:var(--text-secondary);">Membangunkan server...</p>';

                try {
                    const res = await fetch(`${SUPA_URL}/functions/v1/zen-bug-wa`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: action, target: target })
                    });
                    const data = await res.json();

                    if (!data.status) throw new Error(data.error);

                    box.innerHTML = `<p class="success-msg" style="font-size:13px;">Serangan Terkirim!<br><span style="font-size:11px; font-weight:normal;">Respon: ${escapeHTML(data.message)}</span></p>`;
                    showToast('Bug berhasil dikirim ke target!');
                } catch (e) {
                    box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`;
                }
                setBtnLoading(btnExec, false, 'Luncurkan Serangan');
            };
        }
        else if (tool === 'tempmail') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Temp Mail</h3>
                <span class="desc-text">Bikin email sementara (dummy) buat verifikasi.</span>
                <button class="btn btn-primary" id="btn-tm">Buat Email</button>
                <div id="tm-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
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
                    box.innerHTML = `<p style="font-size:14px; margin-bottom:10px;">Email Lu:</p><b style="font-size:16px; color:var(--accent); word-break:break-all;">${escapeHTML(data.result.email)}</b><br><p style="font-size:13px; color:var(--text-secondary); margin-top:5px;">(Token: ${escapeHTML(data.result.token)})</p>`;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Buat Email');
            };
        }
        else if (tool === 'nik') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>NIK Parser</h3>
                <span class="desc-text">Bongkar data dari NIK KTP.</span>
                <input type="text" id="nik-input" placeholder="Masukkan 16 digit NIK..." inputmode="numeric" maxlength="16">
                <button class="btn btn-primary" id="btn-nik">Lacak NIK</button>
                <div id="nik-res" style="display:none; margin-top:15px; text-align:left; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); font-size:14px; line-height:1.6; background:var(--bg-surface);"></div>
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
                <span class="desc-text">Download lagu dari Spotify jadi MP3.</span>
                <input type="text" id="sp-url" placeholder="Paste link Spotify...">
                <button class="btn btn-primary" id="btn-sp">Download</button>
                <div id="sp-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
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
                        <img src="${escapeHTML(s.cover)}" style="width:100px; height:100px; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);">
                        <b style="font-size:14px;">${escapeHTML(s.title)}</b><br>
                        <p style="font-size:13px; color:var(--text-secondary);">${escapeHTML(s.artist)} • ${escapeHTML(s.album || '-')}</p>
                        <audio src="${escapeHTML(s.download_mp3)}" controls style="width:100%; margin-top:10px;"></audio>
                        <a href="${escapeHTML(s.download_mp3)}" class="btn btn-primary" style="margin-top:10px; display:block; text-decoration:none;" download>Simpan MP3</a>
                    `;
                } catch (e) { box.innerHTML = `<p class="error-msg">Gagal: ${escapeHTML(e.message)}</p>`; }
                setBtnLoading(btn, false, 'Download');
            };
        }
        else if (tool === 'iplookup') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>IP Lookup Pro</h3>
                <span class="desc-text">Lacak IP publik via Server Zenkai.</span>
                <input type="text" id="ip-input" placeholder="Cth: 8.8.8.8">
                <button class="btn btn-primary" id="btn-ip">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); font-size:14px; line-height:1.6; background:var(--bg-surface);"></div>
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
                <span class="desc-text">Upload gambar untuk dihapus background-nya secara otomatis.</span>
                <input type="file" id="rb-file" accept="image/*">
                <button class="btn btn-primary" id="btn-rb">Proses Gambar</button>
                <div id="rb-res" style="display:none; margin-top:15px; text-align:center; border:1px solid var(--border-color); padding:15px; border-radius:var(--radius-sm); background:var(--bg-surface);"></div>
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
                                <img src="${escapeHTML(data.image_url)}" style="max-width:100%; border-radius:var(--radius-sm); margin-bottom:10px; border:1px solid var(--border-color);">
                                <a href="${escapeHTML(data.image_url)}" target="_blank" rel="noopener" class="btn btn-primary" style="display:block; text-decoration:none;">Buka Gambar HD</a>
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
        else {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Segera Hadir</h3>
                <span class="desc-text">Fitur "${escapeHTML(tool)}" sedang dalam tahap pengembangan atau belum tersedia.</span>
                <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="text-align: center; text-decoration: none;">Pantau Info</a>
            `;
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

            let images = [];
            if (data.result?.pages?.length > 0) {
                images = data.result.pages.map(p => p.url || p);
            } else if (data.result?.images) {
                images = data.result.images;
            }

            if (images.length === 0) throw new Error('Gambar tidak ditemukan.');

            const chapterTitle = data.result?.chapterTitle || title;
            const history = {
                comicTitle: title,
                chapterTitle: chapterTitle,
                slug: slug,
                time: Date.now()
            };
            localStorage.setItem('zenkai_last_read', JSON.stringify(history));

            const prevSlug = data.result?.navigation?.prevSlug || data.result?.prev || null;
            const nextSlug = data.result?.navigation?.nextSlug || data.result?.next || null;

            let html = `
                <div style="position:sticky; top:0; z-index:100; background:var(--bg-surface); padding:10px 15px; display:flex; align-items:center; justify-content:space-between; border-bottom:1px solid var(--border-color);">
                    <button class="btn btn-ghost btn-back-reader" style="width:40px; height:40px; padding:0; border-radius:50%;">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <div style="font-size:14px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; flex:1; text-align:center;">${escapeHTML(chapterTitle)}</div>
                    <button class="btn btn-primary btn-daftar-reader" style="width:auto; padding:6px 12px; font-size:12px; border-radius:20px; margin:0;">
                        Daftar
                    </button>
                </div>
                <div class="reader-container" style="background:#000; padding:0; margin:0; display:flex; flex-direction:column;">
            `;

            images.forEach(imgUrl => {
                const proxiedImg = `https://wsrv.nl/?url=${encodeURIComponent(imgUrl)}`;
                html += `<img src="${proxiedImg}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none'" style="width:100%; display:block; margin:0; padding:0; max-width:100%; object-fit:contain;">`;
            });

            html += `</div>`;

            html += `
                <div style="display:flex; gap:10px; padding:15px 15px 5px 15px; background:var(--bg-base);">
                    <button class="btn btn-ghost btn-prev-next" data-slug="${escapeHTML(prevSlug || '')}" data-title="${escapeHTML(title)}" ${!prevSlug ? 'disabled' : ''}
                        style="flex:1; padding:12px; opacity:${!prevSlug ? '0.4' : '1'};">
                        Prev
                    </button>
                    <button class="btn btn-primary btn-prev-next" data-slug="${escapeHTML(nextSlug || '')}" data-title="${escapeHTML(title)}" ${!nextSlug ? 'disabled' : ''}
                        style="flex:1; padding:12px; opacity:${!nextSlug ? '0.4' : '1'};">
                        Next
                    </button>
                </div>
                <button class="btn btn-ghost btn-back-katalog" style="color:var(--danger); border-color:var(--danger); margin: 0 15px 20px 15px; width:calc(100% - 30px);">Kembali ke Katalog</button>
            `;

            box.innerHTML = html;

            const scrollContainer = document.querySelector('.bottom-sheet-content');
            if (scrollContainer) scrollContainer.scrollTop = 0;

            box.querySelector('.btn-back-reader').addEventListener('click', () => openTool('komik'));
            box.querySelector('.btn-daftar-reader').addEventListener('click', () => openTool('komik'));
            box.querySelector('.btn-back-katalog').addEventListener('click', () => openTool('komik'));

            box.querySelectorAll('.btn-prev-next').forEach(btn => {
                if(!btn.disabled) {
                    btn.addEventListener('click', () => {
                        window.bacaKomik(btn.dataset.title, btn.dataset.slug);
                    });
                }
            });

        } catch (e) {
            box.innerHTML = `
                <div style="text-align:center; padding: 20px;">
                    <p class="error-msg">${escapeHTML(e.message)}</p>
                    <button class="btn btn-primary" onclick="openTool('komik')" style="margin-top:15px;">Kembali</button>
                </div>
            `;
        }
    };

});