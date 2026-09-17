import { useState } from "react";
import { Link } from "react-router-dom";
import type { Task } from "../interfaces/TaskInterfaces";
import { TaskStatus, TaskStatusLabel } from "../enums/TaskStatus";
import { TaskPriorityLabel } from "../enums/TaskPriority";
import { isAdmin } from "../utils/permissions";
import ToastService from "../services/ToastService";
import TaskService from "../services/TaskService";
import SpecialLoader from "./SpecialLoader";
import type { Comment } from "../interfaces/TaskInterfaces";
import AuthService from "../services/AuthService";

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: TaskStatus) => void;
  onDragStart: (event: React.DragEvent, task: Task) => void;
}

function TaskCard({ task, onDelete, onStatusChange, onDragStart }: TaskCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const priorityLabel = TaskPriorityLabel[task.priority] ?? task.priority;
  const priorityBadgeColor =
    task.priority === "HIGH"
      ? "bg-danger"
      : task.priority === "MEDIUM"
      ? "bg-warning text-dark"
      : "bg-success";

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }

    try {
      setCommentsLoading(true);
      setShowComments(true);
      const data = await TaskService.getComments(task.id);
      setComments(data);
    } catch {
      ToastService.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const comment = await TaskService.addComment(task.id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment("");
    } catch {
      ToastService.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const removeComment = async (commentId: number) => {
    try {
      await TaskService.deleteComment(task.id, commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      ToastService.success("Comment deleted");
    } catch {
      ToastService.error("Failed to delete comment");
    }
  };

  const currentUser = AuthService.getLoggedInUser();

  const canDeleteComment = (commentUserId: number): boolean => {
    if (!currentUser) return false;
    return isAdmin() || currentUser.id === commentUserId;
  };

  return (
    <div
      className="card mb-3 shadow-sm"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <div className="card-body">

        {/* Taks image */}
        {task.image_url && (
          <img
            src={task.image_url}
            alt={task.name}
            className="img-fluid rounded mb-2"
            style={{ maxHeight: "120px", objectFit: "cover", width: "100%" }}
          />
        )}

        <div className="d-flex justify-content-between align-items-start">
          <h6 className="card-title mb-0">{task.name}</h6>
          <span className={`badge ${priorityBadgeColor} ms-2`}>{priorityLabel}</span>
        </div>

        <small className="text-muted">{task.code}</small>

        {task.description && (
          <p className="card-text mt-2 small text-truncate" style={{ maxWidth: "100%" }}>
            {task.description}
          </p>
        )}

        <div className="mt-2 d-flex justify-content-between align-items-center">
          <small className="text-muted">
            {task.due_date ? `Due: ${task.due_date}` : "No due date"}
          </small>
        </div>

        <div className="mt-2">
          {/* Statues dropdown — all users can change status */}
          <select
            className="form-select form-select-sm mb-2"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          >
            <option value={TaskStatus.PENDING}>{TaskStatusLabel.PENDING}</option>
            <option value={TaskStatus.IN_PROGRESS}>{TaskStatusLabel.IN_PROGRESS}</option>
            <option value={TaskStatus.COMPLETED}>{TaskStatusLabel.COMPLETED}</option>
          </select>

          <div className="d-flex gap-1">
            {/* Coment toggle */}
            <button
              className="btn btn-outline-secondary btn-sm flex-grow-1"
              onClick={loadComments}
            >
              {showComments ? "Hide Comments" : "Comments"}
            </button>

            {/* Amdin actions */}
            {isAdmin() && (
              <>
                <Link
                  to={`/tasks/edit/${task.id}`}
                  className="btn btn-outline-primary btn-sm"
                >
                  Edit
                </Link>

                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => onDelete(task.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Commants section */}
        {showComments && (
          <div className="mt-3 border-top pt-2">
            <SpecialLoader loading={commentsLoading} message="Loading comments..." />

            {!commentsLoading && (
              <>
                {comments.length === 0 && (
                  <p className="text-muted small">No comments yet</p>
                )}

                {comments.map((c) => (
                  <div key={c.id} className="mb-1 d-flex justify-content-between align-items-start">
                    <div>
                      <strong className="small">{c.user.username}: </strong>
                      <span className="small">{c.content}</span>
                    </div>

                    {canDeleteComment(c.user.id) && (
                      <button
                        className="btn btn-link btn-sm text-danger p-0 ms-2"
                        onClick={() => removeComment(c.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}

                <div className="input-group input-group-sm mt-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={submitComment}
                    disabled={submitting}
                  >
                    Post
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;