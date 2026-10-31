document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 1. INTRO SCREEN FULLSCREEN (SPLASH SCREEN)
    // =========================================
    const introScreen = document.getElementById('intro-screen');
    const introVideo = document.getElementById('intro-video');
    const introBar = document.getElementById('intro-loader-bar');
    const introBrand = document.getElementById('intro-brand');

    if (introScreen) {
        const hasSeenIntro = sessionStorage.getItem('intro_shown');

        if (hasSeenIntro === 'true') {
            introScreen.remove();
        } else {
            document.body.classList.add('intro-active');
            document.body.style.overflow = 'hidden';

            if (introVideo) {
                introVideo.addEventListener('timeupdate', () => {
                    if (introVideo.duration) {
                        const percent = (introVideo.currentTime / introVideo.duration) * 100;
                        if (introBar) introBar.style.width = percent + '%';
                        if (introVideo.currentTime / introVideo.duration > 0.7 && introBrand) {
                            introBrand.classList.add('show');
                        }
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
            };

            window.skipIntro = () => {
                if (introVideo) introVideo.pause();
                window.closeIntro();
            };
        }
    }

    // =========================================
    // 2. POP-UP WHATSAPP (MUNCUL TIAP 24 JAM / RESET)
    // =========================================
    const waPopup = document.getElementById('wa-popup');
    const LAST_SHOWN = localStorage.getItem('wa_popup_last');
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (!LAST_SHOWN || (Date.now() - Number(LAST_SHOWN)) > ONE_DAY) {
        setTimeout(() => {
            if(waPopup) waPopup.classList.add('active');
            localStorage.setItem('wa_popup_last', Date.now().toString());
        }, 1000);
    }
    
    window.closeWaPopup = () => { if(waPopup) waPopup.classList.remove('active'); };

    // =========================================
    // 3. GANTI TEMA
    // =========================================
    window.setTheme = (themeName) => {
        document.body.setAttribute('data-theme', themeName);
        showToast(`Tema diubah ke ${themeName.toUpperCase()}`);
    };

    // =========================================
    // 4. NAVIGASI (DENGAN PAGE TRANSITION)
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
        }, 200);

        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        if (btn) btn.classList.add('active');
    };

    // =========================================
    // 5. TOAST & HAPTIC FEEDBACK
    // =========================================
    window.showToast = (msg) => {
        const c = document.getElementById('toast-container');
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

    document.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.press') && navigator.vibrate) {
            navigator.vibrate(15);
        }
    });

    // =========================================
    // 6. DEVICE, BATERAI, JAM
    // =========================================
    function updateTime() {
        const now = new Date();
        const c = document.getElementById('clock-now');
        if(c) c.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateTime, 1000); 
    updateTime();

    const ua = navigator.userAgent;
    let dev = "Device";
    if (/android/i.test(ua)) dev = "Android"; 
    else if (/iPad|iPhone|iPod/.test(ua)) dev = "iOS";
    else dev = "Desktop";
    
    const dEl = document.getElementById('device-name'); 
    if(dEl) dEl.innerText = dev;

    if (navigator.getBattery) {
        navigator.getBattery().then(b => {
            const bEl = document.getElementById('battery-level');
            if(bEl) {
                bEl.innerText = Math.round(b.level * 100) + "%";
                b.addEventListener('levelchange', () => {
                    bEl.innerText = Math.round(b.level * 100) + "%";
                });
            }
        });
    }

    // =========================================
    // 7. MUSIK WIDGET & PLAYLIST
    // =========================================
    const bgm = document.getElementById('bgm');
    const icPlay = document.getElementById('ic-play');
    const icPause = document.getElementById('ic-pause');
    let isPlaying = false;
    let currentSong = 0;

    const playlist = [
        { name: "Lagu Viral 1", src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793393742446.mp3" },
        { name: "Lagu Viral 2", src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793393794063.mp3" },
        { name: "Lagu Viral 3", src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/ssstik.io_1793394292663.mp3" },
        { name: "Teh Hijau", src: "https://chcfvbqyygtkfcvhywoa.supabase.co/storage/v1/object/public/lagu/TULUS%20-%20Teh%20Hijau%20(Official%20Lyric%20Video).mp3" }
    ];

    window.loadSong = (index) => {
        currentSong = index;
        bgm.src = playlist[index].src;
    };

    window.toggleMusic = () => {
        if(!isPlaying) {
            if(!bgm.src) loadSong(0);
            bgm.volume = 0.5;
            bgm.play().then(() => {
                isPlaying = true;
                icPlay.style.display = 'none';
                icPause.style.display = 'block';
            }).catch(() => showToast('Klik sekali lagi untuk memutar musik'));
        } else {
            bgm.pause();
            isPlaying = false;
            icPlay.style.display = 'block';
            icPause.style.display = 'none';
        }
    };

    window.nextSong = () => {
        currentSong = (currentSong + 1) % playlist.length;
        loadSong(currentSong);
        if(isPlaying) bgm.play().catch(()=>{});
    };

    window.prevSong = () => {
        currentSong = (currentSong - 1 + playlist.length) % playlist.length;
        loadSong(currentSong);
        if(isPlaying) bgm.play().catch(()=>{});
    };

    bgm.onended = () => { if(isPlaying) nextSong(); };
    loadSong(0);

    window.resetData = () => {
        if(confirm("Yakin mau hapus cache dan muat ulang web?")) {
            sessionStorage.clear();
            localStorage.removeItem('wa_popup_last');
            location.reload();
        }
    };

    // =========================================
    // 8. MODAL BOTTOM SHEET SETUP
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');
    
    window.closeModal = () => { 
        modal.classList.remove('active'); 
        if (window.activeTimerInterval) clearInterval(window.activeTimerInterval);
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
    };
    window.closeModalOnOverlay = (e) => { 
        if(e.target.id === 'tool-modal') closeModal(); 
    };
    const closeSvg = `<button class="modal-close press" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

    // =========================================
    // 9. FITUR TOOLS (DOWNLOADER & STALKER)
    // =========================================
    window.openTool = (tool) => {
        modal.classList.add('active');
        
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>TikTok DL</h3>
                <span class="desc-text">Download video TikTok tanpa watermark. Cukup paste link videonya, lalu simpan ke galeri HP lu.</span>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                if(!url) return showToast('Masukkan link dulu!');
                
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Gagal');
                    const vid = data.data.hdplay || data.data.play;
                    box.innerHTML = `
                        <video style="width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);" src="${vid}" controls></video>
                        <button class="action-btn" id="btn-save-tt">Download Video</button>
                    `;
                    document.getElementById('btn-save-tt').onclick = async () => {
                        const blob = await (await fetch(vid)).blob();
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob); a.download = `tt-${Date.now()}.mp4`; a.click();
                        showToast('Tersimpan!');
                    };
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal ambil video.</p>'; }
            };
        }

        else if (tool === 'instagram') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Instagram DL</h3>
                <span class="desc-text">Download foto, video, atau Reels dari Instagram. Bisa juga kok buat akun yang nggak lu follow. Konten publik tinggal disave aja.</span>
                <input type="text" id="ig-url" placeholder="Paste link IG...">
                <button class="action-btn" onclick="downloadIG()">Download</button>
                <div id="ig-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadIG = async () => {
                const url = document.getElementById('ig-url').value.trim();
                const box = document.getElementById('ig-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/button/instagram?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    const mediaUrl = data.url || data.video;
                    if(!mediaUrl) throw new Error('Gagal');
                    box.innerHTML = `
                        <video src="${mediaUrl}" controls style="width:100%; border-radius:8px; border:3px solid var(--border);"></video>
                        <a href="${mediaUrl}" download class="action-btn" style="margin-top:10px;">Simpan</a>
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Akun private atau API down.</p>'; }
            };
        }

        else if (tool === 'facebook') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Facebook DL</h3>
                <span class="desc-text">Simpan video dari Facebook dalam kualitas HD. Cocok buat download video grup atau postingan yang nggak bisa disave manual.</span>
                <input type="text" id="fb-url" placeholder="Paste link Facebook...">
                <button class="action-btn" onclick="downloadFacebook()">Download</button>
                <div id="fb-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadFacebook = async () => {
                const url = document.getElementById('fb-url').value.trim();
                const box = document.getElementById('fb-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/button/facebook?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    const videoUrl = data.hd || data.sd || data.url;
                    if(!videoUrl) throw new Error('Video tidak ditemukan');
                    box.innerHTML = `
                        <video src="${videoUrl}" controls style="width:100%; border-radius:8px; border:3px solid var(--border);"></video>
                        <a href="${videoUrl}" download class="action-btn" style="margin-top:10px;">Simpan Video</a>
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Video private atau API down.</p>'; }
            };
        }

        else if (tool === 'pinterest') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Pinterest DL</h3>
                <span class="desc-text">Download gambar atau video dari Pinterest. Cukup paste link postingannya. Simpan inspirasi desain atau wallpaper favorit lu.</span>
                <input type="text" id="pin-url" placeholder="Paste link Pinterest (pin.it/...)">
                <button class="action-btn" onclick="downloadPinterest()">Download</button>
                <div id="pin-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadPinterest = async () => {
                const url = document.getElementById('pin-url').value.trim();
                const box = document.getElementById('pin-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://api.pinterestdl.app/api/download?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.error || !data.video && !data.image) throw new Error('Gagal');
                    const mediaUrl = data.video || data.image;
                    const isVideo = mediaUrl.includes('.mp4');
                    box.innerHTML = `
                        ${isVideo 
                            ? `<video src="${mediaUrl}" controls style="width:100%; border-radius:8px; border:3px solid var(--border);"></video>` 
                            : `<img src="${mediaUrl}" style="width:100%; border-radius:8px; border:3px solid var(--border);">`
                        }
                        <a href="${mediaUrl}" download class="action-btn" style="margin-top:10px;">Simpan</a>
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Link private atau API down.</p>'; }
            };
        }

        else if (tool === 'stalkig') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Instagram</h3>
                <span class="desc-text">Kepo sama profil IG orang? Masukin aja usernamenya. Lu bisa liat foto, bio, jumlah followers, dan postingan tanpa harus follow.</span>
                <input type="text" id="stalkig-user" placeholder="Username (tanpa @)">
                <button class="action-btn" onclick="stalkIG()">Cari</button>
                <div id="stalkig-res" style="display:none; margin-top:15px; border:3px solid var(--border); padding:15px; border-radius:8px; text-align:left;"></div>
            `;
            window.stalkIG = async () => {
                const user = document.getElementById('stalkig-user').value.trim();
                const box = document.getElementById('stalkig-res');
                if(!user) return showToast('Masukkan username!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/stalk/instagram?username=${user}`);
                    const data = await res.json();
                    if(!data.status) throw new Error('Gagal');
                    const d = data.data;
                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${d.profile_pic}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${d.username}<br>
                        <b>Nama:</b> ${d.full_name}<br>
                        <b>Bio:</b> ${d.bio || '-'}<br>
                        <b>Followers:</b> ${d.followers}<br>
                        <b>Following:</b> ${d.following}<br>
                        <b>Posts:</b> ${d.posts}
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Akun private atau API down.</p>'; }
            };
        }

        else if (tool === 'stalktt') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk TikTok</h3>
                <span class="desc-text">Cek statistik akun TikTok tanpa buka aplikasinya. Bisa liat jumlah followers, total likes, dan bio-nya. Cocok buat stalking akun gebetan.</span>
                <input type="text" id="stalktt-user" placeholder="Username (tanpa @)">
                <button class="action-btn" onclick="stalkTT()">Cari</button>
                <div id="stalktt-res" style="display:none; margin-top:15px; border:3px solid var(--border); padding:15px; border-radius:8px; text-align:left;"></div>
            `;
            window.stalkTT = async () => {
                const user = document.getElementById('stalktt-user').value.trim();
                const box = document.getElementById('stalktt-res');
                if(!user) return showToast('Masukkan username!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/stalk/tiktok?username=${user}`);
                    const data = await res.json();
                    if(!data.status) throw new Error('Gagal');
                    const d = data.data;
                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${d.avatar}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${d.username}<br>
                        <b>Nama:</b> ${d.nickname}<br>
                        <b>Bio:</b> ${d.signature || '-'}<br>
                        <b>Followers:</b> ${d.followers}<br>
                        <b>Following:</b> ${d.following}<br>
                        <b>Likes:</b> ${d.likes}
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Akun private atau API down.</p>'; }
            };
        }

        else if (tool === 'stalkroblox') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Roblox</h3>
                <span class="desc-text">Lacak profil Roblox player lain. Cek avatar, bio, dan kapan akun itu dibuat. Berguna buat ngecek akun scam atau temen main.</span>
                <input type="text" id="stalkrbx-user" placeholder="Username Roblox">
                <button class="action-btn" onclick="stalkRoblox()">Cari</button>
                <div id="stalkrbx-res" style="display:none; margin-top:15px; border:3px solid var(--border); padding:15px; border-radius:8px; text-align:left;"></div>
            `;
            window.stalkRoblox = async () => {
                const user = document.getElementById('stalkrbx-user').value.trim();
                const box = document.getElementById('stalkrbx-res');
                if(!user) return showToast('Masukkan username!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const idRes = await fetch(`https://users.roblox.com/v1/usernames/users`, {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({usernames: [user], excludeBannedUsers: true})
                    });
                    const idData = await idRes.json();
                    if(!idData.data || idData.data.length === 0) throw new Error('User tidak ditemukan');
                    
                    const userId = idData.data[0].id;
                    const infoRes = await fetch(`https://users.roblox.com/v1/users/${userId}`);
                    const infoData = await infoRes.json();
                    
                    const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=false`);
                    const avatarData = await avatarRes.json();
                    const avatarUrl = avatarData.data[0].imageUrl;

                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${avatarUrl}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${infoData.name}<br>
                        <b>Display Name:</b> ${infoData.displayName}<br>
                        <b>Bio:</b> ${infoData.description || '-'}<br>
                        <b>Dibuat:</b> ${new Date(infoData.created).toLocaleDateString('id-ID')}
                    `;
                } catch(e) { box.innerHTML = '<p class="error-msg">Gagal. Username tidak ditemukan atau API down.</p>'; }
            };
        }
        // =========================================
