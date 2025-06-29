import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FaEllipsisV } from 'react-icons/fa'; // Import the three-dot icon
import { FiEdit, FiTrash2 } from 'react-icons/fi'; // Import icons for update and delete

// Dummy GST rates for the modal (replace with your actual data)
const GST_RATES = {
    Food: 5,
    Electronics: 18,
    Services: 12,
    Other: 0,
};

function FinanceDashboard() {
    const [budgetedAmount, setBudgetedAmount] = useState(0);
    const [spentAmount, setSpentAmount] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [initialBalance, setInitialBalance] = useState("");
    const [accounts, setAccounts] = useState([]);
    const [defaultAccount, setDefaultAccount] = useState(null); // Initialize to null
    const [expense, setExpense] = useState(0);
    const [savings, setSavings] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        category: "Other",
        description: "",
        amount: "",
    });
    const [transactions, setTransactions] = useState([]);
    const [hasUserEditedBudget, setHasUserEditedBudget] = useState(false);
    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    // State for update modal
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [accountToUpdate, setAccountToUpdate] = useState(null);
    const [updateAccountName, setUpdateAccountName] = useState("");
    const [updateAccountType, setUpdateAccountType] = useState("");
    const [updateInitialBalance, setUpdateInitialBalance] = useState("");

    // State for account menu visibility
    const [accountMenuVisible, setAccountMenuVisible] = useState({});

    useEffect(() => {
        if (defaultAccount && defaultAccount.budgetAmount && !hasUserEditedBudget) {
            setBudgetedAmount(defaultAccount.budgetAmount);
        }
        // Set cookie whenever defaultAccount changes
        if (defaultAccount?._id) {
            Cookies.set('activeAccountId', defaultAccount._id);
            console.log('Active Account ID set to cookie:', defaultAccount._id);
        } else {
            Cookies.remove('activeAccountId', { path: '/' });
            console.log('Active Account ID cookie removed');
        }
    }, [defaultAccount, hasUserEditedBudget]);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/account/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch accounts");
                }

                const data = await response.json();
                console.log("Fetched accounts", data);
                setAccounts(data.data || []); // Ensure accounts is always an array
                if (data.data && data.data.length > 0 && !defaultAccount) {
                    setDefaultAccount(data.data[0]);
                }
            } catch (error) {
                console.error("Error fetching accounts:", error.message);
                toast.error(error.message);
            }
        };

        fetchAccounts();
    }, [userId, defaultAccount]); // Added userId as dependency

    useEffect(() => {
        const fetchExpenses = async () => {
            if (defaultAccount?._id) {
                try {
                    const response = await fetch(`http://localhost:3000/api/expense/${defaultAccount._id}`);
                    const data = await response.json();
                    console.log("Expenses:", data);
                    // Assuming the API returns totalExpenseAmount directly
                    if (data?.data && data.data.length > 0) {
                        const lastExpense = data.data[data.data.length - 1]; // Get last expense entry
                        setSpentAmount(lastExpense.totalExpenseAmount || 0);
                    } else {
                        setSpentAmount(0); // If no expenses, set to 0
                    }

                } catch (error) {
                    console.error("Error fetching expenses:", error);
                    toast.error("Failed to fetch expenses.");
                    setSpentAmount(0); // Set to 0 on error, or handle as needed
                }
            }
        };

        fetchExpenses();
    }, [defaultAccount]);

    const handleCreateAccount = async () => {
        try {
            console.log({
                userId,
                accountName,
                accountType,
                initialBalance: parseFloat(initialBalance),

            });

            const response = await fetch('http://localhost:3000/api/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    accountName,
                    accountType,
                    initialBalance: parseFloat(initialBalance),

                }),
            });

            const data = await response.json();
            console.log(data.data._id)

            if (!data.status) {
                throw new Error(data.error || "Account creation failed");
            }

            console.log("Account created successfully:", data.data);
            setAccounts((prevAccounts) => [...prevAccounts, data.data]);
            toast.success("Account created successfully!");
            setShowDialog(false);
            setAccountName("");
            setAccountType("");
            setInitialBalance("");

            if (!defaultAccount && data.data) {
                setDefaultAccount(data.data);
            }

        } catch (err) {
            console.error("Error creating account:", err.message);
            toast.error(err.message);
        }
    };

    const handleAddExpense = () => {
        const amount = parseFloat(newTransaction.amount);

        if (!amount || amount <= 0 || !newTransaction.category) {
            toast.error("Please enter valid expense details.");
            return;
        }

        setExpense((prevExpense) => prevExpense + amount);
        setSavings((prevSavings) => prevSavings - amount);
        setSpentAmount((prevSpentAmount) => prevSpentAmount + amount);

        const newTransactionRecord = {
            ...newTransaction,
            date: new Date().toISOString(),
        };

        setTransactions((prevTransactions) => [...prevTransactions, newTransactionRecord]);
        localStorage.setItem("transactions", JSON.stringify([...transactions, newTransactionRecord]));
        setShowModal(false);
        setNewTransaction({ category: "Other", description: "", amount: "" });
        toast.success("Expense added successfully");
    };

    let percentage = budgetedAmount > 0 ? Math.min((spentAmount / budgetedAmount) * 100, 100).toFixed(2) : 0;

    useEffect(() => {
        const savedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
        setTransactions(savedTransactions);
    }, []);

    const toggleAccountMenu = (accountId) => {
        setAccountMenuVisible(prevState => ({
            ...prevState,
            [accountId]: !prevState[accountId],
        }));
    };

    const openUpdateModal = (account) => {
        setAccountToUpdate(account);
        setUpdateAccountName(account.accountName);
        setUpdateAccountType(account.accountType);
        setUpdateInitialBalance(account.initialBalance);
        setShowUpdateModal(true);
        setAccountMenuVisible({}); // Close any open menus
    };

    const closeUpdateModal = () => {
        setShowUpdateModal(false);
        setAccountToUpdate(null);
    };

    const handleUpdateAccount = async () => {
        if (!accountToUpdate) return;
        try {
            const response = await fetch(`http://localhost:3000/api/account/${accountToUpdate._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountName: updateAccountName,
                    accountType: updateAccountType,
                    initialBalance: parseFloat(updateInitialBalance),
                }),
            });

            const data = await response.json();

            if (!data.status) {
                throw new Error(data.error || "Failed to update account");
            }

            const updatedAccount = data.data;
            setAccounts(prevAccounts =>
                prevAccounts.map(acc => acc._id === updatedAccount._id ? updatedAccount : acc)
            );
            if (defaultAccount?._id === updatedAccount._id) {
                setDefaultAccount(updatedAccount);
            }
            toast.success("Account updated successfully!");
            closeUpdateModal();
        } catch (error) {
            console.error("Error updating account:", error.message);
            toast.error(error.message);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        if (!accountId) return;
        const confirmed = window.confirm("Are you sure you want to delete this account?");
        if (confirmed) {
            try {
                const response = await fetch(`http://localhost:3000/api/account/${accountId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (!data.status) {
                    throw new Error(data.error || "Failed to delete account");
                }

                setAccounts(prevAccounts => prevAccounts.filter(acc => acc._id !== accountId));
                if (defaultAccount?._id === accountId) {
                    setDefaultAccount(accounts.length > 1 ? accounts[0] : null); // Set a new default or null
                }
                toast.success("Account deleted successfully!");
                setAccountMenuVisible({}); // Close any open menus
            } catch (error) {
                console.error("Error deleting account:", error.message);
                toast.error(error.message);
            }
        }
    };

    return (
        <div className={`dashboard-container`}>
            <main className="dashboard-main">
                <section className="account-manager">
                    <button className="add-button" onClick={() => setShowDialog(true)}>
                        Add Account
                    </button>
                    
                    <AnimatePresence>
                        {showDialog && (
                            <motion.div
                                className="dialog-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="dialog-box"
                                    initial={{ y: "-100vh" }}
                                    animate={{ y: "0" }}
                                    exit={{ y: "-100vh" }}
                                >
                                    <h2>Create Account</h2>



                                    <div className="form-group">
                                        <label>Account Name</label>
                                        <input
                                            type="text"
                                            value={accountName}
                                            onChange={(e) => setAccountName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Account Type</label>
                                        <select
                                            value={accountType}
                                            onChange={(e) => setAccountType(e.target.value)}
                                        >
                                            <option value="">-- Select Type --</option>
                                            <option value="Savings">Savings</option>
                                            <option value="Current">Current</option>
                                            <option value="Business">Business</option>
                                            <option value="Investment">Others</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Initial Balance</label>
                                        <input
                                            type="number"
                                            value={initialBalance}
                                            onChange={(e) => setInitialBalance(e.target.value)}
                                        />
                                    </div>
                                    <div className="dialog-buttons">
                                        <button
                                            onClick={() => setShowDialog(false)}
                                            className="can-button"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleCreateAccount}
                                            className="create-button"
                                        >
                                            Create Account
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {showUpdateModal && accountToUpdate && (
                            <motion.div
                                className="dialog-overlay"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <motion.div
                                    className="dialog-box"
                                    initial={{ y: "-100vh" }}
                                    animate={{ y: "0" }}
                                    exit={{ y: "-100vh" }}
                                >
                                    <h2>Update Account</h2>
                                    <div className="form-group">
                                        <label>Account Name</label>
                                        <input
                                            type="text"
                                            value={updateAccountName}
                                            onChange={(e) => setUpdateAccountName(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Account Type</label>
                                        <select
                                            value={updateAccountType}
                                            onChange={(e) => setUpdateAccountType(e.target.value)}
                                        >
                                            <option value="">-- Select Type --</option>
                                            <option value="Savings">Savings</option>
                                            <option value="Current">Current</option>
                                            <option value="Business">Business</option>
                                            <option value="Investment">Others</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Initial Balance</label>
                                        <input
                                            type="number"
                                            value={updateInitialBalance}
                                            onChange={(e) => setUpdateInitialBalance(e.target.value)}
                                        />
                                    </div>
                                    <div className="dialog-buttons">
                                        <button
                                            onClick={closeUpdateModal}
                                            className="can-button"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateAccount}
                                            className="create-button"
                                        >
                                            Update Account
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>


                    <div className="account-cards">
                        {accounts && accounts.length > 0 ? ( // Check if accounts exists and has length
                            accounts.map((account, index) => (
                                <div
                                    key={index}
                                    className={`account-card ${account._id === defaultAccount?._id ? "default" : ""
                                        }`}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            marginTop: "10px",
                                        }}
                                    >
                                        <div
                                            onClick={() => setDefaultAccount(account)}
                                            style={{
                                                width: "40px",
                                                height: "20px",
                                                borderRadius: "20px",
                                                backgroundColor:
                                                    account._id === defaultAccount?._id ? "#6a4c93" : "#ddd",
                                                position: "relative",
                                                cursor: "pointer",
                                                transition: "background-color 0.3s ease",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    content: "''",
                                                    width: "18px",
                                                    height: "18px",
                                                    borderRadius: "50%",
                                                    backgroundColor: "white",
                                                    position: "absolute",
                                                    top: "1px",
                                                    left: account._id === defaultAccount?._id ? "20px" : "1px",
                                                    transition: "transform 0.3s ease",
                                                }}
                                            />
                                        </div>
                                        <div style={{ position: 'relative' }}>
                                            <FaEllipsisV
                                                onClick={() => toggleAccountMenu(account._id)}
                                                style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                            />
                                            {accountMenuVisible[account._id] && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '100%',
                                                    right: 0,
                                                    backgroundColor: 'white',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '5px',
                                                    zIndex: 10,
                                                }}>
                                                  <button
  onClick={() => openUpdateModal(account)}
  style={{
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'inherit', // Inherit text color from parent
    fontSize: 'inherit', // Inherit font size
    width: '100%',
    textAlign: 'left',
  }}
>
  <FiEdit style={{ marginRight: '8px' }} /> Update
</button>
<button
  onClick={() => handleDeleteAccount(account._id)}
  style={{
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'red',
    fontSize: 'inherit',
    width: '100%',
    textAlign: 'left',
  }}
>
  <FiTrash2 style={{ marginRight: '8px' }} /> Delete
</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <h3>{account.accountName}</h3>
                                    <p>Type: {account.accountType}</p>
                                </div>
                            ))
                        ) : (
                            <div>No accounts available.</div> // Or any other message you want to display
                        )}
                    </div>
                </section>
                <section className="savings-income">
                    {defaultAccount ? (
                        <>
                            <div className="income">
                                <h2>Income</h2>
                                <p>₹{defaultAccount.initialBalance || 0}</p>
                            </div>
                            <div className="expenses">
                                <h2>Expense</h2>
                                <p>₹{spentAmount}</p>
                            </div>
                            <div className="savings">
                                <h2>Budget</h2>
                                <p>Your automatic budget is: ₹{defaultAccount.budgetAmount || 0}</p>
                            </div>
                        </>
                    ) : (
                        <p>Select an account to view its details.</p>
                    )}
                </section>

                <div className="progress-container">
                    <div className="progress-header">
                        <div className="input-group">
                            <label>Budget (₹)</label>
                            <input
                                type="number"
                                value={budgetedAmount}
                                onChange={(e) => {
                                    setBudgetedAmount(Number(e.target.value));
                                    setHasUserEditedBudget(true);
                                }}
                            />
                        </div>
                        <div className="input-group">
                            <label>Expense (₹)</label>
                            <input
                                type="number"
                                value={spentAmount} // Use the state variable here
                                onChange={(e) => setSpentAmount(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}>
                            <span className="progress-text">{percentage}%</span>
                        </div>
                    </div>
                    {defaultAccount && (
                        <div style={{ marginTop: "20px", textAlign: "left" }}>
                            <button
                                onClick={() => navigate("/expense")}
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#6a4c93",
                                    color: "#fff",
                                    borderRadius: "5px",
                                    border: "none",
                                    cursor: "pointer",
                                }}
                            >
                                Add Expense
                            </button>
                        </div>
                    )}
                </div>
            </main>
            
            <ToastContainer position="top-right" autoClose={5000} />
        </div>
    );
}

export default FinanceDashboard;

