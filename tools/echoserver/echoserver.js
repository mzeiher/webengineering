const http = require('http');

const server = http.createServer((req, res) => {
    console.log(req);
    debugger;
});

server.on('upgrade', (req, socket, head) => {

    socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
        'Upgrade: WebSocket\r\n' +
        'Connection: Upgrade\r\n' +
        '\r\n');

    socket.pipe(socket); // echo back
});

server.listen(8081, '127.0.0.1', () => {
    console.log('listening on 8081');
})