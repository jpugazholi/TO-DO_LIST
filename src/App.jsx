import { useEffect, useMemo, useState } from "react";
import "./App.css";

const defaultCategories = ["All", "Work", "Personal", "Study", "Shopping"];

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("premium-todo-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskText, setTaskText] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [filter, setFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("premium-todo-theme") === "dark";
  });

  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    localStorage.setItem("premium-todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "premium-todo-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  const addTask = () => {
    if (!taskText.trim()) return;

    const newTask = {
      id: Date.now(),
      text: taskText.trim(),
      category,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    setTaskText("");
    setDueDate("");
    setPriority("Medium");
    setCategory("Personal");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    if (!editText.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, text: editText.trim() }
          : task
      )
    );

    setEditingId(null);
    setEditText("");
  };

  const clearCompleted = () => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  };

  const deleteAll = () => {
    if (tasks.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete all tasks?"
    );

    if (confirmed) {
      setTasks([]);
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100);

  const today = new Date().toISOString().split("T")[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = task.text
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus =
        filter === "All" ||
        (filter === "Active" && !task.completed) ||
        (filter === "Completed" && task.completed);

      const matchesCategory =
        categoryFilter === "All" ||
        task.category === categoryFilter;

      const matchesCompletedVisibility =
        showCompleted || !task.completed;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesCompletedVisibility
      );
    });
  }, [
    tasks,
    search,
    filter,
    categoryFilter,
    showCompleted,
  ]);

  const getPriorityClass = (priority) => {
    return priority.toLowerCase();
  };

  const getDueStatus = (date, completed) => {
    if (!date || completed) return "";

    if (date < today) return "overdue";
    if (date === today) return "today";

    return "";
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>

      <div className="background-shape shape-one"></div>
      <div className="background-shape shape-two"></div>

      <main className="container">

        {/* HEADER */}

        <header className="top-header">
          <div className="brand">
            <div className="brand-icon">✓</div>

            <div>
              <p>PERSONAL PRODUCTIVITY</p>
              <h1>TaskFlow</h1>
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </header>

        {/* WELCOME */}

        <section className="welcome">
          <div>
            <span className="hello">Good to see you 👋</span>
            <h2>Let's get things done.</h2>
            <p>
              Organize your day, focus on what matters,
              and stay productive.
            </p>
          </div>

          <div className="progress-card">
            <div className="progress-info">
              <span>Daily Progress</span>
              <strong>{progress}%</strong>
            </div>

            <div className="progress-bar">
              <div
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <small>
              {completedCount} of {tasks.length} tasks completed
            </small>
          </div>
        </section>

        {/* STATS */}

        <section className="stats">

          <div className="stat">
            <div className="stat-icon purple">📋</div>
            <div>
              <span>Total Tasks</span>
              <strong>{tasks.length}</strong>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon orange">⚡</div>
            <div>
              <span>Active</span>
              <strong>{activeCount}</strong>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>

          <div className="stat">
            <div className="stat-icon blue">🎯</div>
            <div>
              <span>Progress</span>
              <strong>{progress}%</strong>
            </div>
          </div>

        </section>

        {/* ADD TASK */}

        <section className="add-card">

          <div className="section-title">
            <div>
              <h3>Create a new task</h3>
              <p>Add something you want to accomplish.</p>
            </div>
          </div>

          <div className="add-form">

            <div className="input-wrapper">
              <span>✏️</span>

              <input
                type="text"
                placeholder="What do you need to do?"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTask();
                }}
              />
            </div>

            <div className="form-row">

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
              >
                <option>Work</option>
                <option>Personal</option>
                <option>Study</option>
                <option>Shopping</option>
              </select>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <input
                type="date"
                value={dueDate}
                min={today}
                onChange={(e) =>
                  setDueDate(e.target.value)
                }
              />

              <button
                className="add-button"
                onClick={addTask}
              >
                + Add Task
              </button>

            </div>
          </div>
        </section>

        {/* TASK TOOLBAR */}

        <section className="task-section">

          <div className="task-heading">

            <div>
              <h3>Your Tasks</h3>
              <span>
                {filteredTasks.length} tasks shown
              </span>
            </div>

            <div className="task-actions">
              <button onClick={clearCompleted}>
                Clear completed
              </button>

              <button
                className="danger-text"
                onClick={deleteAll}
              >
                Delete all
              </button>
            </div>

          </div>

          {/* SEARCH */}

          <div className="search">
            <span>🔍</span>

            <input
              placeholder="Search your tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>

          {/* FILTERS */}

          <div className="filters">

            <div className="filter-buttons">

              {["All", "Active", "Completed"].map(
                (item) => (
                  <button
                    key={item}
                    className={
                      filter === item
                        ? "filter-active"
                        : ""
                    }
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                )
              )}

            </div>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >
              {defaultCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <button
              className={
                showCompleted
                  ? "show-completed active-show"
                  : "show-completed"
              }
              onClick={() =>
                setShowCompleted(!showCompleted)
              }
            >
              {showCompleted
                ? "✓ Showing completed"
                : "○ Hide completed"}
            </button>

          </div>

          {/* TASK LIST */}

          <div className="task-list">

            {filteredTasks.length === 0 ? (
              <div className="empty-state">

                <div className="empty-icon">✨</div>

                <h3>No tasks found</h3>

                <p>
                  {tasks.length === 0
                    ? "Start by adding your first task."
                    : "Try changing your filters or search."}
                </p>

                {search && (
                  <button
                    onClick={() => setSearch("")}
                  >
                    Clear search
                  </button>
                )}

              </div>
            ) : (
              filteredTasks.map((task) => {

                const dueStatus = getDueStatus(
                  task.dueDate,
                  task.completed
                );

                return (
                  <article
                    className={
                      task.completed
                        ? "task-card completed-card"
                        : "task-card"
                    }
                    key={task.id}
                  >

                    <button
                      className={
                        task.completed
                          ? "check checked"
                          : "check"
                      }
                      onClick={() =>
                        toggleTask(task.id)
                      }
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="task-content">

                      {editingId === task.id ? (
                        <div className="edit-row">

                          <input
                            autoFocus
                            value={editText}
                            onChange={(e) =>
                              setEditText(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                saveEdit(task.id);
                              }

                              if (e.key === "Escape") {
                                setEditingId(null);
                              }
                            }}
                          />

                          <button
                            className="save-edit"
                            onClick={() =>
                              saveEdit(task.id)
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingId(null)
                            }
                          >
                            Cancel
                          </button>

                        </div>
                      ) : (
                        <>
                          <h4
                            className={
                              task.completed
                                ? "done"
                                : ""
                            }
                          >
                            {task.text}
                          </h4>

                          <div className="task-meta">

                            <span
                              className={`category ${task.category.toLowerCase()}`}
                            >
                              {task.category}
                            </span>

                            <span
                              className={`priority ${getPriorityClass(
                                task.priority
                              )}`}
                            >
                              {task.priority === "High"
                                ? "🔴"
                                : task.priority === "Medium"
                                ? "🟡"
                                : "🟢"}{" "}
                              {task.priority}
                            </span>

                            {task.dueDate && (
                              <span
                                className={`due ${dueStatus}`}
                              >
                                📅{" "}
                                {task.dueDate}

                                {dueStatus ===
                                  "overdue" &&
                                  " • Overdue"}

                                {dueStatus ===
                                  "today" &&
                                  " • Today"}
                              </span>
                            )}

                          </div>
                        </>
                      )}

                    </div>

                    {editingId !== task.id && (
                      <div className="task-buttons">

                        <button
                          title="Edit"
                          onClick={() =>
                            startEdit(task)
                          }
                        >
                          ✏️
                        </button>

                        <button
                          title="Delete"
                          className="delete"
                          onClick={() =>
                            deleteTask(task.id)
                          }
                        >
                          🗑️
                        </button>

                      </div>
                    )}

                  </article>
                );
              })
            )}

          </div>

        </section>

        {/* FOOTER */}

        <footer>
          <span>TaskFlow</span>
          <span>•</span>
          <span>Your tasks are saved automatically 💾</span>
        </footer>

      </main>
    </div>
  );
}

export default App;
