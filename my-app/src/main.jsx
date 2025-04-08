import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './Navbar/Navbar.jsx'
import Mainboard from './MainBoard.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// npx vite

const router = createBrowserRouter([
  {path: "/", element: <Navbar/>},
  // {path: "/dashboard", element: <Dashboard/>},
  // {path: "/about", element: <About/>},
  {path: "*", element: <NotFoundPage/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <RouterProvider router={router} />
      <Mainboard />
  </StrictMode>,
)
