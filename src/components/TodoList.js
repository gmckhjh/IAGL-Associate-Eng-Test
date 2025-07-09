import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, toggleCompleted }) {
  if (todos.length === 0) return <p>No todos</p>;

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleCompleted={toggleCompleted}
        />
      ))}
    </ul>
  );
}
