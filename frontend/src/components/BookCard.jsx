// src/components/BookCard.jsx
import { useState } from "react";
import { useAuth } from "../context/auth"; // Assuming auth.jsx
import BookExchange from "./BookExchange";
import './BookCard.css'; // We'll create this CSS file

export default function BookCard({ book, onUpdate }) {
  const [showDescription, setShowDescription] = useState(false);
  const { user } = useAuth();

  const canRequestExchange = user &&
    user.id !== book.owner_id &&
    book.status === "available";

  return (
    <div className="book-card">
      <h3 className="book-card-title">{book.title}</h3>
      <p className="book-card-detail"><strong>Author:</strong> {book.author}</p>
      <p className="book-card-detail"><strong>Genre:</strong> {book.genre}</p>
      <p className="book-card-detail"><strong>Language:</strong> {book.language}</p>
      <p className="book-card-detail"><strong>Condition:</strong> {book.condition}</p>
      <p className="book-card-detail"><strong>Pages:</strong> {book.pages || 'N/A'}</p>
      <p className="book-card-detail"><strong>Exchange Type:</strong> {book.exchange_type}</p>
      <p className="book-card-detail">
        <strong>Status:</strong>
        <span className={`status status-${book.status?.toLowerCase()}`}>{book.status}</span>
      </p>
      <p className="book-card-detail"><strong>Owner:</strong> {book.owner?.full_name || 'Unknown'}</p>

      {book.description && (
        <div className="book-card-description-section">
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="button-outline small"
          >
            {showDescription ? "Hide Description" : "Show Description"}
          </button>
          {showDescription && (
            <p className="book-card-description-text">{book.description}</p>
          )}
        </div>
      )}

      {canRequestExchange && (
        <div className="book-card-exchange-section">
          <BookExchange bookId={book.id} onSuccess={onUpdate} />
        </div>
      )}
    </div>
  );
}