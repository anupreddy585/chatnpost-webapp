import express from "express";
import Post from "../models/Post.js";
import upload from "../middleware/upload.js";
import path from "path";
import fs from "fs";

const router = express.Router();




router.post("/", upload.single("image"), async (req, res) => {
  try {
    console.log("Incoming POST /api/posts");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    if (!req.body.userId) {
      return res.status(400).json({ error: "userId is missing" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Image file is missing" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const newPost = new Post({ userId: req.body.userId, imageUrl });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error("POST /api/posts error:", err);
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Delete image file
    const imagePath = `uploads/${post.imageUrl.split("/uploads/")[1]}`;
    fs.unlink(imagePath, (err) => {
      if (err) console.error("Failed to delete image file:", err);
    });

    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all posts (to view others' posts)
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username").sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
