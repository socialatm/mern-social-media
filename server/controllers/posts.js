import Post from "../models/Post.js";
import User from "../models/User.js";
import mongoose from "mongoose";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ */
export const getFeedPosts = async (_req, res) => {
  try {
    const post = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/**
 * Handles the creation of a new comment on a post.
 *
 * @param {Object} req - The request object.
 * @param {string} req.params.id - The ID of the post to comment on.
 * @param {string} req.body.userId - The ID of the user creating the comment.
 * @param {string} req.body.commentText - The text of the comment.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - The updated post with the new comment.
 */
export const commentPost = async (req, res)=>{
  try {

    const { id } = req.params
    const { userId, commentText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }

    const user = await User.findById(userId).select("firstName lastName picturePath");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { firstName, lastName, picturePath } = user;

    const post = await Post.findById(id);
    post.comments.push({userId, commentText, firstName, lastName, picturePath});
    
    const updatePost = await Post.findByIdAndUpdate(id, {comments:post.comments}, {new:true});
    res.status(200).json(updatePost);
  } catch (err) {
    res.status(404).json({message:err.message})
  }
}
