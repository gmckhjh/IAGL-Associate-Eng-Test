import React from "react";

export default function TodoItem({ todo, toggleCompleted }) {
  const { id, title, content, dueDate, completed, dateCompleted } = todo;

  return (
    <li className={`todo-item ${completed ? "completed" : ""}`}>
      {/* Header: title + checkbox */}
      <div className="todo-item__header">
        <span className="todo-item__title">{title}</span>
        <input
          type="checkbox"
          checked={completed}
          onChange={() => toggleCompleted(id)}
        />
      </div>

      {/* Content Section */}
      {content && <div className="todo-item__content">{content}</div>}

      {/* Footer Section: due and completed dates */}
      <div className="todo-item__footer">
        {dueDate && <div>Due: {dueDate}</div>}
        {dateCompleted && <div>Completed: {dateCompleted}</div>}
      </div>
    </li>
  );
}
