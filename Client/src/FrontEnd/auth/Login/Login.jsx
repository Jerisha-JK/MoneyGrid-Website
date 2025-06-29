import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for the toast
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';



function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [UserName, setUserName] = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
  
    try {
      const response = await fetch('http://localhost:3000/api/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password ,UserName}),
      });

     
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
  


      const data = await response.json();
      // console.log("login response:",data)
      // console.log(data.data._id)
      // After successful login
      const { _id: userId,UserName:fetchedUserName} = data.data;


// console.log("User ID from login:", userId); // Should show a real ID
Cookies.set('userId', userId);



Cookies.set('userName', UserName);
Cookies.set('userEmail', email);
// Cookies.set('profilePic', user.profilePic);

// Cookies.set('token', accessToken); // After login
// console.log('Token:', Cookies.get('token'));

      // Example payload: { userId, email, name }
      const payload = {
        userId,
        email,
        UserName:fetchedUserName,
      };
  
      localStorage.setItem('userPayload', JSON.stringify(payload));

      // Show a success toast message
      toast.success(`Welcome ${UserName}! Login successful.`,{
        position: toast.TOP_RIGHT,
        autoClose: 3000, // Close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      navigate('/user');
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      toast.error(err.message || 'Login Failed', {
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
 <div className={styles.bg}>
  <div className={styles.loginContainer} data-aos="fade-up">
    <h2 data-aos="fade-right">User Login</h2>
    {error && <p className={styles.errorMessage} data-aos="fade-in">{error}</p>}

    <form onSubmit={handleSubmit} className={styles.loginForm} data-aos="zoom-in">
      <div className={styles.formGroup} data-aos="fade-left">
        <label htmlFor="UserName">User Name:</label>
        <input
          type="text"
          id="UserName"
          value={UserName}
          onChange={(e) => setUserName(e.target.value)}
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
        <label htmlFor="password">Password:</label>
        <input
          type={showPassword ? 'text' : 'password'}
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <span
          className={styles.passwordToggle}
          onClick={() => setShowPassword(!showPassword)}
        >
          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
        </span>
      </div>

      <button type="submit" className={styles.loginButton} data-aos="zoom-in" data-aos-delay="300">
        Login
      </button>
    </form>

    <p className={styles.signupLink} data-aos="fade-up" data-aos-delay="400">
      Don't have an account? <Link to="/register">Register here</Link>
    </p>
  </div>
</div>

  );
}

export default LoginForm;
