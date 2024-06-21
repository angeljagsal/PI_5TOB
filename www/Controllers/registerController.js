document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Retrieve user input
  const username = document.getElementById('username').value;
  const email = document.getElementById('emailAddress').value;
  const password = document.getElementById('password').value;

  // Function to make the API request
  async function registerUser(userData) {
    const response = await fetch("http://localhost:3000/api/register", {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    return response.json();
  }

  // Basic client-side validation
  if (!username || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    return;
  }

  try {
    // Make the API request
    const resJson = await registerUser({
      username: username, 
      email: email, 
      password: password
    });

    // Handle response
    if (!resJson.ok) {
      alert(`${resJson.message}`);
      return;
    }

    if (resJson.message === "Registro exitoso") {
      alert("Registration successful!");
      // LoadPartialView('homepage', document.querySelector('.app'));
    } else {
      alert(`Registration failed: ${resJson.message}`);
    }
  } catch (error) {
    alert('Failed to connect to the server. Please check your network connection.');
  }
});
