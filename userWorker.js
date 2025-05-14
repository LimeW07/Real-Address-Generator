// userWorker.js - 提供随机用户姓名与性别
addEventListener('fetch', event => {
    event.respondWith(handleUserRequest(event.request));
  });
  
  async function handleUserRequest(request) {
    try {
      const res = await fetch('https://randomuser.me/api/');
      if (!res.ok) throw new Error();
      const { results } = await res.json();
      const user = results[0];
      const name = `${user.name.first} ${user.name.last}`;
      const gender = user.gender.charAt(0).toUpperCase() + user.gender.slice(1);
      return new Response(JSON.stringify({ name, gender }), {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    } catch {
      return new Response(JSON.stringify({ name: 'Unknown', gender: 'Unknown' }), {
        headers: { 'Content-Type': 'application/json;charset=UTF-8' }
      });
    }
  }
