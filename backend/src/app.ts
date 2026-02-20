import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Vetigram API running");
});

export default app;