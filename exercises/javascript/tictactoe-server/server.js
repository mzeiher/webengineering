const express = require("express"); // express webserver api
const ws = require("ws"); // websocket server

// create new express application
const app = express(); 

// server static files from "./static" directory
app.use(express.static("./static"));

// create websocket server
const wsServer = new ws.Server({ noServer: true });

const connectedClients = new Set();
wsServer.on('connection', client => {
  console.log("client connected");
  connectedClients.add(client);

  client.on('close', () => {
    // remove client if client disconnects
    connectedClients.delete(client);
  })

  client.on('message', (wsmessage) => {
    //message received
    console.log(wsmessage.toString());
  })
});

// start webserver
const server = app.listen(3333, "0.0.0.0", () => {
    console.log('server is running...');
})

// connect websocket server with express
server.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (client, request) => {
        wsServer.emit('connection', client, request);
    })
})