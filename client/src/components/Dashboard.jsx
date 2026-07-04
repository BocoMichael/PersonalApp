import react from "react";




function Dashboard({ totalIncome = 0, totalExpenses = 0, balance = 0 }) {
    const cardStyle = {
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "1rem",
        background: "#f9f9f9",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div style={cardStyle}>
                    <h3>Total Income</h3>
                    <p style={{ fontSize: "1.2rem", margin: 0 }}>${Number(totalIncome).toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                    <h3>Total Expenses</h3>
                    <p style={{ fontSize: "1.2rem", margin: 0 }}>${Number(totalExpenses).toFixed(2)}</p>
                </div>
                <div style={cardStyle}>
                    <h3>Balance</h3>
                    <p style={{ fontSize: "1.2rem", margin: 0, color: balance >= 0 ? "green" : "red" }}>${Number(balance).toFixed(2)}</p>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;