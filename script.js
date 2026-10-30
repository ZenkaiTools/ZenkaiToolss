document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. TOAST NOTIFICATION
    // =========================================
    window.showToast = (msg, isError = false) => {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast';
        
        if (isError) {
            t.style.borderColor = 'var(--neon-red)';
            t.style.borderLeftColor = 'var(--neon-red)';
        }
        
        t.innerText = msg;
        c.appendChild(t);
        
        // Animasi keluar
        setTimeout(() => { 
            t.style.opacity = '0'; 
            t.style.transform = 'translateY(-20px)';
            t.style.transition = '0.3s ease';
            setTimeout(() => t.remove(), 300); 
        }, 3000);
    };

    // =========================================
    // 2. BGM (MUSIK)
    // =========================================
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;
    
    if (musicToggle && bgm) {
        musicToggle.addEventListener('click', () => {
            if (!isPlaying) {
                bgm.volume = 0.2;
                bgm.play().then(() => { 
                    isPlaying = true; 
                    // Ubah warna tombol jadi Cyan pas nyala
                    musicToggle.style.background = 'var(--neon-cyan)'; 
                    musicToggle.style.color = '#000';
                    showToast('Musik dinyalakan 🎵');
                }).catch(() => showToast('Musik gagal diputar.', true));
            } else {
                bgm.pause(); 
                isPlaying = false; 
                // Balikin ke transparan pas mati
                musicToggle.style.background = 'rgba(0, 243, 255, 0.1)';
                musicToggle.style.color = 'var(--neon-cyan)';
                showToast('Musik dimatikan 🔇');
            }
        });
    }

    // =========================================
    // 3. WAKTU & INFO DEVICE
    // =========================================
    function updateTime() {
        const now = new Date();
        const c = document.getElementById('clock-now');
        if(c) c.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    }
    setInterval(updateTime, 1000); 
    updateTime();

    // Deteksi Device
    const ua = navigator.userAgent;
    let dev = "Desktop";
    if (/android/i.test(ua)) dev = "Android"; 
    else if (/iPad|iPhone|iPod/.test(ua)) dev = "iOS";
    
    const dEl = document.getElementById('device-name'); 
    if(dEl) dEl.innerText = dev;
    
    const sEl = document.getElementById('device-status'); 
    if(sEl) sEl.innerText = dev.substring(0,3).toUpperCase() + ".ON";

    // Deteksi Baterai
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
    // 4. NAVIGASI BAWAH
    // =========================================
    window.switchPage = (pageId, btn) => {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
        
        const targetPage = document.getElementById('page-' + pageId);
        if(targetPage) targetPage.classList.add('active');
        if(btn) btn.classList.add('active');
    };

    // =========================================
    // 5. SEARCH FILTER
    // =========================================
    const sInput = document.getElementById('search-tools');
    if (sInput) {
        sInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            document.querySelectorAll('.tool-card').forEach(card => {
                const title = card.querySelector('h4').innerText.toLowerCase();
                if (title.includes(term)) {
                    card.style.display = 'flex';
                    // Reset animasi biar munculnya tetep smooth pas di-search
                    card.style.animation = 'none';
                    card.offsetHeight; /* trigger reflow */
                    card.style.animation = null; 
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // =========================================
    // 6. LOGIC MODAL & FITUR UTAMA
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');

    window.closeModal = () => { 
        modal.classList.remove('active'); 
        setTimeout(() => { modalContent.innerHTML = ''; }, 300);
    };

    // Fungsi Tutup Modal Klik Overlay (Area Gelap)
    window.closeModalOnOverlay = (e) => {
        if (e.target.id === 'tool-modal') {
            closeModal();
        }
    };

    // Buka Tool berdasarkan parameter
    window.openTool = (tool) => {
        modal.classList.add('active');
        modalContent.innerHTML = '';

        // --- 1. TIKTOK DOWNLOADER ---
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                <h3>TikTok DL</h3>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="action-btn" id="btn-dl-tt">Download Video</button>
                <div id="tt-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                if(!url) return showToast('Masukkan link dulu!', true);
                
                box.style.display = 'block'; 
                box.innerText = 'Memproses video...';
                
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Gagal ambil video.');
                    
                    const vidUrl = data.data.hdplay || data.data.play;
                    box.innerText = 'Mendownload (mohon tunggu)...';
                    
                    const blob = await (await fetch(vidUrl)).blob();
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = `tiktok-andika-${Date.now()}.mp4`;
                    a.click();
                    
                    box.innerText = 'Berhasil didownload!';
                    showToast('Video tersimpan di galeri!');
                } catch(e) { 
                    box.innerText = 'Error: ' + e.message; 
                    showToast('Gagal download.', true); 
                }
            };
        }
        
        // --- 2. QR CODE ---
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                <h3>QR Code</h3>
                <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools by Andika T.M">
                <button class="action-btn" id="btn-qr">Generate</button>
                <div class="result-box"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZenkaiTools" style="max-width:100%;border-radius:12px;"></div>
            `;
            document.getElementById('btn-qr').onclick = () => {
                const txt = document.getElementById('qr-text').value || "ZenkaiTools";
                document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(txt)}`;
            };
        }
        
        // --- 3. BRAT TEXT ---
        else if (tool === 'brat') {
            modalContent.innerHTML = `
                <h3>Brat Text</h3>
                <input type="text" id="brat-input" placeholder="Ketik teks..." value="Andika T.M">
                <button class="action-btn" id="btn-brat">Update Teks</button>
                <div class="result-box" style="background:#fff;padding:15px; border-radius:12px; border:none;">
                    <div id="brat-res" style="color:#000;font-family:Arial;font-weight:bold;font-size:24px;filter:blur(1.5px);text-align:center;word-wrap:break-word;line-height:1.2;">Andika T.M</div>
                </div>
                <button class="action-btn" id="btn-dl-brat" style="background:var(--neon-yellow);margin-top:10px;">Save PNG</button>
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
                <h3>Base64 Encode/Decode</h3>
                <textarea id="b64-in" rows="3" placeholder="Ketik teks di sini..."></textarea>
                <div style="display:flex;gap:10px;">
                    <button class="action-btn" id="btn-enc" style="flex:1;">Encode</button>
                    <button class="action-btn" id="btn-dec" style="flex:1;background:var(--neon-purple); color:#fff; box-shadow:none;">Decode</button>
                </div>
                <div id="b64-res" class="result-box" style="display:none; word-break: break-all;"></div>
            `;
            document.getElementById('btn-enc').onclick = () => {
                const v = document.getElementById('b64-in').value;
                if(!v) return showToast('Input kosong!', true);
                const b = document.getElementById('b64-res'); 
                b.style.display='block';
                try {
                    b.innerText = btoa(unescape(encodeURIComponent(v)));
                } catch(e) { b.innerText = 'Gagal encode.'; }
            };
            document.getElementById('btn-dec').onclick = () => {
                const v = document.getElementById('b64-in').value;
                if(!v) return showToast('Input kosong!', true);
                const b = document.getElementById('b64-res'); 
                b.style.display='block';
                try {
                    b.innerText = decodeURIComponent(escape(atob(v)));
                } catch(e) {
                    b.innerText = 'Format Base64 tidak valid!';
                }
            };
        }
        
        // --- 5. IP LOOKUP ---
        else if (tool === 'ip') {
            modalContent.innerHTML = `
                <h3>IP Lookup</h3>
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
                <div id="img-res" class="result-box" style="display:none; font-size:10px; word-break:break-all; text-align:left;"></div>
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
                <div id="pass-res" class="result-box" style="display:none;font-size:20px;font-weight:800;color:var(--neon-green); letter-spacing:1px;"></div>
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
                <div id="calc-res" class="result-box" style="display:none;font-size:24px;font-weight:800;color:var(--neon-cyan);"></div>
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
            modalContent.innerHTML = `
                <h3>Cek Zodiak</h3>
                <input type="date" id="zodiak-in">
                <button class="action-btn" id="btn-zodiak">Cek Zodiak</button>
                <div id="zodiak-res" class="result-box" style="display:none;font-size:16px;"></div>
            `;
            document.getElementById('btn-zodiak').onclick = () => {
                const dVal = document.getElementById('zodiak-in').value;
                if(!dVal) return showToast('Pilih tanggal!', true);
                const d = new Date(dVal);
                const day = d.getDate(), month = d.getMonth() + 1;
                let z = "";
                if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) z = "Aquarius ♒";
                else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) z = "Pisces ♓";
                else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) z = "Aries ♈";
                else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) z = "Taurus ♉";
                else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) z = "Gemini ♊";
                else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) z = "Cancer ♋";
                else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) z = "Leo ♌";
                else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) z = "Virgo ♍";
                else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) z = "Libra ♎";
                else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) z = "Scorpio ♏";
                else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) z = "Sagittarius ♐";
                else z = "Capricorn ♑";
                
                const b = document.getElementById('zodiak-res');
                b.style.display = 'block';
                b.innerHTML = `Zodiak lu: <b style="color:var(--neon-yellow); font-size:22px; display:block; margin-top:5px;">${z}</b>`;
            };
        }
    };

});