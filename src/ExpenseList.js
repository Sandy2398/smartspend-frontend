import React, { useEffect, useState } from "react";
import API from "./api";
import "./ExpenseList.css";

function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [message, setMessage] = useState("");

  const [editingExpense, setEditingExpense] = useState(null);

  // Filter states
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const fetchExpenses = async () => {
    try {
      const response = await API.get("/expenses");
      setExpenses(response.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setMessage("Failed to load expenses.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // -----------------------------
  // Delete Expense
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/expenses/${id}`);

      setMessage("Expense deleted successfully! 🗑️");

      fetchExpenses();
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            `Failed to delete expense (${error.response.status})`
        );
      } else {
        setMessage("Cannot connect to the backend.");
      }
    }
  };

  // -----------------------------
  // Edit Expense
  // -----------------------------

  const handleEditClick = (expense) => {
    setEditingExpense({
      id: expense.id,
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description || "",
    });

    setMessage("");
  };

  const handleEditChange = (e) => {
    setEditingExpense({
      ...editingExpense,
      [e.target.name]: e.target.value,
    });
  };

  // -----------------------------
  // Update Expense
  // -----------------------------

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/expenses/${editingExpense.id}`, {
        title: editingExpense.title,
        amount: Number(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
        description: editingExpense.description,
      });

      setMessage("Expense updated successfully! ✏️");

      setEditingExpense(null);

      fetchExpenses();
    } catch (error) {
      console.error("Update error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            `Failed to update expense (${error.response.status})`
        );
      } else {
        setMessage("Cannot connect to the backend.");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // -----------------------------
  // Clear Filters
  // -----------------------------

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("");
    setDateFilter("");
    setSortBy("");
  };

  // -----------------------------
  // Filter Expenses
  // -----------------------------

  let filteredExpenses = expenses.filter((expense) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      expense.title
        ?.toLowerCase()
        .includes(searchText) ||
      expense.description
        ?.toLowerCase()
        .includes(searchText) ||
      expense.category
        ?.toLowerCase()
        .includes(searchText);

    const matchesCategory =
      categoryFilter === "" ||
      expense.category === categoryFilter;

    const matchesDate =
      dateFilter === "" ||
      expense.date === dateFilter;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDate
    );
  });

  // -----------------------------
  // Sort Expenses
  // -----------------------------

  if (sortBy === "amount-high") {
    filteredExpenses.sort(
      (a, b) =>
        Number(b.amount) - Number(a.amount)
    );
  }

  if (sortBy === "amount-low") {
    filteredExpenses.sort(
      (a, b) =>
        Number(a.amount) - Number(b.amount)
    );
  }

  if (sortBy === "date-new") {
    filteredExpenses.sort(
      (a, b) =>
        new Date(b.date) - new Date(a.date)
    );
  }

  if (sortBy === "date-old") {
    filteredExpenses.sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );
  }

  // -----------------------------
  // Total filtered amount
  // -----------------------------

  const filteredTotal = filteredExpenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  // -----------------------------
  // Get categories
  // -----------------------------

  const categories = [
    ...new Set(
      expenses.map((expense) => expense.category)
    ),
  ];

  return (
    <div className="expense-list-page">

      {/* =========================
          Header
      ========================= */}

      <div className="expense-list-header">

        <h1>My Expenses</h1>

        <p>
          View and manage all your expenses.
        </p>

      </div>


      {/* =========================
          Message
      ========================= */}

      {message && (
        <div className="expense-list-message">
          {message}
        </div>
      )}


      {/* =========================
          Filters
      ========================= */}

      <div className="filters-card">

        <div className="filters-header">

          <div>
            <h2>🔎 Search & Filter</h2>

            <p>
              Find your expenses quickly.
            </p>
          </div>

          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>

        </div>


        <div className="filters-grid">

          {/* Search */}

          <div className="filter-group">

            <label>
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search expenses..."
            />

          </div>


          {/* Category */}

          <div className="filter-group">

            <label>
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(e.target.value)
              }
            >

              <option value="">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

            </select>

          </div>


          {/* Date */}

          <div className="filter-group">

            <label>
              Date
            </label>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(e.target.value)
              }
            />

          </div>


          {/* Sort */}

          <div className="filter-group">

            <label>
              Sort By
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="">
                Default
              </option>

              <option value="amount-high">
                Amount: High to Low
              </option>

              <option value="amount-low">
                Amount: Low to High
              </option>

              <option value="date-new">
                Date: Newest First
              </option>

              <option value="date-old">
                Date: Oldest First
              </option>

            </select>

          </div>

        </div>


        {/* Filter Summary */}

        <div className="filter-summary">

          <span>
            Showing{" "}
            <strong>
              {filteredExpenses.length}
            </strong>{" "}
            expense
            {filteredExpenses.length !== 1
              ? "s"
              : ""}
          </span>

          <span>
            Total:{" "}
            <strong>
              ₹{filteredTotal.toFixed(2)}
            </strong>
          </span>

        </div>

      </div>


      {/* =========================
          Edit Form
      ========================= */}

      {editingExpense && (

        <div className="edit-expense-card">

          <h2>✏️ Edit Expense</h2>

          <form onSubmit={handleUpdate}>

            <div className="edit-form-group">

              <label>
                Expense Title
              </label>

              <input
                type="text"
                name="title"
                value={editingExpense.title}
                onChange={handleEditChange}
                required
              />

            </div>


            <div className="edit-form-group">

              <label>
                Amount
              </label>

              <input
                type="number"
                name="amount"
                value={editingExpense.amount}
                onChange={handleEditChange}
                min="1"
                required
              />

            </div>


            <div className="edit-form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={editingExpense.category}
                onChange={handleEditChange}
                required
              >

                <option value="">
                  Select category
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Shopping">
                  Shopping
                </option>

                <option value="Bills">
                  Bills
                </option>

                <option value="Entertainment">
                  Entertainment
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>


            <div className="edit-form-group">

              <label>
                Date
              </label>

              <input
                type="date"
                name="date"
                value={editingExpense.date}
                onChange={handleEditChange}
                required
              />

            </div>


            <div className="edit-form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={editingExpense.description}
                onChange={handleEditChange}
                rows="4"
              />

            </div>


            <div className="edit-buttons">

              <button
                type="submit"
                className="save-button"
              >
                Save Changes
              </button>

              <button
                type="button"
                className="cancel-button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

      )}


      {/* =========================
          Expense Table
      ========================= */}

      <div className="expense-table-card">

        {expenses.length === 0 ? (

          <div className="empty-expenses">

            <h2>
              No Expenses Found
            </h2>

            <p>
              Start adding expenses to see them
              here.
            </p>

          </div>

        ) : filteredExpenses.length === 0 ? (

          <div className="empty-expenses">

            <h2>
              No Matching Expenses
            </h2>

            <p>
              Try changing your search or
              filters.
            </p>

          </div>

        ) : (

          <div className="table-container">

            <table className="expenses-table">

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

                  <th>
                    Description
                  </th>

                  <th>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredExpenses.map(
                  (expense) => (

                    <tr key={expense.id}>

                      <td className="expense-title">
                        {expense.title}
                      </td>

                      <td className="expense-amount">
                        ₹
                        {Number(
                          expense.amount
                        ).toFixed(2)}
                      </td>

                      <td>

                        <span className="category-badge">
                          {expense.category}
                        </span>

                      </td>

                      <td>
                        {expense.date}
                      </td>

                      <td>
                        {expense.description ||
                          "-"}
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              handleEditClick(
                                expense
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                expense.id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

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

export default ExpenseList;