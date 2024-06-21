document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const res = await fetch("http://localhost:3000/api/register", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: document.getElementById('username').value,
      email: document.getElementById('emailAddress').value,
      password: document.getElementById('password').value
    })
  })
  if(!res.ok) return;
  const resJson = await res.json();
  if(resJson) {
    LoadPartialView('homepage', document.querySelector('.app'));
  }
});
