import express from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPost,
} from "../controllers/posts.controller.js";
import { auth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", auth, createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/likePost", auth, likePost);

// Could Implement getting a single post
router.get("/:id", getPost);
export default router;
