import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useAuth } from "../context/auth";
import { Link } from "react-router-dom";

export default function MyBooks() {
    const [books, setBooks] = useState([]);
    const [exchanges, setExchanges] = useState([]);
    const [err, setErr] = useState("");
    const { user } = useAuth();

    const loadBooks = () => {
        apiFetch(`/api/books?owner_id=${user.id}`)
            .then(setBooks)
            .catch((e) => setErr(e.message));
    };

    const loadExchanges = () => {
        apiFetch('/api/exchanges')
            .then(setExchanges)
            .catch((e) => setErr(e.message));
    };

    useEffect(() => {
        loadBooks();
        loadExchanges();
    }, [user.id]);

    const handleDelete = async (bookId) => {
        if (!window.confirm("Are you sure you want to delete this book?")) {
            return;
        }
        try {
            await apiFetch(`/api/books/${bookId}`, {
                method: "DELETE"
            }, false);
            loadBooks();
        } catch (e) {
            setErr(e.message);
        }
    };

    const hasPendingExchange = (bookId) => {
        return exchanges.some(exchange =>
            exchange.book_id === bookId &&
            exchange.status === 'pending'
        );
    };

    return (
        <div style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2>My Books</h2>
                <Link to="/add-book">
                    <button>Add New Book</button>
                </Link>
            </div>

            {err && <p style={{ color: "red" }}>{err}</p>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                {books.map(book => (
                    <div
                        key={book.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: 8,
                            padding: 15,
                            display: "flex",
                            flexDirection: "column",
                            gap: 10
                        }}
                    >
                        <h3>{book.title}</h3>
                        <p><strong>Author:</strong> {book.author}</p>
                        <p><strong>Genre:</strong> {book.genre}</p>
                        <p><strong>Language:</strong> {book.language}</p>
                        <p><strong>Condition:</strong> {book.condition}</p>
                        <p><strong>Pages:</strong> {book.pages}</p>
                        <p><strong>Exchange Type:</strong> {book.exchange_type}</p>
                        <p><strong>Status:</strong> {book.status}</p>

                        {book.description && (
                            <p style={{ whiteSpace: "pre-wrap" }}>{book.description}</p>
                        )}

                        <div style={{ display: "flex", gap: 10, marginTop: "auto" }}>
                            <Link to={`/edit-book/${book.id}`}>
                                <button>Edit</button>
                            </Link>
                            <button onClick={() => handleDelete(book.id)}>Delete</button>
                            {hasPendingExchange(book.id) ? (
                                <button
                                    disabled
                                    style={{
                                        backgroundColor: '#ccc',
                                        cursor: 'not-allowed'
                                    }}
                                >
                                    Exchange Requested
                                </button>
                            ) : (
                                <Link to={`/book/${book.id}`}>
                                    <button>Exchange</button>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
                {books.length === 0 && <p>You haven't added any books yet</p>}
            </div>
        </div>
    );
} 