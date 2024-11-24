import express, { urlencoded } from "express";
import { listTemplate, indexTemplate, todoTemplate } from "./templates.js";
import { randomUUID } from "crypto";

const todos = new Map<string, string>();

const app = express();

// to automatically parse form-encoded data in post
app.use(urlencoded());

app.get("/", (req, res) => {
  res.statusCode = 200;
  res.header("content-type", "text/html");
  res.end(indexTemplate());
});

app.post("/todos", (req, res) => {
  const todoID = randomUUID();
  todos.set(todoID, req.body.todo);
  res.header("content-type", "x-html-fragment");
  res.statusCode = 201;
  res.end(todoTemplate(todoID, req.body.todo));
});

app.delete("/todos/:id", (req, res) => {
  todos.delete(req.params["id"]);
  res.statusCode = 202;
  res.end();
});

app.get("/todos", (req, res) => {
  res.header("content-type", "x-html-fragment");
  res.statusCode = 200;
  res.end(listTemplate(todos));
});

const server = app.listen(3000, "0.0.0.0", () => {
  console.log("listening...");
});

process.on("SIGINT", () => {
  console.log("got sigint");
  server.closeAllConnections();
  server.close((err) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    } else {
      process.exit(0);
    }
  });
});
