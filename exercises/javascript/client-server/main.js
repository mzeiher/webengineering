const express = require("express"); // express webserver api
const ws = require("ws"); // websocket server

// create new express application
const app = express(); 

// server static files from "./static" directory
app.use(express.static("./static"));

// register handler for GET requests to /hello
app.get("/hello", (req, res) => {
    res.statusCode = 200;
    res.write("hello")
    res.end(); // send response
});

// register handler for GET requests to /hello/<whatever>
app.get("/hello/:name", (req, res) => {
    res.statusCode = 200;
    res.write("hello " + req.params['name']);
    res.end(); //send response
});

// start webserver
const server = app.listen(3333, "0.0.0.0", () => {
    console.log('server is running on port 3333...');
})

// create websocket server
const wsServer = new ws.Server({ noServer: true });
// connect websocket server with express (handle upgrade requests)
server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (client, request) => {
        wsServer.emit('connection', client, request);
    })
})

const connectedClients = new Set();
wsServer.on('connection', client => {
  console.log("client connected");
  connectedClients.add(client);

  client.on('close', () => {
    // remove client if client disconnects
    connectedClients.delete(client);
    console.log("client disconnected");
  })

  client.on('message', (wsmessage) => {
    //message received
    for(client of connectedClients.values()) {
        client.send(wsmessage.toString());
    }
  })
});