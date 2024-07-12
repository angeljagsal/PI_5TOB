document.getElementById("registerForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const formBtn = document.getElementById('formBtn');
  formBtn.disabled = true;
  formBtn.innerText = 'Processing...';

  const username = document.getElementById('username').value;
  const email = document.getElementById('emailAddress').value;
  const password = document.getElementById('password').value;

  // Basic client-side validation
  if (!username || !email || !password) {
      alert("Please fill in all fields.");
      formBtn.disabled = false;
      formBtn.innerText = 'Register';
      return;
  }

  if (username.length < 5) {
    alert("Username not available.")
    return;
  }

  (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (regex.test(email)) {
      console.log('Incorrect email.');
      return true;
    }
  };
  
  if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
  }

  register(username, email, password);
});

async function register(username, email, password) {
  try {
      const response = await fetch(registerUserRoute, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              username: username,
              email: email,
              password: password
          })
      });

      const data = await response.json();

      if (response.ok) {
          console.log('Registration successful:', data);
          alert("Registration successful!");
          LoadPartialView('user/login', document.querySelector('.app'));
      } else {
          console.error('Registration failed:', data.message);
          alert('Registration failed: ' + data.message);
      }
  } catch (error) {
      console.error('Network error:', error);
      alert('Network error, please try again later.');
  }
}
