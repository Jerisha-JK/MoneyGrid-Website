import React from 'react'
import "./Footer.css"

const Footer = () => {
  return (
    <div>
      <div className='footer'>
<div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Personalized Prosperity Navigator. All rights reserved.</p>
        <div className="footer-links">
          <a href="/about">About Us</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Footer