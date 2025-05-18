import { useState, useEffect } from "react";
import { apiFetch } from "../api";
import { useNavigate, useParams } from "react-router-dom";

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

export default function EditBook() {
    const navigate = useNavigate();
    const { bookId } = useParams();
    const [err, setErr] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        description: "",
        condition: "",
        genre: "",
        language: "",
        pages: "",
        exchange_type: ""
    });

    useEffect(() => {
        apiFetch(`/api/books/${bookId}`)
            .then(book => {
                setFormData({
                    ...book,
                    pages: book.pages?.toString() || ""
                });
            })
            .catch(e => setErr(e.message));
    }, [bookId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiFetch(`/api/books/${bookId}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...formData,
                    pages: formData.pages ? parseInt(formData.pages) : null
                })
            });
            navigate("/my-books");
        } catch (e) {
            setErr(e.message);
        }
    };

    return (
        <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
            <h2>Edit Book</h2>
            {err && <p style={{ color: "red" }}>{err}</p>}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Author:</label>
                    <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>

                <div>
                    <label>Condition:</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Condition</option>
                        {CONDITIONS.map(condition => (
                            <option key={condition} value={condition}>
                                {condition.charAt(0).toUpperCase() + condition.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Genre:</label>
                    <select
                        name="genre"
                        value={formData.genre}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Genre</option>
                        {GENRES.map(genre => (
                            <option key={genre} value={genre}>
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Language:</label>
                    <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Language</option>
                        {LANGUAGES.map(lang => (
                            <option key={lang} value={lang}>
                                {lang.charAt(0).toUpperCase() + lang.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Pages:</label>
                    <input
                        type="number"
                        name="pages"
                        value={formData.pages}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Exchange Type:</label>
                    <select
                        name="exchange_type"
                        value={formData.exchange_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Exchange Type</option>
                        {EXCHANGE_TYPES.map(type => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                    <button type="submit">Save Changes</button>
                    <button type="button" onClick={() => navigate("/my-books")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
} 