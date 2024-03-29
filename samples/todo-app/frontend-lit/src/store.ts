export interface ToDo {
    id: number;
    todo: string;
    isDone: boolean;
}

export type DisconnectedEvent = {
    readonly type: "disconnected";
}

export type ConnectedEvent = {
    readonly type: "connected";
}

export type UpdateEvent = {
    readonly type: "update";
    todos: ToDo[];
}
export type ErrorEvent = {
    readonly type: "error";
    error: "Error";
}

export type StoreEvent = UpdateEvent | ErrorEvent | DisconnectedEvent | ConnectedEvent;

class ToDoStore extends EventTarget {

    private host: string = '//172.22.196.109:3000';

    constructor() {
        super();

        window.setTimeout(() => {
            const websocketConnection = () => {
                const ws = new WebSocket(`ws:${this.host}/signal`);
                ws.addEventListener('message', () => {
                    this.sync();
                });
                ws.addEventListener('error', (reason) => {
                    this.dispatchEvent(Object.assign(new Event('error'), { error: reason }));
                    this.dispatchEvent(new Event('disconnected'));
                    window.setTimeout(() => {
                        websocketConnection();
                    }, 1000);
                });
                ws.addEventListener('close', () => {
                    this.dispatchEvent(new Event('disconnected'));
                    window.setTimeout(() => {
                        websocketConnection();
                    }, 1000);
                });
                ws.addEventListener('open', () => {
                    this.dispatchEvent(new Event('connected'));
                });
            }
            websocketConnection();
        }, 0);
    }

    sync() {
        fetch(`${this.host}/todos`, { method: 'GET' }).then(async (response) => {
            const todos = await response.json();
            this.dispatchEvent(Object.assign(new Event('update'), { todos }));
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

    addTodo(text: string) {
        fetch(`${this.host}/todos`, { method: 'POST', body: text }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

    deleteTodo(todo: ToDo) {
        fetch(`${this.host}/todos/${todo.id}`, { method: 'DELETE' }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }
    updateTodo(todo: ToDo) {
        fetch(`${this.host}/todos/${todo.id}`, { method: 'PUT', body: JSON.stringify({ todo: todo.todo, isDone: todo.isDone }) }).then(() => {
            this.sync();
        }).catch((error) => {
            this.dispatchEvent(Object.assign(new Event('error'), { error }));
        });
    }

    public addEventListener<
        T extends StoreEvent['type'],
        E extends StoreEvent & { type: T }
    >(type: T, listener: ((e: Event & E) => boolean | void) | null) {
        super.addEventListener(type, listener);
    }

};
export const store = new ToDoStore();