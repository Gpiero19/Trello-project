import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../api/axiosInstance";
import { hasGuestBoards, getAllGuestBoardsWithData, clearGuestData } from "../api/guestStorage";
import { importGuestBoards } from "../api/boards";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { addToast } = useToast();

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
      addToast("Login successful! Welcome " + (userData.name || userData.email), "success");
      
      // Check for guest boards and offer to migrate
      if (hasGuestBoards()) {
        const migrate = window.confirm("You have guest boards. Would you like to import them to your account?");
        if (migrate) {
          const guestBoards = getAllGuestBoardsWithData();
          const result = await importGuestBoards(guestBoards);
          if (result.success > 0) {
            clearGuestData();
            addToast("Imported " + result.success + " board(s) successfully!", "success");
            // Refresh the page to show imported boards
            window.location.reload();
            return;
          }
        }
      }
      
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid credentials";
      addToast(errorMessage, "error");
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
          <button type="button" onClick={onClose}
           style={{ backgroundColor: "white", color : "#D98324", border: "1px solid #D98324" }}
          >Cancel</button>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
