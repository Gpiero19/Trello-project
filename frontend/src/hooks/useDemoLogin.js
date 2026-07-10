import { useState } from "react";
import { useAuth } from "../context/authContext";
import { useToast } from "../context/ToastContext";
import axiosInstance from "../api/axiosInstance";
import { hasGuestBoards, getAllGuestBoardsWithData, clearGuestData } from "../api/guestStorage";
import { importGuestBoards } from "../api/boards";

const DEMO_EMAIL = "guest@frello.demo";
const DEMO_PASSWORD = "guest1234";

/** Shared login logic (manual + demo account) used by both LoginModal and RegisterUserModal. */
export function useDemoLogin(onSuccess) {
  const [demoLoading, setDemoLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();

  const doLogin = async (loginEmail, loginPassword) => {
    const res = await axiosInstance.post("/auth/login", { email: loginEmail, password: loginPassword });
    const userData = res.data.user || res.data;
    if (res.data.token) localStorage.setItem("token", res.data.token);
    login(userData);
    addToast("Welcome " + (userData.name || userData.email) + "!", "success");

    if (hasGuestBoards()) {
      const migrate = window.confirm("You have guest boards. Would you like to import them to your account?");
      if (migrate) {
        const guestBoards = getAllGuestBoardsWithData();
        const result = await importGuestBoards(guestBoards);
        if (result.success > 0) {
          clearGuestData();
          addToast("Imported " + result.success + " board(s) successfully!", "success");
          window.location.reload();
          return;
        }
      }
    }
    onSuccess?.();
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    try {
      await doLogin(DEMO_EMAIL, DEMO_PASSWORD);
    } catch {
      addToast("Could not load the demo account. Please try again.", "error");
    } finally {
      setDemoLoading(false);
    }
  };

  return { doLogin, handleDemoLogin, demoLoading };
}
