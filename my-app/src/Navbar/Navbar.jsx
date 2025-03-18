// import { useState } from 'react'
import './Navbar.css'

function Navbar() {

return (
  <div className="Navbar" style={{
    backgroundColor: 'blue',
  }}>

<nav className="Navbar-cont" style={{
    display: 'flex',
    justifyContent: "space-between",
    marginLeft: "2em",
    marginRight: "2em",
    padding: "0.4em",
}}>
  <div>Logo</div>
  <div>Board Name</div>
  <div>Profile</div>
</nav>
  </div>
)}

export default Navbar
