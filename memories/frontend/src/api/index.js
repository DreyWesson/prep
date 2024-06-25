import axios from "./axios";

// This is important for our routes auth.middleware to work
axios.interceptors.request.use((req) => {
  if (localStorage.getItem("profile")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("profile")).token
    }`;
  }
  return req;
});

// Posts APIs
const fetchPosts = () => axios.get("/api/posts"),
  getPost = (id) => axios.get(`/api/posts/${id}`),
  createPost = (newPost) => axios.post("/api/posts", newPost),
  updatePost = (id, updatedData) =>
    axios.patch(`/api/posts/${id}`, updatedData),
  deletePost = (id) => axios.delete(`/api/posts/${id}`),
  likePost = (id) => axios.patch(`/api/posts/${id}/likePost`);

// Auth APIs
const signin = (formData) => axios.post("/api/users/signin", formData),
  signup = (formData) => axios.post("/api/users/signup", formData),
  forgotpassword = (formData) =>
    axios.post("/api/users/forgotpassword", formData),
  resetpassword = (formData, match) =>
    axios.put(`/api/users/resetpassword/${match.params.resetToken}`, formData);

export {
  fetchPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  signin,
  signup,
  forgotpassword,
  resetpassword,
};
