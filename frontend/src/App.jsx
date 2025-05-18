// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate, NavLink } from "react-router-dom";
import { useAuth } from "./context/auth"; // Assuming auth.jsx
import BookList from "./components/BookList";
import MyBooks from "./components/MyBooks";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";
import ExchangeManager from "./components/ExchangeManager";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Protected from "./components/Protected"; // Assuming Protected.jsx is in routes
import AdminUsers from "./components/AdminUsers"; // Assuming AdminUsers.jsx

import "./App.css"; // Styles for App layout

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div className="loading-indicator">Loading application...</div>;
  }

  return (
    <Router>
      <div className="app-container">
        <nav className="main-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Books</NavLink>
          {user ? (
            <>
              <NavLink to="/my-books" className={({ isActive }) => isActive ? "active" : ""}>My Books</NavLink>
              <NavLink to="/exchanges" className={({ isActive }) => isActive ? "active" : ""}>Exchanges</NavLink>
              {user.role === 'admin' && (
                 <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>Admin Users</NavLink>
              )}
              <div className="nav-user-section">
                <Profile />
                <button
                  onClick={logout}
                  className="danger" // Using global style
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-user-section">
              <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
              <NavLink to="/register" className={({ isActive }) => isActive ? "active" : ""}>Register</NavLink>
            </div>
          )}
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

            {/* Protected Routes */}
            <Route path="/my-books" element={<Protected><MyBooks /></Protected>} />
            <Route path="/add-book" element={<Protected><AddBook /></Protected>} />
            <Route path="/edit-book/:bookId" element={<Protected><EditBook /></Protected>} />
            <Route path="/exchanges" element={<Protected><ExchangeManager /></Protected>} />
            
            {/* Admin Protected Route */}
            <Route path="/admin/users" element={<Protected adminOnly={true}><AdminUsers /></Protected>} />


            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/" />} /> {/* Fallback for unknown routes */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;