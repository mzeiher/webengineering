const http = require('http');
const Busboy = require('busboy');
const inspect = require('util').inspect;

const WebSocket = require('ws');

const wss = new WebSocket.Server({ noServer: true });

const clients = [];

process.on('SIGINT', () => {
    process.exit(0);
})

const server = http.createServer((req, res) => {
    
    if (/^\/post$/.test(req.url) && req.method === 'POST') {
        if(req.headers["content-type"].startsWith('multipart/form-data')) {
            res.writeHead(405, '405 Method Not Allowed');
            res.end();
        } else {
            let buffer = '';
            req.on('data', (chunk) => {
                buffer += chunk;
            });
            req.on('end', ()=> {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Content-Type', 'text/plain');
                res.writeHead(200);
                res.end(buffer);
            });
        }
    } else if (/^\/form$/.test(req.url) && req.method === 'POST') {
        var busboy = new Busboy({ headers: req.headers });
        let buffer = '';
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            buffer += 'File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype + ',';
            let bytes = 0;
            file.on('data', function (data) {
                bytes += data.length;
            });
            file.on('end', function () {
                buffer += 'length: ' + bytes + '\n';
            });
        });
        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
            buffer += 'Field [' + fieldname + ']: value: ' + inspect(val) + '\n';
        });
        busboy.on('finish', function () {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(200);
            res.end(buffer);
        });
        req.pipe(busboy);
    } else if (/^\/url/.test(req.url) && (req.method === 'POST' || req.method === 'GET')) {
        const parameters = req.url.split('?')[1] || '';
        res.setHeader('Content-Type', 'text/plain');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.writeHead(200);
        parameters.split('&').forEach((tuple) => {
            const [key, value] = tuple.split('=')
            res.write(`${key}: ${encodeURIComponent(value)}\n`);
        });
        res.end();
    } else {
        res.setHeader('Content-Type', 'text/plain');
        res.writeHead(200);
        res.end(`POST /post will read text/plain form data
POST /form will accept multipart/formdata and replay the data
GET/POST /url will accept URL encoded data and replay it
WS:/ws will create a ws echo service (not yet working)
`)
    }
});

server.on('upgrade', (req, socket, head) => {
    
    if (/^\/ws(\?.*)?$/.test(req.url)) {
        wss.handleUpgrade(req, socket, head, (client) => {
            
            clients.push(client);
            client.on('close', function() {
                clients = clients.filter((value) => value !== client);
            });
            client.on('error', function() {
                clients = clients.filter((value) => value !== client);
            });
            client.on('message', (data) => {
                clients.forEach(client => {
                    client.send(data);
                })
            });
            wss.emit('connection', client, req);
        });
    } else {
        socket.write('HTTP/1.1 404 Not Found\r\n')
        socket.destroy();
    }
});

server.listen(8090, '0.0.0.0', () => {
    console.log('listening on 8090');
})