import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { IncomeContext } from './IncomeContext';

const Income = () => {

    const { incomes, setIncome } = useContext(IncomeContext);
    const [newIncome, setNewIncome] = useState(incomes);
    const navigate = useNavigate();
  
    const handleSubmit = (e) => {
      e.preventDefault();
      setIncome(newIncome);
      navigate("/"); // Go back to dashboard
    };

    

  return (
    <div className='dashboard-container'>
<aside className="dashboard-sidebar">
        <nav>
          <ul>
            <li>Overview</li>
            <li>Transaction</li>
            <li>Budget</li>
            <li>Reports</li>
            <li>Goal</li>
            <li>Settings</li>
            <hr />
            <li>Logout</li>
          </ul>
        </nav>
      </aside>

      <div className="income-page">
      <h1>Update Income</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={newIncome}
          onChange={(e) => setNewIncome(Number(e.target.value))}
        />
        <button type="submit">Update</button>
      </form>
    </div>
    </div>
  )
}

export default Income