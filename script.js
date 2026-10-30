document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. SISTEM GANTI TEMA & LAYOUT
    // =========================================
    const themes = ['comic', 'cyber', 'minimal'];
    let currentThemeIndex = 0;

    window.switchTheme = () => {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        const newTheme = themes[currentThemeIndex];
        document.body.setAttribute('data-theme', newTheme);
        
        const themeNames = { comic: 'Comic Style 🎨', cyber: 'Cyberpunk ⚡', minimal: 'Clean Minimalist ✨' };
        showToast(`Tema: ${themeNames[newTheme]}`);
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
    // 3. PLAYLIST MUSIK VIRAL INDONESIA
    // =========================================
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('music-toggle');
    
    // Lagu Viral (Bebas Royalti, Full Audio)
    const playlist = [
        "https://cdn.pixabay.com/download/audio/2023/03/16/audio_6764249b25.mp3?filename=teh-hijau-remix-135971.mp3", // Instrumental Teh Hijau
        "https://cdn.pixabay.com/download/audio/2022/11/22/audio_4b16a02c47.mp3?filename=viral-tiktok-beat-122724.mp3", // Beat Viral
        "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=cyberpunk-2099-10701.mp3", // Cyberpunk
        "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3" // Lofi
    ];
    
    let isPlaying = false;
    let lastPlayedIndex = -1;

    function playRandomSong() {
        let newIndex;
        do { newIndex = Math.floor(Math.random() * playlist.length); } 
        while (newIndex === lastPlayedIndex && playlist.length > 1);
        
        lastPlayedIndex = newIndex;
        bgm.src = playlist[newIndex];
        bgm.play().catch(() => showToast('Gagal memutar musik.', true));
    }

    if (musicToggle && bgm) {
        musicToggle.addEventListener('click', () => {
            if (!isPlaying) {
                bgm.volume = 0.3;
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
    // 5. LOGIC BOTTOM SHEET MODAL
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
        
        // Header Modal dengan Tombol X (SVG)
        const closeBtnHTML = `<button class="modal-close" onclick="closeModal()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" width="16" height="16"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;

        // --- 1. TIKTOK DOWNLOADER ---
        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                ${closeBtnHTML}
                <h3>TikTok Downloader</h3>
                <p style="font-size:12px; opacity:0.7; margin-bottom:15px;">Paste link TikTok lo. Video bakal muncul di sini dan bisa diputar dulu sebelum didownload.</p>
                <input type="text" id="tt-url" placeholder="https://www.tiktok.com/...">
                <button class="action-btn" id="btn-dl-tt">Proses Video</button>
                <div id="tt-result" style="display:none;"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = async () => {
                const url = document.getElementById('tt-url').value.trim();
                const box = document.getElementById('tt-result');
                const btn = document.getElementById('btn-dl-tt');
                if(!url) return showToast('Masukkan link dulu!', true);
                
                btn.innerHTML = '<div class="loader" style="display:inline-block; vertical-align:middle; margin-right:10px;"></div> Memproses...';
                btn.disabled = true;
                box.style.display = 'block'; 
                box.innerHTML = '<div style="text-align:center; padding:20px;"><div class="loader"></div><p style="font-size:12px; margin-top:10px;">Menghubungi server...</p></div>';
                
                try {
                    const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
                    const data = await res.json();
                    if(data.code !== 0) throw new Error('Link gak valid atau video private.');
                    
                    const vidUrl = data.data.hdplay || data.data.play;
                    const title = data.data.title || "Video TikTok";
                    
                    box.innerHTML = `
                        <div style="text-align:left; margin-bottom:10px; font-size:12px; border-bottom:2px solid var(--border); padding-bottom:10px;">
                            <b>Judul:</b> ${title}
                        </div>
                        <video style="width:100%; max-height:250px; border-radius:8px; border:2px solid var(--border); margin-bottom:15px; background:#000;" src="${vidUrl}" controls playsinline></video>
                        <button class="action-btn" id="btn-save-tt">Download Video</button>
                    `;
                    
                    document.getElementById('btn-save-tt').onclick = async () => {
                        const saveBtn = document.getElementById('btn-save-tt');
                        saveBtn.innerHTML = 'Mendownload...';
                        try {
                            const blob = await (await fetch(vidUrl)).blob();
                            const a = document.createElement('a');
                            a.href = URL.createObjectURL(blob);
                            a.download = `tiktok-${Date.now()}.mp4`;
                            a.click();
                            showToast('Video berhasil disimpan!');
                        } catch(e) { showToast('Gagal download.', true); }
                        saveBtn.innerText = 'Download Video';
                    };
                } catch(e) { 
                    box.innerHTML = `<div style="text-align:center; color:#ff3333; padding:10px;">Error: ${e.message}</div>`; 
                } finally {
                    btn.innerText = 'Proses Video';
                    btn.disabled = false;
                }
            };
        }
        
        // --- 2. QR CODE ---
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                ${closeBtnHTML}
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
        
        // --- 3. BRAT TEXT ---
        else if (tool === 'brat') {
            modalContent.innerHTML = `
                ${closeBtnHTML}
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
                    showToast('Gambar tersimpan!');
                });
            };
        }
        
        // --- 4. KALKULATOR BENERAN ---
        else if (tool === 'calc') {
            modalContent.innerHTML = `
                ${closeBtnHTML}
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
                        <button class="calc-btn op" onclick="calcInput('=')" style="background:#00ff9d;">=</button>
                    </div>
                </div>
            `;
        }
        
        // --- 5. ZODIAK (CUSTOM SELECT / BOTTOM SHEET) ---
        else if (tool === 'zodiak') {
            let tglOpts = '';
            for(let i=1; i<=31; i++) tglOpts += `<div class="z-opt" onclick="selectZ('tgl', ${i}, '${i}', this)" style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer;">${i}</div>`;
            
            const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
            let blnOpts = '';
            bulan.forEach((b, i) => blnOpts += `<div class="z-opt" onclick="selectZ('bln', ${i+1}, '${b}', this)" style="padding:10px; border-bottom:1px solid var(--border); cursor:pointer;">${b}</div>`);

            modalContent.innerHTML = `
                ${closeBtnHTML}
                <h3>Cek Zodiak</h3>
                
                <div style="display:flex; gap:10px; margin-bottom:15px;">
                    <div style="flex:1; position:relative;">
                        <button class="action-btn" onclick="toggleZD('tgl')" id="btn-z-tgl" style="margin-bottom:0;">Pilih Tgl</button>
                        <div id="list-tgl" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--card-bg); border:2px solid var(--border); border-radius:8px; max-height:150px; overflow-y:auto; z-index:10; margin-top:5px;">
                            ${tglOpts}
                        </div>
                    </div>
                    <div style="flex:2; position:relative;">
                        <button class="action-btn" onclick="toggleZD('bln')" id="btn-z-bln" style="margin-bottom:0;">Pilih Bulan</button>
                        <div id="list-bln" style="display:none; position:absolute; top:100%; left:0; right:0; background:var(--card-bg); border:2px solid var(--border); border-radius:8px; max-height:150px; overflow-y:auto; z-index:10; margin-top:5px;">
                            ${blnOpts}
                        </div>
                    </div>
                </div>

                <button class="action-btn" onclick="hitungZodiak()" style="margin-top:10px;">Cek Zodiak</button>
                <div id="zodiak-res" style="display:none; text-align:center; font-size:16px; margin-top:15px; padding:15px; background:var(--card-bg); border:2px solid var(--border); border-radius:8px;"></div>
            `;
            
            // State
            window.zTgl = null;
            window.zBln = null;

            window.toggleZD = (type) => {
                document.getElementById('list-tgl').style.display = 'none';
                document.getElementById('list-bln').style.display = 'none';
                const el = document.getElementById(`list-${type}`);
                el.style.display = el.style.display === 'none' ? 'block' : 'none';
            };

            window.selectZ = (type, val, txt, el) => {
                if(type === 'tgl') { window.zTgl = val; document.getElementById('btn-z-tgl').innerText = txt; }
                if(type === 'bln') { window.zBln = val; document.getElementById('btn-z-bln').innerText = txt; }
                document.getElementById('list-tgl').style.display = 'none';
                document.getElementById('list-bln').style.display = 'none';
            };

            window.hitungZodiak = () => {
                if(!window.zTgl || !window.zBln) return showToast('Pilih tanggal & bulan!', true);
                
                let z = "";
                const tgl = window.zTgl, bln = window.zBln;
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
                
                const res = document.getElementById('zodiak-res');
                res.style.display = 'block';
                res.innerHTML = `Zodiak: <b style="color:var(--primary); font-size:20px; display:block;">${z}</b>`;
            };
        }
    };

    // =========================================
    // 7. LOGIKA KALKULATOR
    // =========================================
    let calcExpression = "";
    
    window.calcInput = (val) => {
        const screen = document.getElementById('calc-screen');
        if(val === 'C') { calcExpression = ""; screen.innerText = "0"; return; }
        if(val === 'DEL') { calcExpression = calcExpression.toString().slice(0, -1); screen.innerText = calcExpression || "0"; return; }
        if(val === '=') {
            try {
                const res = Function('"use strict";return (' + calcExpression + ')')();
                screen.innerText = res;
                calcExpression = res.toString();
            } catch(e) { screen.innerText = "Error"; calcExpression = ""; }
            return;
        }
        
        calcExpression += val;
        screen.innerText = calcExpression;
    };

});