import React, { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import styles from './RegistrationForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';


import axios from 'axios';



function RegistrationForm() {

   const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  

  const [confirmPassword, setConfirmPassword] = useState('');
const [userName,setusername]=useState('')

  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();





// inside handleSubmit:

// const response =  axios.post('http://localhost:8000/api/');





 const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  if (!email || !password || !confirmPassword || !userName) {
    setError('Please fill in all the required fields.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match.');
    return;
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    setError('Please enter a valid email address.');
    return;
  }

  const registrationData = { email, password, confirmPassword, userName };

  try {
    const response = await fetch('http://localhost:3000/api/reg', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Registration failed with status ${response.status}`);
    }

    // If we reach here, the status code is in the successful range (2xx), including 201
    // We can assume registration was successful based on the 201 status.
    console.log('Registration successful (HTTP 201)');
    toast.success('Registration successful! Please Login', {
      position: toast.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    navigate('/login');

    // You might not even need to parse the JSON body for success if 201 is your indicator
    // const data = await response.json();
    // if (data.success === true) {
    //   // ... your existing success logic ...
    // } else {
    //   throw new Error(data.error || 'Registration failed');
    // }

  } catch (err) {
    setError(err.message);
    toast.error(err.message || 'Registration Failed', {
      position: toast.TOP_RIGHT,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
};

useEffect(() => {
  AOS.init({ duration: 1000, once: true });
}, []);




  return (

  <div className={styles.bg1}>
  <div className={styles.registrationContainer} data-aos="fade-up">
    <h2 data-aos="fade-right">User Registration</h2>

    {error && <p className={styles.errorMessage} data-aos="fade-in">{error}</p>}

    <form onSubmit={handleSubmit} className={styles.registrationForm} data-aos="zoom-in">
      
      <div className={styles.formGroup} data-aos="fade-left">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={userName}
          onChange={(e) => setusername(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup} data-aos="fade-left" data-aos-delay="100">
        <label htmlFor="email">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={`${styles.formGroup} ${styles.passwordInput}`} data-aos="fade-left" data-aos-delay="200">
        <label htmlFor="password">Set Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>

      <div className={`${styles.formGroup} ${styles.passwordInput}`} data-aos="fade-left" data-aos-delay="300">
        <label htmlFor="confirmPassword">Confirm Password:</label>
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <span className={styles.passwordToggle} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
        </span>
      </div>

      <button type="submit" className={styles.registerButton} data-aos="zoom-in" data-aos-delay="400">
        Register
      </button>
    </form>

    <p className={styles.loginLink} data-aos="fade-up" data-aos-delay="500">
      Already have an account? <Link to="/login">Login here</Link>
    </p>
  </div>
</div>


  );

}



export default RegistrationForm;