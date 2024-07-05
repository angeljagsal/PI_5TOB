var userId = getLocalStorageValue("userId");

// Función para mandar datos a la API y crear un post
async function createPost(title, desc, price, imgFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('price', price);
    formData.append('img', imgFile);
    formData.append('userId', userId);

    try {
        const response = await fetch('http://localhost:3000/api/post', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.table(data);
            alert('Post successfully created!')
            LoadPartialView('homepage', document.querySelector('.app'));
        } else {
            console.error(data.message);
            alert(data.message);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('Error de red, por favor intenta más tarde.');
    }
}

// Función para mostrar los posts provenientes de la API
function displayPost(post) {
    const cardsArea = document.querySelector('.cardsArea');

    const cardHTML = `
        <div class="cards-wrapper flex justify-center mb-3">
            <div class="card w-10/12">
                <div class="bg-black w-full h-80 rounded-xl" style="background-image: url('${post.imageUrl}'); background-size: cover; background-position: center;"></div>
                <p class="text-xs mt-2">${post.title}</p>
                <p class="text-xs text-gray-600">${post.desc || 'No desc'}</p>
                <p class="text-xs text-gray-600">${post.price} MXN</p>
            </div>
        </div>
    `;

    cardsArea.innerHTML += cardHTML;
}

// Función para recuperar la información de los posts proveniente de la API
function loadPosts() {
    fetch('http://localhost:3000/api/posts')
        .then(res => res.json())
        .then(data => {
            // Asegurarse de que 'data.posts' es un arreglo antes de iterar sobre él
            if (Array.isArray(data.posts)) {
                data.posts.forEach(post => displayPost(post));
            } else {
                console.error('Expected "posts" to be an array but got:', data.posts);
            }
        })
        .catch(error => console.error('Error loading posts:', error));
}

// Función para eliminar un post llamandoi a la API
function deletePost() {
    fetch('http://localhost:3000/api/deletePost', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId, imgName }), // NOMBRE DE LA IMAGEN SERÁ SACADO RECORTANDO URL
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Failed to delete post');
    })
    .then(data => {
        console.log('Post deleted:', data);
    })
    .catch(error => {
        console.error('Error deleting post:', error);
    });
}
