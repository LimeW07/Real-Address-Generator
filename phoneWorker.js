// phoneWorker.js - 提供随机电话号码
addEventListener('fetch', event => {
    event.respondWith(handlePhoneRequest(event.request));
  });
  
  async function handlePhoneRequest(request) {
    const url = new URL(request.url);
    const country = url.searchParams.get('country') || 'US';
    const phone = getRandomPhoneNumber(country);
    return new Response(JSON.stringify({ phone }), {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' }
    });
  }
  
  // Helper: 根据国家生成随机电话号码
  function getRandomPhoneNumber(country) {
    const formats = {
      "US": () => {
        const ac = Math.floor(200 + Math.random() * 800).toString().padStart(3, '0');
        const ex = Math.floor(200 + Math.random() * 800).toString().padStart(3, '0');
        const ln = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
        return `+1 (${ac}) ${ex}-${ln}`;
      },
      "UK": () => `+44 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(100000 + Math.random() * 900000)}`,
      "FR": () => `+33 ${Math.floor(1 + Math.random() * 8)} ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "DE": () => `+49 ${Math.floor(100 + Math.random() * 900)} ${Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "CN": () => `+86 ${Math.floor(130 + Math.random() * 60)} ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "TW": () => `+886 9${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "HK": () => `+852 ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "JP": () => `+81 ${Math.floor(10 + Math.random() * 90)} ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "IN": () => `+91 ${Math.floor(700 + Math.random() * 100)} ${Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "AU": () => `+61 ${Math.floor(2 + Math.random() * 8)} ${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "BR": () => {
        const ac = Math.floor(10 + Math.random() * 90).toString().padStart(2, '0');
        return `+55 (${ac}) 9${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`;
      },
      "CA": () => {
        const ac = Math.floor(204 + Math.random() * 600).toString().padStart(3, '0');
        const ex = Math.floor(200 + Math.random() * 800).toString().padStart(3, '0');
        const ln = Math.floor(1000 + Math.random() * 9000).toString().padStart(4, '0');
        return `+1 (${ac}) ${ex}-${ln}`;
      },
      "RU": () => `+7 ${Math.floor(900 + Math.random() * 100)} ${Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "ZA": () => `+27 ${Math.floor(10 + Math.random() * 70)} ${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')} ${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "MX": () => {
        const num = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
        return `+52 (${Math.floor(55 + Math.random() * 44)}) ${num.slice(0, 4)} ${num.slice(4)}`;
      },
      "KR": () => `+82 10-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "IT": () => `+39 0${Math.floor(2 + Math.random() * 9)} ${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')} ${Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "ES": () => `+34 6${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "TR": () => `+90 5${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "SA": () => `+966 5${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "AR": () => {
        const num = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
        return `+54 9${Math.floor(11 + Math.random() * 80)} ${num.slice(0, 4)} ${num.slice(4)}`;
      },
      "EG": () => `+20 1${Math.floor(0 + Math.random() * 2)} ${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')} ${Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "NG": () => `+234 8${Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('')}`,
      "ID": () => `+62 ${Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('')}-${Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('')}`
    };
    return (formats[country] || formats['US'])();
  }