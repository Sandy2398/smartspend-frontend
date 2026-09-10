import React, { useEffect, useState } from "react";
import API from "./api";
import "./Dashboard.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [monthlySpent, setMonthlySpent] = useState(0);

  useEffect(() => {
    fetchExpenses();
    loadBudget();
  }, []);

  // -----------------------------
  // Fetch expenses
  // -----------------------------

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");

      const data = response.data;

      setExpenses(data);

      // Total expenses
      const totalAmount = data.reduce(
        (sum, expense) =>
          sum + Number(expense.amount),
        0
      );

      setTotal(totalAmount);

      // -----------------------------
      // Current month spending
      // -----------------------------

      const currentDate = new Date();

      const currentYear =
        currentDate.getFullYear();

      const currentMonth =
        currentDate.getMonth() + 1;

      const currentMonthExpenses =
        data.filter((expense) => {
          const [year, month] =
            expense.date
              .split("-")
              .map(Number);

          return (
            year === currentYear &&
            month === currentMonth
          );
        });

      const currentMonthTotal =
        currentMonthExpenses.reduce(
          (sum, expense) =>
            sum + Number(expense.amount),
          0
        );

      setMonthlySpent(currentMonthTotal);

    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );
    }
  };

  // -----------------------------
  // Load monthly budget
  // -----------------------------

  const loadBudget = () => {
    const savedBudget =
      localStorage.getItem(
        "monthlyBudget"
      );

    if (savedBudget) {
      setMonthlyBudget(
        Number(savedBudget)
      );
    }
  };

  // -----------------------------
  // Category totals
  // -----------------------------

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category =
      expense.category;

    if (categoryTotals[category]) {
      categoryTotals[category] +=
        Number(expense.amount);
    } else {
      categoryTotals[category] =
        Number(expense.amount);
    }
  });

  // -----------------------------
  // Category chart data
  // -----------------------------

  const categoryChartData =
    Object.entries(
      categoryTotals
    ).map(
      ([category, amount]) => ({
        name: category,
        value: amount,
      })
    );

  // -----------------------------
  // Monthly totals
  // -----------------------------

  const monthlyTotals = {};

  expenses.forEach((expense) => {
    const month =
      expense.date.substring(0, 7);

    if (monthlyTotals[month]) {
      monthlyTotals[month] +=
        Number(expense.amount);
    } else {
      monthlyTotals[month] =
        Number(expense.amount);
    }
  });

  const monthlyData =
    Object.entries(monthlyTotals)
      .sort(([monthA], [monthB]) =>
        monthA.localeCompare(monthB)
      )
      .map(([month, amount]) => {
        const [year, monthNumber] =
          month.split("-");

        const monthName =
          new Date(
            Number(year),
            Number(monthNumber) - 1,
            1
          ).toLocaleString(
            "default",
            {
              month: "short",
            }
          );

        return {
          month: `${monthName} ${year}`,
          amount: amount,
        };
      });

  // -----------------------------
  // Spending insights
  // -----------------------------

  const highestCategory =
    Object.entries(
      categoryTotals
    ).sort(
      (a, b) => b[1] - a[1]
    )[0];

  const highestExpense =
    expenses.length > 0
      ? expenses.reduce(
          (highest, expense) =>
            Number(expense.amount) >
            Number(highest.amount)
              ? expense
              : highest
        )
      : null;

  const averageExpense =
    expenses.length > 0
      ? total / expenses.length
      : 0;

  let insightMessage =
    "Start adding expenses to get spending insights.";

  if (
    highestCategory &&
    expenses.length > 0
  ) {
    insightMessage =
      `You spend the most on ${highestCategory[0]}.`;
  }

  // -----------------------------
  // Budget calculations
  // -----------------------------

  const remainingBudget =
    monthlyBudget - monthlySpent;

  const budgetPercentage =
    monthlyBudget > 0
      ? (monthlySpent / monthlyBudget) *
        100
      : 0;

  const progressPercentage =
    Math.min(
      budgetPercentage,
      100
    );

  // -----------------------------
  // Budget Alert
  // -----------------------------

  let budgetAlertTitle =
    "You're doing well!";

  let budgetAlertMessage =
    "Your spending is comfortably within your monthly budget.";

  let budgetAlertClass =
    "budget-alert-success";

  if (monthlyBudget === 0) {
    budgetAlertTitle =
      "No Budget Set";

    budgetAlertMessage =
      "Set a monthly budget to start receiving spending alerts.";

    budgetAlertClass =
      "budget-alert-neutral";
  } else if (budgetPercentage >= 100) {
    budgetAlertTitle =
      "Budget Exceeded!";

    budgetAlertMessage =
      `You have exceeded your monthly budget by ₹${Math.abs(
        remainingBudget
      ).toFixed(2)}.`;

    budgetAlertClass =
      "budget-alert-danger";
  } else if (budgetPercentage >= 80) {
    budgetAlertTitle =
      "Budget Warning";

    budgetAlertMessage =
      `You have used ${budgetPercentage.toFixed(
        1
      )}% of your monthly budget.`;

    budgetAlertClass =
      "budget-alert-warning";
  }

  return (
    <div className="dashboard">

      {/* =========================
          Dashboard Header
      ========================= */}

      <div className="dashboard-header">

        <h1>
          SmartSpend Dashboard
        </h1>

        <p>
          Track and manage your daily
          expenses easily.
        </p>

      </div>


      {/* =========================
          Summary Cards
      ========================= */}

      <div className="summary-cards">

        <div className="summary-card">

          <div className="card-icon">
            💰
          </div>

          <div>

            <h3>
              Total Expenses
            </h3>

            <h2>
              ₹{total.toFixed(2)}
            </h2>

          </div>

        </div>


        <div className="summary-card">

          <div className="card-icon">
            🧾
          </div>

          <div>

            <h3>
              Total Transactions
            </h3>

            <h2>
              {expenses.length}
            </h2>

          </div>

        </div>


        <div className="summary-card">

          <div className="card-icon">
            📊
          </div>

          <div>

            <h3>
              Categories
            </h3>

            <h2>
              {
                Object.keys(
                  categoryTotals
                ).length
              }
            </h2>

          </div>

        </div>

      </div>


      {/* =========================
          Budget Alert
      ========================= */}

      <div className="dashboard-section">

        <h2>
          🔔 Budget Alert
        </h2>

        <div
          className={`budget-alert ${budgetAlertClass}`}
        >

          <div className="budget-alert-icon">

            {monthlyBudget === 0
              ? "💡"
              : budgetPercentage >= 100
              ? "🚨"
              : budgetPercentage >= 80
              ? "⚠️"
              : "✅"}

          </div>

          <div className="budget-alert-content">

            <h3>
              {budgetAlertTitle}
            </h3>

            <p>
              {budgetAlertMessage}
            </p>

          </div>

        </div>

      </div>


      {/* =========================
          Monthly Budget
      ========================= */}

      <div className="dashboard-section">

        <h2>
          💰 Monthly Budget
        </h2>

        {monthlyBudget === 0 ? (

          <div className="budget-dashboard-card">

            <div className="budget-dashboard-icon">
              💡
            </div>

            <div>

              <h3>
                No monthly budget set
              </h3>

              <p>
                Go to the Budget page
                to set your monthly
                spending limit.
              </p>

            </div>

          </div>

        ) : (

          <div className="budget-dashboard-card">

            <div className="budget-dashboard-top">

              <div>

                <span>
                  Monthly Budget
                </span>

                <strong>
                  ₹
                  {monthlyBudget.toFixed(
                    2
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Spent This Month
                </span>

                <strong>
                  ₹
                  {monthlySpent.toFixed(
                    2
                  )}
                </strong>

              </div>


              <div>

                <span>
                  Remaining
                </span>

                <strong
                  className={
                    remainingBudget < 0
                      ? "budget-negative"
                      : "budget-positive"
                  }
                >
                  ₹
                  {remainingBudget.toFixed(
                    2
                  )}
                </strong>

              </div>

            </div>


            <div className="budget-dashboard-progress-header">

              <span>
                Budget Used
              </span>

              <strong>
                {budgetPercentage.toFixed(
                  1
                )}
                %
              </strong>

            </div>


            <div className="budget-dashboard-progress">

              <div
                className="budget-dashboard-progress-fill"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>


            <div
              className={
                budgetPercentage >= 100
                  ? "dashboard-budget-status danger"
                  : budgetPercentage >= 80
                  ? "dashboard-budget-status warning"
                  : "dashboard-budget-status success"
              }
            >

              {budgetPercentage >= 100
                ? "⚠️ You have exceeded your monthly budget."
                : budgetPercentage >= 80
                ? "⚠️ You are close to reaching your monthly budget."
                : "✅ You are within your monthly budget."}

            </div>

          </div>

        )}

      </div>


      {/* =========================
          Monthly Spending Chart
      ========================= */}

      <div className="dashboard-section">

        <h2>
          📈 Monthly Spending
        </h2>

        {monthlyData.length === 0 ? (

          <p className="empty-message">
            No expense data available
            for the chart.
          </p>

        ) : (

          <div className="chart-card">

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 20,
                    left: 10,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    dataKey="month"
                  />

                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(
                        value
                      ).toFixed(2)}`,
                      "Spending",
                    ]}
                  />

                  <Bar
                    dataKey="amount"
                    name="Monthly Spending"
                    radius={[
                      6,
                      6,
                      0,
                      0,
                    ]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

      </div>


      {/* =========================
          Spending by Category
      ========================= */}

      <div className="dashboard-section">

        <h2>
          🥧 Spending by Category
        </h2>

        {categoryChartData.length ===
        0 ? (

          <p className="empty-message">
            No expense data available
            for the chart.
          </p>

        ) : (

          <div className="chart-card">

            <div className="category-chart-container">

              <ResponsiveContainer
                width="100%"
                height={350}
              >

                <PieChart>

                  <Pie
                    data={
                      categoryChartData
                    }
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({
                      name,
                      percent,
                    }) =>
                      `${name} ${(
                        percent * 100
                      ).toFixed(1)}%`
                    }
                  >

                    {categoryChartData.map(
                      (
                        entry,
                        index
                      ) => (
                        <Cell
                          key={`cell-${index}`}
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(
                        value
                      ).toFixed(2)}`,
                      "Spending",
                    ]}
                  />

                  <Legend />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        )}

      </div>


      {/* =========================
          Spending Insights
      ========================= */}

      <div className="dashboard-section">

        <h2>
          💡 Spending Insights
        </h2>

        <div className="insights-grid">

          <div className="insight-card">

            <div className="insight-icon">
              🏆
            </div>

            <div>

              <h3>
                Top Category
              </h3>

              <p>
                {highestCategory
                  ? highestCategory[0]
                  : "No data"}
              </p>

              {highestCategory && (
                <span>
                  ₹
                  {highestCategory[1].toFixed(
                    2
                  )}
                </span>
              )}

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              💸
            </div>

            <div>

              <h3>
                Highest Expense
              </h3>

              <p>
                {highestExpense
                  ? highestExpense.title
                  : "No data"}
              </p>

              {highestExpense && (
                <span>
                  ₹
                  {Number(
                    highestExpense.amount
                  ).toFixed(
                    2
                  )}
                </span>
              )}

            </div>

          </div>


          <div className="insight-card">

            <div className="insight-icon">
              📊
            </div>

            <div>

              <h3>
                Average Expense
              </h3>

              <p>
                ₹
                {averageExpense.toFixed(
                  2
                )}
              </p>

              <span>
                Per transaction
              </span>

            </div>

          </div>

        </div>


        <div className="insight-message">

          💡 {insightMessage}

        </div>

      </div>


      {/* =========================
          Expenses by Category
      ========================= */}

      <div className="dashboard-section">

        <h2>
          📊 Expenses by Category
        </h2>

        {Object.keys(
          categoryTotals
        ).length === 0 ? (

          <p className="empty-message">
            No expenses found.
          </p>

        ) : (

          <div className="category-grid">

            {Object.entries(
              categoryTotals
            ).map(
              ([category, amount]) => (

                <div
                  className="category-card"
                  key={category}
                >

                  <h3>
                    {category}
                  </h3>

                  <p>
                    ₹
                    {amount.toFixed(
                      2
                    )}
                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =========================
          Recent Expenses
      ========================= */}

      <div className="dashboard-section">

        <h2>
          🕒 Recent Expenses
        </h2>

        {expenses.length === 0 ? (

          <p className="empty-message">
            No expenses found.
          </p>

        ) : (

          <div className="expense-table-container">

            <table className="expense-table">

              <thead>

                <tr>

                  <th>
                    Title
                  </th>

                  <th>
                    Amount
                  </th>

                  <th>
                    Category
                  </th>

                  <th>
                    Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {expenses
                  .slice()
                  .reverse()
                  .slice(0, 5)
                  .map(
                    (expense) => (

                      <tr
                        key={
                          expense.id
                        }
                      >

                        <td>
                          {expense.title}
                        </td>

                        <td>
                          ₹
                          {Number(
                            expense.amount
                          ).toFixed(
                            2
                          )}
                        </td>

                        <td>
                          {
                            expense.category
                          }
                        </td>

                        <td>
                          {
                            expense.date
                          }
                        </td>

                      </tr>

                    )
                  )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;