import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";

var app: Express;

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});


describe("File Tests", () => {
  test("File tests placeholder", async () => {
    expect(true).toBe(true);
  });

});