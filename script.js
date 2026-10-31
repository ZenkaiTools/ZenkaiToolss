document.addEventListener('DOMContentLoaded', () => {
    
    // 1. POP-UP WHATSAPP
    const waPopup = document.getElementById('wa-popup');
    if (!sessionStorage.getItem('wa_popup_shown')) {
        setTimeout(() => {
            if(waPopup) waPopup.classList.add('active');
            sessionStorage.setItem('wa_popup_shown', 'true');
        }, 1000);
    }
    window.closeWaPopup = () => { if(waPopup) waPopup.classList.remove('active'); };

    // 2. GANTI TEMA
    window.setTheme = (themeName) => {
        document.body.setAttribute('data-theme', themeName);
        showToast(`Tema diubah ke ${themeName.toUpperCase()}`);
    };

    // 3. NAVIGASI
    window.switchPage = (pageId, btn) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        const targetPage = document.getElementById('page-' + pageId);
        if(targetPage) targetPage.classList.add('active');
        if(btn) btn.classList.add('active');
    };

    // 4. TOAST
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

    // 5. DEVICE, BATERAI, JAM
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

    // 6. MUSIK WIDGET
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

    // FUNGSI RESET CACHE
    window.resetData = () => {
        if(confirm("Yakin mau hapus cache dan muat ulang web?")) {
            sessionStorage.clear();
            location.reload();
        }
    };

    // 7. MODAL BOTTOM SHEET
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

    // 8. FITUR TOOLS
    window.openTool = (tool) => {
        modal.classList.add('active');
        
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>TikTok DL</h3>
                <span class="desc-text">Download video TikTok tanpa watermark (HD).</span>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                if(!url) return showToast('Masukkan link dulu!');
                
                box.innerHTML = '<div class="loader"></div><p style="text-align:center;font-size:12px; margin-top:10px;">Memproses video...</p>';
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Gagal');
                    const vid = data.data.hdplay || data.data.play;
                    box.innerHTML = `
                        <video style="width:100%; border-radius:8px; margin-bottom:10px; border:2px solid var(--border);" src="${vid}" controls></video>
                        <button class="action-btn" id="btn-save-tt" style="background:var(--primary);">Download Video</button>
                    `;
                    document.getElementById('btn-save-tt').onclick = async () => {
                        const blob = await (await fetch(vid)).blob();
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob); a.download = `tt-${Date.now()}.mp4`; a.click();
                        showToast('Tersimpan!');
                    };
                } catch(e) { box.innerHTML = '<p style="text-align:center;color:red;">Gagal ambil video.</p>'; }
            };
        }

        else if (tool === 'instagram') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Instagram DL</h3>
                <span class="desc-text">Simpan foto, video, atau Reels dari Instagram.</span>
                <input type="text" id="ig-url" placeholder="Paste link IG...">
                <button class="action-btn" onclick="downloadIG()">Download</button>
                <div id="ig-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadIG = async () => {
                const url = document.getElementById('ig-url').value.trim();
                const box = document.getElementById('ig-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p>Memproses...</p>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/button/instagram?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    const mediaUrl = data.url || data.video;
                    if(!mediaUrl) throw new Error('Gagal');
                    box.innerHTML = `
                        <video src="${mediaUrl}" controls style="width:100%; border-radius:8px; border:2px solid var(--border);"></video>
                        <a href="${mediaUrl}" download class="action-btn" style="margin-top:10px;">Simpan</a>
                    `;
                } catch(e) { box.innerHTML = '<p style="color:red;">Gagal. Akun private atau API down.</p>'; }
            };
        }

        else if (tool === 'facebook') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Facebook DL</h3>
                <span class="desc-text">Download video dari Facebook dalam resolusi terbaik.</span>
                <input type="text" id="fb-url" placeholder="Paste link Facebook...">
                <button class="action-btn" onclick="downloadFacebook()">Download</button>
                <div id="fb-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadFacebook = async () => {
                const url = document.getElementById('fb-url').value.trim();
                const box = document.getElementById('fb-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p>Memproses...</p>';
                try {
                    const res = await fetch(`https://api.vevioz.com/api/button/facebook?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    const videoUrl = data.hd || data.sd || data.url;
                    if(!videoUrl) throw new Error('Video tidak ditemukan');
                    box.innerHTML = `
                        <video src="${videoUrl}" controls style="width:100%; border-radius:8px; border:2px solid var(--border);"></video>
                        <a href="${videoUrl}" download class="action-btn" style="margin-top:10px;">Simpan Video</a>
                    `;
                } catch(e) { box.innerHTML = '<p style="color:red;">Gagal. Video private atau API down.</p>'; }
            };
        }

        else if (tool === 'pinterest') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Pinterest DL</h3>
                <span class="desc-text">Simpan video atau gambar dari Pinterest.</span>
                <input type="text" id="pin-url" placeholder="Paste link Pinterest (pin.it/...)">
                <button class="action-btn" onclick="downloadPinterest()">Download</button>
                <div id="pin-res" style="display:none; margin-top:15px; text-align:center;"></div>
            `;
            window.downloadPinterest = async () => {
                const url = document.getElementById('pin-url').value.trim();
                const box = document.getElementById('pin-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p>Memproses...</p>';
                try {
                    const res = await fetch(`https://api.pinterestdl.app/api/download?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.error || !data.video && !data.image) throw new Error('Gagal');
                    const mediaUrl = data.video || data.image;
                    const isVideo = mediaUrl.includes('.mp4');
                    box.innerHTML = `
                        ${isVideo 
                            ? `<video src="${mediaUrl}" controls style="width:100%; border-radius:8px; border:2px solid var(--border);"></video>` 
                            : `<img src="${mediaUrl}" style="width:100%; border-radius:8px; border:2px solid var(--border);">`
                        }
                        <a href="${mediaUrl}" download class="action-btn" style="margin-top:10px;">Simpan</a>
                    `;
                } catch(e) { box.innerHTML = '<p style="color:red;">Gagal. Link private atau API down.</p>'; }
            };
        }

        else if (tool === 'stalkig') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Instagram</h3>
                <span class="desc-text">Lihat info profil, bio, dan jumlah followers.</span>
                <input type="text" id="stalkig-user" placeholder="Username (tanpa @)">
                <button class="action-btn" onclick="stalkIG()">Cari</button>
                <div id="stalkig-res" style="display:none; margin-top:15px; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                            <img src="${d.profile_pic}" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${d.username}<br>
                        <b>Nama:</b> ${d.full_name}<br>
                        <b>Bio:</b> ${d.bio || '-'}<br>
                        <b>Followers:</b> ${d.followers}<br>
                        <b>Following:</b> ${d.following}<br>
                        <b>Posts:</b> ${d.posts}
                    `;
                } catch(e) {
                    box.innerHTML = '<p style="color:red;">Gagal. Akun private, tidak ditemukan, atau API down.</p>';
                }
            };
        }

        else if (tool === 'stalktt') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk TikTok</h3>
                <span class="desc-text">Cek statistik akun TikTok secara instan.</span>
                <input type="text" id="stalktt-user" placeholder="Username (tanpa @)">
                <button class="action-btn" onclick="stalkTT()">Cari</button>
                <div id="stalktt-res" style="display:none; margin-top:15px; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                            <img src="${d.avatar}" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${d.username}<br>
                        <b>Nama:</b> ${d.nickname}<br>
                        <b>Bio:</b> ${d.signature || '-'}<br>
                        <b>Followers:</b> ${d.followers}<br>
                        <b>Following:</b> ${d.following}<br>
                        <b>Likes:</b> ${d.likes}
                    `;
                } catch(e) {
                    box.innerHTML = '<p style="color:red;">Gagal. Akun private atau API down.</p>';
                }
            };
        }

        else if (tool === 'stalkroblox') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Stalk Roblox</h3>
                <span class="desc-text">Lacak profil Roblox, cek bio, tanggal dibuat.</span>
                <input type="text" id="stalkrbx-user" placeholder="Username Roblox">
                <button class="action-btn" onclick="stalkRoblox()">Cari</button>
                <div id="stalkrbx-res" style="display:none; margin-top:15px; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                            <img src="${avatarUrl}" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--border); object-fit:cover;">
                        </div>
                        <b>Username:</b> ${infoData.name}<br>
                        <b>Display Name:</b> ${infoData.displayName}<br>
                        <b>Bio:</b> ${infoData.description || '-'}<br>
                        <b>Dibuat:</b> ${new Date(infoData.created).toLocaleDateString('id-ID')}
                    `;
                } catch(e) {
                    box.innerHTML = '<p style="color:red;">Gagal. Username tidak ditemukan atau API down.</p>';
                }
            };
        }
                // TOOLS GAMBAR & TEKS
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>QR Code</h3>
                <span class="desc-text">Ubah teks atau link menjadi gambar QR Code.</span>
                <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools by Andika T.M">
                <button class="action-btn" id="btn-qr">Generate QR</button>
                <div style="text-align:center; margin-top:15px;"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZenkaiTools" style="max-width:100%; border-radius:8px; border:2px solid var(--border);"></div>
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
                <span class="desc-text">Ubah teks menjadi QR Code resolusi besar.</span>
                <input type="text" id="qr-txt" placeholder="Ketik teks/link...">
                <button class="action-btn" onclick="genQR()">Buat QR</button>
                <div style="text-align:center; margin-top:15px;">
                    <img id="qr-img" src="" style="max-width:100%; border-radius:8px; border:2px solid var(--border); display:none;">
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
                <span class="desc-text">Ubah format gambar PNG/WebP ke JPG.</span>
                <input type="file" id="jpg-in" accept="image/*" style="padding:10px; margin-bottom:15px;">
                <div id="jpg-res" style="display:none; text-align:center;">
                    <img id="jpg-preview" style="max-width:100%; border-radius:8px; border:2px solid var(--border); margin-bottom:10px;">
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
                <span class="desc-text">Perbesar resolusi gambar hingga 2x lipat.</span>
                <input type="file" id="hd-in" accept="image/*" style="padding:10px; margin-bottom:15px;">
                <div id="hd-res" style="display:none; text-align:center;">
                    <img id="hd-preview" style="max-width:100%; border-radius:8px; border:2px solid var(--border); margin-bottom:10px;">
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
                <span class="desc-text">Bikin username keren dan belum dipakai.</span>
                <input type="text" id="user-name" placeholder="Nama kamu (cth: andika)">
                <button class="action-btn" onclick="genUser()">Generate</button>
                <div id="user-res" style="display:none; text-align:center; font-size:16px; font-weight:bold; border:2px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px;"></div>
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
                <span class="desc-text">Cari tau makna dan asal-usul di balik nama.</span>
                <input type="text" id="nama-in" placeholder="Ketik nama...">
                <button class="action-btn" onclick="cariArti()">Cari Arti</button>
                <div id="nama-res" style="display:none; text-align:left; line-height:1.6; border:2px dashed var(--border); padding:15px; border-radius:8px; margin-top:15px;"></div>
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
                <span class="desc-text">Buat password acak 16 karakter yang kuat.</span>
                <button class="action-btn" onclick="genPass()">Generate Password</button>
                <div id="pass-res" style="display:none; font-size:20px; font-weight:800; color:var(--primary); text-align:center; margin-top:15px; border:2px dashed var(--border); padding:15px; border-radius:8px; word-break:break-all;"></div>
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
                <span class="desc-text">Hitung angka dasar dengan cepat.</span>
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
                <span class="desc-text">Cek zodiak berdasarkan tanggal lahir.</span>
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
                <span class="desc-text">Encode atau decode teks ke format Base64.</span>
                <textarea id="b64-in" rows="3" placeholder="Teks..."></textarea>
                <div style="display:flex;gap:10px; justify-content:center;">
                    <button class="action-btn" onclick="b64Act('enc')" style="flex:1;">Encode</button>
                    <button class="action-btn" onclick="b64Act('dec')" style="flex:1;">Decode</button>
                </div>
                <div id="b64-res" style="display:none; margin-top:15px; word-break:break-all; text-align:center; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                <span class="desc-text">Lacak lokasi dan ISP dari alamat IP publik.</span>
                <input type="text" id="ip-in" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" onclick="cekIP()">Lacak</button>
                <div id="ip-res" style="display:none; margin-top:15px; text-align:left; line-height:1.8; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                <span class="desc-text">Balik urutan huruf dalam teks secara instan.</span>
                <input type="text" id="rev-in" placeholder="Ketik teks...">
                <button class="action-btn" onclick="doReverse()">Balik Teks</button>
                <div id="rev-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                <span class="desc-text">Acak urutan huruf biar jadi kata sandi random.</span>
                <input type="text" id="scr-in" placeholder="Ketik teks...">
                <button class="action-btn" onclick="doScramble()">Acak</button>
                <div id="scr-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                <span class="desc-text">Pasang timer hitung mundur.</span>
                <input type="number" id="timer-in" placeholder="Detik (Cth: 10)">
                <button class="action-btn" onclick="startTimer()">Mulai</button>
                <div id="timer-res" style="display:none; margin-top:15px; text-align:center; font-size:32px; font-weight:bold; color:var(--primary); border:2px dashed var(--border); padding:15px; border-radius:8px;">0</div>
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
                <span class="desc-text">Hitung umur berdasarkan tanggal lahir.</span>
                <input type="date" id="umur-in">
                <button class="action-btn" onclick="hitungUmur()">Hitung</button>
                <div id="umur-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
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
                <span class="desc-text">Dapetin kode warna HEX acak.</span>
                <button class="action-btn" onclick="genWarna()">Generate Warna</button>
                <div id="warna-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; padding:40px 15px; border-radius:8px; border:2px solid var(--border); transition:0.3s;"></div>
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
    // 9. SEARCH FILTER
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
    // 10. LOGIKA ZENFUN (BYPASS & ALIGHT VIA KURONEKO)
    // =========================================
    const originalOpenTool = window.openTool;
    window.openTool = (tool) => {
        originalOpenTool(tool);
        
        if (tool === 'linkvertise') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Bypass Link</h3>
                <span class="desc-text">Nembus iklan Linkvertise / SFL.</span>
                <input type="text" id="bypass-url" placeholder="Paste link disini...">
                <button class="action-btn" id="btn-bypass">Bypass Sekarang</button>
                <div id="bypass-res" style="display:none; margin-top:15px; text-align:center; border:2px dashed var(--border); padding:15px; border-radius:8px; word-break:break-all;"></div>
            `;
            document.getElementById('btn-bypass').onclick = async () => {
                const url = document.getElementById('bypass-url').value.trim();
                const box = document.getElementById('bypass-res');
                if(!url) return showToast('Masukkan link!');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p>Memproses...</p>';
                try {
                    const res = await fetch(`https://sylvatica.my.id/api/bypass/linkvertise?url=${encodeURIComponent(url)}&apikey=sylva-e96de6848abe4ce410a0f85ceb0d25ce`);
                    const data = await res.json();
                    if(!data.status) throw new Error(data.error || 'Gagal');
                    box.innerHTML = `
                        <p style="font-size:12px; margin-bottom:10px;">Link Asli:</p>
                        <a href="${data.result.url}" target="_blank" style="color:var(--primary); font-weight:bold;">${data.result.url}</a>
                    `;
                } catch(e) { box.innerHTML = `<p style="color:red;">Gagal: ${e.message}</p>`; }
            };
        }

        else if (tool === 'alightmotion') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Alight Motion</h3>
                <span class="desc-text">Bypass Premium via KuroNeko API.</span>
                <input type="email" id="am-email" placeholder="Email (bebas)">
                <button class="action-btn" id="btn-am">Generate Link</button>
                <div id="am-res" style="display:none; margin-top:15px; text-align:center; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
            `;
            document.getElementById('btn-am').onclick = async () => {
                const email = document.getElementById('am-email').value.trim() || "user@zenkai.com";
                const box = document.getElementById('am-res');
                box.style.display = 'block';
                box.innerHTML = '<div class="loader"></div><p>Memproses via KuroNeko...</p>';
                
                try {
                    // YANG BARU (BENER)
const res = await fetch(`https://sylvatica.my.id/api/tools/alightmotion?email=${encodeURIComponent(email)}&options=send&url=&apikey=sylva-e96de6848abe4ce410a0f85ceb0d25ce`);
                    const data = await res.json();
                    
                    if(!data.status) throw new Error(data.message || 'Gagal ambil data.');
                    
                    const downloadUrl = data.result.url || data.result.download;
                    
                    box.innerHTML = `
                        <p style="color:#00ff9d; font-size:13px; font-weight:bold; margin-bottom:10px;">Berhasil! ✅</p>
                        <a href="${downloadUrl}" target="_blank" class="action-btn press" style="display:block; text-decoration:none;">📥 Download Alight Motion</a>
                        <p style="font-size:11px; opacity:0.7; margin-top:10px;">Link siap dipakai. Cek email <b>${email}</b> jika diminta verifikasi.</p>
                    `;
                } catch(e) { 
                    box.innerHTML = `<p style="color:#ff3333;">Gagal: ${e.message}</p>`; 
                }
            };
        }
    }; // <--- PENUTUP openTool

}); // <--- PENUTUP DOMContentLoaded