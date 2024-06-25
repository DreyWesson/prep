import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../../api";
import { showSnack } from "react-redux-snackbar";
import { snackMessages } from "../../snackMessages";

export const postsSlice = createSlice({
  name: "posts",
  initialState: {
    loading: false,
    posts: [],
    post: {},
    hasErrors: false,
    currentId: null,
  },
  reducers: {
    getPosts: (state) => {
      state.loading = true;
    },
    singlePost: (state, { payload }) => {
      state.post = payload;
    },
    getPostsSuccess: (state, { payload }) => {
      state.posts = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    getPostsFailure: (state, action) => {
      state.loading = false;
      state.hasErrors = true;
    },
    addPost: (state, { payload }) => {
      state.posts.push(payload);
    },
    editPost: (state, { payload }) => {
      state.posts.forEach((post) =>
        post._id === payload._id ? payload : post
      );
    },
    setCurrentId: (state, { payload }) => {
      state.currentId = payload;
    },
    removePost: (state, { payload }) => {
      state.posts.filter((post) => post._id === payload);
    },
    favPost: (state, { payload }) => {
      state.posts.forEach((post) =>
        post._id === payload._id ? payload : post
      );
    },
  },
});

export const {
  getPosts,
  singlePost,
  getPostsSuccess,
  getPostsFailure,
  addPost,
  editPost,
  setCurrentId,
  removePost,
  favPost,
} = postsSlice.actions;

const fetchPosts = createAsyncThunk(
    "posts/fetchPosts",
    async (payload, { dispatch }) => {
      try {
        dispatch(getPosts());
        const { data } = await api.fetchPosts();
        dispatch(getPostsSuccess(data));
      } catch (error) {
        dispatch(
          showSnack("fetchPost", {
            label: snackMessages.fetchPost,
            timeout: 6000,
          })
        );
      }
    }
  ),
  createPost = createAsyncThunk(
    "posts/createPost",
    async (payload, { dispatch }) => {
      try {
        const { data } = await api.createPost(payload);
        dispatch(addPost(data));
        dispatch(
          showSnack("createPost", {
            label: snackMessages.createPost,
            timeout: 6000,
          })
        );
      } catch (error) {
        dispatch(
          showSnack("createPostFail", {
            label: snackMessages.createPostFail,
            timeout: 6000,
          })
        );
      }
    }
  ),
  updatePost = createAsyncThunk(
    "posts/updatePost",
    async (payload, { dispatch }) => {
      try {
        const { currentId, ...postData } = payload;
        const { data } = await api.updatePost(currentId, postData);
        dispatch(editPost(data));
        dispatch(
          showSnack("updatePost", {
            label: snackMessages.updatePost,
            timeout: 6000,
          })
        );
      } catch (error) {
        dispatch(
          showSnack("updatePostFail", {
            label: snackMessages.updatePostFail,
            timeout: 6000,
          })
        );
      }
    }
  ),
  deletePost = createAsyncThunk(
    "posts/deletePost",
    async ({ id }, { dispatch }) => {
      try {
        await api.deletePost(id);
        dispatch(removePost());
        dispatch(
          showSnack("deletePost", {
            label: snackMessages.deletePost,
            timeout: 6000,
          })
        );
      } catch (error) {
        dispatch(
          showSnack("deletePostFail", {
            label: snackMessages.deletePostFail,
            timeout: 6000,
          })
        );
      }
    }
  ),
  likePost = createAsyncThunk(
    "posts/likePost",
    async ({ id }, { dispatch }) => {
      try {
        const { data } = await api.likePost(id);
        dispatch(favPost(data));
        dispatch(
          showSnack("likePost", {
            label: snackMessages.likePost,
            timeout: 6000,
          })
        );
      } catch (error) {
        dispatch(
          showSnack("likePostFail", {
            label: snackMessages.likePostFail,
            timeout: 6000,
          })
        );
      }
    }
  ),
  getPost = createAsyncThunk("posts/getPost", async (payload, { dispatch }) => {
    try {
      const { data } = await api.getPost(payload);
      console.log(data);
      dispatch(singlePost(data));
      dispatch(
        showSnack("likePost", {
          label: snackMessages.likePost,
          timeout: 6000,
        })
      );
    } catch (error) {
      dispatch(
        showSnack("likePostFail", {
          label: snackMessages.likePostFail,
          timeout: 6000,
        })
      );
    }
  });
export { fetchPosts, getPost, createPost, updatePost, deletePost, likePost };

export const selectPosts = (state) => state.posts;
export default postsSlice.reducer;
