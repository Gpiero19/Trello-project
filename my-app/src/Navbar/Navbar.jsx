// import { useState } from 'react'
import './Navbar.css'
import frelloLogo from './Frello.png';
import { Link } from 'react-router-dom';
import { NavLink } from "react-router";

function Navbar() {
// const router = 
return (
  <div className="navbar">
    <NavLink className='img-logo' to={"/"}> 
    <div className='img-logo'>
      <img className='logo' src={frelloLogo} alt="logo" /> </div>
    </NavLink>
    <nav className="navbar-cont">
      <ul className='left-panel'>
        <NavLink to={"/dashboard"}>
        <li><a href="#">Dashboard</a></li>
        </NavLink>
        <li><a href="#">About</a></li>
      </ul>
    </nav>
      <ul className='right-panel'>
        <a className="profile" href="#"><button>Profile</button></a>
      </ul>
  </div>
)}

export default Navbar
