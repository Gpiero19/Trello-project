import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useToast } from "../context/ToastContext";
import { hasGuestBoards } from "../api/guestStorage";
import { useDemoLogin } from "../hooks/useDemoLogin";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

function RegisterUserModal({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { addToast } = useToast();
  const { handleDemoLogin, demoLoading } = useDemoLogin(onClose);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/register", form);

      // Response is already extracted by interceptor
      addToast(res.data?.message || "User registered successfully!", "success");

      // Check for guest boards and inform user
      if (hasGuestBoards()) {
        addToast("You can login to import your guest boards!", "info");
      }

      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      addToast("Error: " + errorMessage, "error");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Register New User</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          aria-label="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="E-mail"
          aria-label="E-mail"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          aria-label="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Register</Button>
        </div>
      </form>
      <div className="demo-divider"><span>or</span></div>
      <button
        className="demo-login-btn"
        onClick={handleDemoLogin}
        disabled={demoLoading}
      >
        {demoLoading ? "Loading…" : "Try the demo account"}
      </button>
      {onSwitchToLogin && (
        <p className="switch-to-demo">
          Already have an account?{" "}
          <button className="link-btn" onClick={onSwitchToLogin}>Log in</button>
        </p>
      )}
    </Modal>
  );
}

export default RegisterUserModal;
