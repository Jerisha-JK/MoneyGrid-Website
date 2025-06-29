import React, { useState, useEffect } from "react";
import "./Goal.css";
import Cookies from "js-cookie";

function Goal( ) {
  const [currentSavings, setCurrentSavings] = useState(0);
  const [loadingSavings, setLoadingSavings] = useState(false);
  const [errorSavings, setErrorSavings] = useState(null);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ title: "", targetAmount: "", useSavings: false });
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [addGoalError, setAddGoalError] = useState(null);

  // Fetch savings
  // Inside your Goal component:

useEffect(() => {
  const fetchSavings = async () => {
    const activeAccountId = Cookies.get("activeAccountId");
    if (!activeAccountId) {
      setErrorSavings("No active account ID found.");
      return;
    }

    setLoadingSavings(true);
    setErrorSavings(null);

    try {
      const response = await fetch(`http://localhost:3000/api/expense/${activeAccountId}`);
      const result = await response.json();
      console.log("Backend result:", result); // helpful debug

      // Updated extraction logic: last element has savings info
      if (result.status && result.data && result.data.length > 0) {
        const lastItem = result.data[result.data.length - 1];
        const savings = lastItem?.savings ?? 0;
        setCurrentSavings(savings);
      } else {
        setCurrentSavings(0);
      }
    } catch (error) {
      setErrorSavings("Failed to fetch savings.");
      console.error(error);
    } finally {
      setLoadingSavings(false);
    }
  };

  fetchSavings();
}, []);


  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount) {
      alert("Please fill out all fields!");
      return;
    }

    setIsAddingGoal(true);
    setAddGoalError(null);

    const newGoalEntry = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: 0,
      useSavings: newGoal.useSavings,
    };

    setGoals([...goals, newGoalEntry]);
    setNewGoal({ title: "", targetAmount: "", useSavings: false });
    setIsAddingGoal(false);
  };

  const toggleUseSavings = (id) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              useSavings: !goal.useSavings,
              savedAmount: !goal.useSavings ? currentSavings : 0,
            }
          : goal
      )
    );
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const calculateProgress = (goal) => {
    const target = goal.useSavings
      ? Math.max(0, parseFloat(goal.targetAmount) - currentSavings)
      : parseFloat(goal.targetAmount);
    const saved = goal.savedAmount;
    return target > 0 ? Math.min((saved / target) * 100, 100) : 100;
  };

  const getRequiredAmount = (goal) => {
    const target = goal.useSavings
      ? Math.max(0, parseFloat(goal.targetAmount) - currentSavings)
      : parseFloat(goal.targetAmount);
    return Math.max(0, target - goal.savedAmount);
  };

  return (
    <div className="goal-container">
      <h2>Financial Goals</h2>
      <br />
      {/* <h3>
        Savings:{" "}
        {loadingSavings ? "Loading..." : errorSavings ? `Error: ${errorSavings}` : `₹${currentSavings}`}
      </h3> */}
      <br />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="goal-form">
          <input
            type="text"
            placeholder="Goal Title"
            value={newGoal.title}
            onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
          />
          <input
            type="number"
            placeholder="Target Amount"
            value={newGoal.targetAmount}
            onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
          />
        </div>
        <div className="add-goal-button-container">
          <button onClick={handleAddGoal} style={{ padding: "10px", width: "10%" }} disabled={isAddingGoal}>
            {isAddingGoal ? "Adding..." : "Add Goal"}
          </button>
          {addGoalError && <p style={{ color: "red" }}>Error adding goal: {addGoalError}</p>}
        </div>
      </div>
      <br />

      <div className="goal-list">
        {goals.length === 0 ? (
          <p>No goals yet. Start by adding one!</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <div className="title-and-toggle">
                <h3>{goal.title}</h3>
                {/* <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={goal.useSavings}
                    onChange={() => toggleUseSavings(goal.id)}
                  />
                  <span className="slider round"></span>
                </label> */}
              </div>
              <p>Target: ₹{goal.targetAmount}</p>

              {/* {goal.useSavings && (
                <>
                  <p>Saved: ₹{goal.savedAmount}</p>
                  <p>Required: ₹{getRequiredAmount(goal)}</p>

                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    ></div>
                  </div>
                </>
              )} */}

              <button className="delete-btn" onClick={() => handleDeleteGoal(goal.id)}>
                Delete Goal
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Goal;
