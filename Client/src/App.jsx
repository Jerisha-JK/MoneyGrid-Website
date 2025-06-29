import Header from "./FrontEnd/Utils/NavBar/Header.jsx";
import './App.css';
import {  Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Home from "./FrontEnd/Pages/Home/Home.jsx";
import Footer from "./FrontEnd/Utils/NavBar/Footer.jsx";
import LoginForm from "./FrontEnd/auth/Login/Login.jsx";
import RegistrationForm from "./FrontEnd/auth/Register/Register.jsx";
import FinanceDashboard from "./FrontEnd/Pages/Dashboard/Dashboard.jsx";

import TransactionGraph from "./FrontEnd/Pages/Transaction/Page.jsx";
import ExpenseEntry from "./FrontEnd/Section/Expense/Expense.jsx";
import ReportsPage from "./FrontEnd/Pages/Report/Report.jsx";
import Asidebar from "./FrontEnd/Utils/NavBar/Asidebar.jsx";
import BudgetPage from "./FrontEnd/Pages/Budget/Budget.jsx";
import Goal from "./FrontEnd/Pages/Goal/Goal.jsx";

import UserProfile from "./FrontEnd/Pages/User/User.jsx";

import { ToastContainer } from 'react-toastify';
import HeaderLogin from "./FrontEnd/Utils/NavBar/HeaderL.jsx";
import Cookies from 'js-cookie'
import { useEffect } from "react";



function App() {
  const location = useLocation();
  // const accessToken = Cookies.get('token')
  const navigate = useNavigate();
  // const isLoggedIn = Boolean(accessToken)

  // useEffect(() => {
  //   if (isLoggedIn && (location.pathname === "/login" || location.pathname === "/register")) {
  //     navigate("/dashboard");
  //   }
  // }, [isLoggedIn, location.pathname, navigate]);

  const sidebarPaths = [
    "/dashboard",
    "/expense",
    "/transaction",
    "/reports",
  
    "/budget",
    "/goal",
    
    "/user"
  ];

  const showAsidebar = sidebarPaths.includes(location.pathname.toLowerCase());
  // const isHomePage = location.pathname === "/";
  const isHomePage = location.pathname === "/";
const isAuthPage = ["/login", "/register"].includes(location.pathname.toLowerCase());

  const hideHeaderFooter = ["/login", "/register"].includes(location.pathname.toLowerCase());

  return (
    <>
      {/* {!hideHeaderFooter   ? <Header /> : '' } */}

  {isHomePage && <Header />}
  {!isHomePage && !isAuthPage && <HeaderLogin />}

  {!isHomePage ? (
    <div style={{ display: "flex", flexDirection: "row" }}>
      {showAsidebar && <Asidebar />}
      <div style={{ flex: 1 }}>
        <ToastContainer />
        <Routes>
          <Route path='/expense' element={<ExpenseEntry />} />
          <Route path='/dashboard' element={<FinanceDashboard />} />
          <Route path='/login' element={<LoginForm />} />
        
          <Route path='/budget' element={<BudgetPage />} />
          <Route path='/goal' element={<Goal />} />
          
          <Route path='/transaction' element={<TransactionGraph />} />
          <Route path='/reports' element={<ReportsPage />} />
          <Route path='/register' element={<RegistrationForm />} />
          <Route path='/user' element={<UserProfile />} />
          
          <Route path='/helogin' element={<HeaderLogin />} />
         
          <Route path='*' element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </div>
    </div>
  ) : (
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
  )}

  {!isAuthPage && <Footer />}
</>

    
  );
}

export default App;