// 10. TOOLS GAMBAR & TEKS
// =========================================
else if (tool === 'qr') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>QR Code</h3>
        <span class="desc-text">Ubah teks, link website, atau nomor WA jadi gambar QR Code. Tinggal scan pakai kamera HP, langsung kebuka.</span>
        <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools by Andika T.M">
        <button class="action-btn" id="btn-qr">Generate QR</button>
        <div style="text-align:center; margin-top:15px;"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZenkaiTools" style="max-width:100%; border-radius:8px; border:3px solid var(--border);"></div>
    `;
    document.getElementById('btn-qr').onclick = () => {
        const txt = document.getElementById('qr-text').value || "ZenkaiTools";
        document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(txt)}`;
    };
}

else if (tool === 'imgtoqr') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Bikin QR Code</h3>
        <span class="desc-text">Bikin QR Code resolusi tinggi (HD). Cocok buat dicetak jadi stiker, banner, atau ditempel di dinding.</span>
        <input type="text" id="qr-txt" placeholder="Ketik teks/link...">
        <button class="action-btn" onclick="genQR()">Buat QR</button>
        <div style="text-align:center; margin-top:15px;">
            <img id="qr-img" src="" style="max-width:100%; border-radius:8px; border:3px solid var(--border); display:none;">
        </div>
    `;
    window.genQR = () => {
        const txt = document.getElementById('qr-txt').value;
        if(!txt) return showToast('Isi teks dulu!');
        const img = document.getElementById('qr-img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(txt)}`;
        img.style.display = 'inline-block';
    };
}

