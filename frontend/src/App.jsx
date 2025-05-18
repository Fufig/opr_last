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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex space-x-8">
                <Link to="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Books
                </Link>
                {user && (
                  <>
                    <Link to="/my-books" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      My Books
                    </Link>
                    <Link to="/exchanges" className="text-gray-900 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                      Exchanges
                    </Link>
                  </>
                )}
              </div>
              
              <div className="flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4">
                    <Profile />
                    <button
                      onClick={logout}
                      className="btn btn-danger"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-4">
                    <Link to="/login" className="btn btn-primary">
                      Login
                    </Link>
                    <Link to="/register" className="btn btn-secondary">
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </main>
      </div>
    </Router>
  );
}

export default App;