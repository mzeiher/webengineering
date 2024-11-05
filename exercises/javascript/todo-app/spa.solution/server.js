import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const wsServer = new WebSocketServer({ noServer: true });

const wsClients = new Set();

// save all todos here
const todos = [];

// logic goes here
const server = createServer((req, res) => {
  if (
    req.method === "GET" &&
    (req.url === "" || req.url === "/" || req.url === "/index.html")
  ) {
    res.setHeader("content-type", "text/html");
    res.statusCode = 200;
    res.end(readFileSync("./index.html", { encoding: "utf8" }));
  } else if (req.method === "GET" && req.url === "/client.js") {
    res.setHeader("content-type", "application/javascript");
    res.statusCode = 200;
    res.end(readFileSync("./client.js", { encoding: "utf8" }));
  } else if (req.method === "GET" && req.url === "/todos") {
    res.statusCode = 200;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify(todos));
  } else if (req.method === "POST" && req.url === "/todos") {
    // add todo to list and notify all clients for new todos
    res.statusCode = 201;
    parseBody(req).then((value) => {
      todos.push(value);
      res.end("success");
      wsClients.forEach((client) => {
        client.send(JSON.stringify(todos));
      });
    });
  } else if (req.method === "DELETE" && /\/todos\/\d+$/.test(req.url)) {
    // remove todo from list and notify all clients for new todos
    // we use a regex to extrac the id from the rest path /todos/<number>
    const id = /\/todos\/(\d+)$/.exec(req.url)[1];
    res.statusCode = 200;
    todos.splice(parseInt(id), 1);
    wsClients.forEach((client) => {
      client.send(JSON.stringify(todos));
    });
    res.end("");
  }
});

// websocket logic all connected clients are stored in the set `wsClients`
// no need to expand
server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (client) => {
    client.on("close", () => {
      console.log("remove client, connection closed");
      wsClients.delete(client);
    });
    client.on("error", () => {
      console.log("remove client, connection error");
      wsClients.delete(client);
    });
    console.log("websocket connected");
    wsClients.add(client);
  });
});

server.listen(3000, () => {
  console.log("listening on :3000");
});

// some helpers to parse the query part from a URL or parse the body from a request

/**
 * @param url {string}
 * @returns { Promise<{[name:string]:string}> }
 */
function parseQuery(url) {
  const query = url.split("?")[1] ?? "";
  const result = query.split("&").reduce((prev, curr) => {
    const keyValue = curr.split("=");
    prev[keyValue[0]] = keyValue[1];
    return prev;
  }, {});
  return result;
}

/**
 * @param req { IncomingMessage }
 * @returns { string }
 */
function parseBody(req) {
  return new Promise((resolve) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
    });
    req.on("end", () => {
      resolve(buffer);
    });
  });
}
