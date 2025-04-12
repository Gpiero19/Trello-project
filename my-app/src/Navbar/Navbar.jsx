// import { useState } from 'react'
import './Navbar.css'
import frelloLogo from './Frello.png';
import { Link } from 'react-router-dom';

function Navbar() {
// const router = 
return (
  <div className="navbar">
    <div className='img-logo'>
      <img className='logo' src={frelloLogo} alt="logo" /> </div>
    <nav className="navbar-cont">
      <ul className='left-panel'>
        <Link to={"/dashboard"}>
        <li><a href="#">Dashboard</a></li>
        </Link>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
      <ul className='right-panel'>
        <a className="profile" href="#"><button>Profile</button></a>
      </ul>
  </div>
)}

export default Navbar
