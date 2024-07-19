document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const formBtn = document.getElementById('formBtn');
    formBtn.disabled = true;
    formBtn.innerText = 'Processing...';

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
            alert('Failed to sign in: ' + data.message);
            const formBtn = document.getElementById('formBtn');
            formBtn.disabled = false;
            formBtn.innerText = 'Sign In';
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Network error, please try again later.');
        const formBtn = document.getElementById('formBtn');
        formBtn.disabled = false;
        formBtn.innerText = 'Sign In';
    }
}
