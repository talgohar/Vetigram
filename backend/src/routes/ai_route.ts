import { Router } from 'express';
import ai_controller from '../controllers/ai_controller';
import { authMiddleware } from '../controllers/auth_controller';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limiter for AI suggestion endpoint - strict to control OpenAI API costs
const aiSuggestionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // 30 requests per hour per IP
  message: 'Too many AI suggestion requests. Please try again in an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});


/**
* @swagger
* tags:
*   name: Posts
*   description: The Posts API
*/

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The title of the post
 *         content:
 *           type: string
 *           description: The content of the post
 *         owner:
 *           type: string
 *           description: The owner id of the post
 *       example:
 *         _id: 245234t234234r234r23f4
 *         title: My First Post
 *         content: This is the content of my first post.
 *         author: 324vt23r4tr234t245tbv45by
 */

/**
 * @swagger
 * /ai_data/ai-content:
 *   get:
 *     summary: Get smaple ai posts
 *     description: Get smaple ai posts
 *     tags:
 *       - Posts
 *     responses:
 *       200:
 *         description: A list of posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Server error
 */
router.get('/ai-content', ai_controller.getAIProcessedContent.bind(ai_controller));

/**
 * @swagger
 * /ai_data/suggest-post-content:
 *   post:
 *     summary: Get AI suggestions for post title and content based on image
 *     description: Upload an image and get AI-suggested title and content for a post
 *     tags:
 *       - AI
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageBase64
 *             properties:
 *               imageBase64:
 *                 type: string
 *                 description: Base64 encoded image data
 *               imageMediaType:
 *                 type: string
 *                 description: MIME type of the image (e.g., image/jpeg, image/png)
 *                 default: image/jpeg
 *     responses:
 *       200:
 *         description: AI suggestions for title and content
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: Suggested post title
 *                 content:
 *                   type: string
 *                   description: Suggested post content
 *       400:
 *         description: Missing or invalid image data
 *       500:
 *         description: AI processing error
 */
router.post('/suggest-post-content', aiSuggestionLimiter, authMiddleware, ai_controller.suggestPostContent.bind(ai_controller));

export default router;