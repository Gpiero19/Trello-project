import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./components/Toast/Toast.css";
import Navbar from "./Navbar/Navbar.jsx";
// import Mainboard from "./MainBoard.jsx";
import About from "./About/About.jsx";
import NotFoundPage from "./NotFoundPage/NotFoundPage.jsx";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard/dashboard.jsx"; 
import { AuthProvider } from "./context/authContext";
import { ToastProvider } from "./context/ToastContext.jsx";
import BoardsDetailView from "./components/BoardDetailView/BoardDetailView.jsx";
import Templates from "./Templates/Templates.jsx";
import TemplatePreview from "./Templates/TemplatePreview.jsx";
import CreateTemplate from "./Templates/CreateTemplate.jsx";


// npx vite
// npm start


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/boards/:boardId" element={<BoardsDetailView />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/templates/create" element={<CreateTemplate />} />
            <Route path="/templates/:id" element={<TemplatePreview />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          </BrowserRouter>
      </ToastProvider>
      </AuthProvider>
  </StrictMode>
);
