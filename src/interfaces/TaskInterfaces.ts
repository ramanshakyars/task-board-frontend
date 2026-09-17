import type { TaskPriority } from "../enums/TaskPriority";
import type { TaskStatus } from "../enums/TaskStatus";
import type { User } from "./AuthInterfaces";

export interface Task {
  id: number;
  name: string;
  code: string;
  priority: TaskPriority;
  status: TaskStatus;
  description: string;
  due_date: string | null;
  image: string | null;
  image_url: string | null;
  order: number;
  created_by: User;
  created_at: string;
  updated_at: string;
}

// Paginated list response from Django
export interface PaginatedTasks {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export interface CreateTaskData {
  name: string;
  code: string;
  priority: TaskPriority;
  status: TaskStatus;
  description?: string;
  due_date?: string | null;
}

export interface TaskFilters {
  status?: TaskStatus | "";
  priority?: TaskPriority | "";
  search?: string;
  due_date_from?: string;
  due_date_to?: string;
  ordering?: string;
  page?: number;
}

export interface Comment {
  id: number;
  task: number;
  user: User;
  content: string;
  created_at: string;
  updated_at: string;
}