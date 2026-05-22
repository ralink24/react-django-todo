import { useState, useEffect } from 'react'
import './App.css'

const API_URL = "http://127.0.0.1:8000/api/todos/";

function App() {
  const [todos, setTodos] = useState([]);
  const [inputVal, setInputVal] = useState("");

  // 1. On page load: fetch todos from Django
  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTodos(data);
  }

  function writeTodo(e) {
    setInputVal(e.target.value);
  }

  // Adds todo by POST to Django then refreshing the list
  async function addTodo() {
    if (inputVal === "") return;

    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: inputVal , position: todos.length}),
    });

    setInputVal("");
    fetchTodos();
  }

  //Delete todo by id then refreshes list.
  async function deleteTodo(id) {
    await fetch(`${API_URL}${id}/`, { method: "DELETE" });
    fetchTodos();
  }

  // Marks a todo item as completed
  async function toggleTodo(id, completed) {
    await fetch(`${API_URL}${id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    fetchTodos();
  }

  // Moves a todo item up one spot
  async function moveUp(id) {
    const index = todos.findIndex((t) => t.id === id);
    if (index <= 0) {
      return;
    }

    const current = todos[index];
    const above = todos[index - 1];

    await fetch(`${API_URL}${current.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: above.position }),
    });

    await fetch(`${API_URL}${above.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: current.position }),
    });
    fetchTodos();
  }

  // Moves a todo item down one spot
  async function moveDown(id) {
    const index = todos.findIndex((t) => t.id === id);
    if (index >= todos.length - 1) {
      return;
    }

    const current = todos[index];
    const below = todos[index + 1];

    await fetch(`${API_URL}${current.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ position: below.position }),
    });

    await fetch(`${API_URL}${below.id}/`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
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

export default App
