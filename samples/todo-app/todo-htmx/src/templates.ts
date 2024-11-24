export function indexTemplate() {
  return `<!DOCTYPE html>
<html>
<head>
	<script src="https://unpkg.com/htmx.org@2.0.3"></script>
</head>
<body>
	<h1>ToDo List</h1>
	<div>
		<form class="w-full max-w-sm mx-auto px-4 py-2" hx-post="/todos" hx-target="#list" hx-swap="beforeend">
			<input type="text" placeholder="do something..." name="todo" required>
			<button type="submit"> 
			    Add
			</button>
		</form>
	</div>
	<div hx-get="/todos" hx-trigger="load">
	</div>
</body>
</html>
`;
}

export function todoTemplate(id: string, text: string) {
  return `<li id="list-item-${id}">
	<label>${text}</label><button hx-delete="/todos/${id}" hx-target="#list-item-${id}" hx-swap="delete swap:0.25s">Delete</button>
</li>
`;
}

export function listTemplate(todos: Map<string, string>) {
  return `<ul id="list">
${Array.from(todos.entries())
  .map(([id, text]) => {
    return todoTemplate(id, text);
  })
  .join("\n")}
</ul>`;
}
