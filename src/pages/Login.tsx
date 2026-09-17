import {  useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { LoginRequest } from "../interfaces/AuthInterfaces";
import LoaderService from "../services/LoaderService";
import AuthService from "../services/AuthService";
import ToastService from "../services/ToastService";


function Login() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState<LoginRequest>({
      username: "",
      password: "",
    });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: FormEvent
  ) => {

    e.preventDefault();

    try {

      LoaderService.show();

      const user =
        await AuthService.login(form);

      ToastService.success(
        `Welcome ${user.username}`
      );

      navigate("/dashboard");

    } catch (error: any) {

      ToastService.error(
        error.response?.data?.detail ||
        "Login failed"
      );

    } finally {

      LoaderService.hide();
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex p-0">
      <div className="row g-0 flex-grow-1 w-100">
        
        {/* Left Side - Message & Portal Name */}
        <div className="col-md-6 bg-primary text-white d-flex flex-column justify-content-center align-items-center p-5 text-center">
          <h1 className="display-4 fw-bold mb-3">Task Board Portal</h1>
          <p className="lead fs-4 opacity-75">
            Organize, manage, and track your tasks all in one place.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="col-md-6 bg-light d-flex justify-content-center align-items-center p-5">
          <div className="card shadow-lg border-0 rounded-4 w-100" style={{ maxWidth: "450px" }}>
            <div className="card-body p-5">
              <h3 className="text-center fw-bold mb-4 text-dark">
                Welcome Back
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold">
                    Username
                  </label>
                  <input
                    className="form-control form-control-lg bg-light"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label text-muted fw-semibold">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg bg-light"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <button className="btn btn-primary btn-lg w-100 mt-2 fw-bold shadow-sm">
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;