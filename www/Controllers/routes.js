const local_server = "http://localhost:6969/api/"
const public_server = "https://travelapp-api.vercel.app/api/"

const env = public_server

// User API
const loginUserRoute = env + "login"
const registerUserRoute = env + "register"
const uploadProfileImgRoute = env + "uploadImg"
const createUserLikeRelationRoute = env + "like"
const retrieveUserLikesRoute = env + "likes"
const deleteUserLikeRoute = env + "removeLike"


// Post API
const createPostRoute = env + "post"
const editPostRoute = env + "editPost"
const deletePostRoute = env + "deletePost"
const loadPostsRoute = env + "posts"
const loadUserPostsRoute = env + "userPosts"
