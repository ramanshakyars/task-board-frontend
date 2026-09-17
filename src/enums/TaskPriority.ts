// Backend values - must match exactly what Django expects
export const TaskPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TaskPriority = typeof TaskPriority[keyof typeof TaskPriority];

// User-friendly labels
export const TaskPriorityLabel: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};