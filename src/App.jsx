import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);

  // Load from local storage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add or update task
  const addTask = () => {
    if (text === "") return;

    if (editIndex !== null) {
      let updated = [...tasks];
      updated[editIndex].text = text;
      updated[editIndex].deadline = deadline;
      updated[editIndex].priority = priority;
      setTasks(updated);
      setEditIndex(null);
    } else {
      const newTask = {
        text,
        deadline,
        priority,
        completed: false,
      };
      setTasks([...tasks, newTask]);
    }

    setText("");
    setDeadline("");
    setPriority("low");
  };

  // Toggle complete
  const toggleTask = (index) => {
    let updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // Delete single task
  const deleteTask = (index) => {
    let updated = tasks.filter((_, i) => i !== index);
    setTasks(updated);
  };

  // Delete all tasks
  const deleteAllTasks = () => {
    if (tasks.length === 0) return;

    const confirmDelete = window.confirm("Delete all tasks?");
    if (confirmDelete) {
      setTasks([]);
    }
  };

  // Edit task
  const editTask = (index) => {
    setText(tasks[index].text);
    setDeadline(tasks[index].deadline);
    setPriority(tasks[index].priority);
    setEditIndex(index);
  };

  const today = new Date().toISOString().split("T")[0];

  // Progress
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className="container">
      <h1>📋 Smart Task Manager</h1>

      {/* INPUTS */}
      <input
        type="text"
        placeholder="Enter task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* ADD / UPDATE BUTTON */}
      <button onClick={addTask}>
        {editIndex !== null ? "Update Task" : "Add Task"}
      </button>

      {/* FILTER BUTTONS */}
      <div className="filter-buttons">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={() => setFilter("pending")}>Pending</button>
      </div>

      {/* DELETE ALL BUTTON */}
      <button className="delete-all" onClick={deleteAllTasks}>
        🗑️ Delete All
      </button>

      {/* TASK LIST */}
      <div className="task-list">
        {tasks
          .filter(task => {
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
            return true;
          })
          .map((task, index) => {
            let overdue =
              task.deadline &&
              task.deadline < today &&
              !task.completed;

            return (
              <div
                key={index}
                className={`task ${task.priority} ${
                  task.completed ? "completed" : ""
                } ${overdue ? "overdue" : ""}`}
              >
                <div>
                  <p>📝 {task.text}</p>
                  <small>📅 {task.deadline || "No deadline"}</small>
                </div>

                <div>
                  <button onClick={() => toggleTask(index)}>✔</button>
                  <button onClick={() => editTask(index)}>✏️</button>
                  <button onClick={() => deleteTask(index)}>❌</button>
                </div>
              </div>
            );
          })}
      </div>

      {/* PROGRESS */}
      <div className="progress-bar">
        <div style={{ width: `${progress}%` }}></div>
      </div>

      <p>
        Completed: {completedCount} / {tasks.length}
      </p>
    </div>
  );
}

export default App;
