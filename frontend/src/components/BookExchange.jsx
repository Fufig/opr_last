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
      <div className="text-center py-4">
        <p className="text-gray-500">Please log in to request an exchange</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add a note to your exchange request..."
        className="input min-h-[100px]"
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <button
        type="submit"
        disabled={loading || !notes.trim()}
        className={clsx(
          "btn btn-primary w-full",
          loading && "opacity-50 cursor-not-allowed"
        )}
      >
        {loading ? "Requesting..." : "Request Exchange"}
      </button>
    </form>
  );
}