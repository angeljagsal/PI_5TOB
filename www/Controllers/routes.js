const local_server = "http://localhost:3000/api/"
const public_server = "https://travelapp-api.vercel.app/api/"

const env = public_server

// User API
const loginUserRoute = env + "login"
const registerUserRoute = env + "register"

// Post API
const createPostRoute = env + "post"
const deletePostRoute = env + "deletePost"
const loadPostsRoute = env + "posts"
