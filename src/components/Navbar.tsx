import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";

function Navbar() {
  const navigate = useNavigate();
  const user = AuthService.getLoggedInUser();

  const handleLogout = async () => {
    await AuthService.logout(navigate);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm px-4">
      <div className="container-fluid">
        <Link to="/dashboard" className="navbar-brand fw-bold fs-4 tracking-wide">
          Task Board
        </Link>

        <div className="d-flex align-items-center gap-3 ms-auto">
          <span className="text-white fw-medium fs-6 d-flex align-items-center">
            Hi, {user?.username}
            {AuthService.isAdmin() && (
              <span className="badge bg-danger rounded-pill ms-2 px-2 py-1 shadow-sm">
                ADMIN
              </span>
            )}
          </span>

          <button
            className="btn btn-outline-light rounded-pill px-4 ms-2 fw-semibold"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;