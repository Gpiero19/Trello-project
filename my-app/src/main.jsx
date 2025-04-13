import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Navbar from "./Navbar/Navbar.jsx";
import Mainboard from "./MainBoard.jsx";
import NotFoundPage from "./NotFoundPage.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from "./dashboard.jsx";

// npx vite

// const router = createBrowserRouter([
//   {path: "/", Component: Mainboard},
//   {path: "/dashboard", Component: Dashboard},
//   // {path: "/about", element: <About/>},
//   {path: "*", element: <NotFoundPage/>},
// ])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter errorElement={<NotFoundPage/>}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Mainboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </BrowserRouter>
  </StrictMode>
);
