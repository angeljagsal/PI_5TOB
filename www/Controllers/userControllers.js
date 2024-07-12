function logout() {
  removeLocalStorageValue("userId")
  removeLocalStorageValue("username")
  removeLocalStorageValue("email")
  removeLocalStorageValue("posts")
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
  })
  .catch(error => {
    console.error('Error updating picture:', error);
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
      if (Array.isArray(data.posts)) {
          data.posts.forEach(post => displayUserLike(post));
      } else {
          var noPosts = `
              <div class="flex justify-center mt-2 text-lg text-gray-500">
                  <p>Nothing here...</p>
              </div>
          `;

          document.querySelector('.userLikesArea').innerHTML += noPosts;
      }
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
          <div class="editPostIcon">
            <img class="ms-1 w-7 h-7" src="../Public/img/full-red-hearth.svg" alt="">
          </div>
        </div>
      </div>
    </div>`;

  cardsArea.innerHTML += cardHTML;
}