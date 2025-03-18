import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './Navbar/Navbar.jsx'
import Mainboard from './MainBoard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar />
    <Mainboard />
  </StrictMode>,
)
