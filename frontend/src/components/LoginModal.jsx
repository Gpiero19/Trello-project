import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useDemoLogin } from "../hooks/useDemoLogin";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

function LoginModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addToast } = useToast();
  const { doLogin, handleDemoLogin, demoLoading } = useDemoLogin(onClose);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doLogin(email, password);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid credentials";
      addToast(errorMessage, "error");
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" aria-label="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" aria-label="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit">Login</Button>
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
    </Modal>
  );
}

export default LoginModal;
