import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './Navbar/Navbar.jsx'
import Mainboard from './MainBoard.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import {  BrowserRouter, Route, Routes } from 'react-router-dom'
import {Dashboard} from './dashboard.jsx'

// npx vite

// const router = createBrowserRouter([
//   {path: "/", Component: Mainboard},
//   {path: "/dashboard", Component: Dashboard},
//   // {path: "/about", element: <About/>},
//   {path: "*", element: <NotFoundPage/>},
// ])

createRoot(document.getElementById('root')).render(
  <StrictMode>

      <BrowserRouter>
      <Navbar/>

      <Routes>
      <Route path="/" element={<Mainboard />} />
    </Routes>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
    <Routes>
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
      </BrowserRouter>

  </StrictMode>,
)
