import { useState } from "react";
import { useAuth } from "../context/auth";
import BookExchange from "./BookExchange";

export default function BookCard({ book, onUpdate }) {
  const [showDescription, setShowDescription] = useState(false);
  const { user } = useAuth();

  const canRequestExchange = user &&
    user.id !== book.owner_id &&
    book.status === "available";

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: 8,
      padding: 15,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      backgroundColor: "white",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}>
      <h3 style={{ margin: 0 }}>{book.title}</h3>
      <p style={{ margin: 0 }}><strong>Author:</strong> {book.author}</p>
      <p style={{ margin: 0 }}><strong>Genre:</strong> {book.genre}</p>
      <p style={{ margin: 0 }}><strong>Language:</strong> {book.language}</p>
      <p style={{ margin: 0 }}><strong>Condition:</strong> {book.condition}</p>
      <p style={{ margin: 0 }}><strong>Pages:</strong> {book.pages}</p>
      <p style={{ margin: 0 }}><strong>Exchange Type:</strong> {book.exchange_type}</p>
      <p style={{ margin: 0 }}><strong>Status:</strong> {book.status}</p>
      <p style={{ margin: 0 }}><strong>Owner:</strong> {book.owner?.full_name || 'Unknown'}</p>

      {book.description && (
        <>
          <button
            onClick={() => setShowDescription(!showDescription)}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f0f0f0",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {showDescription ? "Hide Description" : "Show Description"}
          </button>
          {showDescription && (
            <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{book.description}</p>
          )}
        </>
      )}

      {canRequestExchange && (
        <BookExchange bookId={book.id} onSuccess={onUpdate} />
      )}
    </div>
  );
}