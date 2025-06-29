import React from 'react'
import { LuLayoutDashboard } from "react-icons/lu";
import { GrTransaction } from "react-icons/gr";
import { SiActualbudget } from "react-icons/si";
import { TbReportAnalytics } from "react-icons/tb";
import { TbTargetArrow } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutBoxLine } from "react-icons/ri";
import { FaRegUserCircle } from "react-icons/fa";
import { TbNotification } from "react-icons/tb";
import { GiExpense } from "react-icons/gi";
import { TbTransactionRupee } from "react-icons/tb";
import "./Asidebar.css"
import { useLocation, useNavigate } from 'react-router-dom';

const Asidebar = () => {

    const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  return (
    <div>
 <div className="dashboard-sidebar-container">
  <nav>
    <ul className="sidebar-menu"><br /><br />
      <li onClick={() => navigate("/dashboard")}>
        <LuLayoutDashboard className="sidebar-icon" />
        <span>Dashboard</span>
      </li>
      <li onClick={() => navigate("/transaction")}>
        <TbTransactionRupee className="sidebar-icon" />
        <span>Expenses</span>
        {/* <li onClick={() => navigate("/transaction")}>
        <GrTransaction className="sidebar-icon" /> 
        <span>Transaction</span>*/}
      </li>
      <li onClick={() => navigate("/budget")}>
        <SiActualbudget className="sidebar-icon" />
        <span>Budget</span>
      </li>
      <li onClick={() => navigate("/reports")}>
        <TbReportAnalytics className="sidebar-icon" />
        <span>Reports</span>
      </li>
      <li onClick={() => navigate("/goal")}>
        <TbTargetArrow className="sidebar-icon" />
        <span>Goal</span>
      </li>
    
        <br /><br />
      

      <hr className="sidebar-divider" />
<br /><br />
<li onClick={() => navigate("/user")}>
        <FaRegUserCircle className="sidebar-icon" />
        <span>User Profile</span>
      </li>

      <li onClick={() => navigate("/")}>
        <RiLogoutBoxLine className="sidebar-icon" />
        <span>Logout</span>
      </li>
    </ul>
  </nav>
</div>
    </div>
  )
}

export default Asidebar