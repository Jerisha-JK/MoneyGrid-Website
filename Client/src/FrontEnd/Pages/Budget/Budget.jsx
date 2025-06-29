import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "./Budget.css";
import Cookies from "js-cookie";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Budgeting = () => {
    const [budgets, setBudgets] = useState({});
    const [spending, setSpending] = useState({});
    const [categories, setCategories] = useState([]);
    const [accountId, setAccountId] = useState(Cookies.get('activeAccountId'));
    const [totalBudget, setTotalBudget] = useState(0);
    const [userId, setUserId] = useState(Cookies.get('userId'));

    useEffect(() => {
        const fetchBudgetOverview = async () => {
            const activeId = Cookies.get('activeAccountId');
            const userIdFromCookie = Cookies.get('userId');
            if (activeId && userIdFromCookie) {
                try {
                    const response = await fetch(`http://localhost:3000/api/account/${userIdFromCookie}`);
                    const responseData = await response.json();
                    console.log("Fetched Account Data for Budget:", responseData);

                    if (responseData && responseData.status && Array.isArray(responseData.data)) {
                        const spendingData = {};
                        const categoryList = [];
                        const categorySpendingMap = {};
                        let totalBudgetFromBackend = 0;

                        const account = responseData.data.find(acc => acc._id === activeId);
                        if (account) {
                            totalBudgetFromBackend = account.budgetAmount || 0;
                        }

                        const expenseResponse = await fetch(`http://localhost:3000/api/expense/${activeId}`);
                        const expenseData = await expenseResponse.json();

                        if (expenseData && expenseData.status && Array.isArray(expenseData.data)) {
                            expenseData.data.forEach(item => {
                                if (item.category) {
                                    spendingData[item.category] = (spendingData[item.category] || 0) + item.expenseAmount;
                                    if (!categoryList.includes(item.category)) {
                                        categoryList.push(item.category);
                                    }
                                }
                            });
                        }
                        const allCategories = [...new Set([...categoryList])];
                        setCategories(allCategories);
                        setSpending(spendingData);
                        setTotalBudget(totalBudgetFromBackend);

                        // Generate budgets for each category
                        const generatedBudgets = generateCategoryBudgets(allCategories, totalBudgetFromBackend);
                        setBudgets(generatedBudgets);


                    } else {
                        console.warn("Invalid data format received for account data.");
                        setBudgets({});
                        setSpending({});
                        setCategories([]);
                        setTotalBudget(0);
                    }
                } catch (error) {
                    console.error("Error fetching account data:", error);
                    setBudgets({});
                    setSpending({});
                    setCategories([]);
                    setTotalBudget(0);
                }
            } else {
                console.log("No active account ID or User ID found in cookies.");
                setBudgets({});
                setSpending({});
                setCategories([]);
                setTotalBudget(0);
            }
        };

        fetchBudgetOverview();
    }, [accountId, userId]);

    // Function to generate budget for each category
    const generateCategoryBudgets = (categories, totalBudget) => {
        const numCategories = categories.length;
        if (numCategories === 0 || totalBudget === 0) {
            return {};
        }
        const equalAmount = Math.floor(totalBudget / numCategories);
        const remaining = totalBudget - (equalAmount * numCategories);

        const generatedBudgets = {};
        categories.forEach((category, index) => {
            generatedBudgets[category] = equalAmount + (index < remaining ? 1 : 0);
        });
        return generatedBudgets;
    };

    const data = {
        labels: categories,
        datasets: [
            {
                label: "Budget",
                data: categories.map((cat) => budgets[cat] || 0),
                backgroundColor: "#3b82f6",
            },
            {
                label: "Spending",
                data: categories.map((cat) => spending[cat] || 0),
                backgroundColor: "#ef4444",
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Spending vs Budget per Category" },
        },
    };

    return (
        <div className="budgeting-wrapper ">
            <h2 className="budgeting-title">Budget</h2>
            <h3>Budgeted Amount: ₹{totalBudget}</h3>
            <div className="categories-grid">
                {categories.map((category) => (
                    <div key={category} className="category-card">
                        <h3 className="category-title">{category}</h3>
                        <p className="category-budget">Budget: ₹{budgets[category] || 0}</p>
                        <p className="category-label">Spending: ₹{spending[category] || 0}</p>
                    </div>
                ))}
            </div>

            <div className="chart-container">
                {categories.length > 0 && <Bar data={data} options={options} />}
                {categories.length === 0 && <p>No budget data available.</p>}
            </div>
        </div>
    );
};

export default Budgeting;
