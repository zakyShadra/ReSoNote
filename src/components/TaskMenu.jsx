function TaskMenu({
    task,
    onEdit,
    onDeadline,
    onDelete,
    }) {
    return (
        <div className="task-menu">
        <button
            onClick={() => onEdit(task)}
        >
            ✏ Edit Task
        </button>

        <button
            onClick={() => onDeadline(task)}
        >
            📅 Atur Deadline
        </button>

        <button
            onClick={() => onDelete(task.id)}
        >
            🗑 Hapus Task
        </button>
        </div>
    );
}

export default TaskMenu;