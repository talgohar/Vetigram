import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import postsController from "../controllers/posts_controller";
import { authMiddleware } from "../controllers/auth_controller";
import users_conroller from "../controllers/users_conroller";

const router = express.Router();
const base = `${process.env.DOMAIN_BASE}:${process.env.PORT}/`;

// Storage configuration for public/posts
const postStorage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    const userId = req.params.userId as string;

    if (!userId) {
      return cb(new Error("Unauthorized"), "");
    }

    const userDir = path.join(__dirname, "../../public/posts", userId);

    if (!fs.existsSync(userDir)) {
      console.log("creating directory");
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

// Storage configuration for profile/posts
const profileStorage = multer.diskStorage({
  destination: function (req: Request, file, cb) {
    const userId = req.params.userId;

    if (!userId) {
      return cb(new Error("Unauthorized"), "");
    }

    const userDir = path.join(__dirname, "../../public/profile/");

    if (!fs.existsSync(userDir)) {
      console.log("creating directory");
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    const userId = req.params.userId;
    const ext = path.extname(file.originalname);
    cb(null, `${userId}${ext}`);
  },
});

const uploadPost = multer({ storage: postStorage });
const uploadProfile = multer({ storage: profileStorage });

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File upload operations
 */

/**
 * @swagger
 * /files/posts:
 *   post:
 *     summary: Upload a post file
 *     description: Uploads a file to public/posts and returns its URL
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "http://localhost:3030/public/posts/user123/1709678500000.png"
 *       400:
 *         description: Bad request, no file uploaded
 *       500:
 *         description: Internal server error
 */
router.post("/posts", authMiddleware, uploadPost.single("file"), postsController.updatePostFile.bind(postsController));


/**
 * @swagger
 * /files/profile:
 *   post:
 *     summary: Upload a profile file
 *     description: Uploads a file to profile/posts and returns its URL
 *     tags:
 *       - File
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   example: "http://localhost:3030/profile/posts/user123/1709678500000.png"
 *       400:
 *         description: Bad request, no file uploaded
 *       500:
 *         description: Internal server error
 */
router.post("/profile", authMiddleware, uploadProfile.single("file"), users_conroller.updateUserProfileImage.bind(users_conroller));

export default router;