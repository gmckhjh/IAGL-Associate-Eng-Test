import React, { useEffect, useState } from "react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import axios from "axios";
import "./styles.css";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [tab, setTab] = useState("todo");

  useEffect(() => {
    axios.get("http://localhost:9091/api/todo").then(({ data }) => {
      setTodos(data);
    });
  }, []);

  const toggleCompleted = async (id) => {
    const updated = await axios.patch(`http://localhost:9091/api/todo/${id}/completed`);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated.data : t)));
  };

  const addTodo = async (todo) => {
    const response = await axios.post("http://localhost:9091/api/todo", todo);
    setTodos((prev) => [...prev, response.data]);
    setTab("todo"); // Switch back to todo list after adding
  };

  const todosActive = todos.filter((t) => !t.completed);
  const todosDone = todos.filter((t) => t.completed);

  return (
    <div className="todo-app">
      <h1>Todo</h1>

      <div className="tab-bar">
        <button onClick={() => setTab("todo")} className={tab === "todo" ? "active" : ""}>
          To Do
        </button>
        <button onClick={() => setTab("done")} className={tab === "done" ? "active" : ""}>
          Completed
        </button>
        <button onClick={() => setTab("new")} className={tab === "new" ? "active" : ""}>
          New
        </button>
      </div>

      {tab === "todo" && (
        <>
          <h2>To Do</h2>
          <TodoList todos={todosActive} toggleCompleted={toggleCompleted} />
        </>
      )}

      {tab === "done" && (
        <>
          <h2>Completed</h2>
          <TodoList todos={todosDone} toggleCompleted={toggleCompleted} />
        </>
      )}

      {tab === "new" && (
        <>
          <h2>New Item</h2>
          <AddTodo onAdd={addTodo} />
        </>
      )}
    </div>
  );
}
