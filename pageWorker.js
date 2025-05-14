// pageWorker.js — 渲染前端页面并聚合数据，同步保留了原 worker.js 的页面样式和交互逻辑
addEventListener('fetch', event => {
    event.respondWith(handlePageRequest(event.request));
  });
  
  async function handlePageRequest(request) {
    const url = new URL(request.url);
    const origin = url.origin;
    const country = url.searchParams.get('country') || 'US';
  
    const [addrRes, userRes, phoneRes] = await Promise.all([
      fetch(`${origin}/api/address?country=${country}`),
      fetch(`${origin}/api/user`),
      fetch(`${origin}/api/phone?country=${country}`)
    ]);
  
    const { address } = addrRes.ok ? await addrRes.json() : { address: 'Unknown' };
    const { name, gender } = userRes.ok ? await userRes.json() : { name: 'Unknown', gender: 'Unknown' };
    const { phone } = phoneRes.ok ? await phoneRes.json() : { phone: 'Unknown' };
  
    return new Response(generateHtml(name, gender, phone, address, country), {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
  
  // 从最早的 worker.js 中复制完整的 generateHtml，包括所有 CSS 和 JS 交互逻辑
  function generateHtml(name, gender, phone, address, country) {
    return `<!DOCTYPE html>
  <html>
  <head>
    <title>Real Address Generator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; flex-direction: column; min-height: 100vh; background-color: #f0f0f0; margin: 0; }
      .container { text-align: center; background: white; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1); width: 90%; max-width: 600px; position: relative; }
      .title { font-size: 2em; margin-bottom: 10px; }
      .subtitle { font-size: 1em; margin-bottom: 5px; color: #555; }
      .subtitle-small { font-size: 0.8em; margin-bottom: 20px; color: #888; }
      .copied { display: none; position: absolute; top: 10px; right: 10px; background: #4caf50; color: white; padding: 5px 10px; border-radius: 5px; }
      .name, .gender, .phone, .address { font-size: 1.5em; margin-bottom: 10px; cursor: pointer; }
      .refresh-btn { padding: 10px 20px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; }
      .refresh-btn:hover { background-color: #0056b3; }
      .country-select { margin: 20px 0; }
      .map { width: 100%; height: 300px; border: none; margin-bottom: 20px; }
      .saved-addresses { width: 100%; border-collapse: collapse; margin-top: 10px; }
      .saved-addresses td, .saved-addresses th { border: 1px solid #ddd; padding: 8px; }
      .saved-addresses tr:nth-child(even){ background-color: #f9f9f9; }
      .saved-addresses th { background-color: #007bff; color: white; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="title">Real Address Generator 真实地址生成器</div>
      <div class="subtitle">Click to copy information（点击即可复制信息）</div>
      <div class="subtitle-small"></div>
      <div class="copied" id="copied">Copied!</div>
      <div class="name" onclick="copyToClipboard('${name}')">${name}</div>
      <div class="gender" onclick="copyToClipboard('${gender}')">${gender}</div>
      <div class="phone" onclick="copyToClipboard('${phone.replace(/[^\d+]/g, '')}')">${phone}</div>
      <div class="address" onclick="copyToClipboard('${address}')">${address}</div>
      <button class="refresh-btn" onclick="window.location.reload();">Get Another Address 获取新地址</button>
      <button class="refresh-btn" onclick="saveAddress();">Save Address 保存地址</button>
      <div class="country-select">
        <label for="country">Select country, new address will be generated automatically after checking the box</label><br>
        <span>选择国家，在勾选后将自动生成新地址</span><br>
        <select id="country" onchange="changeCountry(this.value)">${getCountryOptions(country)}</select>
      </div>
      <iframe class="map" src="https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed"></iframe>
      <table class="saved-addresses" id="savedAddrs"></table>
    </div>
    <script>
      function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
          const copied = document.getElementById('copied'); copied.style.display = 'block';
          setTimeout(() => { copied.style.display = 'none'; }, 2000);
        });
      }
      function changeCountry(country) {
      window.location.href = \`?country=\${country}\`
    }
    function saveAddress() {
      const note = prompt('请输入备注（可以留空）｜ Please enter a note (can be left blank)') || '';
      const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
      const newEntry = {
        note: note,
        name: '${name}',
        gender: '${gender}',
        phone: '${phone.replace(/[()\\s-]/g, '')}',
        address: '${address}'
      };
      savedAddresses.push(newEntry);
      localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
      renderSavedAddresses();
    }
    

    // 渲染保存的地址
    function renderSavedAddresses() {
      const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses') || '[]');
      const tbody = document.getElementById('savedAddressesTable').getElementsByTagName('tbody')[0];
      tbody.innerHTML = '';
      savedAddresses.forEach((entry, index) => {
        const row = tbody.insertRow();
        const deleteCell = row.insertCell();
        const noteCell = row.insertCell();
        const nameCell = row.insertCell();
        const genderCell = row.insertCell();
        const phoneCell = row.insertCell();
        const addressCell = row.insertCell();

        // 删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '删除 Delete';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => {
          savedAddresses.splice(index, 1);
          localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
          renderSavedAddresses();
        };
        deleteCell.appendChild(deleteBtn);

        noteCell.textContent = entry.note;
        nameCell.textContent = entry.name;
        genderCell.textContent = entry.gender;
        phoneCell.textContent = entry.phone;
        addressCell.textContent = entry.address;
      });
    }

    // 页面加载时渲染已保存的地址
    window.onload = function() {
      renderSavedAddresses();
    };
  </script>
</body>
</html>
`
}

  
  // Helper: 生成国家下拉选项列表
  function getCountryOptions(selectedCountry) {
    const countries = [
      { name: "United States 美国", code: "US" },
      { name: "United Kingdom 英国", code: "UK" },
      { name: "France 法国", code: "FR" },
      { name: "Germany 德国", code: "DE" },
      { name: "China 中国", code: "CN" },
      { name: "Taiwan 中国台湾", code: "TW" },
      { name: "Hong Kong 中国香港", code: "HK" }, 
      { name: "Japan 日本", code: "JP" },
      { name: "India 印度", code: "IN" },
      { name: "Australia 澳大利亚", code: "AU" },
      { name: "Brazil 巴西", code: "BR" },
      { name: "Canada 加拿大", code: "CA" },
      { name: "Russia 俄罗斯", code: "RU" },
      { name: "South Africa 南非", code: "ZA" },
      { name: "Mexico 墨西哥", code: "MX" },
      { name: "South Korea 韩国", code: "KR" },
      { name: "Italy 意大利", code: "IT" },
      { name: "Spain 西班牙", code: "ES" },
      { name: "Turkey 土耳其", code: "TR" },
      { name: "Saudi Arabia 沙特阿拉伯", code: "SA" },
      { name: "Argentina 阿根廷", code: "AR" },
      { name: "Egypt 埃及", code: "EG" },
      { name: "Nigeria 尼日利亚", code: "NG" },
      { name: "Indonesia 印度尼西亚", code: "ID" }
    ]
    return countries.map(({ name, code }) => `<option value="${code}" ${code === selectedCountry ? 'selected' : ''}>${name}</option>`).join('')
  }
  