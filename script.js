document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // HELPERS
    // =========================================
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

    // =========================================
    // 1. INTRO SCREEN
    // =========================================
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    const introBar = document.getElementById('intro-loader-bar');
    const introBrand = document.getElementById('intro-brand');

    if (introScreen) {
        const hasSeenIntro = sessionStorage.getItem('intro_shown');
        if (hasSeenIntro === 'true' || isReducedMotion()) {
            introScreen.remove();
            document.body.classList.remove('intro-active');
        } else {
            document.body.classList.add('intro-active');
            document.body.style.overflow = 'hidden';

            if (introVideo) {
                introVideo.addEventListener('timeupdate', () => {
                    if (introVideo.duration) {
                        const percent = (introVideo.currentTime / introVideo.duration) * 100;
                        if (introBar) introBar.style.width = percent + '%';
                        if (introVideo.currentTime / introVideo.duration > 0.7 && introBrand) introBrand.classList.add('show');
                    }
                });
                introVideo.addEventListener('ended', () => {
                    if (introScreen) introScreen.classList.add('shake');
                    if (introBar) introBar.style.width = '100%';
                    if (introBrand) introBrand.classList.add('show');
                    setTimeout(() => { window.closeIntro(); }, 800);
                });
                introVideo.play().catch(() => {
                    introVideo.addEventListener('click', () => introVideo.play());
                });
            }

            window.closeIntro = () => {
                if (!introScreen) return;
                sessionStorage.setItem('intro_shown', 'true');
                introScreen.classList.add('hide');
                document.body.classList.remove('intro-active');
                document.body.style.overflow = '';
                setTimeout(() => { if (introScreen && introScreen.parentNode) introScreen.remove(); }, 800);
                scheduleWaPopup();
            };

            window.skipIntro = () => {
                if (introVideo) introVideo.pause();
                window.closeIntro();
            };
        }
    }

    // =========================================
    // 2. POP-UP WHATSAPP (SELALU MUNCUL)
    // =========================================
    const waPopup = document.getElementById('wa-popup');
    let waScheduled = false;

    function scheduleWaPopup() {
        if (waScheduled) return;
        waScheduled = true;
        if (!waPopup) return;
        setTimeout(() => {
            if (waPopup) waPopup.classList.add('active');
        }, 1500); // Muncul 1.5 detik setelah web kebuka/intro selesai
    }

    if (!introScreen || sessionStorage.getItem('intro_shown') === 'true' || isReducedMotion()) {
        scheduleWaPopup();
    }

    window.closeWaPopup = () => { if (waPopup) waPopup.classList.remove('active'); };

    // =========================================
    // 3. TEMA
    // =========================================
    const savedTheme = localStorage.getItem('zenkai_theme');
    if (savedTheme) document.body.setAttribute('data-theme', savedTheme);

    window.setTheme = (themeName) => {
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('zenkai_theme', themeName);
        showToast(`Tema diubah ke ${themeName.toUpperCase()}`);
    };

    // =========================================
    // 4. NAVIGASI
    // =========================================
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

    // =========================================
    // 5. FILTER KATEGORI
    // =========================================
    window.filterCategory = (category, btn) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        document.querySelectorAll('.tool-card').forEach(card => {
            const cat = card.getAttribute('data-category');
            if (category === 'all' || cat === category) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    };

    // =========================================
    // 6. TOAST
    // =========================================
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

    // =========================================
    // 7. DEVICE, BATERAI, JAM
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
    // 8. MUSIK WIDGET
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
            if (!bgm.src) loadSong(0);
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
        if (confirm("Yakin mau hapus cache dan muat ulang web?")) {
            sessionStorage.clear();
            localStorage.removeItem('wa_popup_last');
            location.reload();
        }
    };

    // =========================================
    // 9. MODAL BOTTOM SHEET
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
            if (waPopup && waPopup.classList.contains('active')) closeWaPopup();
        }
    });

    const closeSvg = `<button class="modal-close press" onclick="closeModal()" aria-label="Tutup"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

    document.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && e.target.classList && e.target.classList.contains('tool-card')) {
            e.preventDefault(); e.target.click();
        }
    });
    // =========================================
// 10. openTool
// =========================================
window.openTool = (tool) => {
    if (!modal || !modalContent) return;
    modal.classList.add('active');

    // =========================================
    // FITUR COMING SOON
    // =========================================
    const comingSoonTools = [
        'stalkmlbb', 'stalkpubg', 'stalkcodm', 'stalkgenshin', 
        'twitter', 'youtube', 'imghd'
    ];
    
    if (comingSoonTools.includes(tool)) {
        modalContent.innerHTML = `
            ${closeSvg}
            <h3>Coming Soon</h3>
            <span class="desc-text">Fitur ini sedang dalam tahap pengembangan. Nantikan update-nya di Channel WhatsApp kami ya!</span>
            <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-align: center; text-decoration: none; background: #00ff9d;">
                Pantau Update
            </a>
        `;
        return;
    }

    // =========================================
    // BYPASS MAINTENANCE
    // =========================================
    if (tool === 'linkvertise') {
        modalContent.innerHTML = `
            ${closeSvg}
            <h3>Bypass Link</h3>
            <span class="desc-text" style="color: #ff3333; border-color: #ff3333; background: rgba(255, 51, 51, 0.1);">
                🚧 SEDANG MAINTENANCE 🚧
            </span>
            <p style="text-align: center; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                Fitur bypass link saat ini sedang dalam perbaikan sistem keamanan.<br><br>Silakan coba lagi nanti.
            </p>
        `;
        return;
    }

    // =========================================
    // DOWNLOADER
    // =========================================
    if (tool === 'tiktok') {
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
                const res = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-pinterest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                        const dlRes = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-pinterest', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
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
            <span class="desc-text" style="color: #ff3333; border-color: #ff3333; background: rgba(255, 51, 51, 0.1);">
                🚧 SEDANG MAINTENANCE 🚧
            </span>
            <p style="text-align: center; font-size: 13px; line-height: 1.6; margin-bottom: 20px;">
                Fitur downloader Instagram saat ini sedang dalam perbaikan oleh developer (API Down).<br><br>
                Silakan gunakan tool lain atau coba lagi nanti.
            </p>
            <a href="https://whatsapp.com/channel/0029VbDH9Vv3WHTXkPU0LG3H" target="_blank" rel="noopener noreferrer" class="action-btn" style="text-align: center; text-decoration: none; background: #00ff9d;">
                Pantau Update di WhatsApp
            </a>
        `;
    }

    else if (tool === 'facebook') {
        modalContent.innerHTML = `
            ${closeSvg}
            <h3>Facebook DL</h3>
            <span class="desc-text">Simpan video dari Facebook dalam kualitas HD.</span>
            <input type="text" id="fb-url" placeholder="Paste link Facebook...">
            <button class="action-btn" id="btn-fb">Download</button>
            <div id="fb-res" style="display:none; margin-top:15px; text-align:center;"></div>
        `;
        const btn = document.getElementById('btn-fb');
        btn.onclick = async () => {
            const url = document.getElementById('fb-url').value.trim();
            const box = document.getElementById('fb-res');
            if (!url) return showToast('Masukkan link!');
            box.style.display = 'block';
            setBtnLoading(btn, true, 'Download');
            box.innerHTML = '<div class="loader"></div>';
            try {
                const res = await fetch(`https://api.vevioz.com/api/button/facebook?url=${encodeURIComponent(url)}`);
                const data = await res.json();
                const videoUrl = data.hd || data.sd || data.url;
                if (!videoUrl) throw new Error('Video tidak ditemukan');
                box.innerHTML = `
                    <video src="${escapeHTML(videoUrl)}" controls style="width:100%; border-radius:8px; border:3px solid var(--border);"></video>
                    <a href="${escapeHTML(videoUrl)}" download class="action-btn" style="margin-top:10px;">Simpan Video</a>
                `;
            } catch (e) { box.innerHTML = '<p class="error-msg">Gagal. Video private atau API down.</p>'; }
            setBtnLoading(btn, false, 'Download');
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
                const res = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-pinterest', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                        const dlRes = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-pinterest', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
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
                        const dlRes = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-pinterest', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
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

    // =========================================
    // STALKER
    // =========================================
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
                const res = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tiktok', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
                const res = await fetch('https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-roblox', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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

    // =========================================
    // UTILITY
    // =========================================
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

    else if (tool === 'calc') {
        modalContent.innerHTML = `
            ${closeSvg}
            <h3>Kalkulator</h3>
            <span class="desc-text">Kalkulator simpel buat hitung angka dasar.</span>
            <div class="calc-container">
                <div class="calc-display" id="calc-screen">0</div>
                <div class="calc-keys">
                    <button class="calc-btn op" onclick="calcInput('C')">C</button>
                    <button class="calc-btn op" onclick="calcInput('DEL')">⌫</button>
                    <button class="calc-btn op" onclick="calcInput('%')">%</button>
                    <button class="calc-btn op" onclick="calcInput('/')">÷</button>
                    <button class="calc-btn" onclick="calcInput('7')">7</button>
                    <button class="calc-btn" onclick="calcInput('8')">8</button>
                    <button class="calc-btn" onclick="calcInput('9')">9</button>
                    <button class="calc-btn op" onclick="calcInput('*')">×</button>
                    <button class="calc-btn" onclick="calcInput('4')">4</button>
                    <button class="calc-btn" onclick="calcInput('5')">5</button>
                    <button class="calc-btn" onclick="calcInput('6')">6</button>
                    <button class="calc-btn op" onclick="calcInput('-')">-</button>
                    <button class="calc-btn" onclick="calcInput('1')">1</button>
                    <button class="calc-btn" onclick="calcInput('2')">2</button>
                    <button class="calc-btn" onclick="calcInput('3')">3</button>
                    <button class="calc-btn op" onclick="calcInput('+')">+</button>
                    <button class="calc-btn" onclick="calcInput('0')" style="grid-column: span 2;">0</button>
                    <button class="calc-btn" onclick="calcInput('.')">.</button>
                    <button class="calc-btn op" onclick="calcInput('=')" style="background:var(--primary);">=</button>
                </div>
            </div>
        `;
        window.calcExpression = "";
        window.calcInput = (val) => {
            const screen = document.getElementById('calc-screen');
            if (!screen) return;
            if (val === 'C') { window.calcExpression = ""; screen.innerText = "0"; return; }
            if (val === 'DEL') { window.calcExpression = window.calcExpression.slice(0, -1); screen.innerText = window.calcExpression || "0"; return; }
            if (val === '=') {
                if (!/^[\d+\-*/%.() ]+$/.test(window.calcExpression)) {
                    screen.innerText = "Error"; window.calcExpression = ""; return;
                }
                try {
                    const res = Function('"use strict";return (' + window.calcExpression + ')')();
                    screen.innerText = res;
                    window.calcExpression = res.toString();
                } catch (e) { screen.innerText = "Error"; window.calcExpression = ""; }
                return;
            }
            window.calcExpression += val;
            screen.innerText = window.calcExpression;
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

        else if (tool === 'ip') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>IP Lookup</h3>
                <span class="desc-text">Lacak lokasi dari sebuah IP publik (via ipapi.co).</span>
                <input type="text" id="ip-in" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" id="btn-ipbasic">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; line-height:1.8; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            const btn = document.getElementById('btn-ipbasic');
            btn.onclick = async () => {
                const ip = document.getElementById('ip-in').value.trim();
                const b = document.getElementById('ip-res');
                if (!ip) return showToast('Masukkan IP!');
                b.style.display = 'block';
                setBtnLoading(btn, true, 'Lacak');
                b.innerText = 'Mencari...';
                try {
                    const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
                    const data = await res.json();
                    if (data.error) throw new Error(data.reason || 'IP tidak ditemukan');
                    b.innerHTML = `<b>IP:</b> ${escapeHTML(data.ip)}<br><b>Kota:</b> ${escapeHTML(data.city || '-')}<br><b>Negara:</b> ${escapeHTML(data.country_name || '-')}<br><b>ISP:</b> ${escapeHTML(data.org || '-')}`;
                } catch (e) { b.innerText = 'IP tidak ditemukan.'; }
                setBtnLoading(btn, false, 'Lacak');
            };
        }

        else if (tool === 'reverse') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Teks Terbalik</h3>
                <span class="desc-text">Balik urutan huruf dalam teks secara instan.</span>
                <input type="text" id="rev-in" placeholder="Ketik teks...">
                <button class="action-btn" id="btn-rev">Balik Teks</button>
                <div id="rev-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-rev').onclick = () => {
                const v = document.getElementById('rev-in').value;
                if (!v) return showToast('Isi teks!');
                const b = document.getElementById('rev-res');
                b.style.display = 'block'; b.innerText = v.split("").reverse().join("");
            };
        }

        else if (tool === 'scramble') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Acak Huruf</h3>
                <span class="desc-text">Acak urutan huruf dari sebuah kata.</span>
                <input type="text" id="scr-in" placeholder="Ketik teks...">
                <button class="action-btn" id="btn-scr">Acak</button>
                <div id="scr-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-scr').onclick = () => {
                const v = document.getElementById('scr-in').value;
                if (!v) return showToast('Isi teks!');
                const b = document.getElementById('scr-res');
                b.style.display = 'block'; b.innerText = v.split('').sort(() => 0.5 - Math.random()).join('');
            };
        }

        else if (tool === 'timer') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Timer</h3>
                <span class="desc-text">Pasang timer hitung mundur sesuai detik yang lu mau.</span>
                <input type="number" id="timer-in" placeholder="Detik (Cth: 10)">
                <button class="action-btn" id="btn-tmr">Mulai</button>
                <div id="timer-res" style="display:none; margin-top:15px; text-align:center; font-size:32px; font-weight:bold; color:var(--primary); border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);">0</div>
            `;
            document.getElementById('btn-tmr').onclick = () => {
                let s = parseInt(document.getElementById('timer-in').value);
                if (!s) return showToast('Isi detik!');
                const b = document.getElementById('timer-res');
                b.style.display = 'block';
                b.innerText = s;
                if (window.activeTimerInterval) clearInterval(window.activeTimerInterval);
                window.activeTimerInterval = setInterval(() => {
                    s--;
                    b.innerText = s;
                    if (s <= 0) {
                        clearInterval(window.activeTimerInterval);
                        showToast('Waktu Habis!');
                    }
                }, 1000);
            };
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

        else if (tool === 'warna') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Gen Warna</h3>
                <span class="desc-text">Generate kode warna HEX acak.</span>
                <button class="action-btn" id="btn-warna">Generate Warna</button>
                <div id="warna-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; padding:40px 15px; border-radius:8px; border:3px dashed var(--border); transition:0.3s;"></div>
            `;
            document.getElementById('btn-warna').onclick = () => {
                const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                const b = document.getElementById('warna-res');
                b.style.display = 'block';
                b.style.background = hex;
                b.style.color = (parseInt(hex.replace('#', ''), 16) > 0xffffff / 2) ? '#000' : '#fff';
                b.innerText = hex.toUpperCase();
            };
        }

        // =========================================
        // ALIGHT MOTION (FITUR SULTAN)
        // =========================================
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
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/amprem`, {
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

        // =========================================
        // FITUR SUPABASE
        // =========================================
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
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
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
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
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
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'spotify', params: { url: url } })
                    });
                    const data = await res.json();
                    if (!data.status) throw new Error(data.message || 'Gagal');
                    const s = data.data;
                    box.innerHTML = `
                        <img src="${escapeHTML(s.cover)}" style="width:100px; height:100px; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                        <b>${escapeHTML(s.title)}</b><br>
                        <p style="font-size:11px; opacity:0.8;">${escapeHTML(s.artist)} • ${escapeHTML(s.album)}</p>
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
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
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
                            const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
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

        // ---------- FALLBACK ----------
        else {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Tool Tidak Ditemukan</h3>
                <span class="desc-text">Modul "${escapeHTML(tool)}" belum tersedia atau sedang dalam pengembangan.</span>
            `;
        }
    };

    // =========================================
    // 11. SEARCH FILTER
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
                const title = card.querySelector('h4').innerText.toLowerCase();
                card.style.display = title.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // =========================================
    // 12. UPDATE VISUAL: TANDAI TOOL MAINTENANCE
    // =========================================
    const igCard = document.querySelector('.tool-card[onclick="openTool(\'instagram\')"]');
    if (igCard) {
        igCard.classList.add('maintenance');
        const igTitle = igCard.querySelector('h4');
        if (igTitle) igTitle.innerText = 'Instagram DL';
    }

});