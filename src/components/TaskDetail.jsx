import { useState } from "react";
import AddSubtaskModal from "./AddSubtaskModal";

function TaskDetail({
    selectedTask,
    tasks,
    setTasks,
    setSelectedTask,
    }) {
    const [subtaskModalOpen, setSubtaskModalOpen] = useState(false);

    if (!selectedTask) return null;

    const addSubtask = (subtaskText) => {
        const updatedTasks =
        tasks.map((task) =>
            task.id === selectedTask.id
            ? {
                ...task,
                subtasks: [
                    ...task.subtasks,
                    {
                    id: Date.now(),
                    text: subtaskText,
                    done: false,
                    },
                ],
                }
            : task
        );

        setTasks(updatedTasks);

        const updatedTask =
        updatedTasks.find(
            (task) =>
            task.id === selectedTask.id
        );

        setSelectedTask(updatedTask);
        setSubtaskModalOpen(false);
    };

    const toggleSubtask = (
        subtaskId
    ) => {
        const updatedTasks =
        tasks.map((task) =>
            task.id === selectedTask.id
            ? {
                ...task,
                subtasks:
                    task.subtasks.map(
                    (subtask) =>
                        subtask.id ===
                        subtaskId
                        ? {
                            ...subtask,
                            done:
                                !subtask.done,
                            }
                        : subtask
                    ),
                }
            : task
        );

        setTasks(updatedTasks);

        const updatedTask =
        updatedTasks.find(
            (task) =>
            task.id === selectedTask.id
        );

        setSelectedTask(updatedTask);
    };

    const deleteSubtask = (
        subtaskId
    ) => {
        if (
        !confirm(
            "Hapus subtask ini?"
        )
        )
        return;

        const updatedTasks =
        tasks.map((task) =>
            task.id === selectedTask.id
            ? {
                ...task,
                subtasks:
                    task.subtasks.filter(
                    (subtask) =>
                        subtask.id !==
                        subtaskId
                    ),
                }
            : task
        );

        setTasks(updatedTasks);

        const updatedTask =
        updatedTasks.find(
            (task) =>
            task.id === selectedTask.id
        );

        setSelectedTask(updatedTask);
    };

    return (
        <div className="task-detail">
        <div className="task-detail-header">
            <div>
            <span className="task-detail-eyebrow">Task aktif</span>
            <h2>
                {selectedTask.icon}{" "}
                {selectedTask.title}
            </h2>
            </div>

            <button
            className="add-subtask-btn"
            onClick={() => setSubtaskModalOpen(true)}
            >
            <span className="add-subtask-icon">+</span>
            <span>Subtask</span>
            </button>
        </div>

        {selectedTask.subtasks
            .length === 0 && (
            <p className="subtask-empty">
            Belum ada subtask.
            </p>
        )}

        {selectedTask.subtasks.map(
            (subtask) => (
            <div
                key={subtask.id}
                className="subtask-row"
            >
                <div
                className="subtask-left"
                >
                <input
                    type="checkbox"
                    checked={
                    subtask.done
                    }
                    onChange={() =>
                    toggleSubtask(
                        subtask.id
                    )
                    }
                />

                <span
                    style={{
                    textDecoration:
                        subtask.done
                        ? "line-through"
                        : "none",
                    }}
                >
                    {subtask.text}
                </span>
                </div>

                <button
                className="subtask-delete"
                onClick={() =>
                    deleteSubtask(
                    subtask.id
                    )
                }
                >
                🗑
                </button>
            </div>
            )
        )}

        <AddSubtaskModal
            isOpen={subtaskModalOpen}
            onClose={() => setSubtaskModalOpen(false)}
            onAdd={addSubtask}
        />
        </div>
    );
    }

export default TaskDetail;
