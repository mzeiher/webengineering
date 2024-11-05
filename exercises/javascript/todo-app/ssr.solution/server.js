import { createServer, IncomingMessage } from "node:http";

let todos = [];

const server = createServer((req, res) => {
  // handle get request
  if (req.method === "GET") {
    res.setHeader("Content-Type", "text/html");
    res.statusCode = 200;
    res.end(renderPage());
  } else if (req.method === "POST" && req.url === "/add") {
    parseBody(req).then((value) => {
      todos.push(value.todo);
      res.setHeader("Content-Type", "text/html");
      res.statusCode = 200;
      res.end(renderPage());
    });
  } else if (req.method === "POST" && req.url === "/delete") {
    parseBody(req).then((value) => {
      todos.splice(parseInt(value.index), 1);
      res.setHeader("Content-Type", "text/html");
      res.statusCode = 200;
      res.end(renderPage());
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
	<form method="POST" action="/add">
		<input type="text" name="todo" placeholder="Enter a new todo">
		<button type="submit">Add</button>
	</form>
	<ul>
		${todos
      .map(
        (todo, idx) => `<li>
			  <form method="POST" action="/delete"><input type="hidden" name="index" value="${idx}"/>${todo}<button type="submit">Delete</button></form>
                        </li>`,
      )
      .join("")}
	</ul>
</body>
</html>
`;
}

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
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
