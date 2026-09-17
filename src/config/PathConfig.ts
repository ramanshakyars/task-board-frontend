const PathConfig = {
  login: "/api/auth/login/",
  logout: "/api/auth/logout/",
  me: "/api/auth/me/",
  tasks: "/api/tasks/",
  taskDetail: (id: number) => `/api/tasks/${id}/`,
  taskReorder: "/api/tasks/reorder/",
  taskExportExcel: "/api/tasks/export/excel/",
  taskExportPdf: "/api/tasks/export/pdf/",
  comments: (taskId: number) => `/api/comments/tasks/${taskId}/comments/`,
  commentDetail: (taskId: number, commentId: number) =>
    `/api/comments/tasks/${taskId}/comments/${commentId}/`,
};

export default PathConfig;