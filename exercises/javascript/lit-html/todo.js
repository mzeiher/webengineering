import {
  html,
  render,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

let todos = ["init"];

function update() {
  render(
    html`<div>
      <form
        @submit=${(evt) => {
          evt.preventDefault();
          const input = document.querySelector("[name=text]");
          todos.push(input.value);
          update();
        }}
      >
        <input type="text" name="text" /><button>Add</button>
      </form>
      <ul>
        ${todos.map((value) => {
          return html`<li>${value}</li>`;
        })}
      </ul>
    </div>`,
    document.querySelector("body"),
  );
}
update();
