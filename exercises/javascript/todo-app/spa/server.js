import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const wsServer = new WebSocketServer({ noServer: true });

const wsClients = new Set();

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
  }
});

server.on("upgrade", (req, socket, head) => {
  wsServer.handleUpgrade(req, socket, head, (client) => {
    client.on("open", () => {
      console.log("added client");
      wsClients.add(client);
    });
    client.on("close", () => {
      console.log("remove client, connection closed");
      wsClients.delete(client);
    });
    client.on("error", () => {
      console.log("remove client, connection error");
      wsClients.delete(client);
    });
    console.log("websocket connected");
  });
});

server.listen(3000, () => {
  console.log("listening on :3000");
});
