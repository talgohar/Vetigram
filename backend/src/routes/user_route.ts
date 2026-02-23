import express from "express";
const router = express.Router();
import usersController from "../controllers/users_conroller";
import { authMiddleware } from "../controllers/auth_controller";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The Users API
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - username
 *         - password
 *         - isVet
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           description: The email of the user
 *         username:
 *           type: string
 *           description: The username of the user
 *         password:
 *           type: string
 *           description: The password of the user
 *         refreshToken:
 *           type: array
 *           items:
 *             type: string
 *           description: The refresh token of the user
 *         isVet:
 *           type: boolean
 *           description: Indicates if the user is a vet
 *       example:
 *         _id: "245"
 *         email: "user@gmail.com"
 *         username: "user123"
 *         password: "password123456789"
 *         refreshToken: []
 *         isVet: false
 */

/**
 * @swagger
 * /users/user:
 *   post:
 *     summary: Get user
 *     description: Get user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: bobTheBuilder
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/user', authMiddleware, usersController.getUser.bind(usersController));

/**
 * @swagger
 * /users/username:
 *   post:
 *     summary: Get user username
 *     description: Get user username
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: get user username
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: bobTheBuilder
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/username', authMiddleware, usersController.getUsername.bind(usersController));


/**
 * @swagger
 * /users/update_user:
 *   get:
 *     summary: update user
 *     description: update user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: The username of the user
 *         example: "bobTheNotBuilder"
 *     responses:
 *       200:
 *         description: Returns true if the user is a veterinarian, false otherwise
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               example: true
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.post('/update_user', authMiddleware, usersController.updateUser.bind(usersController));

export default router;
