class ToDoStore extends EventTarget {

    #host = '//172.21.9.177:3000';

    constructor() {
        super();

        window.setTimeout(() => {
            const websocketConnection = () => {
                const ws = new WebSocket(`ws:${this.#host}/signal`);
                ws.addEventListener('message', () => {
                    this.sync();
                });
                ws.addEventListener('error', (reason) => {
                    this.dispatchEvent(Object.assign(new Event('error'), { error: reason }));
                    this.dispatchEvent(Object.assign(new Event('connection_state'), { connected: false}));
                    window.setTimeout(() => {
                        websocketConnection();
                    }, 1000);
                });
                ws.addEventListener('close', () => {
                    this.dispatchEvent(Object.assign(new Event('connection_state'), { connected: false}));
                    window.setTimeout(() => {
                        websocketConnection();
                    }, 1000);
                });
                ws.addEventListener('open', () => {
                    this.dispatchEvent(Object.assign(new Event('connection_state'), { connected: true}));
                });
            }
            websocketConnection();
        }, 0);
    }

    sync() {
        fetch(`${this.#host}/todos`, { method: 'GET' }).then(async (response) => {
            const todos = await response.json();
            this.dispatchEvent(Object.assign(new Event('update'), { todos }));
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

    addTodo(text) {
        fetch(`${this.#host}/todos`, { method: 'POST', body: text }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

    deleteTodo(todo) {
        fetch(`${this.#host}/todos/${todo.id}`, { method: 'DELETE' }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }
    updateTodo(todo) {
        fetch(`${this.#host}/todos/${todo.id}`, { method: 'PUT', body: JSON.stringify({ todo: todo.todo, isDone: todo.isDone }) }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

};
export const store = new ToDoStore();