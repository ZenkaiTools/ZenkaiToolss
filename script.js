import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// === KONFIGURASI SUPABASE LU ===
const SUPABASE_URL = "https://chcfvbqyygtkfcvhywoa.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoY2Z2YnF5eWd0a2Zjdmh5d29hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjYxNDAsImV4cCI6MjEwNjQ0MjE0MH0.VjsHm2lIVs--biNLF-ku6K3AyIbUVXylyFY77xjaajM";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// === LOGIC LOGIN SUPABASE (Biar keren pake Auth) ===
document.getElementById('btnLogin').addEventListener('click', async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if(error) alert("Error: " + error.message);
});

// === UI LOGIC ===
const modal = document.getElementById('toolModal');
const toolBody = document.getElementById('toolBody');

window.closeModal = () => {
  modal.classList.remove('active');
  toolBody.innerHTML = '';
};

// SEARCH FILTER
document.getElementById('searchInput').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(term) ? 'block' : 'none';
  });
});

// === FUNGSI BUKA TOOL ===
window.openTool = (tool) => {
  modal.classList.add('active');
  
  if(tool === 'tiktok') {
    toolBody.innerHTML = `
      <h3>TikTok Downloader</h3>
      <input type="text" id="ttUrl" placeholder="Paste link TikTok di sini...">
      <button onclick="downloadTikTok()">Download Video</button>
      <div id="ttResult" class="result-box" style="display:none;"></div>
    `;
  } 
  
  else if(tool === 'qr') {
    toolBody.innerHTML = `
      <h3>QR Code Generator</h3>
      <input type="text" id="qrText" placeholder="Ketik teks atau link..." oninput="generateQR()">
      <div id="qrResult" class="result-box">
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
      <button onclick="encodeB64()" style="width:48%; margin-right:4%;">Encode</button>
      <button onclick="decodeB64()" style="width:48%;">Decode</button>
      <div id="b64Result" class="result-box" style="display:none;"></div>
    `;
  } 
  
  else if(tool === 'iplookup') {
    toolBody.innerHTML = `
      <h3>IP Lookup</h3>
      <input type="text" id="ipAddr" placeholder="Masukkan IP (misal: 8.8.8.8)">
      <button onclick="lookupIP()">Lacak IP</button>
      <div id="ipResult" class="result-box" style="display:none;"></div>
    `;
  }
};

// === FUNGSI EKSEKUSI TOOL ===

// 1. TikTok Downloader (Pake API Publik)
window.downloadTikTok = async () => {
  const url = document.getElementById('ttUrl').value;
  const resBox = document.getElementById('ttResult');
  if(!url) return alert("Masukin link dulu, kontol!");
  
  resBox.style.display = 'block';
  resBox.innerHTML = "Memproses video...";
  
  try {
    // Pake API gratis (TikWM) - Catatan: API publik bisa mati kapan aja
    const res = await fetch(`https://www.tikwm.com/api/?url=${url}`);
    const data = await res.json();
    
    if(data.code === 0 && data.data) {
      const videoUrl = data.data.play;
      resBox.innerHTML = `
        <p style="color:#00ff66;font-size:12px;margin-bottom:10px;">Berhasil!</p>
        <video src="${videoUrl}" controls style="max-width:100%;border-radius:8px;"></video>
        <br><br>
        <a href="${videoUrl}" target="_blank" style="display:block;background:#00ff66;color:#000;text-decoration:none;padding:10px;border-radius:8px;font-weight:bold;">Download Video HD</a>
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
  box.innerHTML = `<b>Result:</b><br><span style="color:#00ff66">${res}</span>`;
};
window.decodeB64 = () => {
  const input = document.getElementById('b64Input').value;
  try {
    const res = atob(input);
    const box = document.getElementById('b64Result');
    box.style.display = 'block';
    box.innerHTML = `<b>Result:</b><br><span style="color:#00ff66">${res}</span>`;
  } catch(e) {
    alert("Format Base64 salah, kontol!");
  }
};

// 5. IP Lookup (Pake API ipapi.co)
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
        <div style="text-align:left;font-size:13px;">
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