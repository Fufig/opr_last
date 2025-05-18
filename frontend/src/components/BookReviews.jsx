import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";

export default function BookReviews({ bookId }) {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, [bookId]);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`/api/books/${bookId}/reviews`);
            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }
            const data = await response.json();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.trim()) return;

        try {
            const response = await fetch(`/api/books/${bookId}/reviews`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newReview }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit review");
            }

            setNewReview("");
            await fetchReviews();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading reviews...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h3>Reviews</h3>

            {user && (
                <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                    <textarea
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                        placeholder="Write your review..."
                        style={{
                            width: "100%",
                            minHeight: "100px",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ddd"
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Submit Review
                    </button>
                </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {reviews.map((review) => (
                    <div
                        key={review.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            backgroundColor: "white"
                        }}
                    >
                        <p style={{ margin: "0 0 10px 0" }}>
                            <strong>{review.user.full_name}</strong> -{" "}
                            {new Date(review.created_at).toLocaleDateString()}
                        </p>
                        <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{review.content}</p>
                    </div>
                ))}
                {reviews.length === 0 && <p>No reviews yet</p>}
            </div>
        </div>
    );
} 