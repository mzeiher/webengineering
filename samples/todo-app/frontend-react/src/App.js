import { Fragment, useState, useEffect } from 'react';

import { store } from './store';

import './main.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [CONNECTED, setConnected] = useState(true);

  useEffect(() => {
    store.sync();
    const updateTodos = (evt) => {
      setTodos(evt.todos);
    }
    const connectionState = (evt) => {
      setConnected(evt.connected);
    }
    store.addEventListener('connection_state', connectionState);
    store.addEventListener('update', updateTodos);
    return () => {
      store.removeEventListener('connection_state', connectionState);
      store.removeEventListener('update', updateTodos);
    }
  }, [])

  return (
    <Fragment>
      <header><h1>ToDo App</h1></header>
      {!CONNECTED ? (<div className="error">DISCONNECTED</div>) : (<div></div>)}

      <main className={!CONNECTED ? 'offline' : ''}>
        <ToDoList todos={todos}></ToDoList>
      </main>
    </Fragment>
  );
}

function ToDoList({ todos }) {
  return (
    <Fragment>
      <ul className='todo_list'>
        {todos.map((todo) => {
          return (
            <li className={todo.isDone ? 'done' : ''}>
              <label>{todo.todo}</label>
              <button onClick={() => {
                if (todo.isDone) {
                  store.deleteTodo(todo);
                } else {
                  store.updateTodo({ ...todo, isDone: !todo.isDone })
                }
              }}>{todo.isDone ? '❌' : '✔️'}</button>
            </li>
          )
        })}
      </ul>
      <form onSubmit={(evt) => {
        evt.preventDefault();
        const form_data = new FormData(evt.target);
        store.addTodo(form_data.get('text'));
      }}>
        <div class="todo_input"><input type="text" name="text" /><button type="submit">➕</button></div>
      </form>
    </Fragment>
  );
}

export default App;
