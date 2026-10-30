document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. SISTEM GANTI TEMA
    // =========================================
    const themes = ['comic', 'cyber', 'minimal'];
    let currentThemeIndex = 0;
    window.switchTheme = () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        document.body.setAttribute('data-theme', themes[currentThemeIndex]);
        showToast(`Tema diubah!`);
    };

    // =========================================
    // 2. TOAST NOTIFICATION
    // =========================================
    window.showToast = (msg) => {
        const c = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast';
        t.innerText = msg;
        c.appendChild(t);
        setTimeout(() => { 
            t.style.opacity = '0'; 
            setTimeout(() => t.remove(), 300); 
        }, 2500);
    };

    // =========================================
    // 3. MUSIK (Lagu Viral)
    // =========================================
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('music-toggle');
    const playlist = [
        "https://cdn.pixabay.com/download/audio/2023/03/16/audio_6764249b25.mp3?filename=teh-hijau-remix-135971.mp3",
        "https://cdn.pixabay.com/download/audio/2022/11/22/audio_4b16a02c47.mp3?filename=viral-tiktok-beat-122724.mp3",
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3"
    ];
    let isPlaying = false, lastIdx = -1;
    
    if (musicToggle) {
        musicToggle.onclick = () => {
            if(!isPlaying) {
                let idx; do { idx = Math.floor(Math.random() * playlist.length); } while(idx === lastIdx);
                lastIdx = idx; 
                bgm.src = playlist[idx]; 
                bgm.volume = 0.3; 
                bgm.play();
                isPlaying = true; 
                musicToggle.style.background = '#fff'; 
                showToast('Musik Nyala 🎵');
            } else {
                bgm.pause(); 
                isPlaying = false; 
                musicToggle.style.background = 'var(--primary)'; 
                showToast('Musik Mati 🔇');
            }
        };
        bgm.onended = () => { 
            if(isPlaying) { 
                let idx; do { idx = Math.floor(Math.random() * playlist.length); } while(idx === lastIdx);
                lastIdx = idx; bgm.src = playlist[idx]; bgm.play(); 
            } 
        };
    }

    // =========================================
    // 4. LOGIC MODAL (BOTTOM SHEET)
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');
    
    window.closeModal = () => { 
        modal.classList.remove('active'); 
        setTimeout(() => modalContent.innerHTML = '', 300); 
    };
    
    window.closeModalOnOverlay = (e) => { 
        if(e.target.id === 'tool-modal') closeModal(); 
    };

    // SVG Tombol Close (Pengganti '?' )
    const closeSvg = `<button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

    // =========================================
    // 5. FITUR MODULES (LENGKAP)
    // =========================================
    window.openTool = (tool) => {
        modal.classList.add('active');
        
        // --- TIKTOK DL ---
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>TikTok DL</h3>
                <input type="text" id="tt-url" placeholder="Paste link TikTok...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                if(!url) return showToast('Masukkan link!');
                
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
                } catch(e) { box.innerHTML = '<p style="text-align:center;color:red;">Gagal ambil video. Pastikan link valid.</p>'; }
            };
        }

        // --- KALKULATOR BENERAN ---
        else if (tool === 'calc') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Kalkulator</h3>
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

        // --- ZODIAK LIST (TANPA SELECT BAWAAN) ---
        else if (tool === 'zodiak') {
            let tgls = ''; for(let i=1; i<=31; i++) tgls += `<div onclick="setZ('tgl',${i},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${i}</div>`;
            let blns = ''; const b = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"];
            b.forEach((nm, i) => blns += `<div onclick="setZ('bln',${i+1},this)" style="padding:12px; border-bottom:1px solid var(--border); cursor:pointer;">${nm}</div>`);

            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Cek Zodiak</h3>
                <div style="display:flex; gap:10px; margin-bottom:15px;">
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

        // --- FITUR LAINNYA (QR, BRAT, BASE64, IP, IMG, PASSWORD, CUACA, QUOTES, BMI) ---
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>QR Code Generator</h3>
                <input type="text" id="qr-text" placeholder="Teks/Link..." value="ZenkaiTools by Andika T.M">
                <button class="action-btn" id="btn-qr">Generate QR</button>
                <div style="text-align:center; margin-top:15px;"><img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=ZenkaiTools" style="max-width:100%; border-radius:8px; border:2px solid var(--border);"></div>
            `;
            document.getElementById('btn-qr').onclick = () => {
                const txt = document.getElementById('qr-text').value || "ZenkaiTools";
                document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(txt)}`;
            };
        }

        else if (tool === 'brat') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Brat Text Maker</h3>
                <input type="text" id="brat-input" placeholder="Ketik teks..." value="Andika T.M">
                <button class="action-btn" id="btn-brat">Update Teks</button>
                <div style="background:#fff;padding:20px; border-radius:8px; border:2px solid var(--border); display:flex; justify-content:center; margin-bottom:15px;">
                    <div id="brat-res" style="color:#000;font-family:Arial;font-weight:bold;font-size:26px;filter:blur(1.5px);text-align:center;word-wrap:break-word;line-height:1.2; max-width:100%;">Andika T.M</div>
                </div>
                <button class="action-btn" id="btn-dl-brat">Simpan PNG</button>
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
                    showToast('Tersimpan!');
                });
            };
        }

        else if (tool === 'base64') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Base64</h3>
                <textarea id="b64-in" rows="3" placeholder="Teks..."></textarea>
                <div style="display:flex;gap:10px;">
                    <button class="action-btn" onclick="b64Action('enc')" style="flex:1;">Encode</button>
                    <button class="action-btn" onclick="b64Action('dec')" style="flex:1; background:var(--primary);">Decode</button>
                </div>
                <div id="b64-res" style="display:none; margin-top:15px; word-break:break-all; text-align:center; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
            `;
            window.b64Action = (type) => {
                const v = document.getElementById('b64-in').value;
                const b = document.getElementById('b64-res');
                if(!v) return showToast('Isi teks dulu!');
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

        else if (tool === 'imgto') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Image to Base64</h3>
                <input type="file" id="img-in" accept="image/*" style="padding:10px; margin-bottom:15px;">
                <div id="img-res" style="display:none; font-size:10px; word-break:break-all; text-align:left; border:2px dashed var(--border); padding:15px; border-radius:8px; max-height:150px; overflow-y:auto;"></div>
            `;
            document.getElementById('img-in').onchange = (e) => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const b = document.getElementById('img-res');
                    b.style.display = 'block'; b.innerText = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
        }

        else if (tool === 'password') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Password Gen</h3>
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

        else if (tool === 'cuaca') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Cek Cuaca</h3>
                <input type="text" id="cuaca-in" placeholder="Nama Kota...">
                <button class="action-btn" onclick="cekCuaca()">Cari Cuaca</button>
                <div id="cuaca-res" style="display:none; margin-top:15px; text-align:left; line-height:1.8; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
            `;
            window.cekCuaca = async () => {
                const city = document.getElementById('cuaca-in').value;
                const b = document.getElementById('cuaca-res');
                if(!city) return showToast('Masukkan kota!');
                b.style.display = 'block'; b.innerText = 'Mencari...';
                try {
                    const geo = await (await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)).json();
                    if(!geo.results) throw new Error('Kota tidak ditemukan.');
                    const {latitude, longitude, name} = geo.results[0];
                    const wx = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`)).json();
                    b.innerHTML = `<b style="color:var(--primary); font-size:16px;">${name}</b><br><b>Suhu:</b> ${wx.current_weather.temperature}°C<br><b>Angin:</b> ${wx.current_weather.windspeed} km/h`;
                } catch(e) { b.innerText = e.message; }
            };
        }

        else if (tool === 'quotes') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Random Quotes</h3>
                <button class="action-btn" onclick="getQuote()">Ambil Quotes</button>
                <div id="quote-res" style="display:none; margin-top:15px; font-style:italic; text-align:center; line-height:1.8; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
            `;
            window.getQuote = async () => {
                const b = document.getElementById('quote-res');
                b.style.display = 'block'; b.innerText = 'Memuat...';
                try {
                    const res = await (await fetch('https://api.quotable.io/random')).json();
                    b.innerHTML = `"${res.content}"<br><br><b style="color:var(--primary);">- ${res.author}</b>`;
                } catch(e) { 
                    b.innerHTML = `"Koding itu seni, dan lo adalah senimannya."<br><br><b style="color:var(--primary);">- Andika T.M</b>`; 
                }
            };
        }

        else if (tool === 'bmi') {
            modalContent.innerHTML = `
                ${closeSvg}
                <h3>Hitung BMI</h3>
                <input type="number" id="bmi-bb" placeholder="Berat (kg)">
                <input type="number" id="bmi-tb" placeholder="Tinggi (cm)">
                <button class="action-btn" onclick="hitungBMI()">Hitung</button>
                <div id="bmi-res" style="display:none; margin-top:15px; text-align:center; font-size:18px; font-weight:bold; border:2px dashed var(--border); padding:15px; border-radius:8px;"></div>
            `;
            window.hitungBMI = () => {
                const bb = parseFloat(document.getElementById('bmi-bb').value);
                const tb = parseFloat(document.getElementById('bmi-tb').value) / 100;
                if(!bb || !tb) return showToast('Isi data dulu!');
                const bmi = (bb / (tb * tb)).toFixed(1);
                let status = bmi < 18.5 ? "Kurus" : bmi <= 24.9 ? "Normal" : bmi <= 29.9 ? "Gemuk" : "Obesitas";
                const b = document.getElementById('bmi-res');
                b.style.display = 'block';
                b.innerHTML = `Skor: <span style="color:var(--primary); font-size:24px;">${bmi}</span><br>Status: ${status}`;
            };
        }
    };

    // Search Tool
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

});