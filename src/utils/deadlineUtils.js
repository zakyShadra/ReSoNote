// Helper function untuk mendapatkan status deadline dan warna
export const getDeadlineStatus = (deadline) => {
  if (!deadline) return { status: "none", color: "var(--text3)", label: "-" };
  
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diff = deadlineDate - now;
  const hours = diff / (1000 * 60 * 60);

  if (hours < 0) {
    return {
      status: "overdue",
      color: "#ef4444",
      bgColor: "rgba(239,68,68,0.12)",
      label: "Kelewat",
    };
  }

  if (hours <= 24) {
    return {
      status: "soon",
      color: "#f59e0b",
      bgColor: "rgba(245,158,11,0.12)",
      label: "24 Jam",
    };
  }

  return {
    status: "safe",
    color: "#22c55e",
    bgColor: "rgba(34,197,74,0.12)",
    label: "Aman",
  };
};

export const getDeadlineColor = (deadline) => {
  const status = getDeadlineStatus(deadline);
  return status.color;
};

export const getDeadlineBgColor = (deadline) => {
  const status = getDeadlineStatus(deadline);
  return status.bgColor;
};
