import dotenv from "dotenv"
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Express } from "express";
import postsRoute from "./routes/post_route";
import commentsRoute from "./routes/comment_route";
import usersRoute from "./routes/user_route";
import authRoutes from "./routes/auth_route";
import fileRoute from "./routes/file_route";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import aiRoute from "./routes/ai_route";
import rateLimit from 'express-rate-limit';
import path from "path";
const port = process.env.PORT;


const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  message: 'Too many requests from this IP, please try again after a minute',
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Web Dev 2025 REST API",
      version: "1.0.0",
      description: "REST server including authentication using JWT",
    },
    servers: [{ url: `http://localhost:4000` }, { url: `http://localhost:27017` }, { url: `http://10.10.246.141` }, { url: `https://10.10.246.141` }, { url: `https://node141.cs.colman.ac.il` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use("/posts", postsRoute);
app.use("/comments", commentsRoute);
app.use("/users", usersRoute);
app.use("/auth", authRoutes);
app.use("/files", fileRoute);
app.use("/ai_data", apiLimiter, aiRoute)
app.use("/public", express.static("public"));
app.use(express.static("front"));
const frontPath = path.join(__dirname, "..", "..", "front");

app.get("*", (req, res) => {
  res.sendFile(path.join(frontPath, "index.html"));
});

const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DB_CONNECT) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DB_CONNECT)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;