const local_server = "http://localhost:6969/api/"
const public_server = "https://travelapp-api.vercel.app/api/"

const env = local_server

// User API
const loginUserRoute = env + "login"
const registerUserRoute = env + "register"

// Post API
const createPostRoute = env + "post"
const deletePostRoute = env + "deletePost"
const loadPostsRoute = env + "posts"
const loadUserPostsRoute = env + "userPosts"
