var loader = document.getElementById('loader');

function logout() {
  removeLocalStorageValue("userId")
  removeLocalStorageValue("username")
  removeLocalStorageValue("email")
  removeLocalStorageValue("likes")
  // removeLocalStorageValue("posts")
  removeLocalStorageValue("profileImg")
}

var userId = getLocalStorageValue("userId");

function changeProfileImg(userId, newImage) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('img', newImage);

  fetch(uploadProfileImgRoute, {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Failed changing picture');
    })
    .then(data => {
      var userImgUrl = data.userImgUrl;
      saveLocalStorageValue("profileImg", userImgUrl)
      document.getElementById('userImage').src = getLocalStorageValue("profileImg")
      
      alert('Picture successfully updated!');
      document.getElementById('fileInput').disabled = false;
      document.getElementById('userImage').classList.remove('opacity-20');
    })
    .catch(error => {
      console.error('Error updating picture:', error);
    });
}

function editUser(userId, username, email, password) {
  fetch(editUserRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, username, email, password })
  })
    .then(response => {
      if (response.ok) {
        alert('User edited successfully!');
        saveLocalStorageValue("username", username)
        saveLocalStorageValue("email", email)
      } else {
        alert('Failed to edit user.');
        var formBtn = document.getElementById('saveBtn');
        formBtn.disabled = false;
        formBtn.innerText = 'Save';
      }
    })
    .catch(err => {
      console.error('Error:', err);
      var formBtn = document.getElementById('saveBtn');
      formBtn.disabled = false;
      formBtn.innerText = 'Save';
    });
}

function deleteUser(userId, password) {
  fetch(deleteUserRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId, password })
  })
    .then(response => {
      if (response.ok) {
        alert('User deleted successfully!');
        logout();
        LoadPartialView('homepage/homepage', document.querySelector('.app'))
      } else {
        alert('Failed to delete user.');
        var formBtn = document.getElementById('delete');
        formBtn.disabled = false;
        formBtn.innerText = 'Delete';
      }
    })
    .catch(err => {
      console.error('Error:', err);
      var formBtn = document.getElementById('delete');
      formBtn.disabled = false;
      formBtn.innerText = 'Delete';
    });
}

function likePost(postId) {
  fetch(createUserLikeRelationRoute, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, postId })
  })
    .then(response => {
      var likes = JSON.parse(localStorage.getItem('likes') || '[]');

      if (!likes.includes(postId)) {
        likes.push(postId);
        localStorage.setItem('likes', JSON.stringify(likes));
      }

      // document.getElementById('cardsArea').innerHTML = '';
      // loadPosts();
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

function dislikePost(postId) {
  fetch(deleteUserLikeRoute, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ userId, postId })
  })
    .then(response => {
      if (response.ok) {
        // Clear and reload user likes displayed
        var userLikesArea = document.getElementById('userLikesArea')

        if (userLikesArea) {
          userLikesArea.innerHTML = '';
          loadUserLikes();
        }

        // Remove postId from localStorage
        var likes = JSON.parse(localStorage.getItem('likes') || '[]');
        const index = likes.indexOf(postId);
        if (index !== -1) {
          likes.splice(index, 1);
          saveLocalStorageValue('likes', JSON.stringify(likes));
        }

        // var cardsArea = document.getElementById('cardsArea')

        // if(cardsArea){
        //   cardsArea.innerHTML = '';
        //   loadPosts();
        // }

      } else {
        console.log('Failed to remove like from the server.');
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
}

function loadUserLikes() {
  fetch(retrieveUserLikesRoute, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  })
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.posts) && data.posts.length > 0) {
        data.posts.forEach(post => displayUserLike(post));
      } else {
        var noPosts = `
              <div class="flex justify-center mt-2 text-lg text-gray-500">
                  <p>Nothing here...</p>
              </div>
          `;

        document.querySelector('.userLikesArea').innerHTML += noPosts;
      }
      loader.classList.add('hidden');
    })
    .catch(error => console.error('Error loading posts:', error));
}

function displayUserLike(post) {
  const cardsArea = document.querySelector('.userLikesArea');
  if (!cardsArea) {
    console.error('Element .userLikesArea not found');
    return;
  }

  const cardHTML = `
    <div class="flex justify-center mb-4">
      <div class="relative w-10/12 max-w-md h-36 bg-white shadow-2xl rounded-lg overflow-hidden">
        <div class="absolute inset-0">
          <img src="${post.imageUrl}" alt="${post.title}" class="object-cover w-full h-full cursor-pointer" onclick="loadPostViewAndInfo('${post.postId}')"/>
        </div>
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
          <p class="text-lg font-bold text-white truncate">${post.title}</p>
          <p class="text-md text-gray-200">$${post.price}</p>
        </div>
        <div class="absolute top-2 right-2 flex items-center justify-center bg-white p-1 rounded-full shadow-lg cursor-pointer hover:bg-gray-200" onclick="dislikePost('${post.postId}')">
          <img class="w-7 h-7 text-red-600" src="../Public/img/trashcan.svg" alt="Dislike">
        </div>
      </div>
    </div>`;

  cardsArea.innerHTML += cardHTML;
}
