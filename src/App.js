import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./Dashboard";
import Expense from "./Expense";
import ExpenseList from "./ExpenseList";
import Budget from "./Budget";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      {/* Navigation */}
      <Navbar />

      <Routes>

        {/* =========================
            Public Routes
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================
            Home Route
        ========================= */}

        <Route
          path="/"
          element={
            localStorage.getItem("token") ? (
              <Navigate
                to="/dashboard"
                replace
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />


        {/* =========================
            Dashboard
        ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* =========================
            Add Expense
        ========================= */}

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expense />
            </ProtectedRoute>
          }
        />


        {/* =========================
            My Expenses
        ========================= */}

        <Route
          path="/expense-list"
          element={
            <ProtectedRoute>
              <ExpenseList />
            </ProtectedRoute>
          }
        />


        {/* =========================
            Monthly Budget
        ========================= */}

        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <Budget />
            </ProtectedRoute>
          }
        />


        {/* =========================
            Unknown URL
        ========================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;