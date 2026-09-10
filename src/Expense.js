import React, { useState } from "react";
import API from "./api";
import "./Expense.css";

function Expense() {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await API.post("/expenses", {
        title: formData.title,
        amount: Number(formData.amount),
        category: formData.category,
        date: formData.date,
        description: formData.description,
      });

      console.log("Expense created:", response.data);

      setMessage("Expense added successfully! 🎉");

      setFormData({
        title: "",
        amount: "",
        category: "",
        date: "",
        description: "",
      });
    } catch (error) {
      console.error("Expense error:", error);

      if (error.response) {
        setMessage(
          error.response.data?.message ||
            `Failed to add expense (${error.response.status})`
        );
      } else {
        setMessage("Cannot connect to the backend.");
      }
    }
  };

  return (
    <div className="expense-page">
      <div className="expense-card">

        <div className="expense-header">
          <h1>Add Expense</h1>
          <p>Record your spending and keep track of your money.</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Expense Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Dinner"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add a description (optional)"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="add-expense-button"
          >
            Add Expense
          </button>

        </form>

        {message && (
          <div className="expense-message">
            {message}
          </div>
        )}

      </div>
    </div>
  );
}

export default Expense;