import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}>

      <h1 className="display-1 fw-bold text-secondary">404</h1>

      <h4 className="mb-3">Page Not Found</h4>

      <p className="text-muted mb-4">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>

    </div>
  );
}

export default NotFound;
