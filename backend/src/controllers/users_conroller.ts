import userModel, { IUser } from "../models/users_model";
import { Request, Response } from "express";
import BaseController from "./base_controller";
import mongoose from "mongoose";

class UsersController extends BaseController<IUser> {
  constructor() {
    super(userModel);
  }
  async getUser(req: Request, res: Response) {
    const user = await userModel.findById(req.params.userId);
    if (!user) {
      res.status(404).send("user not found");
      return;
    }
    res.status(200).json(user);
    return;
  }

  async getUsername(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    console.log(userId);
    try {
      const user = await userModel.findById(userId).select("username");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ username: user.username });
      return;
    } catch (error) {
      console.error("Error fetching username:", error);
      res.status(500).json({ message: "Internal server error" });
      return;
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.userId as string;
    const username = req.body.username;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    if (!username) {
      res.status(400).json({ message: "No username provided" });
      return;
    }

    try {
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,{username: username})
      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUserProfileImage(req: Request, res: Response) {
    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    const userId = req.params.userId as string;
    const base = `${process.env.DOMAIN_BASE}:${process.env.PORT}/public/`;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid userId" });
      return;
    }

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Update user with new image
      const updatedUser = await userModel.findByIdAndUpdate(
        userId,
        { $set: { imageName: req.file.filename } },
        { new: true }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // Delete the old image if it exists
      

      res.status(200).json({ url: `${base}profile/${req.file.filename}` });
    } catch (error) {
      console.error("Error updating profile image:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new UsersController();
