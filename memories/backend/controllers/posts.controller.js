// import e from "cors";
import mongoose from "mongoose";
import Post from "../models/postSchema.js";

const verifyID = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("There's no post with that ID");
};

const getPosts = async (req, res, next) => {
    try {
      const posts = await Post.find().sort({ _id: -1 });
      // console.log("POPULATE: ", posts);
      // const posts = await Post.find().populate('userCreator').sort({ _id: -1 });
      res.status(200).json(posts);
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: error });
    }
  },
  createPost = async (req, res, next) => {
    const post = req.body;
    // console.log(post);
    console.log("Request user ID from auth.middleware: ", req.userId);
    const newPost = new Post({
      ...post,
      creator: req.userId,
      createdAt: new Date().toISOString(),
      // userCreator: req.userId,
    });
    try {
      await newPost.save();

      res.status(200).json(newPost);
      console.log("NEW POST: ", newPost);
    } catch (error) {
      console.log(error);
      res.status(409).json({ message: error.message });
    }
  },
  updatePost = async (req, res, next) => {
    const { id: _id } = req.params;
    const post = req.body;
    verifyID(_id, res);
    try {
      let updatedPost = await Post.findByIdAndUpdate(
        _id,
        { ...post, _id },
        {
          new: true,
        }
      );
      console.log("UPDATED: ", updatedPost);
      res.json(updatedPost);
    } catch (error) {
      console.log("UPDATE ERROR: ", error);
    }
  },
  deletePost = async (req, res, next) => {
    const { id } = req.params;
    console.log("POST ID: ", id);
    verifyID(id, res);
    try {
      await Post.findByIdAndRemove(id);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.log("DELETE ERROR: ", error);
    }
  },
  likePost = async (req, res, next) => {
    const { id } = req.params;
    console.log("USERID from auth.middleware.js: ", req.userId);
    console.log("USER from auth.middleware.js: ", req.user);

    if (!req.userId) return res.json({ message: "Unauthenticated" });

    verifyID(id, res);
    try {
      const post = await Post.findById(id);

      // Checks if user already liked the post
      const index = post.likes.findIndex((id) => id === String(req.userId));
      if (index === -1) {
        post.likes.push(req.userId);
      } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
      }

      let updatedPost = await Post.findByIdAndUpdate(
        id,
        // { likeCount: post.likeCount + 1 },
        post,
        {
          new: true,
        }
      );
      res.json(updatedPost);
    } catch (error) {
      console.log("UPDATE ERROR: ", error);
    }
  },
  getPost = async (req, res, next) => {
    const { id: _id } = req.params;
    console.log(_id);

    verifyID(_id, res);
    try {
      let singularPost = await Post.findById(_id);
      res.status(200).json(singularPost);
    } catch (error) {
      console.log("SINGLE POST ERROR: ", error);
    }
  };

export { getPosts, createPost, updatePost, deletePost, likePost, getPost };
