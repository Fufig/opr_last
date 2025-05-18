import { useState } from "react";
import { useAuth } from "../context/auth";
import { apiFetch } from "../api";

export default function BookExchange({ bookId, onSuccess }) {
    const [notes, setNotes] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!notes.trim()) return;

        setLoading(true);
        setError(null);

        try {
            await apiFetch("/api/exchanges", {
                method: "POST",
                body: JSON.stringify({
                    book_id: bookId,
                    notes: notes
                })
            });

            setNotes("");
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div style={{ marginTop: "10px" }}>
                <p>Please log in to request an exchange</p>
            </div>
        );
    }

    return (
        <div style={{ marginTop: "10px" }}>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add a note to your exchange request..."
                    style={{
                        width: "100%",
                        minHeight: "80px",
                        padding: "8px",
                        marginBottom: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd"
                    }}
                />
                {error && (
                    <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
                )}
                <button
                    type="submit"
                    disabled={loading || !notes.trim()}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: loading ? "#ccc" : "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: loading ? "not-allowed" : "pointer"
                    }}
                >
                    {loading ? "Requesting..." : "Request Exchange"}
                </button>
            </form>
        </div>
    );
} 