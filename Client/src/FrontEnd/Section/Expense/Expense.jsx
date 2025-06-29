import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Expense.css";
import axios from "axios";

import Cookies from "js-cookie";


const GST_RATES = {
  Food: 5,
  Electronics: 18,
  Clothing: 12,
  Furniture: 18,
  Beauty: 18,
  Services: 18,
  Health: 5,
  Books: 0,
  Transportation: 28,
  Others: 18,
};

function ExpenseEntry() {
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    amount: "",
    category: "--Select type--",
    description: "",
  });
  const [gstAmount, setGstAmount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const navigate = useNavigate();

  const calculateGST = (amount, category) => {
    const gst = (amount * GST_RATES[category]) / 100;
    const base = amount - gst;
    return { gst, base };
  };

  const handleAddToList = async () => {
    if (!newTransaction.amount || isNaN(newTransaction.amount)) {
      toast.error("Please enter a valid amount!");
      return;
    }

    const { gst, base } = calculateGST(
      parseFloat(newTransaction.amount),
      newTransaction.category
    );

    const expense = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category || "Others",
      description: newTransaction.description || "N/A",
      gst,
      totalAmount: base + gst,
    };

    if (editIndex !== null) {
      const updated = [...transactions];
      updated[editIndex] = expense;
      setTransactions(updated);
      setEditIndex(null);
      toast.success("Expense updated successfully");
    } else {
      setTransactions([ expense,...transactions]);
      toast.success("Expense added to list");
    }

    setNewTransaction({
      amount: "",
      category: "--Select type--",
      description: "",
    });
    setBaseAmount(0);
    setGstAmount(0);
  };

  const handleEdit = (index) => {
    const tx = transactions[index];
    setNewTransaction({
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
    });
    setEditIndex(index);

    const { gst, base } = calculateGST(tx.amount, tx.category);
    setBaseAmount(base);
    setGstAmount(gst);
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
    toast.info("Expense deleted");
  };

  // const handleSubmitAll = () => {

  //   console.log("Submitting all transactions:", transactions);
  //   toast.success("All expenses submitted");
  //   // navigate("/transaction");
  // };

  const handleSubmitAll = async () => {
    try {
      if (transactions.length === 0) {
        toast.warn("No expenses to submit");
        return;
      }


      const userId = Cookies.get('userId');
const accountId = Cookies.get('activeAccountId');
      console.log(accountId)
      // const userId = "68233c1e0ce40fbb305eb673"; // Replace with logged-in user's ID (or from context/auth)
      // const accountId = "68233da61fef7618bc38d631"; // Replace with selected accountId
      const budgetAmount = 0; // Set actual value from account if needed
 
      const payloads = transactions.map((tx) => ({
        userId: userId,
        accountId: accountId,
        budgetAmount: budgetAmount,
        category: tx.category,
        expenseAmount: tx.amount,
        description: tx.description,
        GST: tx.gst.toFixed(2),
        baseAmount: (tx.amount - tx.gst).toFixed(2),
      }));

      for (const data of payloads) {
        const res = await axios.post("http://localhost:3000/api/expense", data);
        if (res.data.status) {
          console.log("Submitted:", res.data.data);
        } else {
          console.error("Failed to submit:", res.data.error);
          toast.error("Some expenses failed to submit.");
          return;
        }
      }

      toast.success("All expenses submitted successfully!");
      setTransactions([]); // Clear after submission
      navigate("/transaction")
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    const amount = parseFloat(newTransaction.amount);
    setNewTransaction({ ...newTransaction, category });

    if (amount) {
      const { gst, base } = calculateGST(amount, category);
      setGstAmount(gst);
      setBaseAmount(base);
    }
  };

  const handleAmountChange = (e) => {
    const amount = e.target.value;
    setNewTransaction({ ...newTransaction, amount });

    if (amount) {
      const { gst, base } = calculateGST(
        parseFloat(amount),
        newTransaction.category
      );
      setGstAmount(gst);
      setBaseAmount(base);
    } else {
      setGstAmount(0);
      setBaseAmount(0);
    }
  };

  return (
    <div className="expense-entry-container">
      <main className="expense-entry-content">
        <ToastContainer />
        <h2 className="entry-heading">
          {editIndex !== null ? "Edit Expense" : "Log Multiple Expenses"}
        </h2>

        <div className="card-container">
          <div className="card">
            <h3>Select Category</h3>
            <select
              value={newTransaction.category}
              onChange={handleCategoryChange}
              className="form-input"
            >
              <option value="--Select type--" disabled>
                --Select type--
              </option>
              {Object.keys(GST_RATES).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {newTransaction.category !== "--Select type--" && (
              <p className="gst-rate-info">
                GST Rate: <strong>{GST_RATES[newTransaction.category]}%</strong>
              </p>
            )}
          </div>

          <div className="card">
            <h3>Enter Amount</h3>
            <input
              type="number"
              placeholder="Amount (e.g. 1000)"
              value={newTransaction.amount}
              onChange={handleAmountChange}
              className="form-input"
              disabled={newTransaction.category === "--Select type--"}
            />
          </div>

          <div className="card">
            <h3>Description</h3>
            <textarea
              placeholder="Optional description"
              value={newTransaction.description}
              onChange={(e) =>
                setNewTransaction({
                  ...newTransaction,
                  description: e.target.value,
                })
              }
              className="form-textarea"
            />
          </div>

          {newTransaction.amount &&
            newTransaction.category !== "--Select type--" && (
              <div className="gst-breakdown gst-card">
                <div className="gst-row">
                  <span className="label">Amount:</span>
                  <span className="value">₹{newTransaction.amount}</span>
                </div>
                <div className="gst-row">
                  <span className="label">Base Amount:</span>
                  <span className="value">₹{baseAmount.toFixed(2)}</span>
                </div>
                <div className="gst-row">
                  <span className="label">
                    GST ({GST_RATES[newTransaction.category]}%):
                  </span>
                  <span className="value">₹{gstAmount.toFixed(2)}</span>
                </div>
                <div className="gst-row total">
                  <span className="label">Total:</span>
                  <span className="value">
                    ₹{(baseAmount + gstAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            )}

          <button
            className="primary-btn"
            onClick={handleAddToList}
            disabled={
              newTransaction.category === "--Select type--" ||
              !newTransaction.amount
            }
          >
            {editIndex !== null ? "Update Expense" : "Add to List"}
          </button>
        </div>

        {transactions.length > 0 && (
          <div className="transaction-list">
            <h3>Pending Transactions</h3>
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>GST</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={tx.id}>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td>₹{tx.amount}</td>
                    <td>₹{tx.gst.toFixed(2)}</td>
                    <td>₹{tx.totalAmount.toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleEdit(index)}>Edit</button>
                      <button onClick={() => handleDelete(tx.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
<div className="table-btn">

            <button className="submit-btn" onClick={handleSubmitAll}>
              Submit All Expenses
            </button>
            <button
              onClick={() => setShowModal(false)}
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1,
                justifyContent: "space-between"
              }}
              >
              Cancel
            </button>
              </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExpenseEntry;
