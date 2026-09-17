import { Link } from "react-router-dom";
import AuthService from "../services/AuthService";

function Navbar() {
  const user = AuthService.getLoggedInUser();

  const handleLogout = async () => {
    await AuthService.logout();
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4">
      <Link to="/dashboard" className="navbar-brand">
        Task Board
      </Link>

      <div className="d-flex align-items-center gap-3">
        <span className="text-white">
          {user?.username}
          {AuthService.isAdmin() && (
            <span className="badge bg-danger ms-2">ADMIN</span>
          )}
        </span>

        <button
          className="btn btn-outline-light btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;