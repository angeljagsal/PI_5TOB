function logout() {
  removeLocalStorageValue("userId")
  removeLocalStorageValue("username")
  removeLocalStorageValue("email")
  removeLocalStorageValue("posts")
  removeLocalStorageValue("profileImg")
}

function changeProfileImg(userId, newImage) {
  const formData = new FormData();
  formData.append('userId', userId);
  formData.append('img', newImage);

  fetch(uploadProfileImg, {
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