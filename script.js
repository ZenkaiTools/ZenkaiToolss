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
                    musicToggle.style.background = 'var(--neon-cyan)'; 
                    musicToggle.style.color = '#000';
                    showToast('Musik dinyalakan 🎵');
                }).catch(() => showToast('Musik gagal diputar.', true));
            } else {
                bgm.pause(); 
                isPlaying = false; 
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
        if(c) c.innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
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
                    card.style.animation = 'none';
                    card.offsetHeight; 
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
                <h3>TikTok Downloader</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Paste link video TikTok lo di bawah. Sistem bakal otomatis ngambil versi HD tanpa watermark.</p>
                <input type="text" id="tt-url" placeholder="https://www.tiktok.com/@user/video/...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                const btn = document.getElementById('btn-dl-tt');
                if(!url) return showToast('Masukkan link dulu!', true);
                
                btn.innerText = 'Memproses...';
                btn.disabled = true;
                box.style.display = 'block'; 
                box.innerHTML = '<span style="color:var(--neon-cyan);">Mengambil data dari server...</span>';
                
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Gagal ambil video. Pastikan link valid.');
                    
                    const vidUrl = data.data.hdplay || data.data.play;
                    const title = data.data.title || "Video TikTok";
                    
                    box.innerHTML = `
                        <div style="text-align:left; margin-bottom:10px;">
                            <b style="color:var(--text-main);">Judul:</b><br>
                            <span style="font-size:11px; color:var(--text-muted);">${title}</span>
                        </div>
                        <button class="action-btn" id="btn-save-tt" style="background:var(--neon-green); margin-bottom:0;">Simpan ke Galeri</button>
                    `;
                    
                    document.getElementById('btn-save-tt').onclick = async () => {
                        document.getElementById('btn-save-tt').innerText = 'Mendownload...';
                        const blob = await (await fetch(vidUrl)).blob();
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = `tiktok-${Date.now()}.mp4`;
                        a.click();
                        showToast('Video berhasil disimpan!');
                        document.getElementById('btn-save-tt').innerText = 'Simpan ke Galeri';
                    };
                } catch(e) { 
                    box.innerHTML = `<span style="color:var(--neon-red);">Error: ${e.message}</span>`; 
                    showToast('Gagal memproses video.', true); 
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
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Ubah teks atau link apapun jadi QR Code yang siap di-scan.</p>
                <input type="text" id="qr-text" placeholder="Ketik teks atau link..." value="ZenkaiTools by Andika T.M">
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
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Bikin gambar teks ala-ala album Brat. Simpel dan langsung save.</p>
                <input type="text" id="brat-input" placeholder="Ketik teks..." value="Andika T.M">
                <button class="action-btn" id="btn-brat">Update Teks</button>
                <div class="result-box" style="background:#fff;padding:20px; border-radius:12px; border:none; display:flex; justify-content:center;">
                    <div id="brat-res" style="color:#000;font-family:Arial;font-weight:bold;font-size:26px;filter:blur(1.5px);text-align:center;word-wrap:break-word;line-height:1.2; max-width:100%;">Andika T.M</div>
                </div>
                <button class="action-btn" id="btn-dl-brat" style="background:var(--neon-yellow);margin-top:15px;">Simpan PNG</button>
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
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Encode teks biasa jadi Base64, atau decode Base64 balik jadi teks.</p>
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
                <h3>IP Address Lookup</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Lacak lokasi dan ISP dari sebuah alamat IP publik.</p>
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
                } catch(e) { b.innerText = 'IP tidak ditemukan atau limit tercapai.'; }
            };
        }
        
        // --- 6. IMAGE TO BASE64 ---
        else if (tool === 'imgto') {
            modalContent.innerHTML = `
                <h3>Image to Base64</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Ubah file gambar dari galeri lo jadi kode Base64.</p>
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
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Buat password acak yang kuat dan aman (16 Karakter).</p>
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
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Hitung ekspresi matematika. Cth: 5 + 5 * 2</p>
                <input type="text" id="calc-in" placeholder="Masukkan angka...">
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
        
        // --- 9. ZODIAK (CUSTOM DROPDOWN) ---
        else if (tool === 'zodiak') {
            let optTgl = '<option value="">Tgl</option>';
            for(let i=1; i<=31; i++) optTgl += `<option value="${i}">${i}</option>`;
            
            const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            let optBln = '<option value="">Bulan</option>';
            bulan.forEach((b, i) => optBln += `<option value="${i+1}">${b}</option>`);
            
            modalContent.innerHTML = `
                <h3>Cek Zodiak</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Pilih tanggal lahir lo buat liat zodiaknya.</p>
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
                b.innerHTML = `Zodiak lu: <b style="color:var(--neon-yellow); font-size:22px; display:block; margin-top:5px;">${z}</b>`;
            };
        }
        
        // --- 10. CUACA (BMKG/Open-Meteo) ---
        else if (tool === 'cuaca') {
            modalContent.innerHTML = `
                <h3>Cek Cuaca</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Ketik nama kota buat liat suhu dan kondisi cuaca saat ini.</p>
                <input type="text" id="cuaca-in" placeholder="Cth: Jakarta, Bandung, Tokyo">
                <button class="action-btn" id="btn-cuaca">Cari Cuaca</button>
                <div id="cuaca-res" class="result-box" style="display:none; text-align:left; line-height:1.8;"></div>
            `;
            document.getElementById('btn-cuaca').onclick = async () => {
                const city = document.getElementById('cuaca-in').value;
                if(!city) return showToast('Masukkan nama kota!', true);
                const b = document.getElementById('cuaca-res'); 
                b.style.display='block'; b.innerText = 'Mencari data cuaca...';
                try {
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=id`);
                    const geoData = await geoRes.json();
                    if(!geoData.results) throw new Error('Kota gak ditemukan.');
                    
                    const lat = geoData.results[0].latitude;
                    const lon = geoData.results[0].longitude;
                    const name = geoData.results[0].name;
                    
                    const wxRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
                    const wxData = await wxRes.json();
                    const w = wxData.current_weather;
                    
                    b.innerHTML = `
                        <b style="color:var(--neon-cyan); font-size:16px;">${name}</b><br>
                        <b>Suhu:</b> ${w.temperature}°C<br>
                        <b>Kecepatan Angin:</b> ${w.windspeed} km/h<br>
                        <b>Kode Cuaca:</b> ${w.weathercode} (Lihat referensi di Google)
                    `;
                } catch(e) { b.innerText = e.message; }
            };
        }
        
        // --- 11. QUOTES RANDOM ---
        else if (tool === 'quotes') {
            modalContent.innerHTML = `
                <h3>Random Quotes</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Dapetin quotes random buat semangat harian.</p>
                <button class="action-btn" id="btn-quotes" style="background:var(--neon-purple); color:#fff;">Ambil Quotes</button>
                <div id="quotes-res" class="result-box" style="display:none; font-style:italic; line-height:1.8;"></div>
            `;
            document.getElementById('btn-quotes').onclick = async () => {
                const b = document.getElementById('quotes-res'); 
                b.style.display='block'; b.innerText = 'Memuat quotes...';
                try {
                    const res = await fetch('https://api.quotable.io/random');
                    const data = await res.json();
                    b.innerHTML = `"${data.content}"<br><br><b style="color:var(--neon-cyan);">- ${data.author}</b>`;
                } catch(e) { 
                    // Fallback kalo API eror
                    const fallback = [
                        "Jangan takut gagal, takutlah kalau gak pernah nyoba.",
                        "Koding itu seni, dan lo adalah senimannya.",
                        "Istirahat sejenak, lalu lanjutkan perjuangan."
                    ];
                    b.innerHTML = `"${fallback[Math.floor(Math.random()*fallback.length)]}"<br><br><b style="color:var(--neon-cyan);">- Anonim</b>`;
                }
            };
        }
        
        // --- 12. HITUNG BMI ---
        else if (tool === 'bmi') {
            modalContent.innerHTML = `
                <h3>Kalkulator BMI</h3>
                <p style="font-size:12px; color:var(--text-muted); margin-bottom:15px;">Hitung Indeks Massa Tubuh lo.</p>
                <input type="number" id="bmi-bb" placeholder="Berat Badan (kg)">
                <input type="number" id="bmi-tb" placeholder="Tinggi Badan (cm)">
                <button class="action-btn" id="btn-bmi">Hitung BMI</button>
                <div id="bmi-res" class="result-box" style="display:none;font-size:18px;font-weight:bold;color:var(--neon-cyan);"></div>
            `;
            document.getElementById('btn-bmi').onclick = () => {
                const bb = parseFloat(document.getElementById('bmi-bb').value);
                const tb = parseFloat(document.getElementById('bmi-tb').value) / 100;
                
                if(!bb || !tb) return showToast('Isi berat dan tinggi!', true);
                
                const bmi = (bb / (tb * tb)).toFixed(1);
                let status = "";
                let color = "";
                
                if (bmi < 18.5) { status = "Kurus"; color = "var(--neon-yellow)"; }
                else if (bmi >= 18.5 && bmi <= 24.9) { status = "Normal"; color = "var(--neon-green)"; }
                else if (bmi >= 25 && bmi <= 29.9) { status = "Gemuk"; color = "var(--neon-orange)"; }
                else { status = "Obesitas"; color = "var(--neon-red)"; }
                
                const b = document.getElementById('bmi-res');
                b.style.display = 'block';
                b.innerHTML = `Skor BMI: <span style="color:${color}; font-size:24px;">${bmi}</span><br>Status: <span style="color:${color};">${status}</span>`;
            };
        }
    };

});