import { useState, useEffect } from "react";

export default function Input({ todos, setTodos, editIndex, setEditIndex }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (editIndex !== -1) {
      setText(todos[editIndex].text);
    }
  }, [editIndex]);

  function handleSubmit() {
    if (!text.trim()) return;

    if (editIndex === -1) {
      setTodos([...todos, { text, completed: false }]);
    } else {
      const updated = [...todos];
      updated[editIndex].text = text;
      setTodos(updated);
      setEditIndex(-1);
    }

    setText("");
  }

  return (
    <div className="inputBox">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
      />
      <button onClick={handleSubmit}>
        {editIndex === -1 ? "Add" : "Update"}
      </button>
    </div>
  );
}
