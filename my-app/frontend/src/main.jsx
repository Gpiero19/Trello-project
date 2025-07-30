import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./Navbar/Navbar.jsx";
import Mainboard from "./MainBoard.jsx";
import NotFoundPage from "./NotFoundPage/NotFoundPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard.jsx"; 
import { AuthProvider } from "./context/authContext";
import BoardsDetailView from "./components/BoardDetailView.jsx";


// npx vite


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Mainboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/:boardId" element={<BoardsDetailView />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      
        </BrowserRouter>
      </AuthProvider>
  </StrictMode>
);
