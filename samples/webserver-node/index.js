import { createServer } from "http"

const server = createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end("Hello");
});

server.listen(3000, () => {
	console.log("listening on :3000");
})

process.on('SIGTERM', () => {
	server.close();
})
process.on('SIGINT', () => {
	server.close();
})