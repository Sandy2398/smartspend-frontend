import React, { useEffect, useState } from "react";
import API from "./api";
import "./Budget.css";

function Budget() {
  const [budget, setBudget] = useState("");
  const [spent, setSpent] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedBudget = localStorage.getItem("monthlyBudget");

    if (savedBudget) {
      setBudget(savedBudget);
    }

    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");

      const expenses = response.data;

      const currentDate = new Date();

      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const currentMonthExpenses = expenses.filter((expense) => {
        const [year, month] = expense.date
          .split("-")
          .map(Number);

        return (
          year === currentYear &&
          month === currentMonth
        );
      });

      const totalSpent = currentMonthExpenses.reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );

      setSpent(totalSpent);

    } catch (error) {
      console.error("Budget error:", error);
      setMessage("Failed to load expenses.");
    }
  };

  const handleBudgetSubmit = (e) => {
    e.preventDefault();

    if (!budget || Number(budget) <= 0) {
      setMessage("Please enter a valid budget.");
      return;
    }

    localStorage.setItem(
      "monthlyBudget",
      budget
    );

    setMessage("Monthly budget saved successfully! 🎉");
  };

  const budgetAmount = Number(budget) || 0;

  const remaining = budgetAmount - spent;

  const percentage =
    budgetAmount > 0
      ? (spent / budgetAmount) * 100
      : 0;

  const progressPercentage = Math.min(
    percentage,
    100
  );

  return (
    <div className="budget-page">

      <div className="budget-card">

        <div className="budget-header">

          <h1>💰 Monthly Budget</h1>

          <p>
            Set a budget and keep your spending
            under control.
          </p>

        </div>


        {/* Set Budget */}

        <form
          className="budget-form"
          onSubmit={handleBudgetSubmit}
        >

          <label>
            Monthly Budget
          </label>

          <div className="budget-input-container">

            <span>₹</span>

            <input
              type="number"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value)
              }
              placeholder="Enter monthly budget"
              min="1"
              required
            />

          </div>

          <button
            type="submit"
            className="budget-button"
          >
            Save Budget
          </button>

        </form>


        {message && (
          <div className="budget-message">
            {message}
          </div>
        )}


        {/* Budget Summary */}

        <div className="budget-summary">

          <div className="budget-summary-item">

            <span>
              Monthly Budget
            </span>

            <strong>
              ₹{budgetAmount.toFixed(2)}
            </strong>

          </div>


          <div className="budget-summary-item">

            <span>
              Spent This Month
            </span>

            <strong>
              ₹{spent.toFixed(2)}
            </strong>

          </div>


          <div className="budget-summary-item">

            <span>
              Remaining
            </span>

            <strong
              className={
                remaining < 0
                  ? "negative"
                  : "positive"
              }
            >
              ₹{remaining.toFixed(2)}
            </strong>

          </div>

        </div>


        {/* Progress */}

        <div className="budget-progress-section">

          <div className="progress-header">

            <span>
              Budget Used
            </span>

            <strong>
              {percentage.toFixed(1)}%
            </strong>

          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>

        </div>


        {/* Budget Status */}

        {budgetAmount > 0 && (

          <div
            className={
              percentage >= 100
                ? "budget-status danger"
                : percentage >= 80
                ? "budget-status warning"
                : "budget-status success"
            }
          >

            {percentage >= 100
              ? "⚠️ You have exceeded your monthly budget."
              : percentage >= 80
              ? "⚠️ You are close to reaching your monthly budget."
              : "✅ You are within your monthly budget."}

          </div>

        )}

      </div>

    </div>
  );
}

export default Budget;