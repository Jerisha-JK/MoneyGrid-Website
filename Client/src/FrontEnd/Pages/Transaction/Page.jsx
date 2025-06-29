import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import "./Transaction.css";
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
    Transportion: 28,
    Others: 18,
};

const TransactionGraph = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        date: "",
        description: "",
        category: "Food",
        amount: 0,
        gst: 0,
        totalAmount: 0,
    });
    const [darkMode, setDarkMode] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [searchCategory, setSearchCategory] = useState("");
    const [totalSpent, setTotalSpent] = useState(0); // Add state for total spent
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchCategory);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchCategory]);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setFilteredData(transactions);
            return;
        }
        const filtered = transactions.filter((txn) =>
            txn?.category?.toLowerCase().includes(debouncedSearch?.toLowerCase().trim())
        );
        setFilteredData(filtered);
    }, [transactions, debouncedSearch, darkMode]);

    useEffect(() => {
        setFilteredData(transactions);
    }, [transactions, darkMode]);

    const handleAddExpense = () => {
        const gstAmount =
            (newTransaction.amount * GST_RATES[newTransaction.category]) / 100;
        const totalAmount = parseFloat(newTransaction.amount) - gstAmount;

        const updatedTransaction = {
            ...newTransaction,
            gst: gstAmount,
            totalAmount: totalAmount.toFixed(2),
            date: new Date().toLocaleDateString(),
        };

        const updatedTransactions = [updatedTransaction, ...transactions];

        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));
        setShowModal(false);
        setNewTransaction({
            date: "",
            description: "",
            category: "Food",
            amount: 0,
            gst: 0,
            totalAmount: 0,
        });

        Swal.fire("Success!", "Transaction added successfully.", "success");
    };

    const accountId = Cookies.get("activeAccountId");

    useEffect(() => {
        const getExpenseData = async () => {
            if (accountId) {
                setLoading(true); // Start loading
                try {
                    const response = await fetch(`http://localhost:3000/api/expense/${accountId}`);
                    const data = await response.json();
                    console.log(data, "Fetched Expense Data");

                    const validTransactions = data?.data?.filter(txn =>
                        txn.createdAt || txn.category || txn.description || txn.expenseAmount || txn.GST || txn.baseAmount
                    ) || [];

                    setTransactions(validTransactions);
                    setFilteredData(validTransactions);

                    // Extract totalExpenseAmount from the last element of the data array
                    if (data?.data && data.data.length > 0) {
                        const lastElement = data.data[data.data.length - 1];
                        if (lastElement?.totalExpenseAmount !== undefined) {
                            setTotalSpent(parseFloat(lastElement.totalExpenseAmount.toFixed(2))); // Update totalSpent
                        } else {
                            setTotalSpent(0);
                        }
                    } else {
                        setTotalSpent(0);
                    }
                } catch (err) {
                    console.error("Error fetching expense data:", err);
                    setTotalSpent(0); // Ensure totalSpent is reset on error
                } finally {
                    setLoading(false); // Stop loading
                }
            } else {
                console.log("No active account ID found.");
                setTransactions([]);
                setFilteredData([]);
                setTotalSpent(0);
                setLoading(false);
            }
        };

        getExpenseData();
    }, [accountId]);

    const handleDelete = (id) => {
        const updatedTransactions = transactions.filter((txn) => txn._id !== id);
        setTransactions(updatedTransactions);
        localStorage.setItem("transactions", JSON.stringify(updatedTransactions));

        Swal.fire("Deleted!", "Transaction has been deleted.", "error");
    };

    const handleEdit = (txn) => {
        setNewTransaction({
            _id: txn._id,
            date: txn.createdAt ? new Date(txn.createdAt).toISOString().split("T")[0] : "",
            description: txn.description || "",
            category: txn.category || "Food",
            amount: txn.expenseAmount || 0,
            gst: txn.GST || 0,
            totalAmount: txn.baseAmount || 0,
        });
        setShowModal(true);
    };

    const handleSearchChange = (e) => {
        setSearchCategory(e.target.value);
    };

    return (
        <div className={`dashboard-container`}>
            <main className="dashboard-main">
                

                <div className="transaction-item">
                    <h3>Expense item</h3>
                </div>

                <div style={{ position: "relative", width: "250px", marginBottom: "15px" }}>
                    <FaSearch
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#888",
                        }}
                    />
                    <input
                        type="search"
                        placeholder="Search by category..."
                        value={searchCategory}
                        onChange={(i) => setSearchCategory(i.target.value)}
                        autoFocus
                        style={{
                            width: "100%",
                            padding: "8px 8px 8px 32px",
                            border: "1px solid #ccc",
                            borderRadius: "6px",
                        }}
                    />
                </div>

                {loading ? (
                    <div>Loading...</div> // Simple loading indicator
                ) : (
                    <div className="total-spent">Total Spent: ₹{totalSpent}</div> // Display totalSpent
                )}
                <br />
                <br />
                {filteredData.length === 0 && !loading ? (
                    <p>No transactions found.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Category</th>
                                    <th>Description</th>
                                    <th>Base Amount (₹)</th>
                                    <th>GST (₹)</th>
                                    <th>Total Amount (₹)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((txn, index) => (
                                    <tr key={txn._id || index}>
                                        <td>
                                            {txn.createdAt
                                                ? new Date(txn.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                        <td>{txn.category}</td>
                                        <td>{txn.description}</td>
                                        <td>₹{txn.expenseAmount}</td>
                                        <td>₹{txn.GST}</td>
                                        <td>₹{txn.baseAmount}</td>
                                        <td>
                                            {/* <button onClick={() => handleEdit(txn)}>
                                                <FaEdit />
                                            </button> */}
                                            <button onClick={() => handleDelete(txn._id)}>
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {showModal && (
                    <div className="slide-up-overlay">
                        <div className="slide-up-modal">
                            <h3>
                                {newTransaction._id
                                    ? "Edit Transaction"
                                    : "Add New Transaction"}
                            </h3>
                            <select
                                value={newTransaction.category}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        category: e.target.value,
                                    })
                                }
                            >
                                {Object.keys(GST_RATES).map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder="Description"
                                value={newTransaction.description}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        description: e.target.value,
                                    })
                                }
                            />
                            <input
                                type="number"
                                placeholder="Amount (₹)"
                                value={newTransaction.amount}
                                onChange={(e) =>
                                    setNewTransaction({
                                        ...newTransaction,
                                        amount: parseFloat(e.target.value) || 0,
                                    })
                                }
                            />
                            <div>
                                <strong>
                                    GST ({GST_RATES[newTransaction.category]}%):
                                </strong>{" "}
                                ₹
                                {(
                                    ((parseFloat(newTransaction.amount) || 0) *
                                        GST_RATES[newTransaction.category]) /
                                    100
                                ).toFixed(2)}
                            </div>
                            <button onClick={handleAddExpense} className="save-button">
                                {newTransaction._id ? "Save Changes" : "Add"}
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="cancel-button"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TransactionGraph;
