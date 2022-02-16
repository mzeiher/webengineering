import { render, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {map} from 'lit/directives/map.js';
// import {repeat} from 'lit/directives/repeat.js';

import { store, ToDo } from './store.js';

const update = (todos: ToDo[]) => {
    render(app(todos), document.body);
}

const app = (todos: ToDo[]) => {
    return html`
    <header><h1>ToDo App</h1></header>
    <main>
        ${todoList(todos)}
    </main>`;
}

const todoList = (todos: ToDo[]) => {
    return html`
    <ul class="todo_list">
        ${map(todos, (todo) => {
        return html`<li class="${classMap({ done: todo.isDone })}">
        <label>${todo.todo}</label><button @click="${() => {
                if( todo.isDone ) {
                    store.deleteTodo(todo);
                } else {
                    store.updateTodo({ ...todo, isDone: !todo.isDone })
                }
            }}">${todo.isDone ? '❌' : '✔️'}</button>
        </li>
        `
    })}
    </ul>
    <form @submit="${(evt: Event) => {
            evt.preventDefault();
            const form_data = new FormData(evt.target as HTMLFormElement);
            store.addTodo(form_data.get('text') as string);
        }}">
    <div class="todo_input"><input type="text" name="text" /><button type="submit">➕</button></div>
    </form>
    `
}

store.addEventListener('update', (evt) => {
    update(evt.todos);
})

window.addEventListener('load', () => {
    store.sync();
});