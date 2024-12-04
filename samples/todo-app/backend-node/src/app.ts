import Fastify from "fastify";
import FastifyWS, { SocketStream } from "fastify-websocket";
import FastifyCors from "fastify-cors";

import * as mime from "mime-types";

import * as path from "path";
import { fileURLToPath } from "url";
import * as fs from "fs/promises";

import { getDBConnection, Todo } from "./db.js";

const STATIC_DIR = path.resolve(
  path.parse(fileURLToPath(import.meta.url)).dir,
  "static",
);
const DB_DIR = path.resolve(
  path.parse(fileURLToPath(import.meta.url)).dir,
  "db",
);

const DATABASE = await getDBConnection(path.resolve(DB_DIR, "db.sqlite"));

const fastify = Fastify();
fastify.register(FastifyWS);
fastify.register(FastifyCors);

if (process.env.DEBUG) {
  console.warn("DEBUG MODE");
  fastify.addHook("preHandler", (_, reply, done) => {
    reply.header("Access-Control-Allow-Origin", "*");
    done();
  });
}

const clients = new Set<SocketStream>();

// default route for static content
fastify.get("/*", async (request, reply) => {
  const requested_resource =
    request.url === "/" ? "index.html" : request.url.substring(1); // trim leading slash
  const resolved_path = path.resolve(STATIC_DIR, requested_resource);

  let file_stat = null;
  try {
    file_stat = await fs.stat(resolved_path);
  } catch (e) {
    console.warn(`Try access to file ${resolved_path}`);
  }

  if (file_stat !== null && file_stat.isFile()) {
    reply
      .code(200)
      .headers({ "content-type": mime.lookup(resolved_path) })
      .send(await fs.readFile(resolved_path));
  } else {
    reply.statusCode = 404;
    reply.send();
  }
});

fastify.get("/todos", async (_, reply) => {
  try {
    const todos = await DATABASE.list();
    reply
      .code(200)
      .headers({ "content-type": "text/json" })
      .send(JSON.stringify(todos));
  } catch (err) {
    reply.code(500).send();
  }
});

fastify.post("/todos", async (request, reply) => {
  try {
    const todo: string = request.body as string;
    if (typeof todo === "string") {
      await DATABASE.add(todo);
      reply.code(200).send();
    } else {
      throw new Error("invalid parameters");
    }
    notifyClients();
  } catch (err) {
    reply.code(400).send();
  }
});

fastify.delete("/todos/:id", async (request, reply) => {
  try {
    if (!/\d+/.test(request.params["id"])) {
      throw new Error("param is not a number");
    }
    await DATABASE.remove(Number(request.params["id"]));
    reply.code(200).send();
    notifyClients();
  } catch (err) {
    reply.code(400).send();
  }
});

fastify.put("/todos/:id", async (request, reply) => {
  try {
    if (!/\d+/.test(request.params["id"])) {
      throw new Error("param is not a number");
    }
    const todo: Todo = JSON.parse(request.body as string);
    if (typeof todo.todo !== "string" || todo.isDone === undefined) {
      throw new Error("param missing in todo");
    }
    await DATABASE.updateTodo(
      Number(request.params["id"]),
      todo.todo,
      todo.isDone,
    );
    reply.code(200).send();
    notifyClients();
  } catch (err) {
    reply.code(400).send();
  }
});

fastify.get(
  "/signal",
  { websocket: true },
  (connection /* SocketStream */, req /* FastifyRequest */) => {
    clients.add(connection);
    connection.on("close", () => {
      clients.delete(connection);
    });
  },
);

function notifyClients() {
  clients.forEach((client) => {
    client.socket.send("update", (err) => {
      if (err) {
        clients.delete(client);
      }
    });
  });
}

// Run the server!
fastify.listen(3000, "0.0.0.0", function (err, address) {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Listening on ${address}`);
});
