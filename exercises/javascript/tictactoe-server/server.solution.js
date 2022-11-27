const express = require("express"); // express webserver api
const ws = require("ws"); // websocket server

// create new express application
const app = express(); 

// server static files from "./static" directory
app.use(express.static("./static"));

// create websocket server
const wsServer = new ws.Server({ noServer: true });

// virtual field for evaluation
let field = [undefined, undefined, undefined,
    undefined, undefined, undefined,
    undefined, undefined, undefined];

let currentPlayer = "❌";

function checkFieldFree(fieldNbr) {
    return field[fieldNbr] === undefined;
}

function checkWinningCondition() { // check against all possible solutions
    return (field[0] === field[1] && field[1] === field[2] && field[2] !== undefined) || // horizontal row 1
        (field[3] === field[4] && field[4] === field[5] && field[5] !== undefined) || // horizontal row 1
        (field[6] === field[7] && field[7] === field[8] && field[8] !== undefined) || // horizontal row 1
        (field[0] === field[3] && field[3] === field[6] && field[6] !== undefined) || // vertical row 1
        (field[1] === field[4] && field[4] === field[7] && field[7] !== undefined) || // vertical row 2
        (field[2] === field[5] && field[5] === field[8] && field[8] !== undefined) || // vertical row 3 
        (field[0] === field[4] && field[4] === field[8] && field[8] !== undefined) || // diagonal 1
        (field[2] === field[4] && field[4] === field[6] && field[6] !== undefined)// diagonal 2
}

function checkDraw() {
    for(let i = 0; i < field.length; i++) {
        if(field[i] === undefined) {
            return false;
        }
    }
    return true;
}

const connectedClients = new Set();
wsServer.on('connection', client => {
  connectedClients.add(client);

  // send current player to synchronize
  client.send(JSON.stringify({type: "connect", nextPlayer: currentPlayer, field}));

  client.on('close', () => {
    // remove client if client disconnects
    connectedClients.delete(client);
  })

  client.on('message', (wsmessage) => {
    const message = JSON.parse(wsmessage.toString()); // we assume we always get valid json
    if(message.type === "click-on-field") {
        const fieldNumber = message.fieldNumber - 1; // we have to subtract 1 from the clicked field to match with array indices

        if (checkFieldFree(fieldNumber)) {
            field[fieldNumber] = currentPlayer;
        } else {
            return;
        }
        const win = checkWinningCondition();
        const draw = checkDraw();
        if(win || draw) {
            // reset field
            field = [undefined, undefined, undefined,
                undefined, undefined, undefined,
                undefined, undefined, undefined]
            
            const nextPlayer = "❌";

            connectedClients.forEach((player) => {
                // send win to all clients
                player.send(JSON.stringify({type: "win-or-draw", winningPlayer: win ? currentPlayer: undefined, nextPlayer}));
            });

            currentPlayer = nextPlayer;
        } else {
            // set next player
            const nextPlayer = currentPlayer === "❌" ? "⭕" : "❌";
            connectedClients.forEach((player) => {
                // send valid move to all clients
                player.send(JSON.stringify({type: "valid-move", currentPlayer, nextPlayer, fieldNumber: message.fieldNumber}));
            });
            // update current player
            currentPlayer = nextPlayer;
        }

    }
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