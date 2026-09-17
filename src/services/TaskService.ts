import PathConfig from "../config/PathConfig";
import type { TaskStatus } from "../enums/TaskStatus";
import type {
  Comment,
  CreateTaskData,
  PaginatedTasks,
  Task,
  TaskFilters,
} from "../interfaces/TaskInterfaces";
import HttpService from "./HttpService";

class TaskService {

  async getTasks(filters?: TaskFilters): Promise<PaginatedTasks> {
    const params: Record<string, unknown> = {};

    if (filters?.status) params.status = filters.status;
    if (filters?.priority) params.priority = filters.priority;
    if (filters?.search) params.search = filters.search;
    if (filters?.due_date_from) params.due_date_from = filters.due_date_from;
    if (filters?.due_date_to) params.due_date_to = filters.due_date_to;
    if (filters?.ordering) params.ordering = filters.ordering;
    if (filters?.page) params.page = filters.page;

    return HttpService.get<PaginatedTasks>(PathConfig.tasks, params);
  }

  async getTask(id: number): Promise<Task> {
    return HttpService.get<Task>(PathConfig.taskDetail(id));
  }

  async createTask(data: CreateTaskData | FormData): Promise<Task> {
    if (data instanceof FormData) {
      return HttpService.post<Task>(PathConfig.tasks, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return HttpService.post<Task>(PathConfig.tasks, data);
  }

  async updateTask(id: number, data: Partial<CreateTaskData> | FormData): Promise<Task> {
    if (data instanceof FormData) {
      return HttpService.put<Task>(PathConfig.taskDetail(id), data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return HttpService.put<Task>(PathConfig.taskDetail(id), data);
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    return HttpService.patch<Task>(PathConfig.taskDetail(id), { status });
  }

  async deleteTask(id: number): Promise<void> {
    return HttpService.delete<void>(PathConfig.taskDetail(id));
  }

  async reorderTasks(orderedIds: number[]): Promise<void> {
    return HttpService.post<void>(PathConfig.taskReorder, { ordered_ids: orderedIds });
  }

  async exportExcel(): Promise<void> {
    const blob = await HttpService.getBlob(PathConfig.taskExportExcel);
    triggerDownload(blob, "tasks.xlsx");
  }

  async exportPdf(): Promise<void> {
    const blob = await HttpService.getBlob(PathConfig.taskExportPdf);
    triggerDownload(blob, "tasks.pdf");
  }

  async getComments(taskId: number): Promise<Comment[]> {
    return HttpService.get<Comment[]>(PathConfig.comments(taskId));
  }

  async addComment(taskId: number, content: string): Promise<Comment> {
    return HttpService.post<Comment>(PathConfig.comments(taskId), { content });
  }

  async deleteComment(taskId: number, commentId: number): Promise<void> {
    return HttpService.delete<void>(PathConfig.commentDetail(taskId, commentId));
  }
}


function triggerDownload(blob: Blob, filename: string): void {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export default new TaskService();
