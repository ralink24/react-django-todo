import { useState, useEffect, useContext } from 'react'
import AuthContext from './AuthContext';

import './App.css'

const API_URL = "http://127.0.0.1:8000/api/todos/";

function TodoPage() {
  const [todos, setTodos] = useState([]);
  const [inputVal, setInputVal] = useState("");
  
  const { authTokens } = useContext(AuthContext);
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + authTokens.access,
  }

  useEffect(() => {
    if (authTokens){
        fetchTodos();
    }
  }, [authTokens]);

  async function fetchTodos() {
    const response = await fetch(API_URL, {
        headers: authHeaders,
    });
    const data = await response.json();
    setTodos(data);
  }

  function writeTodo(e) {
    setInputVal(e.target.value);
  }

  async function addTodo() {
    if (inputVal === "") return;

    await fetch(API_URL, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ title: inputVal , position: todos.length}),
    });

    setInputVal("");
    fetchTodos();
  }

  async function deleteTodo(id) {
    await fetch(`${API_URL}${id}/`, { 
        method: "DELETE",
        headers: authHeaders
    });
    fetchTodos();
  }

  async function toggleTodo(id, completed) {
    await fetch(`${API_URL}${id}/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ completed }),
    });
    fetchTodos();
  }

  async function moveUp(id) {
    const index = todos.findIndex((t) => t.id === id);
    if (index <= 0) {
      return;
    }

    const current = todos[index];
    const above = todos[index - 1];

    await fetch(`${API_URL}${current.id}/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ position: above.position }),
    });

    await fetch(`${API_URL}${above.id}/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ position: current.position }),
    });
    fetchTodos();
  }

  async function moveDown(id) {
    const index = todos.findIndex((t) => t.id === id);
    if (index >= todos.length - 1) {
      return;
    }

    const current = todos[index];
    const below = todos[index + 1];

    await fetch(`${API_URL}${current.id}/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ position: below.position }),
    });

    await fetch(`${API_URL}${below.id}/`, {
      method: "PATCH",
      headers: authHeaders,
      body: JSON.stringify({ position: current.position }),
    });
    fetchTodos();
  }

  return (
    <main>
      <h1>Todo List</h1>
      <InputContainer
        inputVal={inputVal}
        writeTodo={writeTodo}
        addTodo={addTodo}
      />
      <TodoContainer
        todos={todos}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
        moveUp={moveUp}
        moveDown={moveDown}
      />
    </main>
  );
}

function InputContainer({ inputVal, writeTodo, addTodo }) {
  return (
    <div className="input-container">
      <input
        id="input-todo"
        type="text"
        placeholder="Enter Todos"
        value={inputVal}
        onChange={writeTodo}
        onKeyDown={(e) => e.key === "Enter" && addTodo()}
      />
      <button onClick={addTodo}>+</button>
    </div>
  );
}

function TodoContainer({ todos, deleteTodo, toggleTodo, moveUp, moveDown }) {
  return (
    <div className="container">
      {todos.map((todo) => (
        <Todo
          key={todo.id}
          todo={todo}
          deleteTodo={deleteTodo}
          toggleTodo={toggleTodo}
          moveUp={moveUp}
          moveDown={moveDown}
        />
      ))}
    </div>
  );
}

function Todo({ todo, deleteTodo, toggleTodo, moveUp, moveDown }) {
  return (
    <div className="todo">
      <div className="arrow-buttons">
        <button onClick={() => moveUp(todo.id)}>↑</button>
        <button onClick={() => moveDown(todo.id)}>↓</button>
      </div>
      <p style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
        {todo.title}
      </p>
      <div className="actions">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id, !todo.completed)}
        />
        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
      </div>
    </div>
  );
}

export default TodoPage