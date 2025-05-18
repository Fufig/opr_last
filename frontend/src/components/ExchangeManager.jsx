import { useState, useEffect } from "react";
import { useAuth } from "../context/auth";
import { apiFetch } from "../api";

const STATUS_COLORS = {
    pending: "#FFA500",
    approved: "#4CAF50",
    declined: "#F44336",
    completed: "#2196F3",
    cancelled: "#9E9E9E"
};

export default function ExchangeManager() {
    const [exchanges, setExchanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchExchanges();
    }, []);

    const fetchExchanges = async () => {
        try {
            const data = await apiFetch("/api/exchanges");
            setExchanges(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (exchangeId, newStatus) => {
        try {
            await apiFetch(`/api/exchanges/${exchangeId}`, {
                method: "PUT",
                body: JSON.stringify({ status: newStatus })
            });
            await fetchExchanges();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading exchanges...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div style={{ padding: "20px" }}>
            <h2>Exchange Requests</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {exchanges.map((exchange) => (
                    <div
                        key={exchange.id}
                        style={{
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            padding: "15px",
                            backgroundColor: "white",
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                        }}
                    >
                        <div style={{ marginBottom: "10px" }}>
                            <h3 style={{ margin: "0 0 10px 0" }}>{exchange.book.title}</h3>
                            <p style={{ margin: "5px 0" }}>
                                <strong>Author:</strong> {exchange.book.author}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                                <strong>Requested by:</strong> {exchange.requester.full_name}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                                <strong>Book Owner:</strong> {exchange.book.owner.full_name}
                            </p>
                            <p style={{ margin: "5px 0" }}>
                                <strong>Status:</strong>{" "}
                                <span
                                    style={{
                                        color: STATUS_COLORS[exchange.status] || "#000",
                                        fontWeight: "bold"
                                    }}
                                >
                                    {exchange.status}
                                </span>
                            </p>
                            {exchange.notes && (
                                <p style={{ margin: "5px 0" }}>
                                    <strong>Notes:</strong> {exchange.notes}
                                </p>
                            )}
                        </div>

                        {exchange.status === "pending" && (
                            <div style={{ display: "flex", gap: "10px" }}>
                                {user.id === exchange.book.owner_id && (
                                    <>
                                        <button
                                            onClick={() => handleStatusUpdate(exchange.id, "approved")}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#4CAF50",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(exchange.id, "declined")}
                                            style={{
                                                padding: "8px 16px",
                                                backgroundColor: "#F44336",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "4px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Decline
                                        </button>
                                    </>
                                )}
                                {user.id === exchange.requester_id && (
                                    <button
                                        onClick={() => handleStatusUpdate(exchange.id, "cancelled")}
                                        style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#9E9E9E",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}
                                    >
                                        Cancel Request
                                    </button>
                                )}
                            </div>
                        )}

                        {exchange.status === "approved" && user.id === exchange.requester_id && (
                            <button
                                onClick={() => handleStatusUpdate(exchange.id, "completed")}
                                style={{
                                    padding: "8px 16px",
                                    backgroundColor: "#2196F3",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer"
                                }}
                            >
                                Mark as Completed
                            </button>
                        )}
                    </div>
                ))}
                {exchanges.length === 0 && <p>No exchange requests</p>}
            </div>
        </div>
    );
} 