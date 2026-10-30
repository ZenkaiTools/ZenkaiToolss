// ===== LOGIC POPUP WA =====
window.closePopup = () => {
  document.getElementById('waPopup').style.display = 'none';
};

// ===== LOGIC INFO DEVICE =====
function getDeviceName() {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "Android Device";
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS Device";
  if (/Windows/i.test(ua)) return "Windows PC";
  if (/Mac/i.test(ua)) return "MacBook";
  return "Unknown Device";
}
document.getElementById('deviceName').innerText = getDeviceName();

if(navigator.getBattery) {
  navigator.getBattery().then(function(battery) {
    document.getElementById('batteryLevel').innerText = Math.round(battery.level * 100) + "%";
  });
}

setInterval(() => {
  const now = new Date();
  const dateOpt = { day: 'numeric', month: 'short', year: 'numeric' };
  document.getElementById('dateNow').innerText = now.toLocaleDateString('id-ID', dateOpt);
  document.getElementById('clockNow').innerText = now.toLocaleTimeString('id-ID');
}, 1000);

// ===== SEARCH FILTER =====
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.tool-card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
});

// ===== LOGIC MODAL TOOL =====
const modal = document.getElementById('toolModal');
const toolBody = document.getElementById('toolBody');

window.closeModal = () => {
  modal.classList.remove('active');
  toolBody.innerHTML = '';
};

window.openTool = (tool) => {
  modal.classList.add('active');
  
  if(tool === 'tiktok') {
    toolBody.innerHTML = `
      <h3>Downloader TikTok</h3>
      <input type="text" id="ttUrl" placeholder="Paste link TikTok di sini...">
      <button class="action-btn" onclick="downloadTikTok()">Download Video</button>
      <div id="ttResult" class="result-box" style="display:none;"></div>
    `;
  } 
  else if(tool === 'qr') {
    toolBody.innerHTML = `
      <h3>QR Code Generator</h3>
      <input type="text" id="qrText" placeholder="Ketik teks atau link..." oninput="generateQR()">
      <div class="result-box">
        <img id="qrImg" src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ZenkaiTools" alt="QR">
      </div>
    `;
  } 
  else if(tool === 'brat') {
    toolBody.innerHTML = `
      <h3>Brat Text Generator</h3>
      <input type="text" id="bratText" placeholder="Ketik teks lu..." oninput="generateBrat()">
      <div class="result-box">
        <div id="bratResult" style="background:#fff;color:#000;padding:20px;font-family:Arial;font-size:24px;font-weight:bold;word-wrap:break-word;filter:blur(0.5px);">Zenkai</div>
      </div>
    `;
  } 
  else if(tool === 'base64') {
    toolBody.innerHTML = `
      <h3>Base64 Tool</h3>
      <textarea id="b64Input" rows="3" placeholder="Ketik teks atau Base64 di sini..."></textarea>
      <div style="display:flex; gap:10px;">
        <button class="action-btn" onclick="encodeB64()" style="flex:1;">Encode</button>
        <button class="action-btn" onclick="decodeB64()" style="flex:1; background:var(--pastel-yellow);">Decode</button>
      </div>
      <div id="b64Result" class="result-box" style="display:none;"></div>
    `;
  } 
  else if(tool === 'iplookup') {
    toolBody.innerHTML = `
      <h3>IP Lookup</h3>
      <input type="text" id="ipAddr" placeholder="Masukkan IP (misal: 8.8.8.8)">
      <button class="action-btn" onclick="lookupIP()">Lacak IP</button>
      <div id="ipResult" class="result-box" style="display:none;"></div>
    `;
  }
  else if(tool === 'soon') {
    toolBody.innerHTML = `<h3>Coming Soon</h3><p>Fitur ini masih dalam tahap pengembangan, kontol!</p>`;
  }
};

// ===== FUNGSI EKSEKUSI TOOL =====

// 1. TikTok Downloader
window.downloadTikTok = async () => {
  const url = document.getElementById('ttUrl').value;
  const resBox = document.getElementById('ttResult');
  if(!url) return alert("Masukin link dulu, kontol!");
  
  resBox.style.display = 'block';
  resBox.innerHTML = "Memproses video...";
  
  try {
    const res = await fetch(`https://www.tikwm.com/api/?url=${url}`);
    const data = await res.json();
    
    if(data.code === 0 && data.data) {
      const videoUrl = data.data.play;
      resBox.innerHTML = `
        <p style="color:#25D366; margin-bottom:10px;">Berhasil!</p>
        <video src="${videoUrl}" controls style="max-width:100%; border-radius:8px; border:2px solid #333;"></video>
        <br><br>
        <a href="${videoUrl}" target="_blank" class="action-btn" style="text-decoration:none; display:block; background:#25D366; color:#fff;">Download Video HD</a>
      `;
    } else {
      resBox.innerHTML = "<span style='color:red'>Gagal ambil video. Link salah atau API down.</span>";
    }
  } catch(e) {
    resBox.innerHTML = "<span style='color:red'>Error koneksi ke server TikTok.</span>";
  }
};

// 2. QR Generator
window.generateQR = () => {
  const text = document.getElementById('qrText').value || "ZenkaiTools";
  document.getElementById('qrImg').src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
};

// 3. Brat Text
window.generateBrat = () => {
  const text = document.getElementById('bratText').value || "Zenkai";
  document.getElementById('bratResult').innerText = text;
};

// 4. Base64
window.encodeB64 = () => {
  const input = document.getElementById('b64Input').value;
  const res = btoa(input);
  const box = document.getElementById('b64Result');
  box.style.display = 'block';
  box.innerHTML = `<b>Result:</b><br><span style="color:#333; font-family:monospace;">${res}</span>`;
};
window.decodeB64 = () => {
  const input = document.getElementById('b64Input').value;
  try {
    const res = atob(input);
    const box = document.getElementById('b64Result');
    box.style.display = 'block';
    box.innerHTML = `<b>Result:</b><br><span style="color:#333; font-family:monospace;">${res}</span>`;
  } catch(e) {
    alert("Format Base64 salah!");
  }
};

// 5. IP Lookup
window.lookupIP = async () => {
  const ip = document.getElementById('ipAddr').value;
  const box = document.getElementById('ipResult');
  if(!ip) return alert("Masukin IP dulu!");
  
  box.style.display = 'block';
  box.innerHTML = "Mencari lokasi...";
  
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await res.json();
    
    if(data.error) {
      box.innerHTML = `<span style="color:red">${data.reason}</span>`;
    } else {
      box.innerHTML = `
        <div style="text-align:left; font-size:14px;">
          <p><b>IP:</b> ${data.ip}</p>
          <p><b>Kota:</b> ${data.city}</p>
          <p><b>Negara:</b> ${data.country_name}</p>
          <p><b>ISP:</b> ${data.org}</p>
        </div>
      `;
    }
  } catch(e) {
    box.innerHTML = "<span style='color:red'>Gagal melacak IP.</span>";
  }
};