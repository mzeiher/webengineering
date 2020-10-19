const http = require('http');
const Busboy = require('busboy');
const inspect = require('util').inspect;
const crypto = require('crypto');

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
            res.setHeader('Content-Type', 'text/plain');
            res.writeHead(200);
            res.end(buffer);
        });
        req.pipe(busboy);
    } else if (/^\/url/.test(req.url) && (req.method === 'POST' || req.method === 'GET')) {
        const parameters = req.url.split('?')[1] || '';
        res.setHeader('Content-Type', 'text/plain');
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
    if (/^\/ws$/.test(req.url)) {

        const key = req.headers['sec-websocket-key'];
        const sha = crypto.createHash('sha1');
        sha.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11', 'utf8');
        const result = sha.digest('base64');
        socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
            'Upgrade: WebSocket\r\n' +
            'Connection: Upgrade\r\n' +
            'Sec-WebSocket-Accept: '+ result + '\r\n' +
            '\r\n');

        // to be done -> masking etc...
    } else {
        socket.write('HTTP/1.1 404 Not Found\r\n')
    }
});

server.listen(8090, '0.0.0.0', () => {
    console.log('listening on 8081');
})