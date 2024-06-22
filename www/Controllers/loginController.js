document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});

async function login(email, password) {
  try {
      const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            email: email,
            password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
          console.log('Login successful:', data);
          LoadPartialView('homepage', document.querySelector('.app'));
    } else {
          console.error('Login failed:', data.message);
          alert('Error al iniciar sesión: ' + data.message);
      }
  } catch (error) {
      console.error('Network error:', error);
      alert('Error de red, por favor intenta más tarde.');
  }
}
