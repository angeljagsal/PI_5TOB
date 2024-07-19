var userId = getLocalStorageValue("userId");
var loader = document.getElementById('loader');

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

                saveLocalStorageValue("posts", JSON.stringify(posts))
            } saveNewPostId(data.post.postId);

            alert('Post successfully created!')
            LoadPartialView('homepage/homepage', document.querySelector('.app'));
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
                var noPosts = `
                <div class="flex justify-center text-lg text-gray-500">
                    <p>Nothing here...</p>
                </div>
            `;

                document.querySelector('.cardsArea').innerHTML += noPosts;
            }
            loader.classList.add('hidden');
        })
        .catch(error => console.error('Error loading posts:', error));
}

// Function for displayPost usage
function loadPostViewAndInfo(postId) {
    // Start loader
    var loader = document.getElementById('loader');
    loader.classList.remove('hidden');

    // Show post view
    document.getElementById('post').classList.remove('hidden');
    document.getElementById('lowerNav').classList.add('hidden');
    document.getElementById('upperNav').classList.add('hidden');

    // Load post view information
    retrievePostInformation(postId);
}

// Function to show posts coming from the API
function displayPost(post) {
    const cardsArea = document.querySelector('.cardsArea');
    if (!cardsArea) {
        console.error('Element .cardsArea not found');
        return;
    }

    var userLikes = getLocalStorageValue('likes') || [];

    const heartIcon = userLikes.includes(post.postId) ? "../Public/img/full-red-heart.svg" : "../Public/img/heart.svg";

    const cardHTML = `
    <div class="cards-wrapper flex justify-center mb-5">
        <div class="card w-10/12 bg-white rounded-xl shadow-md overflow-hidden">
            <div class="relative">
                <div id="openInfo" class="aspect-w-1 aspect-h-1 cursor-pointer" onclick="loadPostViewAndInfo('${post.postId}')">
                    <div class="bg-black w-full h-full" style="background-image: url('${post.imageUrl}'); background-size: cover; background-position: center;"></div>
                </div>
                <div class="absolute top-2 right-2 rounded-full bg-white p-1 shadow-lg cursor-pointer">
                    <img id="heartIcon${post.postId}" class="w-6" src="${heartIcon}" alt="Like Icon" onclick="toggleLike('${post.postId}')">
                </div>
            </div>
            <div class="p-4">
                <p class="card-title text-sm font-semibold">${post.title}</p>
                <p class="card-desc text-xs text-gray-600 mt-1 truncate">${post.desc || 'No desc'}</p>
                <p class="text-xs text-gray-600 mt-2 font-semibold">${post.price} MXN</p>
            </div>
        </div>
    </div>`;

    cardsArea.innerHTML += cardHTML;
}

function toggleLike(postId) {
    if (!userId) {
        alert('You must be logged in to like a post');
        LoadPartialView('user/login', document.querySelector('.app'));
        return;
    }

    let userLikes = getLocalStorageValue('likes');
    if (!Array.isArray(userLikes)) {
        userLikes = userLikes ? JSON.parse(userLikes) : [];
    }

    const isLiked = userLikes.includes(postId);

    if (isLiked) {
        userLikes = userLikes.filter(id => id !== postId);
        document.getElementById(`heartIcon${postId}`).src = "Public/img/heart.svg";
        if (document.getElementById('heartIconDetail')) {
            document.getElementById('heartIconDetail').src = "Public/img/heart.svg";
        }
        dislikePost(postId);
    } else {
        userLikes.push(postId);
        document.getElementById(`heartIcon${postId}`).src = "Public/img/full-red-heart.svg";
        if (document.getElementById('heartIconDetail')) {
            document.getElementById('heartIconDetail').src = "Public/img/full-red-heart.svg";
        }
        likePost(postId);
    }

    saveLocalStorageValue('likes', JSON.stringify(userLikes));
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
                var noPosts = `
                <div class="flex justify-center mt-2 text-lg text-gray-500">
                    <p>Nothing here...</p>
                </div>
            `;

                document.querySelector('.userPostsArea').innerHTML += noPosts;
            }
            loader.classList.add('hidden');
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
                <div class="bg-white w-full h-5/6 rounded-xl flex items-center justify-center overflow-hidden" style="background-image: url('${post.imageUrl}'); background-size: cover; background-position: center;"></div>
            </div>
            <div class="col-span-3 flex flex-col justify-center px-3">
                <p class="text-sm font-bold">${post.title}</p>
                <p class="text-xs text-gray-600">$${post.price}</p>
            </div>
            <div class="col-span-2 flex flex-col items-center justify-center gap-y-5">
                <div class="editPostIcon" onclick="openModalEdit('${post.postId}', '${post.title}', '${post.desc}', ${post.price})">
                <img class="ms-1 w-7 h-7" src="../../Public/img/edit.svg" alt="">
                </div>
                <div class="deletePostIcon" onclick="openModalDelete('${post.postId}')">
                <img class="w-7 h-7 fill-red-600" src="../../Public/img/trashcan.svg" alt="">
                </div>
            </div>
            </div>
        </div>`;

    cardsArea.innerHTML += cardHTML;
}

function editPost(formData) {
    fetch(editPostRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to edit post');
        })
        .then(data => {
            alert('Post successfully edited!')
            console.log('Post edited:', data);
            document.getElementById('userPostsArea').innerHTML = '';
            loadUserPosts();
        })
        .catch(error => {
            console.error('Error editing post:', error);
        });
}

// Function to delete a post by calling the API
function deletePost(postId) {
    fetch(deletePostRoute, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to delete post');
        })
        .then(data => {
            alert('Post successfully deleted!')
            console.log('Post deleted:', data);
            document.getElementById('userPostsArea').innerHTML = '';
            loadUserPosts();
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
}

function retrievePostInformation(postId) {
    fetch(retrievePostInfo, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Failed to retrieve information');
        })
        .then(data => {
            // Extract all data
            const price = data.post[0].price;
            const imageUrl = data.post[0].imageUrl;
            const postId = data.post[0].postId;
            const title = data.post[0].title;
            const desc = data.post[0].desc;
            const creator = data.user[0].username;
            const creatorImg = data.user[0].userImg;

            // Display data
            document.getElementById('bgImg').style.backgroundImage = `url('${imageUrl}')`;
            document.getElementById('title').innerHTML = title;
            document.getElementById('price').innerHTML = price;
            document.getElementById('desc').innerHTML = desc;
            document.getElementById('creator').innerHTML = creator;

            let defaultImg = 'Public/img/default-user.webp';
            let backgroundImageUrl = (creatorImg && creatorImg.trim()) ? `url('${creatorImg}')` : `url('${defaultImg}')`;
            document.getElementById('userImg').style.backgroundImage = backgroundImageUrl;

            // Handle like icon in detail view
            let userLikes = JSON.parse(getLocalStorageValue('likes')) || [];
            const heartIcon = userLikes.includes(postId) ? "Public/img/full-red-heart.svg" : "Public/img/heart.svg";
            document.getElementById('heartIconDetail').src = heartIcon;
            document.getElementById('heartIconDetail').onclick = function () {
                toggleLike(postId);
            };

            // Stop loader
            var loader = document.getElementById('loader');
            loader.classList.add('hidden');
        })
        .catch(error => console.error('Error:', error));
}
