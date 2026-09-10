import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  // Don't show the navigation menu
  // when the user is not logged in.
  if (!token) {
    return null;
  }

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px 30px",
        backgroundColor: "#222",
        color: "white",
      }}
    >

      <h2 style={{ margin: 0 }}>
        SmartSpend
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >

        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/expenses"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Add Expense
        </Link>

        <Link
          to="/expense-list"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          My Expenses
        </Link>

        <Link
          to="/budget"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Budget
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;