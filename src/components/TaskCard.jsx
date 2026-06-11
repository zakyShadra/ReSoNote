import { useState } from "react";
import TaskMenu from "./TaskMenu";

function TaskCard({
  task,
  setSelectedTask,
  toggleTask,
  getProgress,
  deleteTask,
  editTask,
  setDeadline,
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
    <div
      className={`task-card ${task.done ? "task-done" : ""}`}
      onClick={() => setSelectedTask(task)}
    >
      <div className="task-card-body">
        <div className="task-header">
          <div className="task-title">
            <input
              className="task-checkbox"
              type="checkbox"
              checked={task.done}
              onChange={(e) => {
                e.stopPropagation();
                toggleTask(task.id);
              }}
            />
            <h3 style={{ textDecoration: task.done ? "line-through" : "none" }}>
              {task.icon} {task.title}
            </h3>
          </div>
        </div>

        {task.deadline && (
          <div className="task-deadline-text">{formatDate(task.deadline)}</div>
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
                style={{ width: `${getProgress(task)}%` }}
              />
            </div>
          </div>
        )}

        <p className="task-status-text">
          {task.subtasks.length > 0
            ? `${task.subtasks.filter((s) => s.done).length}/${task.subtasks.length} selesai`
            : task.done
              ? "Selesai"
              : "Belum selesai"}
        </p>

        {task.deadline && (
          <div className={`deadline ${status}`}>
            Jam {new Date(task.deadline).toLocaleString()}
          </div>
        )}
      </div>

      <div className="task-card-actions" onClick={(e) => e.stopPropagation()}>
        <button
          className="task-menu-btn"
          onClick={() => setShowMenu(!showMenu)}
          title="Menu task"
        >
          ⋮
        </button>
        {showMenu && (
          <TaskMenu
            task={task}
            onEdit={editTask}
            onDeadline={setDeadline}
            onDelete={deleteTask}
          />
        )}
      </div>
    </div>
  );
}

export default TaskCard;
