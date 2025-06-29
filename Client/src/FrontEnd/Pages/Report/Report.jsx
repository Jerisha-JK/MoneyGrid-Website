import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Report.css";
import Cookies from "js-cookie";
import axios from "axios";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Attach autoTable plugin to jsPDF instance


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7B1FA2', '#E91E63'];
// autoTable(jsPDF);

function ReportsPage() {
    const [startDate, setStartDate] = useState(() => {
        const saved = localStorage.getItem("startDate");
        return saved ? new Date(saved) : null;
    });
    const [endDate, setEndDate] = useState(() => {
        const saved = localStorage.getItem("endDate");
        return saved ? new Date(saved) : null;
    });
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(() => {
        return localStorage.getItem("selectedCategory") || null;
    });
    
    const accountId = Cookies.get("activeAccountId");
    const userId = Cookies.get("userId");

    // Save date and category filter to localStorage on change
    useEffect(() => {
        if (startDate) localStorage.setItem("startDate", startDate.toISOString());
        else localStorage.removeItem("startDate");

        if (endDate) localStorage.setItem("endDate", endDate.toISOString());
        else localStorage.removeItem("endDate");

        if (selectedCategory) localStorage.setItem("selectedCategory", selectedCategory);
        else localStorage.removeItem("selectedCategory");
    }, [startDate, endDate, selectedCategory]);

    const fetchTransactions = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }

        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];
        setLoading(true);

        try {
            const response = await axios.get(`http://localhost:3000/api/expense/${accountId}`, {
                params: {
                    userId,
                    accountId,
                    fromDate: formattedStartDate,
                    toDate: formattedEndDate,
                },
            });

            if (response.data && Array.isArray(response.data.data)) {
                const txns = response.data.data.filter(item => !item.totalExpenseAmount);
                setTransactions(txns);
            } else {
                setTransactions([]);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const pieChartData = transactions.reduce((acc, txn) => {
        const category = txn.category || "Uncategorized";
        const amount = parseFloat(txn.expenseAmount || 0);
        const existing = acc.find(item => item.name === category);
        if (existing) {
            existing.value += amount;
        } else {
            acc.push({ name: category, value: amount });
        }
        return acc;
    }, []);

    const filteredTransactions = selectedCategory
        ? transactions.filter(txn => txn.category === selectedCategory)
        : transactions;

    // PDF Export function
   const logoBase64 = "data:image/png;base64,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"; // Replace with your real image

const exportPDF = () => {
  const doc = new jsPDF();

  // Add header image
  doc.addImage(logoBase64, "PNG", 150, 10, 40, 15); // x, y, width, height

  doc.setFontSize(18);
  doc.text("Finance Report", 14, 22);

  doc.setFontSize(12);
  doc.text(
    `Date Range: ${startDate ? startDate.toLocaleDateString() : "-"} to ${endDate ? endDate.toLocaleDateString() : "-"}`,
    14,
    32
  );
  if (selectedCategory) {
    doc.text(`Filtered by Category: ${selectedCategory}`, 14, 40);
  }

  const tableColumn = ["Date", "Category", "Description", "Base (₹)", "GST (₹)", "Total (₹)"];
  const tableRows = [];

  let totalBase = 0;
  let totalGst = 0;
  let totalExpense = 0;

  filteredTransactions.forEach((txn) => {
    const base = parseFloat(txn.baseAmount || 0);
    const gst = parseFloat(txn.GST || 0);
    const total = parseFloat(txn.expenseAmount || 0);

    totalBase += base;
    totalGst += gst;
    totalExpense += total;

    const txnData = [
      txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : "N/A",
      txn.category || "-",
      txn.description || "-",
      base.toFixed(2),
      gst.toFixed(2),
      total.toFixed(2),
    ];
    tableRows.push(txnData);
  });

  // Add total row
  const totalRow = ["", "", "Total", totalBase.toFixed(2), totalGst.toFixed(2), totalExpense.toFixed(2)];
  tableRows.push(totalRow);

  autoTable(doc, {
    startY: selectedCategory ? 46 : 38,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 9 },
    didDrawCell: (data) => {
      // Bold the total row
      if (data.row.index === tableRows.length - 1) {
        doc.setFont("helvetica", "bold");
      }
    },
  });

  doc.save("finance_report.pdf");
};


    // Fix black box on pie slice click: prevent default event propagation + no active highlight
    // Also, set cursor to pointer for clickable slices via style
    const handlePieClick = (data) => {
        setSelectedCategory(data.name);
        localStorage.setItem("selectedCategory", data.name);
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>Finance Reports</h1>

            <div style={{ display: "flex", gap: "35px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div>
                    <label>Start Date:</label><br />
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select start date"
                    />
                </div>
                <div>
                    <label>End Date:</label><br />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select end date"
                    />
                </div>
                <div style={{ alignSelf: "flex-end", display: "flex", gap: "25px" }}>
                    <button
                        onClick={fetchTransactions}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "plum",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}
                    >
                        View Transactions
                    </button>

                    <button
                        onClick={exportPDF}
                        disabled={filteredTransactions.length === 0}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: filteredTransactions.length === 0 ? "plum" : "purple",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: filteredTransactions.length === 0 ? "not-allowed" : "pointer",
                        }}
                        title={filteredTransactions.length === 0 ? "No data to export" : "Export as PDF"}
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {/* Pie Chart */}
                    {pieChartData.length > 0 && (
                        <div style={{ width: "100%", height: 350, marginBottom: "40px" }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name} (${(percent * 100).toFixed(1)}%)`
                                        }
                                        isAnimationActive={true}
                                        onClick={handlePieClick}
                                        cursor="pointer"
                                        activeIndex={-1} // disables default active slice highlighting which causes black box
                                    >
                                        {pieChartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>

                                    {/* Center total label */}
                                    <text
                                        x="50%"
                                        y="50%"
                                        textAnchor="middle"
                                        dominantBaseline="middle"
                                        style={{ fontSize: "16px", fontWeight: "bold" }}
                                    >
                                        ₹{pieChartData.reduce((sum, entry) => sum + entry.value, 0).toFixed(2)}
                                    </text>

                                    <Tooltip
                                        formatter={(value) => [`₹${value.toFixed(2)}`, "Amount"]}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Selected Category Info */}
                    {selectedCategory && (
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Filtering by Category:</strong> {selectedCategory}
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    localStorage.removeItem("selectedCategory");
                                }}
                                style={{ marginLeft: "10px", padding: "5px 10px", cursor: "pointer" }}
                            >
                                Clear Filter
                            </button>
                        </div>
                    )}

                    {/* Transaction Table */}
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ backgroundColor: "#f2f2f2" }}>
                            <tr>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Date</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Category</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Description</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Base Amount (₹)</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>GST (₹)</th>
                                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                                        No transactions found {selectedCategory ? `for "${selectedCategory}"` : "for the selected date range"}.
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn, index) => (
                                    <tr key={txn._id || index}>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                            {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : "N/A"}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{txn.category}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>{txn.description}</td>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                            ₹{parseFloat(txn.baseAmount || 0).toFixed(2)}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                            ₹{parseFloat(txn.GST || 0).toFixed(2)}
                                        </td>
                                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                                            ₹{parseFloat(txn.expenseAmount || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default ReportsPage;