else if (tool === 'imgtojpg') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Image to JPG</h3>
        <span class="desc-text">Ubah format gambar (PNG/WebP) jadi JPG. Cocok buat kompres ukuran foto biar nggak makan memori HP.</span>
        <input type="file" id="jpg-in" accept="image/*" style="padding:10px; margin-bottom:15px; background:transparent; border:2px dashed var(--border); width:100%;">
        <div id="jpg-res" style="display:none; text-align:center;">
            <img id="jpg-preview" style="max-width:100%; border-radius:8px; border:3px solid var(--border); margin-bottom:10px;">
            <a id="jpg-dl" class="action-btn" download="gambar.jpg">Download JPG</a>
        </div>
    `;
    document.getElementById('jpg-in').onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
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

else if (tool === 'hdimage') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Image HD (Upscale)</h3>
        <span class="desc-text">Naikin resolusi gambar jadi 2x lipat lebih tajam. Foto yang tadinya blur atau pecah bisa jadi lebih jernih.</span>
        <input type="file" id="hd-in" accept="image/*" style="padding:10px; margin-bottom:15px; background:transparent; border:2px dashed var(--border); width:100%;">
        <div id="hd-res" style="display:none; text-align:center;">
            <img id="hd-preview" style="max-width:100%; border-radius:8px; border:3px solid var(--border); margin-bottom:10px;">
            <a id="hd-dl" class="action-btn" download="hd-image.png">Download HD</a>
        </div>
    `;
    document.getElementById('hd-in').onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width * 2; 
                canvas.height = img.height * 2;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                const dataUrl = canvas.toDataURL('image/png');
                
                document.getElementById('hd-res').style.display = 'block';
                document.getElementById('hd-preview').src = dataUrl;
                document.getElementById('hd-dl').href = dataUrl;
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
        <span class="desc-text">Bingung cari username buat akun baru atau nick game? Generate aja di sini. Bisa dapet ide username aesthetic secara acak.</span>
        <input type="text" id="user-name" placeholder="Nama kamu (cth: andika)">
        <button class="action-btn" onclick="genUser()">Generate</button>
        <div id="user-res" style="display:none; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px; background:var(--card-bg);"></div>
    `;
    window.genUser = () => {
        const name = document.getElementById('user-name').value.trim() || "user";
        const rand = Math.floor(Math.random() * 9999);
        const suffix = Math.random() > 0.5 ? "._" : "_";
        const b = document.getElementById('user-res');
        b.style.display = 'block';
        b.innerHTML = `@${name}${suffix}${rand}<br><span style="font-size:12px; opacity:0.7;">(Klik generate lagi buat ganti)</span>`;
    };
}

else if (tool === 'artinama') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Arti Nama</h3>
        <span class="desc-text">Cari tahu arti dan asal-usul dari sebuah nama. Cocok buat cari referensi nama bayi, atau sekadar penasaran arti nama lu sendiri.</span>
        <input type="text" id="nama-in" placeholder="Ketik nama...">
        <button class="action-btn" onclick="cariArti()">Cari Arti</button>
        <div id="nama-res" style="display:none; text-align:left; line-height:1.6; border:3px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px; background:var(--card-bg);"></div>
    `;
    window.cariArti = () => {
        const nama = document.getElementById('nama-in').value.trim().toLowerCase();
        if(!nama) return showToast('Masukkan nama!');
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
        if(database[nama]) {
            b.innerHTML = `<b>Arti Nama ${nama.toUpperCase()}:</b><br><br>${database[nama]}`;
        } else {
            b.innerHTML = `Maaf, arti nama <b>${nama}</b> belum ada di database. Silakan coba nama lain.`;
        }
    };
}

