import { useState } from "react";
import { useAuth } from "../context/authContext";
import axiosInstance from "../api/axiosInstance";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      
      // Response is already extracted by interceptor: { token, user }
      const userData = res.data.user || res.data;
      
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      login(userData);  // Save user in context
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid credentials";
      alert(errorMessage);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
