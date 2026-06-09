import { getReminders } from "./reminderEngine";

export function startReminderRunner(getTasks, notify, setTasks) {
  const interval = setInterval(() => {
    const tasks = getTasks();
    if (!tasks || tasks.length === 0) return;

    const now = new Date();
    let hasChanges = false;

    const updated = tasks.map((task) => {
      if (
        task.deadline &&
        !task.done &&
        !task.reminded &&
        new Date(task.deadline) <= now
      ) {
        notify("⏰ Deadline ReSoNote", `"${task.title}" sudah lewat deadline!`);
        hasChanges = true;
        return { ...task, reminded: true };
      }
      return task;
    });

    // ✅ FIX: hanya update state kalau ada perubahan, cegah re-render terus
    if (hasChanges) {
      setTasks(updated);
    }
  }, 10000); // cek tiap 10 detik

  return interval;
}
