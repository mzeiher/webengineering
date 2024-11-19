import {
  html,
  render,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

class Store extends EventTarget {
  constructor() {
    super();
    const ws = new WebSocket("/");
    ws.addEventListener("message", (evt) => {
      this.dispatchEvent(
        new CustomEvent("update", { detail: JSON.parse(evt.data) }),
      );
    });
  }

  addTodo(todo) {
    fetch("/todos", { method: "POST", body: todo });
  }

  deleteTodo(idx) {
    fetch(`/todos/${idx}`, { method: "DELETE" });
  }

  get() {
    fetch("/todos", { method: "GET" })
      .then((value) => {
        return value.json();
      })
      .then((value) => {
        this.dispatchEvent(new CustomEvent("update", { detail: value }));
      });
  }
}

const store = new Store();
store.addEventListener("update", (evt) => {
  update(evt.detail);
});
store.get();

function update(todos) {
  render(
    html`<div>
      <form
        @submit=${(evt) => {
          evt.preventDefault();
          store.addTodo(evt.target.elements[0].value);
        }}
      >
        <input type="text" name="text" /><button>Add</button>
      </form>
      <ul>
        ${todos.map((value, idx) => {
          return html`<li>
            <label> ${value}</label
            ><button
              @click=${() => {
                store.deleteTodo(idx);
              }}
            >
              X
            </button>
          </li>`;
        })}
      </ul>
    </div>`,
    document.querySelector("body"),
  );
}
