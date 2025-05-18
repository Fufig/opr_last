import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/auth";
import BookList from "./components/BookList";
import MyBooks from "./components/MyBooks";
import AddBook from "./components/AddBook";
import EditBook from "./components/EditBook";
import ExchangeManager from "./components/ExchangeManager";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";

function App() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <div style={{ padding: 20 }}>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <nav style={{
          padding: 20,
          display: "flex",
          gap: 10,
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #dee2e6",
          marginBottom: 20,
          alignItems: "center"
        }}>
          <Link to="/" style={{ textDecoration: "none", color: "#333" }}>Books</Link>
          {user ? (
            <>
              <Link to="/my-books" style={{ textDecoration: "none", color: "#333" }}>My Books</Link>
              <Link to="/exchanges" style={{ textDecoration: "none", color: "#333" }}>Exchanges</Link>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" }}>
                <Profile />
                <button
                  onClick={logout}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#dc3545",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer"
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: "none", color: "#333" }}>Login</Link>
              <Link to="/register" style={{ textDecoration: "none", color: "#333" }}>Register</Link>
            </>
          )}
        </nav>

        <div style={{ padding: "0 20px" }}>
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route
              path="/my-books"
              element={user ? <MyBooks /> : <Navigate to="/login" />}
            />
            <Route
              path="/add-book"
              element={user ? <AddBook /> : <Navigate to="/login" />}
            />
            <Route
              path="/edit-book/:bookId"
              element={user ? <EditBook /> : <Navigate to="/login" />}
            />
            <Route
              path="/exchanges"
              element={user ? <ExchangeManager /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;