document.addEventListener('DOMContentLoaded', () => {

  /* =========================================================
     1. POPUP WA
  ========================================================= */
  const btnTutupWa = document.getElementById('btnTutupWa');
  const waPopup = document.getElementById('waPopup');
  if (btnTutupWa && waPopup) {
    btnTutupWa.addEventListener('click', () => { waPopup.style.display = 'none'; });
  }

  /* =========================================================
     2. INFO DEVICE
  ========================================================= */
  function getDeviceName() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "Android Device";
    if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
    if (/Windows/i.test(ua)) return "Windows PC";
    if (/Mac/i.test(ua)) return "MacBook";
    if (/Linux/i.test(ua)) return "Linux";
    return "Unknown Device";
  }
  const deviceNameEl = document.getElementById('deviceName');
  if (deviceNameEl) deviceNameEl.innerText = getDeviceName();

  const batteryEl = document.getElementById('batteryLevel');
  if (batteryEl) {
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        const update = () => { batteryEl.innerText = Math.round(battery.level * 100) + "%"; };
        update();
        battery.addEventListener('levelchange', update);
      }).catch(() => { batteryEl.innerText = "N/A"; });
    } else {
      batteryEl.innerText = "N/A";
    }
  }

  function updateClock() {
    const now = new Date();
    const dateEl = document.getElementById('dateNow');
    const clockEl = document.getElementById('clockNow');
    if (dateEl) dateEl.innerText = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    if (clockEl) clockEl.innerText = now.toLocaleTimeString('id-ID');
  }
  updateClock();
  setInterval(updateClock, 1000);

  /* =========================================================
     3. SEARCH FILTER
  ========================================================= */
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      const term = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.tool-card').forEach(card => {
        card.style.display = card.innerText.toLowerCase().includes(term) ? 'block' : 'none';
      });
    });
  }

  /* =========================================================
     4. NAVIGASI HALAMAN
  ========================================================= */
  const pages = {
    tools: document.getElementById('pageTools'),
    setting: document.getElementById('pageSetting'),
    info: document.getElementById('pageInfo')
  };
  window.switchPage = (name) => {
    Object.keys(pages).forEach(k => pages[k].classList.toggle('page-hidden', k !== name));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.page === name));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* =========================================================
     5. SCROLL HELPERS
  ========================================================= */
  window.scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  window.scrollToTools = () => {
    const t = document.getElementById('toolsSection');
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* =========================================================
     6. MODAL
  ========================================================= */
  const modal = document.getElementById('toolModal');
  const toolBody = document.getElementById('toolBody');

  window.closeModal = () => {
    modal.classList.remove('active');
    toolBody.innerHTML = '';
  };
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  window.openTool = (tool) => {
    modal.classList.add('active');
    toolBody.innerHTML = '';

    if (tool === 'tiktok') {
      toolBody.innerHTML = `
        <h3>Downloader TikTok</h3>
        <input type="text" id="ttUrl" placeholder="Paste link TikTok di sini...">
        <button class="action-btn" id="ttBtn">Download Video</button>
        <div id="ttResult" class="result-box" style="display:none;"></div>
      `;
      document.getElementById('ttBtn').onclick = downloadTikTok;
    }

    else if (tool === 'qr') {
      toolBody.innerHTML = `
        <h3>QR Code Generator</h3>
        <input type="text" id="qrText" placeholder="Ketik teks atau link..." value="ZenkaiTools">
        <button class="action-btn" id="qrBtn">Generate QR</button>
        <div class="result-box">
          <img id="qrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZenkaiTools" alt="QR">
        </div>
      `;
      const qrText = document.getElementById('qrText');
      const qrImg = document.getElementById('qrImg');
      const doQR = () => {
        const v = qrText.value.trim() || "ZenkaiTools";
        qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(v)}`;
      };
      document.getElementById('qrBtn').onclick = doQR;
      qrText.addEventListener('input', doQR);
    }

    else if (tool === 'brat') {
      toolBody.innerHTML = `
        <h3>Brat Text Generator</h3>
        <input type="text" id="bratText" placeholder="Ketik teks..." value="Zenkai">
        <button class="action-btn" id="bratBtn">Generate</button>
        <div class="result-box">
          <div id="bratCanvasWrap">
            <div id="bratResult">Zenkai</div>
          </div>
        </div>
        <button class="action-btn secondary" id="bratDl" style="margin-top:12px;">Download PNG</button>
      `;
      const bratInput = document.getElementById('bratText');
      const bratResult = document.getElementById('bratResult');
      const doBrat = () => { bratResult.innerText = bratInput.value.trim() || "Zenkai"; };
      document.getElementById('bratBtn').onclick = doBrat;
      bratInput.addEventListener('input', doBrat);

      document.getElementById('bratDl').onclick = () => {
        if (typeof html2canvas === 'undefined') {
          alert('Library html2canvas belum termuat. Cek koneksi internet.');
          return;
        }
        const wrap = document.getElementById('bratCanvasWrap');
        html2canvas(wrap, { scale: 3, backgroundColor: '#ffffff' }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'brat-' + Date.now() + '.png';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      };
    }

    else if (tool === 'base64') {
      toolBody.innerHTML = `
        <h3>Encode / Decode Base64</h3>
        <textarea id="b64Input" rows="3" placeholder="Ketik teks atau Base64 di sini..."></textarea>
        <div style="display:flex; gap:10px;">
          <button class="action-btn" id="b64Enc" style="flex:1;">Encode</button>
          <button class="action-btn secondary" id="b64Dec" style="flex:1;">Decode</button>
        </div>
        <div id="b64Result" class="result-box" style="display:none;"></div>
      `;
      const b64Input = document.getElementById('b64Input');
      const b64Result = document.getElementById('b64Result');

      const enc = (str) => btoa(unescape(encodeURIComponent(str)));
      const dec = (str) => decodeURIComponent(escape(atob(str)));

      document.getElementById('b64Enc').onclick = () => {
        const v = b64Input.value;
        if (!v) return alert('Isi teks dulu.');
        try {
          b64Result.style.display = 'block';
          b64Result.innerHTML = `<b>Hasil Encode:</b><br><span style="font-family:monospace;word-break:break-all;">${enc(v)}</span>`;
        } catch (e) { alert('Gagal encode: ' + e.message); }
      };
      document.getElementById('b64Dec').onclick = () => {
        const v = b64Input.value.trim();
        if (!v) return alert('Isi Base64 dulu.');
        try {
          b64Result.style.display = 'block';
          b64Result.innerHTML = `<b>Hasil Decode:</b><br><span style="font-family:monospace;word-break:break-all;">${dec(v)}</span>`;
        } catch (e) { alert('Format Base64 tidak valid.'); }
      };
    }

    else if (tool === 'iplookup') {
      toolBody.innerHTML = `
        <h3>IP Lookup</h3>
        <input type="text" id="ipAddr" placeholder="Masukkan IP (misal: 8.8.8.8)">
        <button class="action-btn" id="ipBtn">Lacak IP</button>
        <div id="ipResult" class="result-box" style="display:none;"></div>
      `;
      document.getElementById('ipBtn').onclick = lookupIP;
    }

    else if (tool === 'soon') {
      toolBody.innerHTML = `
        <h3>Coming Soon</h3>
        <p style="font-size:14px;line-height:1.6;color:#555;">Fitur ini masih dalam pengembangan. Stay tuned di saluran WhatsApp Zenkai ya!</p>
      `;
    }
  };

  /* =========================================================
     7. FUNGSI EKSEKUSI TOOL
  ========================================================= */

  // TikTok
  async function downloadTikTok() {
    const url = document.getElementById('ttUrl').value.trim();
    const box = document.getElementById('ttResult');
    if (!url) return alert('Masukkan link TikTok dulu.');
    if (!/tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(url)) return alert('Link tidak valid. Pastikan link dari TikTok.');

    box.style.display = 'block';
    box.innerHTML = 'Memproses video...';

    try {
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      if (data.code === 0 && data.data) {
        const videoUrl = data.data.hdplay || data.data.play;
        box.innerHTML = `
          <p style="color:#25D366;margin-bottom:10px;font-weight:800;">Berhasil!</p>
          <video src="${videoUrl}" controls playsinline style="max-width:100%;border-radius:8px;border:2px solid #333;"></video>
          <br><br>
          <a href="${videoUrl}" target="_blank" rel="noopener" class="action-btn" style="display:block;text-decoration:none;background:#25D366;color:#fff;">Download / Buka Video</a>
        `;
      } else {
        box.innerHTML = `<span style="color:#d33;font-weight:700;">Gagal ambil video. Link salah atau API sedang down.</span>`;
      }
    } catch (e) {
      box.innerHTML = `<span style="color:#d33;font-weight:700;">Error koneksi ke server. Coba lagi nanti.</span>`;
    }
  }

  // IP Lookup
  async function lookupIP() {
    const ip = document.getElementById('ipAddr').value.trim();
    const box = document.getElementById('ipResult');
    if (!ip) return alert('Masukkan IP dulu.');
    box.style.display = 'block';
    box.innerHTML = 'Mencari lokasi...';

    try {
      const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`);
      const data = await res.json();
      if (data.error) {
        box.innerHTML = `<span style="color:#d33;font-weight:700;">${data.reason || 'IP tidak ditemukan.'}</span>`;
        return;
      }
      box.innerHTML = `
        <div style="text-align:left;font-size:14px;line-height:1.8;">
          <p><b>IP:</b> ${data.ip || '-'}</p>
          <p><b>Kota:</b> ${data.city || '-'}</p>
          <p><b>Region:</b> ${data.region || '-'}</p>
          <p><b>Negara:</b> ${data.country_name || '-'}</p>
          <p><b>ISP:</b> ${data.org || '-'}</p>
        </div>
      `;
    } catch (e) {
      box.innerHTML = `<span style="color:#d33;font-weight:700;">Gagal melacak IP.</span>`;
    }
  }

});