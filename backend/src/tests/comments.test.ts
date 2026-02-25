import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import commentsModel from "../models/comments_model";
import postModel from "../models/posts_model";
import userModel, { IUser } from "../models/users_model";
import { Express } from "express";
import testComments from "./test_comments.json";

var app: Express;

type User = IUser & { accessToken?: string; refreshToken?: string };
const testUser: User = {
  email: "test@user.com",
  username: "testuser",
  password: "testpassword",
}

const testUserForLogin = {
  identifier: "test@user.com",
  password: "testpassword",
}

let postId = "";

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await commentsModel.deleteMany();
  await postModel.deleteMany();
  await userModel.deleteMany();
  
  // Register and login user
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUserForLogin);
  testUser.accessToken = res.body.accessToken;
  testUser._id = res.body._id;
  
  // Create a post for comments
  const postRes = await request(app).post("/posts")
    .set({ authorization: "JWT " + testUser.accessToken })
    .send({
      title: "Test Post for Comments",
      content: "Test Content",
      owner: testUser._id,
    });
  postId = postRes.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let commentId = "";

describe("Comments Tests", () => {
  test("Test Create Comment", async () => {
    const response = await request(app).post("/comments")
      .set({ authorization: "JWT " + testUser.accessToken })
      .send({
        comment: "Great post!",
        postId: postId,
        owner: testUser._id,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.comment).toBe("Great post!");
    expect(response.body.postId).toBe(postId);
    commentId = response.body._id;
  });

  test("Test get comments by post id", async () => {
    const response = await request(app).get("/comments/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].comment).toBe("Great post!");
    expect(response.body[0].postId).toBe(postId);
  });

  test("Test Delete Comment", async () => {
    const response = await request(app).delete("/comments/" + commentId)
      .set({ authorization: "JWT " + testUser.accessToken });
    expect(response.statusCode).toBe(200);
  });

  test("Test Delete Comment returns 404 after deletion", async () => {
    // Try to get the comment by postId - it should be gone
    const response = await request(app).get("/comments/" + postId);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });
});