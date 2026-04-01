import { useState } from "react";
import Input from "./components/Input";
import List from "./components/List";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [filter, setFilter] = useState("all");

  return (
    <div className="app">
      <div className="container">
        <h1>✨ My To-Do App</h1>

        {/* Filter Buttons */}
        <div className="filters">
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            All
          </button>

          <button
            className={filter === "completed" ? "active" : ""}
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>

          <button
            className={filter === "incomplete" ? "active" : ""}
            onClick={() => setFilter("incomplete")}
          >
            Incomplete
          </button>
        </div>

        <Input
          todos={todos}
          setTodos={setTodos}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
        />

        <List
          todos={todos}
          setTodos={setTodos}
          setEditIndex={setEditIndex}
          filter={filter}
        />
      </div>
    </div>
  );
}
