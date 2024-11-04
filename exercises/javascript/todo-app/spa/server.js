import { WebSocketServer } from "ws";
import { createServer } from "node:http";
import { readFileSync } from "node:fs";

const wsServer = new WebSocketServer({ noServer: true });

const wsClients = new Set();

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
  } else if (req.method === "POST" && req.url === "/add") {
    res.statusCode = 501;
    res.end("not implemented");
  } else if (req.method === "DELETE") {
    res.statusCode = 501;
    res.end("not implemented");
  }
});

// websocket logic all connected clients are stored in the set `wsClients`
// no need to expand
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
 * @returns { Promise<{[name:string]:string}> }
 */
function parseBody(req) {
  return new Promise((resolve) => {
    let buffer = "";
    req.on("data", (chunk) => {
      buffer += chunk;
    });
    req.on("end", () => {
      const result = buffer.split("\n").reduce((prev, curr) => {
        const keyValue = curr.split("=");
        prev[keyValue[0]] = keyValue[1];
        return prev;
      }, {});
      resolve(result);
    });
  });
}
