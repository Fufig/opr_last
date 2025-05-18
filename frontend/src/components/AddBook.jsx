// src/components/AddBook.jsx
import { useState } from "react";
import { apiFetch } from "../api"; // Assuming api.js
import { useNavigate } from "react-router-dom";
import './Form.css'; // Common styles for forms

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

export default function AddBook() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "", author: "", description: "", condition: "",
    genre: "", language: "", pages: "", exchange_type: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await apiFetch("/api/books", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          pages: formData.pages ? parseInt(formData.pages) : null
        })
      });
      navigate("/my-books");
    } catch (e) {
      setError(e.message || "Failed to add book. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Book</h2>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit} className="styled-form">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input id="title" type="text" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="author">Author:</label>
            <input id="author" type="text" name="author" value={formData.author} onChange={handleChange} required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="condition">Condition:</label>
            <select id="condition" name="condition" value={formData.condition} onChange={handleChange} required>
              <option value="">Select Condition</option>
              {CONDITIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="genre">Genre:</label>
            <select id="genre" name="genre" value={formData.genre} onChange={handleChange} required>
              <option value="">Select Genre</option>
              {GENRES.map(g => <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <select id="language" name="language" value={formData.language} onChange={handleChange} required>
              <option value="">Select Language</option>
              {LANGUAGES.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="pages">Pages:</label>
            <input id="pages" type="number" name="pages" value={formData.pages} onChange={handleChange} min="0" />
          </div>
        </div>
        
        <div className="form-group">
            <label htmlFor="exchange_type">Exchange Type:</label>
            <select id="exchange_type" name="exchange_type" value={formData.exchange_type} onChange={handleChange} required>
              <option value="">Select Exchange Type</option>
              {EXCHANGE_TYPES.map(type => <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>)}
            </select>
          </div>

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add Book"}
          </button>
          <button type="button" className="secondary" onClick={() => navigate("/my-books")} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}