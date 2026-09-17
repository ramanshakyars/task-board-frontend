import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import SpecialLoader from "../components/SpecialLoader";
import ConfirmDialog from "../components/ConfirmDialog";
import TaskService from "../services/TaskService";
import ToastService from "../services/ToastService";
import type { Task, TaskFilters } from "../interfaces/TaskInterfaces";
import { TaskStatus } from "../enums/TaskStatus";
import { TaskPriority } from "../enums/TaskPriority";
import { isAdmin } from "../utils/permissions";
import LoaderService from "../services/LoaderService";

function Dashboard() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const [filters, setFilters] = useState<TaskFilters>({
    status: "",
    priority: "",
    search: "",
  });

  const loadTasks = async (activeFilters?: TaskFilters) => {
    try {
      setLoading(true);
      const data = await TaskService.getTasks(activeFilters ?? filters);
      setTasks(data.results);
      setTotalCount(data.count);
    } catch {
      ToastService.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    loadTasks(updated);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...filters, search: e.target.value };
    setFilters(updated);
    // debounce not needed for assigment, just call directly
    loadTasks(updated);
  };

  const deleteTask = (id: number) => {
    setTaskToDelete(id);
  };

  const executeDeleteTask = async () => {
    if (taskToDelete === null) return;

    try {
      LoaderService.show();
      await TaskService.deleteTask(taskToDelete);
      setTasks(tasks.filter((t) => t.id !== taskToDelete));
      ToastService.success("Task deleted successfully");
    } catch {
      ToastService.error("Failed to delete task");
    } finally {
      LoaderService.hide();
      setTaskToDelete(null);
    }
  };

  const updateStatus = async (id: number, status: TaskStatus) => {
    try {
      await TaskService.updateTaskStatus(id, status);
      setTasks(tasks.map((t) => (t.id === id ? { ...t, status } : t)));
      ToastService.success("Status updated");
    } catch {
      ToastService.error("Failed to update status");
    }
  };

  const handleExportExcel = async () => {
    try {
      LoaderService.show();
      await TaskService.exportExcel();
    } catch {
      ToastService.error("Failed to export Excel");
    } finally {
      LoaderService.hide();
    }
  };

  const handleExportPdf = async () => {
    try {
      LoaderService.show();
      await TaskService.exportPdf();
    } catch {
      ToastService.error("Failed to export PDF");
    } finally {
      LoaderService.hide();
    }
  };

  const dragStart = (event: React.DragEvent, task: Task) => {
    event.dataTransfer.setData("taskId", task.id.toString());
  };

  const dropTask = async (event: React.DragEvent, status: TaskStatus) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("taskId");
    if (!taskId) return;
    await updateStatus(Number(taskId), status);
  };

  const allowDrop = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  return (
    <>
      <Navbar />

      <ConfirmDialog
        isOpen={taskToDelete !== null}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        onConfirm={executeDeleteTask}
        onCancel={() => setTaskToDelete(null)}
      />
      <div className="container-fluid p-4">

        {/* Heaeder */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-0">Task Board</h2>
            {totalCount > 0 && (
              <small className="text-muted">{totalCount} task(s) total</small>
            )}
          </div>

          <div className="d-flex gap-2">
            {isAdmin() && (
              <>
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={handleExportExcel}
                >
                  Export Excel
                </button>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleExportPdf}
                >
                  Export PDF
                </button>

                <Link to="/tasks/create" className="btn btn-primary btn-sm">
                  + Create Task
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Fliters */}
        <div className="row g-2 mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or code..."
              name="search"
              value={filters.search ?? ""}
              onChange={handleSearchChange}
            />
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              name="status"
              value={filters.status ?? ""}
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value={TaskStatus.PENDING}>Pending</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.COMPLETED}>Completed</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              name="priority"
              value={filters.priority ?? ""}
              onChange={handleFilterChange}
            >
              <option value="">All Priorities</option>
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>
          </div>

          <div className="col-md-2">
            <select
              className="form-select"
              name="ordering"
              value={filters.ordering ?? ""}
              onChange={handleFilterChange}
            >
              <option value="">Default Order</option>
              <option value="due_date">Due Date ↑</option>
              <option value="-due_date">Due Date ↓</option>
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
            </select>
          </div>

          <div className="col-md-2">
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                const cleared: TaskFilters = { status: "", priority: "", search: "" };
                setFilters(cleared);
                loadTasks(cleared);
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Local loder */}
        <SpecialLoader loading={loading} message="Loading tasks..." />

        {/* Kanban bord */}
        {!loading && (
          <div className="row">
            <TaskColumn
              title="Pending"
              status={TaskStatus.PENDING}
              tasks={getTasksByStatus(TaskStatus.PENDING)}
              onDelete={deleteTask}
              onStatusChange={updateStatus}
              onDragStart={dragStart}
              onDrop={dropTask}
              onDragOver={allowDrop}
            />

            <TaskColumn
              title="In Progress"
              status={TaskStatus.IN_PROGRESS}
              tasks={getTasksByStatus(TaskStatus.IN_PROGRESS)}
              onDelete={deleteTask}
              onStatusChange={updateStatus}
              onDragStart={dragStart}
              onDrop={dropTask}
              onDragOver={allowDrop}
            />

            <TaskColumn
              title="Completed"
              status={TaskStatus.COMPLETED}
              tasks={getTasksByStatus(TaskStatus.COMPLETED)}
              onDelete={deleteTask}
              onStatusChange={updateStatus}
              onDragStart={dragStart}
              onDrop={dropTask}
              onDragOver={allowDrop}
            />
          </div>
        )}

      </div>
    </>
  );
}

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDragStart: (event: React.DragEvent, task: Task) => void;
  onDrop: (event: React.DragEvent, status: TaskStatus) => void;
  onDragOver: (event: React.DragEvent) => void;
}

function TaskColumn({
  title,
  status,
  tasks,
  onDelete,
  onStatusChange,
  onDragStart,
  onDrop,
  onDragOver,
}: TaskColumnProps) {
  return (
    <div className="col-md-4">
      <div
        className="bg-light p-3 rounded"
        style={{ minHeight: "500px" }}
        onDrop={(e) => onDrop(e, status)}
        onDragOver={onDragOver}
      >
        <h4 className="mb-3">
          {title}
          <span className="badge bg-secondary ms-2">{tasks.length}</span>
        </h4>

        {tasks.length === 0 && (
          <p className="text-muted text-center mt-5">No tasks here</p>
        )}

        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;