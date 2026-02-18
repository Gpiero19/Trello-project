import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

function RegisterUserModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axiosInstance.post("/auth/register", form);
      
      // Response is already extracted by interceptor
      alert(res.data?.message || "User registered successfully!");
      onClose();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Registration failed";
      alert("Error: " + errorMessage);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Register New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
          <input
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default RegisterUserModal;
