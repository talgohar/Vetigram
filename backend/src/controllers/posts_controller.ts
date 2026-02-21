import postModel, { IPost } from "../models/posts_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import mongoose from "mongoose";
import likeModel, { ILike } from "../models/likes_model";

class PostsController extends BaseController<IPost> {
  constructor() {
    super(postModel);
  }

  async create(req: Request, res: Response) {
    const userId = req.params.userId;
    const post = {
      ...req.body,
      owner: new mongoose.Types.ObjectId(userId)
    };
    try {
      const createdPost = await this.model.create(post);
      const populatedPost = await createdPost.populate('owner', 'username imageName isVet');
      res.status(201).send(populatedPost);
    } catch (error) {
      res.status(400).send(error);
    }
  }

  async getAll(req: Request, res: Response) {
    const filter = req.query.owner;
    try {
        if (filter) {
            const item = await this.model.find({ owner: filter }).populate('owner', 'username imageName isVet');
            res.send(item);
        } else {
            const items = await this.model.find().populate('owner', 'username imageName isVet');
            res.send(items);
        }
    } catch (error) {
        res.status(400).send(error);
    }
  };


  async getLikeStatus(req: Request, res: Response) {
    try{
      const userId = req.params.userId;
      if(!userId){
        res.status(400).json({ message: "No userId" });
        return;
      }
      const postId = req.body.postId;
      if(!postId){
        res.status(400).json({ message: "No postId" });
        return;
      }
      let like = await likeModel.findOne({ userId, postId });
      if(like === null||like === undefined){
        await likeModel.create({ userId, postId, isLiked: false });
        like = await likeModel.findOne({ userId, postId });
      }
      const likesCount = await likeModel.countDocuments({ postId, isLiked: true });
  
      res.status(200).json({ liked : like?.isLiked, likesCount: likesCount });
    } catch (error) {
      console.error("Error fetching like status:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async toggleLike(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      if(!userId){
        res.status(400).json({ message: "No userId" });
        return;
      }
      const postId = req.body.postId;
      if(!postId){
        res.status(400).json({ message: "No postId" });
        return;
      }
      let like = await likeModel.findOne({ userId, postId });
      if(like === null||like === undefined){
        await likeModel.create({ userId, postId, isLiked: false });
        like = await likeModel.findOne({ userId, postId });
      }
      if (like) {
        (like as ILike).isLiked = req.body.newLikeStatus;
        await like.save();
      }
      const likesCount = await likeModel.countDocuments({ postId, isLiked: true });
      res.status(200).json({ liked : like?.isLiked, likesCount: likesCount });
    } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
    

  async updatePostFile(req: Request, res: Response) {
    
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }
    
    const userId = req.params.userId;
    const postId = req.body.postId; 
    const base = `${process.env.DOMAIN_BASE}:${process.env.PORT}/`;
    
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      res.status(400).json({ message: "Invalid postId" });
      return;
    }

    try {
      const updatedPost = await postModel.findByIdAndUpdate(
        postId,
        { $set: { imageName: req.file.filename } },
        { new: true }
      );

      if (!updatedPost) {
        res.status(404).json({ message: "Post not found" });
        return;
      }

      res.status(200).send({ url: `${base}public/posts/${userId}/${req.file.filename}` });
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new PostsController();
