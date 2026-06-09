import { useState, useEffect } from "react";
import { startReminderRunner } from "../utils/reminderRunner";
import { notify } from "../adapters/webNotifier";
import TaskCard from "../components/TaskCard";
import TaskDetail from "../components/TaskDetail";
import DeadlineModal from "../components/DeadlineModal";
import "../style/todo.css";

function Todo() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("resonote-tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [taskTitle, setTaskTitle] = useState("");
  const [taskIcon, setTaskIcon] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [deadlineModalOpen, setDeadlineModalOpen] = useState(false);
  const [deadlineValue, setDeadlineValue] = useState("");
  const [taskForDeadline, setTaskForDeadline] = useState(null);

  useEffect(() => {
    localStorage.setItem("resonote-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    const interval = startReminderRunner(
      () => JSON.parse(localStorage.getItem("resonote-tasks")) || [],
      notify,
      setTasks
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedTask) return;
    const stillExist = tasks.find((t) => t.id === selectedTask.id);
    if (!stillExist) setSelectedTask(null);
  }, [tasks, selectedTask]);

  const addTask = () => {
    if (!taskTitle.trim()) return;
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      icon: taskIcon,
      done: false,
      deadline: null,
      subtasks: [],
      reminded: false,
    };
    setTasks([...tasks, newTask]);
    setTaskTitle("");
    setTaskIcon("");
  };

  const toggleTask = (taskId) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, done: !t.done } : t
    );
    setTasks(updated);
    if (selectedTask?.id === taskId)
      setSelectedTask(updated.find((t) => t.id === taskId));
  };

  const deleteTask = (taskId) => {
    if (!confirm("Hapus task ini?")) return;
    setTasks(tasks.filter((t) => t.id !== taskId));
    if (selectedTask?.id === taskId) setSelectedTask(null);
  };

  const editTask = (task) => {
    const newTitle = prompt("Edit task:", task.title);
    if (!newTitle) return;
    const updated = tasks.map((t) =>
      t.id === task.id ? { ...t, title: newTitle } : t
    );
    setTasks(updated);
    if (selectedTask?.id === task.id)
      setSelectedTask(updated.find((t) => t.id === task.id));
  };

  const setDeadline = (task) => {
    setTaskForDeadline(task);
    setDeadlineValue(task.deadline || "");
    setDeadlineModalOpen(true);
  };

  // ✅ FIX: terima finalDeadline dari modal sebagai parameter
  const saveDeadline = (finalDeadline) => {
    if (!taskForDeadline) return;
    const updated = tasks.map((t) =>
      t.id === taskForDeadline.id
        ? { ...t, deadline: finalDeadline, reminded: false }
        : t
    );
    setTasks(updated);
    if (selectedTask?.id === taskForDeadline.id)
      setSelectedTask(updated.find((t) => t.id === taskForDeadline.id));
    setDeadlineModalOpen(false);
    setTaskForDeadline(null);
    setDeadlineValue("");
  };

  const getProgress = (task) => {
    if (task.subtasks.length === 0) return task.done ? 100 : 0;
    return Math.round(
      (task.subtasks.filter((s) => s.done).length / task.subtasks.length) * 100
    );
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (filter === "done") return task.done;
    if (filter === "undone") return !task.done;
    return true;
  });

  return (
    <div className="todo-container">
      <h1>✅ Todo</h1>

      <input
        type="text"
        placeholder="🔍 Cari task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <div className="filter-buttons">
        {[
          { key: "all", label: "Semua" },
          { key: "undone", label: "Belum Selesai" },
          { key: "done", label: "Selesai" },
        ].map(({ key, label }) => (
          <button
            key={key}
            className={filter === key ? "active" : ""}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="add-task-row">
        <input
          type="text"
          placeholder="Nama Task..."
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select value={taskIcon} onChange={(e) => setTaskIcon(e.target.value)}>
          <option value="">Tanpa Icon</option>
          <option value="📚">📚 Belajar</option>
          <option value="💼">💼 Kerja</option>
          <option value="🏋">🏋 Olahraga</option>
          <option value="🎮">🎮 Hiburan</option>
          <option value="📝">📝 Catatan</option>
          <option value="💰">💰 Keuangan</option>
          <option value="🎯">🎯 Target</option>
          <option value="🏠">🏠 Pribadi</option>
        </select>
        <button onClick={addTask} className="btn-add">+ Tambah</button>
      </div>

      <DeadlineModal
        isOpen={deadlineModalOpen}
        deadline={deadlineValue}
        onSave={saveDeadline}
        onClose={() => {
          setDeadlineModalOpen(false);
          setTaskForDeadline(null);
        }}
      />

      <TaskDetail
        selectedTask={selectedTask}
        tasks={tasks}
        setTasks={setTasks}
        setSelectedTask={setSelectedTask}
      />

      {filteredTasks.length === 0 && (
        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "40px" }}>
          {tasks.length === 0 ? "Belum ada task. Tambah sekarang!" : "Tidak ada task yang cocok."}
        </p>
      )}

      {filteredTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          selectedTask={selectedTask}
          setSelectedTask={setSelectedTask}
          toggleTask={toggleTask}
          getProgress={getProgress}
          deleteTask={deleteTask}
          editTask={editTask}
          setDeadline={setDeadline}
        />
      ))}
    </div>
  );
}

export default Todo;
