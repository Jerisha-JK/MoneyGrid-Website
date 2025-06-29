import React from 'react'
import { Link } from 'react-router-dom'
import "./Header.css"
import LoginForm from '../../auth/Login/Login'
import { px } from 'framer-motion'
import { GiReceiveMoney } from "react-icons/gi";

const Header = () => {
  return (
	<>
	
	<nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
        <img src="src\assets\logo2.png" alt="" style={{height:"50px",width:"240px"}}/>
        {/* <GiReceiveMoney />   Money Grid */}
        </Link>
        <ul className="navbar-menu" >
          {/* <li className="navbar-item">
            <Link to="/About" className="navbar-link">
              About
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/Features" className="navbar-link">
              Features
            </Link>
          </li> */}
         
          <li className="navbar-item">
            <Link to="/login" className="navbar-link" element ={<LoginForm/>}>
             <button className= "login-btn">Login</button>
            </Link>
          </li>
          
        </ul>
        {/* You can add a mobile menu toggle button here for responsiveness */}
      </div>
    </nav>
	
	
	
	</>
  )
}

export default Header