function logout() {
  removeLocalStorageValue("userId")
  removeLocalStorageValue("username")
  removeLocalStorageValue("email")
  removeLocalStorageValue("posts")
}