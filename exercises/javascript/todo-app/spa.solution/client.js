window.addEventListener("load", function () {
  main();
});

function main() {
  document
    .querySelector("#app > form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // send the todo
      fetch("/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: document.querySelector("#app > form > input").value,
      });
    });

  const ws = new WebSocket("ws://localhost:3000");
  ws.addEventListener("message", (data) => {
    // message received, add todo item
    updateTodos(JSON.parse(data.data));
  });

  // initial fetch of all todos
  fetch("/todos", { method: "GET" })
    .then((res) => {
      return res.json();
    })
    .then((todos) => {});

  // handle button click for deletion
  // we use a handler on the list directly instead of creating a handler for every entry/button
  // and check if the click happend on a button
  document.querySelector("#todos").addEventListener("click", (evt) => {
    // check if clicked on a button
    if (evt.target.nodeName === "BUTTON") {
      // get data-index attribute from dataset property
      fetch(`/todos/${evt.target.dataset.index}`, { method: "DELETE" });
    }
  });
}

function updateTodos(todos) {
  const list = document.querySelector("#todos");
  list.innerHTML = ""; // remove all todos
  // update the list
  list.innerHTML = todos
    .map((todo, index) => {
      return `<li><span>${todo}</span><button data-index=${index}>X</button></li>`;
    })
    .join("");
}
