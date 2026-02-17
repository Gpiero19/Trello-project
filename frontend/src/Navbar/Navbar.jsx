import './Navbar.css'
import frelloLogo from './Frello.png';
import { NavLink } from 'react-router-dom';
import { useState } from "react";
import RegisterUserModal from "../components/registerUserModal";
import LoginModal from "../components/LoginModal";
import { useAuth } from '../context/authContext';

function Navbar() {
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

return (

  <div className="navbar">
    <NavLink className='img-logo' to={"/dashboard"}> 
      <img className='logo' src={frelloLogo} alt="logo" />
    </NavLink>

      <ul className='left-panel'>           
        <li>
          <NavLink to={"/about"}>
            About
          </NavLink>
        </li>
      </ul>


      <div className='right-panel'>
      {user ? (
        <>
          <span className='user-name'>Welcome {user.name || user.username || user.email}!</span>
          <button onClick={logout}>Logout</button>
        </>
          ) : (
        <>
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowRegister(true)}>Register</button>
        </>
      )}
      </div>
        
        {/* Register Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterUserModal onClose={() => setShowRegister(false)} />}
  </div>
)}

export default Navbar
