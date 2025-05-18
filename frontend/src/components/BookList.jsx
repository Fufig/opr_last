import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import BookCard from "./BookCard";

const GENRES = [
  'fiction', 'non-fiction', 'science', 'fantasy', 'mystery',
  'romance', 'biography', 'history', 'poetry', 'children'
];

const LANGUAGES = [
  'russian', 'english', 'german', 'french',
  'spanish', 'chinese', 'japanese'
];

const CONDITIONS = ['new', 'good', 'worn'];
const EXCHANGE_TYPES = ['temporary', 'permanent'];
const STATUSES = ['available', 'exchanged'];

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    genre: "",
    language: "",
    condition: "",
    exchange_type: "",
    status: ""
  });

  const loadBooks = async () => {
    try {
      setLoading(true);
      setErr("");
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const data = await apiFetch(`/api/books?${queryParams.toString()}`);
      setBooks(data);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Available Books</h2>
      {err && <p style={{ color: "red" }}>{err}</p>}

      <div style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 10 }}>
        <select
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        >
          <option value="">All Genres</option>
          {GENRES.map(genre => (
            <option key={genre} value={genre}>
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.language}
          onChange={(e) => handleFilterChange('language', e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        >
          <option value="">All Languages</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.condition}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        >
          <option value="">All Conditions</option>
          {CONDITIONS.map(condition => (
            <option key={condition} value={condition}>
              {condition.charAt(0).toUpperCase() + condition.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.exchange_type}
          onChange={(e) => handleFilterChange('exchange_type', e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        >
          <option value="">All Exchange Types</option>
          {EXCHANGE_TYPES.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 4,
            border: "1px solid #ccc"
          }}
        >
          <option value="">All Statuses</option>
          {STATUSES.map(status => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading books...</p>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 20
        }}>
          {books.map(book => (
            <BookCard
              key={book.id}
              book={book}
              onUpdate={loadBooks}
            />
          ))}
          {books.length === 0 && <p>No books found</p>}
        </div>
      )}
    </div>
  );
}