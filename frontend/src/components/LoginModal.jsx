import { useState } from "react";
import { useAuth } from "../context/authContext";
import axios from "axios";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", { email, password });
      const userData = res.data.user || res.data;  // Extract user object if nested
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
      }
      login(userData);  // Save user in context
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      alert("Invalid credentials");
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
