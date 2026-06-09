import { isBefore, isAfter, addHours } from "date-fns";

export function getOverdueTasks(tasks) {
  const now = new Date();

  return tasks.filter(task => {
    if (!task.deadline || task.done) return false;

    return isBefore(new Date(task.deadline), now);
  });
}

export function getUpcomingTasks(tasks, hours = 24) {
  const now = new Date();
  const limit = addHours(now, hours);

  return tasks.filter(task => {
    if (!task.deadline || task.done) return false;

    const deadline = new Date(task.deadline);

    return isAfter(deadline, now) && isBefore(deadline, limit);
  });
}

export function getReminders(tasks) {
  return {
    overdue: getOverdueTasks(tasks),
    upcoming: getUpcomingTasks(tasks, 24),
  };
}

export function getPendingReminders(tasks) {
  const now = new Date();

  return tasks.filter(task => {
    if (!task.deadline || task.done) return false;
    if (task.reminded) return false;

    return new Date(task.deadline) <= now;
  });
}