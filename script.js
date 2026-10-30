document.addEventListener('DOMContentLoaded', () => {

    // =========================================
    // 1. TOAST NOTIFICATION (PENGGANTI ALERT)
    // =========================================
    window.showToast = (message, isError = false) => {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        if (isError) toast.style.borderColor = 'var(--danger)';
        toast.innerText = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // =========================================
    // 2. BGM (MUSIK VIRAL) LOGIC
    // =========================================
    const bgm = document.getElementById('bgm');
    const musicToggle = document.getElementById('music-toggle');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (!isPlaying) {
            bgm.volume = 0.3;
            bgm.play().then(() => {
                isPlaying = true;
                musicToggle.innerText = '🔇';
                showToast('Musik dinyalakan 🎵');
            }).catch(() => {
                showToast('Gagal memutar musik. Cek koneksi.', true);
            });
        } else {
            bgm.pause();
            isPlaying = false;
            musicToggle.innerText = '🎵';
            showToast('Musik dimatikan 🔇');
        }
    });

    // =========================================
    // 3. CLOCK & DEVICE
    // =========================================
    function updateTime() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('date').innerText = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    setInterval(updateTime, 1000);
    updateTime();

    const ua = navigator.userAgent;
    let device = "Desktop";
    if (/android/i.test(ua)) device = "Android";
    else if (/iPad|iPhone|iPod/.test(ua)) device = "iOS";
    document.getElementById('device-status').innerText = device;

    // =========================================
    // 4. NAVIGASI & SEARCH
    // =========================================
    window.switchPage = (page, btnElement) => {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');
        
        if (page === 'tools') {
            document.getElementById('page-tools').style.display = 'block';
            document.getElementById('page-info').classList.add('page-hidden');
        } else {
            document.getElementById('page-tools').style.display = 'none';
            document.getElementById('page-info').classList.remove('page-hidden');
        }
    };

    document.getElementById('search-tools').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(card => {
            const title = card.querySelector('h4').innerText.toLowerCase();
            card.style.display = title.includes(term) ? 'block' : 'none';
        });
    });

    // =========================================
    // 5. MODAL LOGIC & TOOLS
    // =========================================
    const modal = document.getElementById('tool-modal');
    const modalContent = document.getElementById('modal-content');

    window.closeModal = () => {
        modal.classList.remove('active');
        modalContent.innerHTML = '';
    };

    window.openTool = (tool) => {
        modal.classList.add('active');
        modalContent.innerHTML = '';

        if (tool === 'tiktok') {
            modalContent.innerHTML = `
                <h3>TikTok Downloader</h3>
                <p style="font-size:12px;color:#888;margin-bottom:10px;">Download video tanpa watermark langsung ke galeri HP lu.</p>
                <input type="text" id="tt-url" placeholder="Paste link TikTok di sini...">
                <button class="action-btn" id="btn-dl-tt">Download Video</button>
                <div id="tt-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-dl-tt').onclick = downloadTikTok;
        } 
        else if (tool === 'qr') {
            modalContent.innerHTML = `
                <h3>QR Code Generator</h3>
                <input type="text" id="qr-text" placeholder="Ketik teks atau link..." value="Andika Tools">
                <button class="action-btn" id="btn-qr">Generate</button>
                <div class="result-box" id="qr-result">
                    <img id="qr-img" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Andika+Tools" alt="QR">
                </div>
            `;
            document.getElementById('btn-qr').onclick = () => {
                const text = document.getElementById('qr-text').value || "Andika Tools";
                document.getElementById('qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
            };
        }
        else if (tool === 'brat') {
            modalContent.innerHTML = `
                <h3>Brat Text Generator</h3>
                <input type="text" id="brat-input" placeholder="Ketik teks..." value="Andika">
                <button class="action-btn" id="btn-brat">Update Teks</button>
                <div class="result-box" style="background:#fff;padding:20px;">
                    <div id="brat-result" style="color:#000;font-family:Arial;font-weight:bold;font-size:24px;filter:blur(1px);text-align:center;word-wrap:break-word;">Andika</div>
                </div>
                <button class="action-btn" id="btn-dl-brat" style="background:#ffcc00;margin-top:10px;">Download PNG</button>
            `;
            document.getElementById('btn-brat').onclick = () => {
                document.getElementById('brat-result').innerText = document.getElementById('brat-input').value || "Andika";
            };
            document.getElementById('btn-dl-brat').onclick = () => {
                const node = document.getElementById('brat-result').parentElement;
                html2canvas(node, { scale: 2, backgroundColor: '#ffffff' }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'brat-andika.png';
                    link.href = canvas.toDataURL();
                    link.click();
                    showToast('Gambar berhasil di-download!');
                });
            };
        }
        else if (tool === 'base64') {
            modalContent.innerHTML = `
                <h3>Encode / Decode Base64</h3>
                <textarea id="b64-input" rows="3" placeholder="Ketik teks di sini..."></textarea>
                <button class="action-btn" id="btn-enc">Encode</button>
                <button class="action-btn" id="btn-dec" style="background:#555;color:#fff;">Decode</button>
                <div id="b64-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-enc').onclick = () => {
                const val = document.getElementById('b64-input').value;
                if(!val) return showToast('Input kosong!', true);
                try {
                    const res = btoa(unescape(encodeURIComponent(val)));
                    const box = document.getElementById('b64-result');
                    box.style.display = 'block';
                    box.innerHTML = `<b>Encoded:</b><br>${res}`;
                } catch(e) { showToast('Gagal encode.', true); }
            };
            document.getElementById('btn-dec').onclick = () => {
                const val = document.getElementById('b64-input').value;
                if(!val) return showToast('Input kosong!', true);
                try {
                    const res = decodeURIComponent(escape(atob(val)));
                    const box = document.getElementById('b64-result');
                    box.style.display = 'block';
                    box.innerHTML = `<b>Decoded:</b><br>${res}`;
                } catch(e) { showToast('Format Base64 tidak valid.', true); }
            };
        }
        else if (tool === 'ip') {
            modalContent.innerHTML = `
                <h3>IP Lookup</h3>
                <input type="text" id="ip-input" placeholder="Cth: 8.8.8.8">
                <button class="action-btn" id="btn-ip">Lacak</button>
                <div id="ip-result" class="result-box" style="display:none;"></div>
            `;
            document.getElementById('btn-ip').onclick = async () => {
                const ip = document.getElementById('ip-input').value;
                if(!ip) return showToast('Masukkan IP!', true);
                const box = document.getElementById('ip-result');
                box.style.display = 'block';
                box.innerHTML = 'Mencari...';
                try {
                    const res = await fetch(`https://ipapi.co/${ip}/json/`);
                    const data = await res.json();
                    if(data.error) return box.innerHTML = `<span style="color:var(--danger)">${data.reason}</span>`;
                    box.innerHTML = `
                        <div style="text-align:left;line-height:1.8;">
                            <b>IP:</b> ${data.ip}<br>
                            <b>Kota:</b> ${data.city}<br>
                            <b>Negara:</b> ${data.country_name}<br>
                            <b>ISP:</b> ${data.org}
                        </div>
                    `;
                } catch(e) { box.innerHTML = `<span style="color:var(--danger)">Gagal melacak IP.</span>`; }
            };
        }
        else if (tool === 'imgto') {
            modalContent.innerHTML = `
                <h3>Image to Link</h3>
                <p style="font-size:12px;color:#aaa;margin-bottom:10px;">Upload gambar untuk mendapatkan link base64.</p>
                <input type="file" id="img-upload" accept="image/*" style="border:none;padding:0;margin-bottom:15px;">
                <div id="img-preview" class="result-box" style="display:none;"></div>
                <button class="action-btn" id="btn-copy-img" style="display:none;margin-top:10px;">Copy Link</button>
            `;
            const fileInput = document.getElementById('img-upload');
            const preview = document.getElementById('img-preview');
            const copyBtn = document.getElementById('btn-copy-img');
            let base64Str = '';

            fileInput.onchange = (e) => {
                const file = e.target.files[0];
                if(!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    base64Str = ev.target.result;
                    preview.style.display = 'block';
                    preview.innerHTML = `<img src="${base64Str}" style="max-height:150px;">`;
                    copyBtn.style.display = 'block';
                };
                reader.readAsDataURL(file);
            };

            copyBtn.onclick = () => {
                navigator.clipboard.writeText(base64Str).then(() => {
                    showToast('Link gambar berhasil di-copy!');
                }).catch(() => showToast('Gagal copy link.', true));
            };
        }
        else if (tool === 'password') {
            modalContent.innerHTML = `
                <h3>Password Generator</h3>
                <button class="action-btn" id="btn-genpass">Generate Password</button>
                <div id="pass-result" class="result-box" style="display:none;font-size:18px;font-weight:bold;color:var(--border-neon);"></div>
                <button class="action-btn" id="btn-copy-pass" style="display:none;background:#555;color:#fff;">Copy Password</button>
            `;
            document.getElementById('btn-genpass').onclick = () => {
                const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
                let pass = "";
                for(let i=0; i<16; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
                const resBox = document.getElementById('pass-result');
                const copyBtn = document.getElementById('btn-copy-pass');
                resBox.style.display = 'block';
                resBox.innerText = pass;
                copyBtn.style.display = 'block';
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(pass).then(() => showToast('Password di-copy!'));
                };
            };
        }
        else if (tool === 'calc') {
            modalContent.innerHTML = `
                <h3>Kalkulator</h3>
                <input type="text" id="calc-input" placeholder="Cth: 2 + 2 * 3" style="font-size:18px;">
                <button class="action-btn" id="btn-calc">Hitung</button>
                <div id="calc-result" class="result-box" style="display:none;font-size:24px;font-weight:bold;"></div>
            `;
            document.getElementById('btn-calc').onclick = () => {
                const expr = document.getElementById('calc-input').value;
                if(!expr) return;
                try {
                    const res = Function('"use strict";return (' + expr + ')')();
                    const box = document.getElementById('calc-result');
                    box.style.display = 'block';
                    box.innerText = res;
                } catch(e) {
                    showToast('Ekspresi tidak valid.', true);
                }
            };
        }
        else if (tool === 'textcase') {
            modalContent.innerHTML = `
                <h3>Text Case Converter</h3>
                <textarea id="tc-input" rows="3" placeholder="Ketik teks..."></textarea>
                <div style="display:flex;gap:5px;flex-wrap:wrap;margin-bottom:15px;">
                    <button class="action-btn" onclick="changeCase('upper')" style="flex:1;padding:8px;font-size:12px;">UPPER</button>
                    <button class="action-btn" onclick="changeCase('lower')" style="flex:1;padding:8px;font-size:12px;">lower</button>
                    <button class="action-btn" onclick="changeCase('title')" style="flex:1;padding:8px;font-size:12px;">Title</button>
                </div>
                <div id="tc-result" class="result-box" style="display:none;"></div>
            `;
            window.changeCase = (type) => {
                let text = document.getElementById('tc-input').value;
                if(type === 'upper') text = text.toUpperCase();
                if(type === 'lower') text = text.toLowerCase();
                if(type === 'title') text = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                const box = document.getElementById('tc-result');
                box.style.display = 'block';
                box.innerText = text;
            };
        }
        else if (tool === 'zodiak') {
            modalContent.innerHTML = `
                <h3>Cek Zodiak</h3>
                <input type="date" id="zodiak-date">
                <button class="action-btn" id="btn-zodiak">Cek Zodiak</button>
                <div id="zodiak-result" class="result-box" style="display:none;font-size:16px;"></div>
            `;
            document.getElementById('btn-zodiak').onclick = () => {
                const dateVal = document.getElementById('zodiak-date').value;
                if(!dateVal) return showToast('Pilih tanggal lahir!', true);
                const d = new Date(dateVal);
                const day = d.getDate(), month = d.getMonth() + 1;
                let zodiak = "";
                if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) zodiak = "Aquarius ♒";
                else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) zodiak = "Pisces ♓";
                else if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) zodiak = "Aries ♈";
                else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) zodiak = "Taurus ♉";
                else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) zodiak = "Gemini ♊";
                else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) zodiak = "Cancer ♋";
                else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) zodiak = "Leo ♌";
                else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) zodiak = "Virgo ♍";
                else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) zodiak = "Libra ♎";
                else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) zodiak = "Scorpio ♏";
                else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) zodiak = "Sagittarius ♐";
                else zodiak = "Capricorn ♑";
                
                const box = document.getElementById('zodiak-result');
                box.style.display = 'block';
                box.innerHTML = `Zodiak lu: <b style="color:var(--border-neon);font-size:20px;">${zodiak}</b>`;
            };
        }
        else if (tool === 'quotes') {
            modalContent.innerHTML = `
                <h3>Quotes Random</h3>
                <button class="action-btn" id="btn-quotes">Kasih Quotes</button>
                <div id="quotes-result" class="result-box" style="display:none;font-style:italic;font-size:15px;line-height:1.6;"></div>
            `;
            document.getElementById('btn-quotes').onclick = () => {
                const quotes = [
                    "Jangan pernah menyerah, karena istirahat itu penting.",
                    "Kesuksesan berawal dari mimpi, dan mimpi berawal dari tidur yang cukup.",
                    "Hidup itu seperti sepeda. Agar tetap seimbang, kau harus terus bergerak.",
                    "Jangan takut gagal, karena gagal adalah awal dari sukses yang tertunda.",
                    "Berbuat baiklah, karena karma itu nyata.",
                    "Kamu lebih kuat dari yang kamu kira.",
                    "Masa depan milik mereka yang percaya pada keindahan mimpi mereka."
                ];
                const randomQ = quotes[Math.floor(Math.random() * quotes.length)];
                const box = document.getElementById('quotes-result');
                box.style.display = 'block';
                box.innerHTML = `"${randomQ}"`;
            };
        }
        else if (tool === 'game') {
            modalContent.innerHTML = `
                <h3>Tebak Angka (1-10)</h3>
                <p style="font-size:12px;color:#aaa;margin-bottom:10px;">Tebak angka yang benar dari 1 sampai 10!</p>
                <input type="number" id="guess-input" placeholder="Masukkan angka (1-10)" min="1" max="10">
                <button class="action-btn" id="btn-guess">Tebak!</button>
                <div id="guess-result" class="result-box" style="display:none;"></div>
            `;
            // Generate angka random baru setiap kali tool dibuka
            const targetNum = Math.floor(Math.random() * 10) + 1;
            let attempts = 0;
            
            document.getElementById('btn-guess').onclick = () => {
                const val = parseInt(document.getElementById('guess-input').value);
                const box = document.getElementById('guess-result');
                if(!val || val < 1 || val > 10) return showToast('Masukkan angka 1-10!', true);
                
                attempts++;
                box.style.display = 'block';
                
                if(val === targetNum) {
                    box.innerHTML = `<b style="color:var(--border-neon);">BENAR! 🎉</b><br>Lu berhasil nebak dalam ${attempts} percobaan.`;
                    box.style.borderColor = 'var(--border-neon)';
                } else if (val > targetNum) {
                    box.innerHTML = `<span style="color:#ff9900;">Terlalu TINGGI! ⬇️</span>`;
                    box.style.borderColor = '#ff9900';
                } else {
                    box.innerHTML = `<span style="color:#ff4d4d;">Terlalu RENDAH! ⬆️</span>`;
                    box.style.borderColor = '#ff4d4d';
                }
            };
        }
    };

    // =========================================
    // 6. FUNGSI DOWNLOAD TIKTOK (LANGSUNG KE DEVICE)
    // =========================================
    async function downloadTikTok() {
        const url = document.getElementById('tt-url').value.trim();
        const resBox = document.getElementById('tt-result');
        
        if (!url) return showToast('Masukkan link TikTok dulu!', true);
        if (!/tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(url)) return showToast('Link tidak valid!', true);

        resBox.style.display = 'block';
        resBox.innerHTML = 'Mengambil data video...';

        try {
            const apiRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
            const data = await apiRes.json();

            if (data.code !== 0 || !data.data) {
                throw new Error('Gagal mengambil video. Pastikan link publik.');
            }

            const videoUrl = data.data.hdplay || data.data.play;
            resBox.innerHTML = 'Mendownload video (mohon tunggu)...';

            // Trik: Ambil file video sebagai Blob, lalu paksa download
            const videoRes = await fetch(videoUrl);
            const blob = await videoRes.blob();
            const blobUrl = URL.createObjectURL(blob);

            // Trigger download langsung
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `tiktok-andika-${Date.now()}.mp4`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Bersihkan memory
            URL.revokeObjectURL(blobUrl);

            resBox.innerHTML = `<b style="color:var(--border-neon);">✅ Berhasil didownload!</b><br><span style="font-size:12px;color:#aaa;">Cek galeri/File Manager HP lu.</span>`;
            showToast('Video berhasil didownload!');
            
        } catch (e) {
            resBox.innerHTML = `<span style="color:var(--danger);font-weight:bold;">Gagal: ${e.message}</span>`;
            showToast('Gagal mendownload video.', true);
        }
    }

});