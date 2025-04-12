import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './Navbar/Navbar.jsx'
import Mainboard from './MainBoard.jsx'
import NotFoundPage from './NotFoundPage.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {Dashboard} from './dashboard.jsx'

// npx vite

const router = createBrowserRouter([
  {path: "/", element: <Navbar/>},
  {path: "/dashboard", Component: Dashboard},
  // {path: "/about", element: <About/>},
  {path: "*", element: <NotFoundPage/>},
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
      <Mainboard />
  </StrictMode>,
)
