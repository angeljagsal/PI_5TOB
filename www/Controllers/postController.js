var userId = getLocalStorageValue("userId");

// Function to send data to the API and create a post
async function createPost(title, desc, price, imgFile) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('price', price);
    formData.append('img', imgFile);
    formData.append('userId', userId);

    try {
        const response = await fetch(createPostRoute, {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (response.ok) {
            console.table(data);

            function saveNewPostId(postId) {
                let posts = JSON.parse(getLocalStorageValue('posts'));

                if (!posts) {
                    posts = [];
                }

                posts.push(postId)

                saveLocalStorageValue("posts", JSON.stringify(posts));
            } saveNewPostId(data.post.postId);

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

// Function to retrieve the information of the posts from the API
function loadPosts() {
    fetch(loadPostsRoute)
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data.posts)) {
                data.posts.forEach(post => displayPost(post)); 
            } else {
                console.error('Expected "posts" to be an array but got:', data.posts);
            }
        })
        .catch(error => console.error('Error loading posts:', error));
}

// Function to show posts coming from the API
function displayPost(post) {
    const cardsArea = document.querySelector('.cardsArea');
    if (!cardsArea) {
        console.error('Element .cardsArea not found');
        return;
    }

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

// Function to retrieve the information of the posts within a user from the API
function loadUserPosts() {
    const userId = getLocalStorageValue("userId");

    fetch(loadUserPostsRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
    })
    .then(res => res.json())
    .then(data => {
        if (Array.isArray(data.posts)) {
            data.posts.forEach(post => displayUserPost(post));
        } else {
            console.error('Expected "posts" to be an array but got:', data.posts);
        }
    })
    .catch(error => console.error('Error loading posts:', error));
}


// Function to show posts from user coming from the API
function displayUserPost(post) {
    const cardsArea = document.querySelector('.userPostsArea');
    if (!cardsArea) {
        console.error('Element .userPostsArea not found');
        return;
    }

    const cardHTML = `
        <div class="flex justify-center mb-3">
        <div class="grid grid-cols-8 w-10/12 h-32 bg-gray-200 rounded-xl">
            <div class="col-span-3 flex items-center justify-center px-3">
            <div class="bg-white w-full h-5/6 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="${post.imageUrl}" alt="" class="object-cover h-full w-full">
            </div>
            </div>
            <div class="col-span-3 flex flex-col justify-center px-3">
            <p class="text-sm font-bold">${post.title}</p>
            <p class="text-xs text-gray-600">Created in</p>
            </div>
            <div class="col-span-2 flex flex-col items-center justify-center gap-y-5">
            <div class="editPostIcon">
                <img class="w-7 h-7" src="../../Public/img/edit.svg" alt="">
            </div>
            <div class="deletePostIcon">
                <img class="w-7 h-7 fill-red-600" src="../../Public/img/trashcan.svg" alt="">
            </div>
            </div>
        </div>
        </div>
    `;

    cardsArea.innerHTML += cardHTML;
}

// Function to delete a post by calling the API
function deletePost() {
    fetch(deletePostRoute, {
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
