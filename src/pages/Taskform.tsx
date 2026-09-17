import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import TaskService from "../services/TaskService";
import ToastService from "../services/ToastService";
import LoaderService from "../services/LoaderService";
import { TaskStatus, TaskStatusLabel } from "../enums/TaskStatus";
import { TaskPriority, TaskPriorityLabel } from "../enums/TaskPriority";

interface FormState {
  name: string;
  code: string;
  priority: string;
  status: string;
  description: string;
  due_date: string;
}

const emptyForm: FormState = {
  name: "",
  code: "",
  priority: TaskPriority.MEDIUM,
  status: TaskStatus.PENDING,
  description: "",
  due_date: "",
};

function TaskForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditMode && id) {
      loadTask(Number(id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadTask = async (taskId: number) => {
    try {
      setLoading(true);
      const task = await TaskService.getTask(taskId);
      setForm({
        name: task.name,
        code: task.code,
        priority: task.priority,
        status: task.status,
        description: task.description ?? "",
        due_date: task.due_date ?? "",
      });
      setExistingImageUrl(task.image_url);
    } catch {
      ToastService.error("Failed to load task");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // clear feild error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: [] });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImageFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      LoaderService.show();

      if (imageFile) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("code", form.code);
        formData.append("priority", form.priority);
        formData.append("status", form.status);
        formData.append("description", form.description);
        if (form.due_date) formData.append("due_date", form.due_date);
        formData.append("image", imageFile);

        if (isEditMode && id) {
          await TaskService.updateTask(Number(id), formData);
        } else {
          await TaskService.createTask(formData);
        }
      } else {
        const payload = {
          name: form.name,
          code: form.code,
          priority: form.priority as typeof TaskPriority[keyof typeof TaskPriority],
          status: form.status as typeof TaskStatus[keyof typeof TaskStatus],
          description: form.description,
          due_date: form.due_date || null,
        };

        if (isEditMode && id) {
          await TaskService.updateTask(Number(id), payload);
        } else {
          await TaskService.createTask(payload);
        }
      }

      ToastService.success(
        isEditMode ? "Task updated successfully" : "Task created successfully"
      );
      navigate("/dashboard");
    } catch (err: unknown) {
      // show validaton errors from backend
      const axiosErr = err as { response?: { data?: Record<string, string[]> } };
      if (axiosErr?.response?.data && typeof axiosErr.response.data === "object") {
        const data = axiosErr.response.data;
        const fieldErrors: Record<string, string[]> = {};
        for (const key of Object.keys(data)) {
          fieldErrors[key] = data[key];
        }
        setErrors(fieldErrors);
        ToastService.error("Please fix the errors below");
      } else {
        ToastService.error(
          isEditMode ? "Failed to update task" : "Failed to create task"
        );
      }
    } finally {
      LoaderService.hide();
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center p-5">
          <div className="spinner-border" role="status" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-md-7">

            <div className="card shadow-sm">
              <div className="card-body">

                <h4 className="mb-4">
                  {isEditMode ? "Edit Task" : "Create Task"}
                </h4>

                <form onSubmit={handleSubmit}>

                  <div className="mb-3">
                    <label className="form-label">Name *</label>
                    <input
                      className={`form-control ${errors.name ? "is-invalid" : ""}`}
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      maxLength={255}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name.join(", ")}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Code *</label>
                    <input
                      className={`form-control ${errors.code ? "is-invalid" : ""}`}
                      name="code"
                      value={form.code}
                      onChange={handleChange}
                      required
                      maxLength={50}
                      placeholder="e.g. TASK-001"
                    />
                    {errors.code && (
                      <div className="invalid-feedback">{errors.code.join(", ")}</div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                      >
                        {Object.entries(TaskPriorityLabel).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                      >
                        {Object.entries(TaskStatusLabel).map(([val, label]) => (
                          <option key={val} value={val}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="due_date"
                      value={form.due_date}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    {existingImageUrl && !imageFile && (
                      <div className="mb-2">
                        <img
                          src={existingImageUrl}
                          alt="Current"
                          style={{ maxHeight: "100px", borderRadius: "4px" }}
                        />
                        <div className="small text-muted mt-1">Current image. Upload a new one to replace it.</div>
                      </div>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {isEditMode ? "Save Changes" : "Create Task"}
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate("/dashboard")}
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default TaskForm;
