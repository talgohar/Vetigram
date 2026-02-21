import express from "express";
const router = express.Router();
import commentsController from "../controllers/comments_controller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: The Comments API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - comment
 *         - owner
 *         - postId
 *         - isOwnerVet
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the comment
 *         comment:
 *           type: string
 *           description: The comment content
 *         owner:
 *           type: string
 *           description: Comment writer
 *         postId:
 *           type: string
 *           description: Associated post ID
 *         isOwnerVet:
 *           type: boolean
 *           description: Indicates if the comment owner is a veterinarian
 *       example:
 *         _id: "245234t234234r234r23f4"
 *         comment: "Nice Post"
 *         owner: "324vt23r4tr234t245tbv45by"
 *         postId: "245234tasd34234r2asdad23f4"
 *         isOwnerVet: false
 */

/**
 * @swagger
 * /comments:
 *   post:
 *     summary: Create a new comment
 *     description: Create a new comment
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - owner
 *               - postId
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The comment content
 *               owner:
 *                 type: string
 *                 description: The comment owner
 *               postId:
 *                 type: string
 *                 description: The post ID
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, commentsController.create.bind(commentsController));

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Delete a single comment by its ID
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, commentsController.deleteItem.bind(commentsController));

/**
 * @swagger
 * /comments/{postId}:
 *   get:
 *     summary: Get all comments of a specific post
 *     description: Retrieve a list of all comments for a post
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       500:
 *         description: Server error
 */
router.get("/:postId", commentsController.getAllCommentsByPostId.bind(commentsController));

export default router;
