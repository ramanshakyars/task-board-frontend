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
    <div className="container">

      <div className="row justify-content-center mt-5">

        <div className="col-md-5">

          <div className="card shadow">

            <div className="card-body">

              <h3 className="text-center mb-4">
                Task Board Login
              </h3>

              <form
                onSubmit={handleSubmit}
              >

                <div className="mb-3">

                  <label>
                    Username
                  </label>

                  <input
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />

                </div>

                <div className="mb-3">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />

                </div>

                <button
                  className="btn btn-primary w-100"
                >
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