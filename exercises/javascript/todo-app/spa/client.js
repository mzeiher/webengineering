window.addEventListener("load", function () {
  main();
});

function main() {
  document
    .querySelector("#app > form")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      // get the todo to add

      // send the todo
      fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          // handle response
        })
        .catch((error) => {
          // handle error
        });
    });

  const ws = new WebSocket("ws://localhost:3000");
  ws.addEventListener("message", (data) => {
    // message received, add todo item
  });
}
