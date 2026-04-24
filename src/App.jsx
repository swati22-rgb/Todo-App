import { useState, useEffect } from "react";
import "./App.css";
import Auth from "./Auth";

function App() {
  const [user, setUser] = useState(localStorage.getItem("userEmail"));
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("low");
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");

  // ✅ LOAD TASKS
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(saved);
  }, []);

  // ✅ SAVE TASKS
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // ✅ LOGIN CHECK (AFTER HOOKS)
  if (!user) return <Auth setUser={setUser} />;

  // 🚀 ADD TASK (INSTANT UI)
  const addTask = () => {
    const newTask = {
      text: text || "No Task",
      deadline: deadline || "",
      time: time || "",
      email: user,
      priority,
      completed: false,
      sent: false,
    };

    if (editIndex !== null) {
      let updated = [...tasks];
      updated[editIndex] = newTask;
      setTasks(updated);
      setEditIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    // backend call (no delay UI)
    fetch("http://localhost:5000/add-task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    }).catch((err) => console.log(err));

    // reset
    setText("");
    setDeadline("");
    setTime("");
    setPriority("low");
  };

  // ❌ DELETE ONE
  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // 🗑 DELETE ALL
  const deleteAll = () => {
    setTasks([]);
  };

  // ✏️ EDIT
  const editTask = (index) => {
    const t = tasks[index];
    setText(t.text === "No Task" ? "" : t.text);
    setDeadline(t.deadline);
    setTime(t.time);
    setPriority(t.priority);
    setEditIndex(index);
  };

  // ✔ COMPLETE
  const toggleTask = (index) => {
    let updated = [...tasks];
    updated[index].completed = !updated[index].completed;
    setTasks(updated);
  };

  // 🔍 FILTER
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="app-bg">
      <div className="container">

        {/* HEADER */}
        <div className="header">
          <h2>Hello 👋</h2>
          <h1>{user}</h1>
        </div>

        {/* INPUT */}
        <input
          type="text"
          placeholder="Enter task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="row">
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <button className="add-btn" onClick={addTask}>
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>

        {/* FILTER */}
        <div className="filter-buttons">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        {/* TASK LIST */}
        <div className="task-container">
          <h3>Today's Tasks</h3>

          {filteredTasks.length === 0 && (
            <p className="empty">No tasks yet 🚀</p>
          )}

          {filteredTasks.map((task, index) => (
            <div
              key={index}
              className={`task ${task.completed ? "completed" : ""}`}
            >
              <div>
                <p>{task.text}</p>
                <small>
                  📅 {task.deadline || "No Date"} ⏰ {task.time || "No Time"}
                </small>
              </div>

              <div className="actions">
                <button onClick={() => toggleTask(index)}>✔</button>
                <button onClick={() => editTask(index)}>✏️</button>
                <button onClick={() => deleteTask(index)}>❌</button>
              </div>
            </div>
          ))}
        </div>

        {/* DELETE ALL */}
        <button className="delete-all" onClick={deleteAll}>
          🗑️ Delete All Tasks
        </button>

        {/* LOGOUT */}
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("userEmail");
            setUser(null); // ✅ NO REFRESH
          }}
        >
          Logout
        </button>

      </div>
    </div>
  );
}

export default App;
