import TaskMenu from "./TaskMenu";
import { useState } from "react";

function TaskCard({
  task,
  setSelectedTask,
  toggleTask,
  getProgress,
  deleteTask,
  editTask,
  setDeadline,
  onAddSubtask
}) {
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return "none";

    const now = new Date();
    const time = new Date(deadline);
    const diff = time - now;
    const hours = diff / (1000 * 60 * 60);

    if (hours < 0) return "overdue";
    if (hours <= 24) return "soon";
    return "safe";
  };

  const status = getDeadlineStatus(task.deadline);

  return (
    <div className="task-card" onClick={() => setSelectedTask(task)}>
      <div className="task-header">
        <div className="task-title">
          <input
            type="checkbox"
            checked={task.done}
            onChange={(e) => {
              e.stopPropagation();
              toggleTask(task.id);
            }}
          />
          <h3
            style={{
              textDecoration: task.done ? "line-through" : "none",
            }}
          >
            {task.icon} {task.title}
          </h3>
        </div>

        <button
          className="menu-button"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
        >
          ⋮
        </button>
      </div>

      {/* Menampilkan teks deadline (format tanggal buatanmu) kalau ada */}
      {task.deadline && (
        <div className="task-deadline-text">
          {formatDate(task.deadline)}
        </div>
      )}

      {task.subtasks.length > 0 && (
        <div className="progress-wrap">
          <div className="progress-label">
            <span>Progres Subtask</span>
            <span>{getProgress(task)}%</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${getProgress(task)}%`,
              }}
            />
          </div>
        </div>
      )}

      <button
        className="add-subtask-card-btn"
        onClick={(e) => {
          e.stopPropagation();
          onAddSubtask(task);
        }}
      >
        ➕ Subtask
      </button>

      <p>
        {task.subtasks.length > 0
          ? `${task.subtasks.filter((s) => s.done).length}/${task.subtasks.length} selesai`
          : task.done
          ? "Selesai"
          : "Belum selesai"}
      </p>

      {task.deadline && (
        <div className={`deadline ${status}`}>
          ⏰ {new Date(task.deadline).toLocaleString()}
        </div>
      )}

      {showMenu && (
        <TaskMenu
          task={task}
          onEdit={editTask}
          onDeadline={setDeadline}
          onDelete={deleteTask}
        />
      )}
    </div>
  );
}

export default TaskCard;