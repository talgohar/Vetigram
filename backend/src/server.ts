import app from "./app";

const port = 5050;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});