import { createServer } from "node:http";

let todos = [];

const server = createServer((req, res) => {
	// handle get request
	if (req.method === "GET") {
		res.setHeader("Content-Type", "text/html");
		res.statusCode = 200;
		res.end(renderPage());
	} else if (req.method === "POST") {
		let body = "";
		req.on("data", chunk => {
			body += chunk.toString();
		});
		req.on("end", () => {
			// implement adding of todo or deleting
			res.statusCode = 501;
			res.end("not implemented");
		});
	}
});

function renderPage() {
	return `<!doctype html>
<html>
<head>
	<title>Todo App</title>
	<meta charset="utf-8">
</heade>
<body>
	<h1>Todo App</h1>
	<form method="POST" action="/">
		<input type="text" name="todo" placeholder="Enter a new todo">
		<button type="submit">Add</button>
	</form>
	<ul>
		${todos.map(todo => `<li>${todo}</li>`).join("")}
	</ul>
</body>
</html>
`

}

server.listen(3000, () => {
	console.log("Server is running on http://localhost:3000");
});
