import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Loader from "./components/Loader";
import ProtectedRoute from "./common/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import TaskForm from "./pages/Taskform";
import NotFound from "./pages/Notfound";

function App() {
  return (
    <BrowserRouter>

      {/* Global fullscreen loader */}
      <Loader />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <Routes>

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/create"
          element={
            <ProtectedRoute adminOnly>
              <TaskForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <TaskForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;