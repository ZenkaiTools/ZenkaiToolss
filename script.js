document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. SISTEM GANTI TEMA (COMIC -> CYBER -> MINIMAL)
    // =========================================
    const themes = ['comic', 'cyber', 'minimal'];
    let currentThemeIndex = 0;

    window.switchTheme = () => {
        // Ganti index tema (0, 1, 2)
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        
        // Terapkan ke body
        document.body.setAttribute('data-theme', newTheme);
        
        // Notifikasi sesuai tema
        const themeNames = { comic: 'Comic Style 🎨', cyber: 'Cyberpunk ⚡', minimal: 'Clean Minimalist ✨' };
        showToast(`Tema diganti: ${themeNames[newTheme]}`);
    };

    // =========================================
    // 2. TOAST NOTIFICATION
    // =========================================
    window.showToast = (msg, isError = false) => {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast';
        if (isError) t.style.borderColor = '#ff3333';
        t.innerText = msg;
        c.appendChild(t);
        setTimeout(() => { 
            t.style.opacity = '0'; 
            t.style.transform = 'translateY(-20px)';
            t.style.transition = '0.3s ease';
            setTimeout(() => t.remove(), 300); 
        }, 3000);
    };

    // =========================================
    // 3. PLAYLIST MUSIK (ACAK & GAK NGULANG)
    // =========================================
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('music-toggle');
    
    // Kumpulan lagu bebas royalti (Full Song)
    const playlist = [
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3",
        "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bab.mp3?filename=electronic-future-beats-117997.mp3",
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3"
    ];
    
    let isPlaying = false;
    let lastPlayedIndex = -1;

    function playRandomSong() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === lastPlayedIndex && playlist.length > 1);
        
        lastPlayedIndex = newIndex;
        bgm.src = playlist[newIndex];
        bgm.play().catch(() => showToast('Gagal memutar musik.', true));
    }

    if (musicToggle && bgm) {
        musicToggle.addEventListener('click', () => {
            if (!isPlaying) {
                bgm.volume = 0.2;
                playRandomSong();
                isPlaying = true; 
                musicToggle.style.background = 'var(--primary)'; 
                showToast('Musik dinyalakan 🎵');
            } else {
                bgm.pause(); 
                isPlaying = false; 
                musicToggle.style.background = 'var(--card-bg)';
                showToast('Musik dimatikan 🔇');
            }
        });

        // Pas lagu habis, putar lagu random selanjutnya
        bgm.addEventListener('ended', () => {
            if (isPlaying) playRandomSong();
        });
    }

    // =========================================
    // 4. NAVIGASI & SEARCH
    // =========================================
    window.switchPage = (pageId, btn) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        document.getElementById('page-' + pageId).classList.add('active');
        if(btn) btn.classList.add('active');
    };

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
    // 5. LOGIC MODAL
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');

    window.closeModal = () => { 
        modal.classList.remove('active'); 
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
    };
    window.closeModalOnOverlay = (e) => {
        if (e.target.id === 'tool-modal') closeModal();
    };

    // =========================================
    // 6. FITUR TOOLS
    // =========================================
    window.openTool = (tool) => {
        modal.classList.add('active');
        modalContent.innerHTML = '';

        // --- 1. TIKTOK DOWNLOADER (WITH VIDEO PREVIEW & LOADING) ---
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                <h3>TikTok Downloader</h3>
                <p style="font-size:12px; opacity:0.7; margin-bottom:15px;">Paste link TikTok lo. Video bakal muncul di sini dan bisa diputar dulu sebelum didownload.</p>
                <input type="text" id="tt-url" placeholder="https://www.tiktok.com/...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                const btn = document.getElementById('btn-dl-tt');
                if(!url) return showToast('Masukkan link dulu!', true);
                
                // LOADING ANIMASI
                btn.innerHTML = '<span class="loader-spinner"></span> Memproses...';
                btn.disabled = true;
                box.style.display = 'block'; 
                box.innerHTML = '<span style="color:var(--primary); font-weight:bold;">Menghubungi server TikTok...</span>';
                
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Link gak valid atau video private.');
                    
                    const vidUrl = data.data.hdplay || data.data.play;
                    const title = data.data.title || "Video TikTok";
                    
                    // TAMPILKAN VIDEO PREVIEW
                    box.innerHTML = `
                        <div style="text-align:left; margin-bottom:10px; font-size:12px;">
                            <b>Judul:</b> ${title}
                        </div>
                        <video class="video-preview" src="${vidUrl}" controls playsinline></video>
                        <button class="action-btn" id="btn-save-tt" style="background:var(--primary);">Download ke Galeri</button>
                    `;
                    
                    // LOGIC DOWNLOAD
                    document.getElementById('btn-save-tt').onclick = async () => {
                        const saveBtn = document.getElementById('btn-save-tt');
                        saveBtn.innerHTML = '<span class="loader-spinner"></span> Mendownload...';
                        try {
                            const blob = await (await fetch(vidUrl)).blob();
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `tiktok-${Date.now()}.mp4`;
                            a.click();
                            showToast('Video berhasil disimpan!');
                        } catch(e) { showToast('Gagal download.', true); }
                        saveBtn.innerText = 'Download ke Galeri';
                    };
                } catch(e) { 
                    box.innerHTML = `<span style="color:#ff3333;">Error: ${e.message}</span>`; 
                } finally {
                    btn.innerText = 'Proses Video';
                    btn.disabled = false;
                }
            };
        }
        
        // --- 2. QR CODE ---
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                <h3>QR Code Generator</h3>
                <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools by Andika T.M">
                <button class="action-btn" id="btn-qr">Generate QR</button>
                <div class="result-box"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZenkaiTools" style="max-width:100%;border-radius:12px;"></div>
            `;
            document.getElementById('btn-qr').onclick = () => {
                const txt = document.getElementById('qr-text').value || "ZenkaiTools";
                document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(txt)}`;
            };
        }
        
        // --- 3. BRAT TEXT ---
        else if (tool === 'brat') {
            modalContent.innerHTML = `
                <h3>Brat Text Maker</h3>
                <input type="text" id="brat-input" placeholder="Ketik teks..." value="Andika T.M">
                <button class="action-btn" id="btn-brat">Update Teks</button>
                <div class="result-box" style="background:#fff;padding:20px; border-radius:12px; border:none; display:flex; justify-content:center;">
                    <div id="brat-res" style="color:#000;font-family:Arial;font-weight:bold;font-size:26px;filter:blur(1.5px);text-align:center;word-wrap:break-word;line-height:1.2; max-width:100%;">Andika T.M</div>
                </div>
                <button class="action-btn" id="btn-dl-brat" style="margin-top:15px;">Simpan PNG</button>
            `;
            document.getElementById('btn-brat').onclick = () => {
                document.getElementById('brat-res').innerText = document.getElementById('brat-input').value || "Andika T.M";
            };
            document.getElementById('btn-dl-brat').onclick = () => {
                html2canvas(document.getElementById('brat-res').parentElement, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
                    const a = document.createElement('a'); 
                    a.download = 'brat-andika.png'; 
                    a.href = canvas.toDataURL(); 
                    a.click();
                    showToast('Gambar tersimpan!');
                });
            };
        }
        
        // --- 4. BASE64 ---
        else if (tool === 'base64') {
            modalContent.innerHTML = `
                <h3>Base64 Converter</h3>
                <textarea id="b64-in" rows="3" placeholder="Ketik teks di sini..."></textarea>
                <div style="display:flex;gap:10px;">
                    <button class="action-btn" id="btn-enc" style="flex:1;">Encode</button>
                    <button class="action-btn" id="btn-dec" style="flex:1;">Decode</button>
                </div>
                <div id="b64-res" class="result-box" style="display:none; word-break: break-all;"></div>
            `;
            document.getElementById('btn-enc').onclick = () => {
                const v = document.getElementById('b64-in').value;
                if(!v) return showToast('Input kosong!', true);
                const b = document.getElementById('b64-res'); 
                b.style.display='block';
                try { b.innerText = btoa(unescape(encodeURIComponent(v))); } catch(e) { b.innerText = 'Gagal encode.'; }
            };
            document.getElementById('btn-dec').onclick = () => {
                const v = document.getElementById('b64-in').value;
                if(!v) return showToast('Input kosong!', true);
                const b = document.getElementById('b64-res'); 
                b.style.display='block';
                try { b.innerText = decodeURIComponent(escape(atob(v))); } catch(e) { b.innerText = 'Format Base64 tidak valid!'; }
            };
        }
        
        // --- 5. IP LOOKUP ---
        else if (tool === 'ip') {
            modalContent.innerHTML = `
                <h3>IP Address Lookup</h3>
                <input type="text" id="ip-in" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" id="btn-ip">Lacak IP</button>
                <div id="ip-res" class="result-box" style="display:none; text-align:left; line-height:1.8;"></div>
            `;
            document.getElementById('btn-ip').onclick = async () => {
                const ip = document.getElementById('ip-in').value;
                if(!ip) return showToast('Masukkan IP!', true);
                const b = document.getElementById('ip-res'); 
                b.style.display='block'; b.innerText = 'Mencari...';
                try {
                    const res = await fetch(`https://ipapi.co/${ip}/json/`);
                    const data = await res.json();
                    if(data.error) throw new Error(data.reason);
                    b.innerHTML = `<b>IP:</b> ${data.ip}<br><b>Kota:</b> ${data.city}<br><b>Negara:</b> ${data.country_name}<br><b>ISP:</b> ${data.org}`;
                } catch(e) { b.innerText = 'IP tidak ditemukan.'; }
            };
        }
        
        // --- 6. IMAGE TO BASE64 ---
        else if (tool === 'imgto') {
            modalContent.innerHTML = `
                <h3>Image to Base64</h3>
                <input type="file" id="img-in" accept="image/*" style="padding:10px;">
                <div id="img-res" class="result-box" style="display:none; font-size:10px; word-break:break-all; text-align:left; max-height:150px; overflow-y:auto;"></div>
            `;
            document.getElementById('img-in').onchange = (e) => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const b = document.getElementById('img-res');
                    b.style.display = 'block';
                    b.innerText = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
        }
        
        // --- 7. PASSWORD GEN ---
        else if (tool === 'password') {
            modalContent.innerHTML = `
                <h3>Password Generator</h3>
                <button class="action-btn" id="btn-pass">Generate Password</button>
                <div id="pass-res" class="result-box" style="display:none;font-size:20px;font-weight:800; color:var(--primary); letter-spacing:1px;"></div>
            `;
            document.getElementById('btn-pass').onclick = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                let pass = "";
                for(let i=0; i<16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                const b = document.getElementById('pass-res');
                b.style.display = 'block';
                b.innerText = pass;
            };
        }
        
        // --- 8. KALKULATOR ---
        else if (tool === 'calc') {
            modalContent.innerHTML = `
                <h3>Kalkulator</h3>
                <input type="text" id="calc-in" placeholder="Cth: 5 + 5 * 2">
                <button class="action-btn" id="btn-calc">Hitung</button>
                <div id="calc-res" class="result-box" style="display:none;font-size:24px;font-weight:800; color:var(--primary);"></div>
            `;
            document.getElementById('btn-calc').onclick = () => {
                const expr = document.getElementById('calc-in').value;
                if(!expr) return;
                try {
                    const res = Function('"use strict";return (' + expr + ')')();
                    const b = document.getElementById('calc-res');
                    b.style.display = 'block'; b.innerText = res;
                } catch(e) { showToast('Ekspresi tidak valid!', true); }
            };
        }
        
        // --- 9. ZODIAK ---
        else if (tool === 'zodiak') {
            let optTgl = '<option value="">Tgl</option>';
            for(let i=1; i<=31; i++) optTgl += `<option value="${i}">${i}</option>`;
            const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            let optBln = '<option value="">Bulan</option>';
            bulan.forEach((b, i) => optBln += `<option value="${i+1}">${b}</option>`);
            
            modalContent.innerHTML = `
                <h3>Cek Zodiak</h3>
                <div class="date-group">
                    <select id="z-tgl">${optTgl}</select>
                    <select id="z-bln" style="flex:2;">${optBln}</select>
                </div>
                <button class="action-btn" id="btn-zodiak">Cek Zodiak</button>
                <div id="zodiak-res" class="result-box" style="display:none;font-size:16px;"></div>
            `;
            document.getElementById('btn-zodiak').onclick = () => {
                const tgl = parseInt(document.getElementById('z-tgl').value);
                const bln = parseInt(document.getElementById('z-bln').value);
                if(!tgl || !bln) return showToast('Pilih tanggal dan bulan!', true);
                
                let z = "";
                if ((bln == 1 && tgl >= 20) || (bln == 2 && tgl <= 18)) z = "Aquarius ♒";
                else if ((bln == 2 && tgl >= 19) || (bln == 3 && tgl <= 20)) z = "Pisces ♓";
                else if ((bln == 3 && tgl >= 21) || (bln == 4 && tgl <= 19)) z = "Aries ♈";
                else if ((bln == 4 && tgl >= 20) || (bln == 5 && tgl <= 20)) z = "Taurus ♉";
                else if ((bln == 5 && tgl >= 21) || (bln == 6 && tgl <= 20)) z = "Gemini ♊";
                else if ((bln == 6 && tgl >= 21) || (bln == 7 && tgl <= 22)) z = "Cancer ♋";
                else if ((bln == 7 && tgl >= 23) || (bln == 8 && tgl <= 22)) z = "Leo ♌";
                else if ((bln == 8 && tgl >= 23) || (bln == 9 && tgl <= 22)) z = "Virgo ♍";
                else if ((bln == 9 && tgl >= 23) || (bln == 10 && tgl <= 22)) z = "Libra ♎";
                else if ((bln == 10 && tgl >= 23) || (bln == 11 && tgl <= 21)) z = "Scorpio ♏";
                else if ((bln == 11 && tgl >= 22) || (bln == 12 && tgl <= 21)) z = "Sagittarius ♐";
                else z = "Capricorn ♑";
                
                const b = document.getElementById('zodiak-res');
                b.style.display = 'block';
                b.innerHTML = `Zodiak lu: <b style="color:var(--primary); font-size:22px; display:block; margin-top:5px;">${z}</b>`;
            };
        }
    };
});