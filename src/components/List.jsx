export default function List({ todos, setTodos, setEditIndex, filter }) {
  const filteredTodos =
    filter === "completed"
      ? todos.filter((t) => t.completed)
      : filter === "incomplete"
      ? todos.filter((t) => !t.completed)
      : todos;

  function toggleComplete(index) {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  }

  function deleteTodo(index) {
    const updated = todos.filter((_, i) => i !== index);
    setTodos(updated);
  }

  return (
    <ul className="list">
      {filteredTodos.length === 0 ? (
        <p className="empty">No tasks found</p>
      ) : (
        filteredTodos.map((todo, index) => (
          <li
            key={index}
            className={todo.completed ? "completed" : ""}
          >
            <span>{todo.text}</span>

            <div className="actions">
              <button onClick={() => toggleComplete(index)}>✔</button>
              <button onClick={() => setEditIndex(index)}>✏</button>
              <button onClick={() => deleteTodo(index)}>🗑</button>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
