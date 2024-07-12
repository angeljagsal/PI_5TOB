document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
});

async function login(email, password) {
    try {
        const response = await fetch(loginUserRoute, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            console.table(data);
            // Save user data within local storage
            saveLocalStorageValue("userId", data.user.id);
            saveLocalStorageValue("username", data.user.username);
            saveLocalStorageValue("email", data.user.email);
            const likesJSON = JSON.stringify(data.user.likes);
            saveLocalStorageValue("likes", likesJSON);
            saveLocalStorageValue("profileImg", data.user.profileImg);
            // const postsJson = JSON.stringify(data.user.posts);
            // saveLocalStorageValue("posts", postsJson);

            // Change partial view
            LoadPartialView('homepage/homepage', document.querySelector('.app'));
        } else {
            console.error('Login failed:', data.message);
            alert('Error al iniciar sesión: ' + data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Error de red, por favor intenta más tarde.');
    }
}
