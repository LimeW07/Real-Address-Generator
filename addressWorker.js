// addressWorker.js - 负责地理反向查询并返回格式化地址数据
addEventListener('fetch', event => {
  event.respondWith(handleAddressRequest(event.request));
});

async function handleAddressRequest(request) {
  const url = new URL(request.url);
  const country = url.searchParams.get('country') || getRandomCountry();
  let address = null;

  // 尝试最多30次获取有效地址
  for (let i = 0; i < 30; i++) {
    try {
      const location = getRandomLocationInCountry(country);
      const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}&zoom=18&addressdetails=1`;
      const response = await fetch(apiUrl, { headers: { 'User-Agent': 'Cloudflare Worker' } });
      if (!response.ok) continue;
      const data = await response.json();
      const addr = data.address;
      if (addr?.house_number && addr?.road && (addr?.city || addr?.town || addr?.village)) {
        address = formatAddress(addr, country);
        break;
      }
    } catch (e) {
      continue;
    }
  }

  if (!address) {
    return new Response(JSON.stringify({ error: 'Failed to retrieve detailed address' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }

  return new Response(JSON.stringify({ address }), {
    headers: { 'Content-Type': 'application/json;charset=UTF-8' }
  });
}

// Helper: 随机选择国家代码
function getRandomCountry() {
  const countries = ["US","UK","FR","DE","CN","TW","HK","JP","IN","AU","BR","CA","RU","ZA","MX","KR","IT","ES","TR","SA","AR","EG","NG","ID"];
  return countries[Math.floor(Math.random() * countries.length)];
}

// Helper: 随机生成给定国家内的经纬度
function getRandomLocationInCountry(country) {
  const countryCoordinates = {
    "US": [{ lat: 37.7749, lng: -122.4194 },{ lat: 34.0522, lng: -118.2437 }],
    "UK": [{ lat: 51.5074, lng: -0.1278 },{ lat: 53.4808, lng: -2.2426 }],
    "FR": [{ lat: 48.8566, lng: 2.3522 },{ lat: 45.7640, lng: 4.8357 }],
    "DE": [{ lat: 52.5200, lng: 13.4050 },{ lat: 48.1351, lng: 11.5820 }],
    "CN": [{ lat: 39.9042, lng: 116.4074 },{ lat: 31.2304, lng: 121.4737 }],
    "TW": [{ lat: 25.0330, lng: 121.5654 },{ lat: 22.6273, lng: 120.3014 }],
    "HK": [{ lat: 22.3193, lng: 114.1694 },{ lat: 22.3964, lng: 114.1095 }],
    "JP": [{ lat: 35.6895, lng: 139.6917 },{ lat: 34.6937, lng: 135.5023 }],
    "IN": [{ lat: 28.6139, lng: 77.2090 },{ lat: 19.0760, lng: 72.8777 }],
    "AU": [{ lat: -33.8688, lng: 151.2093 },{ lat: -37.8136, lng: 144.9631 }],
    "BR": [{ lat: -23.5505, lng: -46.6333 },{ lat: -22.9068, lng: -43.1729 }],
    "CA": [{ lat: 43.651070, lng: -79.347015 },{ lat: 45.501690, lng: -73.567253 }],
    "RU": [{ lat: 55.7558, lng: 37.6173 },{ lat: 59.9343, lng: 30.3351 }],
    "ZA": [{ lat: -33.9249, lng: 18.4241 },{ lat: -26.2041, lng: 28.0473 }],
    "MX": [{ lat: 19.4326, lng: -99.1332 },{ lat: 20.6597, lng: -103.3496 }],
    "KR": [{ lat: 37.5665, lng: 126.9780 },{ lat: 35.1796, lng: 129.0756 }],
    "IT": [{ lat: 41.9028, lng: 12.4964 },{ lat: 45.4642, lng: 9.1900 }],
    "ES": [{ lat: 40.4168, lng: -3.7038 },{ lat: 41.3851, lng: 2.1734 }],
    "TR": [{ lat: 41.0082, lng: 28.9784 },{ lat: 39.9334, lng: 32.8597 }],
    "SA": [{ lat: 24.7136, lng: 46.6753 },{ lat: 21.3891, lng: 39.8579 }],
    "AR": [{ lat: -34.6037, lng: -58.3816 },{ lat: -31.4201, lng: -64.1888 }],
    "EG": [{ lat: 30.0444, lng: 31.2357 },{ lat: 31.2156, lng: 29.9553 }],
    "NG": [{ lat: 6.5244, lng: 3.3792 },{ lat: 9.0579, lng: 7.4951 }],
    "ID": [{ lat: -6.2088, lng: 106.8456 },{ lat: -7.7956, lng: 110.3695 }]
  };
  const arr = countryCoordinates[country] || countryCoordinates['US'];
  const city = arr[Math.floor(Math.random() * arr.length)];
  return { lat: city.lat + (Math.random()-0.5)*0.1, lng: city.lng + (Math.random()-0.5)*0.1 };
}

// Helper: 格式化地址字符串
function formatAddress(addr, country) {
  return `${addr.house_number} ${addr.road}, ${addr.city||addr.town||addr.village}, ${addr.postcode||''}, ${country}`;
}
