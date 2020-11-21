import { createServer } from 'http';
import { readFile, stat } from 'fs/promises';
import { resolve, parse } from 'path';
import * as ws from 'ws';

const hostname = '127.0.0.1';
const port = 3000;

const websocketServer = new ws.default.Server({ noServer: true });

const server = createServer(async (req, res) => {
    if (req.url === '/greeting' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Hello World');
        return;
    }
    if (req.url === '' || req.url === '/') {
        req.url = '/index.html';
    }
    if (req.url.startsWith('/')) {
        req.url = req.url.substr(1);
    }
    try {
        if ((await stat(resolve(process.cwd(), req.url))).isFile) {
            const content = await readFile(resolve(process.cwd(), req.url));
            res.setHeader('Content-Type', getMimeType(req.url));
            res.writeHead(200);
            res.write(content);
            res.end();
        } else {
            throw new Error('not found');
        }
    } catch (e) {
        res.statusCode = 404;
        res.statusMessage = 'Not found';
        res.setHeader('Content-Type', 'text/plain');
        res.end('Not found');
    }
});

server.on('upgrade', (req, socket, head) => {
    websocketServer.handleUpgrade(req, socket, head, (client) => {
        websocketServer.emit('connection', client, req);
        client.on('message', (data) => {
            client.send(data); // simple echo server
        });
    });
});


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function getMimeType(path) {
    const extension = parse(path).ext;
    switch (extension) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'application/javascript';
        case '.css':
            return 'text/css';
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
            return `image/${extension.substr(1)}`;
        default:
            return 'application/octet-stream';
    }
}