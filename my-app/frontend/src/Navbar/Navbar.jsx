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
    <NavLink className='img-logo' to={"/"}> 
    <div className='img-logo'>
      <img className='logo' src={frelloLogo} alt="logo" /> </div>
    </NavLink>

    <nav className="navbar-cont">
      <ul className='left-panel'>
        <NavLink to={"/dashboard"}>
        <li>Dashboard</li>
        {/* Update About link */}
        </NavLink>              
        <li>About</li>
      </ul>
    </nav>

      <ul className='right-panel'>
      {user ? (
        <>
        
          <span>Welcome {user.name}!</span>  {/* Fix user name, not showing in navbar! */}
          <button onClick={logout}>Logout</button>
        </>
          ) : (
        <>
          <button onClick={() => setShowLogin(true)}>Login</button>
          <button onClick={() => setShowRegister(true)}>Register</button>
        </>
      )}
      </ul>
        
        {/* Register Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterUserModal onClose={() => setShowRegister(false)} />}
  </div>
)}

export default Navbar
