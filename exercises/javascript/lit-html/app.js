import {
  html,
  render,
} from "https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js";

let counterValue = 0;

function update() {
  render(
    html`<div>
      ${counterValue}<button
        @click=${() => {
          counterValue = counterValue + 1;
          update();
        }}
      >
        +</button
      ><button
        @click=${() => {
          counterValue = counterValue - 1;
          update();
        }}
      >
        -
      </button>
    </div>`,
    document.querySelector("body"),
  );
}
update();