else if (tool === 'password') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Password Gen</h3>
        <span class="desc-text">Buat password acak 16 karakter (huruf, angka, simbol) yang susah ditebak. Biar akun sosmed atau game lu nggak gampang dijebol hacker.</span>
        <button class="action-btn" onclick="genPass()">Generate Password</button>
        <div id="pass-res" style="display:none; font-size:20px; font-weight:800; color:var(--primary); text-align:center; margin-top:15px; border:3px dashed var(--border); padding:15px; border-radius:8px; word-break:break-all; background:var(--card-bg);"></div>
    `;
    window.genPass = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let pass = "";
        for(let i=0; i<16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
        const b = document.getElementById('pass-res');
        b.style.display = 'block'; b.innerText = pass;
    };
}

else if (tool === 'calc') {
    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Kalkulator</h3>
        <span class="desc-text">Kalkulator simpel buat hitung angka dasar (tambah, kurang, kali, bagi). Praktis tanpa harus buka aplikasi kalkulator bawaan HP.</span>
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
        if(val === 'C') { window.calcExpression = ""; screen.innerText = "0"; return; }
        if(val === 'DEL') { window.calcExpression = window.calcExpression.slice(0, -1); screen.innerText = window.calcExpression || "0"; return; }
        if(val === '=') {
            try {
                const res = Function('"use strict";return (' + window.calcExpression + ')')();
                screen.innerText = res;
                window.calcExpression = res.toString();
            } catch(e) { screen.innerText = "Error"; window.calcExpression = ""; }
            return;
        }
        window.calcExpression += val;
        screen.innerText = window.calcExpression;
    };
} 

else if (tool === 'zodiak') {
    let tgls = ''; for(let i=1; i<=31; i++) tgls += `<div onclick="setZ('tgl',${i},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${i}</div>`;
    let blns = ''; const b = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
    b.forEach((nm, i) => blns += `<div onclick="setZ('bln',${i+1},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${nm}</div>`);

    modalContent.innerHTML = `
        ${closeSvg}
        <h3>Cek Zodiak</h3>
        <span class="desc-text">Lagi penasaran zodiak lu apa? Atau mau cek kecocokan zodiak sama doi? Tinggal pilih tanggal lahir lu, langsung ketahuan.</span>
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
        if(t === 'tgl') { window.zTgl = v; document.getElementById('btn-tgl').innerText = v; }
        if(t === 'bln') { window.zBln = v; document.getElementById('btn-bln').innerText = el.innerText; }
        document.getElementById('list-tgl').style.display = 'none';
        document.getElementById('list-bln').style.display = 'none';
    };
    window.cekZodiak = () => {
        if(!window.zTgl || !window.zBln) return showToast('Pilih dulu!');
        let z = "";
        const t = window.zTgl, bl = window.zBln;
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
                <span class="desc-text">Encode teks jadi kode rahasia, atau decode balik ke teks asli. Sering dipake programmer buat nyelipin data di dalam sistem.</span>
                <textarea id="b64-in" rows="3" placeholder="Teks..."></textarea>
                <div style="display:flex;gap:10px; justify-content:center;">
                    <button class="action-btn" onclick="b64Act('enc')" style="flex:1;">Encode</button>
                    <button class="action-btn" onclick="b64Act('dec')" style="flex:1;">Decode</button>
                </div>
                <div id="b64-res" style="display:none; margin-top:15px; word-break:break-all; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            window.b64Act = (type) => {
                const v = document.getElementById('b64-in').value;
                const b = document.getElementById('b64-res');
                if(!v) return showToast('Isi teks!');
                b.style.display = 'block';
                try {
                    if(type === 'enc') b.innerText = btoa(unescape(encodeURIComponent(v)));
                    else b.innerText = decodeURIComponent(escape(atob(v)));
                } catch(e) { b.innerText = 'Gagal memproses.'; }
            };
        }

        else if (tool === 'ip') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>IP Lookup</h3>
                <span class="desc-text">Lacak lokasi dari sebuah IP publik. Bisa buat ngecek asal koneksi, negara, atau ISP yang dipakai. (Cth: 8.8.8.8).</span>
                <input type="text" id="ip-in" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" onclick="cekIP()">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; line-height:1.8; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            window.cekIP = async () => {
                const ip = document.getElementById('ip-in').value;
                const b = document.getElementById('ip-res');
                if(!ip) return showToast('Masukkan IP!');
                b.style.display = 'block'; b.innerText = 'Mencari...';
                try {
                    const res = await fetch(`https://ipapi.co/${ip}/json/`);
                    const data = await res.json();
                    b.innerHTML = `<b>IP:</b> ${data.ip}<br><b>Kota:</b> ${data.city}<br><b>Negara:</b> ${data.country_name}<br><b>ISP:</b> ${data.org}`;
                } catch(e) { b.innerText = 'IP tidak ditemukan.'; }
            };
        }

        else if (tool === 'reverse') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Teks Terbalik</h3>
                <span class="desc-text">Balik urutan huruf dalam teks secara instan. Cocok buat nulis pesan rahasia, prank temen, atau sekadar iseng.</span>
                <input type="text" id="rev-in" placeholder="Ketik teks...">
                <button class="action-btn" onclick="doReverse()">Balik Teks</button>
                <div id="rev-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            window.doReverse = () => {
                const v = document.getElementById('rev-in').value;
                if(!v) return showToast('Isi teks!');
                const b = document.getElementById('rev-res');
                b.style.display = 'block'; b.innerText = v.split("").reverse().join("");
            };
        }

        else if (tool === 'scramble') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Acak Huruf</h3>
                <span class="desc-text">Acak urutan huruf dari sebuah kata. Bisa dipakai buat bikin kata sandi random, CAPTCHA, atau kode unik.</span>
                <input type="text" id="scr-in" placeholder="Ketik teks...">
                <button class="action-btn" onclick="doScramble()">Acak</button>
                <div id="scr-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            window.doScramble = () => {
                const v = document.getElementById('scr-in').value;
                if(!v) return showToast('Isi teks!');
                const b = document.getElementById('scr-res');
                b.style.display = 'block'; b.innerText = v.split('').sort(() => 0.5 - Math.random()).join('');
            };
        }

        else if (tool === 'timer') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Timer</h3>
                <span class="desc-text">Pasang timer hitung mundur sesuai detik yang lu mau. Cocok buat alarm masak mie, waktu belajar, atau interval olahraga.</span>
                <input type="number" id="timer-in" placeholder="Detik (Cth: 10)">
                <button class="action-btn" onclick="startTimer()">Mulai</button>
                <div id="timer-res" style="display:none; margin-top:15px; text-align:center; font-size:32px; font-weight:bold; color:var(--primary); border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);">0</div>
            `;
            window.startTimer = () => {
                let s = parseInt(document.getElementById('timer-in').value);
                if(!s) return showToast('Isi detik!');
                const b = document.getElementById('timer-res');
                b.style.display = 'block';
                b.innerText = s;
                if (window.activeTimerInterval) clearInterval(window.activeTimerInterval);
                window.activeTimerInterval = setInterval(() => {
                    s--;
                    b.innerText = s;
                    if(s <= 0) { 
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
                <span class="desc-text">Hitung umur lu atau orang lain berdasarkan tanggal lahir. Hasilnya bisa tahu persis udah berapa tahun lu hidup di dunia ini.</span>
                <input type="date" id="umur-in">
                <button class="action-btn" onclick="hitungUmur()">Hitung</button>
                <div id="umur-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            window.hitungUmur = () => {
                const v = document.getElementById('umur-in').value;
                if(!v) return showToast('Pilih tanggal!');
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
                <span class="desc-text">Bingung mau pilih warna apa? Generate aja kode warna HEX acak di sini. Cocok buat referensi desain atau bikin tema web.</span>
                <button class="action-btn" onclick="genWarna()">Generate Warna</button>
                <div id="warna-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; padding:40px 15px; border-radius:8px; border:3px dashed var(--border); transition:0.3s;"></div>
            `;
            window.genWarna = () => {
                const hex = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
                const b = document.getElementById('warna-res');
                b.style.display = 'block';
                b.style.background = hex;
                b.style.color = (parseInt(hex.replace('#',''), 16) > 0xffffff/2) ? '#000' : '#fff';
                b.innerText = hex.toUpperCase();
            };
        }
    };

    // =========================================
    // 11. SEARCH FILTER
    // =========================================
    const sInput = document.getElementById('search-tools');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tool-card').forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                card.style.display = title.includes(term) ? 'flex' : 'none';
            });
        });
    }

    // =========================================
    // 12. LOGIKA ZENFUN (BYPASS & ALIGHT) & FITUR BARU
    // =========================================
    const originalOpenTool = window.openTool;
    window.openTool = (tool) => {
        originalOpenTool(tool);
        
        if (tool === 'linkvertise') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Bypass Link</h3>
                <span class="desc-text">Nembus link iklan yang bikin pusing (Linkvertise, SFL, dll). Lu tinggal paste link-nya, langsung dapet link asli tanpa harus klik iklan satu-satu.</span>
                <input type="text" id="bypass-url" placeholder="Paste link disini...">
                <button class="action-btn" id="btn-bypass">Bypass Sekarang</button>
                <div id="bypass-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; word-break:break-all; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-bypass').onclick = async () => {
                const url = document.getElementById('bypass-url').value.trim();
                const box = document.getElementById('bypass-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://sylvatica.my.id/api/bypass/linkvertise?url=${encodeURIComponent(url)}&apikey=sylva-e96de6848abe4ce410a0f85ceb0d25ce`);
                    const data = await res.json();
                    if(!data.status) throw new Error(data.error || 'Gagal');
                    box.innerHTML = `
                        <p style="font-size:12px; margin-bottom:10px;">Link Asli:</p>
                        <a href="${data.result.url}" target="_blank" style="color:var(--primary); font-weight:bold;">${data.result.url}</a>
                    `;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'alightmotion') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Alight Motion</h3>
                <span class="desc-text">Bypass akun Premium Alight Motion secara gratis. Ikuti tutorial di bawah ini biar nggak gagal.</span>
                
                <div style="text-align:left; font-size:11px; background:rgba(0,0,0,0.05); padding:12px; border-radius:8px; margin-bottom:15px; border:2px dashed var(--border); line-height:1.5;">
                    <b style="color:var(--primary);">📌 TUTORIAL:</b><br>
                    1. Buka Aplikasi Alight Motion.<br>
                    2. Login pakai Email (bukan Google/FB).<br>
                    3. Masukkan email yang sama di bawah.<br>
                    4. Generate & cek Inbox/Spam.<br>
                    5. Klik link verifikasi. Aplikasi otomatis Premium! ✅
                </div>
                <input type="email" id="am-email" placeholder="Ketik email aktif lu...">
                <button class="action-btn" id="btn-am">Generate Link</button>
                <div id="am-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
                <div style="font-size:9px; opacity:0.6; margin-top:15px; text-align:center;">⚠️ Gunakan dengan bijak.</div>
            `;
            document.getElementById('btn-am').onclick = async () => {
                const email = document.getElementById('am-email').value.trim();
                const box = document.getElementById('am-res');
                if (!email) return showToast('Masukkan email dulu bro!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/amprem`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email })
                    });
                    const data = await res.json();
                    if (data.status === false || data.error) throw new Error(data.message || 'Gagal');
                    box.innerHTML = `<p class="success-msg">Berhasil Terkirim! ✅<br><span style="font-size:11px; font-weight:normal;">Cek Inbox/Spam di <b>${email}</b>.</span></p>`;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        // =========================================
        // 13. FITUR BARU (KURONEKO / SUPABASE)
        // =========================================
        else if (tool === 'tempmail') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Temp Mail</h3>
                <span class="desc-text">Bikin email sementara (dummy) buat verifikasi. Aman dari spam dan nggak perlu daftar.</span>
                <button class="action-btn" id="btn-tm">Buat Email</button>
                <div id="tm-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-tm').onclick = async () => {
                const box = document.getElementById('tm-res');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'tempmail_create', params: {} })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.message || 'Gagal');
                    box.innerHTML = `<p style="font-size:12px; margin-bottom:10px;">Email Lu:</p><b style="font-size:16px; color:var(--primary); word-break:break-all;">${data.result.email}</b><br><p style="font-size:11px; opacity:0.8; margin-top:5px;">(Token: ${data.result.token})</p>`;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'nik') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>NIK Parser</h3>
                <span class="desc-text">Bongkar data dari NIK KTP. Cek Provinsi, Kabupaten, Tanggal Lahir, Zodiak, dan Usia.</span>
                <input type="text" id="nik-input" placeholder="Masukkan 16 digit NIK...">
                <button class="action-btn" id="btn-nik">Lacak NIK</button>
                <div id="nik-res" style="display:none; margin-top:15px; text-align:left; border:3px dashed var(--border); padding:15px; border-radius:8px; font-size:12px; line-height:1.6; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-nik').onclick = async () => {
                const nik = document.getElementById('nik-input').value.trim();
                const box = document.getElementById('nik-res');
                if(!nik) return showToast('Masukkan NIK!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'nik', params: { nik: nik } })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.error || 'NIK tidak valid');
                    const d = data.data.data;
                    box.innerHTML = `<b>NIK:</b> ${d.nik || nik}<br><b>Provinsi:</b> ${d.provinsi}<br><b>Kabupaten:</b> ${d.kabupaten}<br><b>Kecamatan:</b> ${d.kecamatan}<br><b>Kelamin:</b> ${d.kelamin}<br><b>Tgl Lahir:</b> ${d.tempat_lahir}<br><b>Zodiak:</b> ${d.zodiak}<br><b>Usia:</b> ${d.usia}`;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'mlbb') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk MLBB</h3>
                <span class="desc-text">Cek profil Mobile Legends. Masukin User ID & Server ID buat lihat Nickname, Rank, Skin, dan Squad.</span>
                <input type="text" id="ml-id" placeholder="User ID (cth: 12345678)">
                <input type="text" id="ml-zone" placeholder="Server ID (cth: 2001)">
                <button class="action-btn" id="btn-ml">Lacak</button>
                <div id="ml-res" style="display:none; margin-top:15px; text-align:left; border:3px dashed var(--border); padding:15px; border-radius:8px; font-size:12px; line-height:1.6; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-ml').onclick = async () => {
                const userId = document.getElementById('ml-id').value.trim();
                const serverId = document.getElementById('ml-zone').value.trim();
                const box = document.getElementById('ml-res');
                if(!userId || !serverId) return showToast('Isi ID & Server!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'mlbb', params: { userId: userId, serverId: serverId } })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.message || 'Gagal');
                    const id = data.data.identity;
                    box.innerHTML = `
                        <div style="text-align:center; margin-bottom:10px;">
                            <img src="${id.avatar_url}" style="width:80px; height:80px; border-radius:50%; border:3px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Nickname:</b> ${id.nickname}<br><b>Rank:</b> ${id.current_rank} (${id.current_stars} ⭐)<br><b>Level:</b> ${id.level}<br><b>Skin:</b> ${id.skin_count} Skin<br><b>Region:</b> ${id.location}<br><b>Squad:</b> ${id.squad}
                    `;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
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
            document.getElementById('btn-sp').onclick = async () => {
                const url = document.getElementById('sp-url').value.trim();
                const box = document.getElementById('sp-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'spotify', params: { url: url } })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.message || 'Gagal');
                    const s = data.data;
                    box.innerHTML = `
                        <img src="${s.cover}" style="width:100px; height:100px; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);">
                        <b>${s.title}</b><br><p style="font-size:11px; opacity:0.8;">${s.artist} • ${s.album}</p>
                        <audio src="${s.download_mp3}" controls style="width:100%; margin-top:10px;"></audio>
                        <a href="${s.download_mp3}" class="action-btn" style="margin-top:10px; display:block; text-decoration:none;" download>Simpan MP3</a>
                    `;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'iplookup') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>IP Lookup</h3>
                <span class="desc-text">Lacak IP publik. Cek asal kota, negara, dan ISP.</span>
                <input type="text" id="ip-input" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" id="btn-ip">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; border:3px dashed var(--border); padding:15px; border-radius:8px; font-size:12px; line-height:1.6; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-ip').onclick = async () => {
                const ip = document.getElementById('ip-input').value.trim();
                const box = document.getElementById('ip-res');
                if(!ip) return showToast('Masukkan IP!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'iplookup', params: { ip: ip } })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.message || 'Gagal');
                    const r = data.result;
                    box.innerHTML = `<b>IP:</b> ${r.ip}<br><b>Kota:</b> ${r.city}<br><b>Provinsi:</b> ${r.region_name}<br><b>Negara:</b> ${r.country} (${r.country_code})<br><b>ISP:</b> ${r.isp}<br><b>Org:</b> ${r.org}`;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'removebg') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Remove Background</h3>
                <span class="desc-text">Hapus background gambar otomatis. Cocok buat bikin stiker, foto produk, atau edit foto.</span>
                <input type="text" id="rb-url" placeholder="Paste URL gambar (https://...)">
                <button class="action-btn" id="btn-rb">Proses Gambar</button>
                <div id="rb-res" style="display:none; margin-top:15px; text-align:center; border:3px dashed var(--border); padding:15px; border-radius:8px; background:var(--card-bg);"></div>
            `;
            document.getElementById('btn-rb').onclick = async () => {
                const url = document.getElementById('rb-url').value.trim();
                const box = document.getElementById('rb-res');
                if(!url) return showToast('Masukkan URL gambar!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div>';
                try {
                    const res = await fetch(`https://chcfvbqyygtkfcvhywoa.supabase.co/functions/v1/zen-tools`, {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ path: 'removebg', params: { url: url } })
                    });
                    const data = await res.json();
                    if(!data.status) throw new Error(data.message || 'Gagal');
                    box.innerHTML = `<img src="${data.image_url}" style="max-width:100%; border-radius:8px; margin-bottom:10px; border:3px solid var(--border);"><a href="${data.image_url}" target="_blank" class="action-btn" style="display:block; text-decoration:none;">Buka Gambar HD</a>`;
                } catch(e) { box.innerHTML = `<p class="error-msg">Gagal: ${e.message}</p>`; }
            };
        }
    };

});