// src/components/Profile.jsx
import { useState, useEffect, useRef } from "react";
import { apiFetch } from "../api"; // Предполагается, что api.js существует
import { useAuth } from "../context/auth"; // Предполагается, что auth.jsx существует
import './Profile.css'; // Создадим этот CSS файл для стилей модального окна и кнопки

export default function Profile() {
    // Use refreshUser from the auth context
    const { user, refreshUser } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [formData, setFormData] = useState({
        full_name: "",
        telegram: "", // Changed from email to telegram to match state usage
        phone: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const modalRef = useRef(null);

    // Инициализация и обновление formData при изменении пользователя или открытии модального окна
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || "",
                telegram: user.telegram || "", // Assuming 'telegram' is the correct field name in user object
            });
        }
    }, [user, showProfileModal]); // Перезаполняем форму при каждом открытии

    const openModal = () => {
        setError("");
        setSuccess("");
        setShowProfileModal(true);
    };

    const closeModal = () => {
        setShowProfileModal(false);
        // Optional: Refresh user data from the server when closing the modal
        // in case any external changes occurred or the success message should persist
        // refreshUser();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // Ensure user and user.id exist before making the API call
            if (!user || !user.id) {
                throw new Error("User not authenticated or user ID is missing.");
            }

            const updatedUserData = await apiFetch(`/api/users/${user.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    full_name: formData.full_name,
                    telegram: formData.telegram, // Ensure the API expects 'telegram'
                    // Include other fields if your API expects them, e.g., phone: formData.phone
                })
            });

            // Refresh the user data in the AuthProvider context
            await refreshUser(); // Use the new refreshUser function

            setSuccess("Profile updated successfully!");
            // Do not close the modal immediately, let the user see the success message
            // closeModal(); // You can close it after a few seconds or require manual closing
        } catch (err) {
            console.error("Profile update failed:", err); // Log error for debugging
            setError(err.message || "Failed to update profile.");
            setSuccess(""); // Clear success message on error
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Закрытие модального окна по клику вне его
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                // Проверяем, что клик не был по кнопке открытия, чтобы избежать двойного срабатывания
                if (!event.target.closest('.profile-button-container')) {
                     closeModal();
                }
            }
        };

        if (showProfileModal) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileModal]);

    // Закрытие модального окна по клавише Escape
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (showProfileModal) {
            document.addEventListener('keydown', handleEscapeKey);
        } else {
            document.removeEventListener('keydown', handleEscapeKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
        };
    }, [showProfileModal]);


    if (!user) return null;

    return (
        <div className="profile-button-container">
            <button
                onClick={openModal}
                className="profile-action-button" // Используем класс из Profile.css
                title="Edit Profile"
            >
                {user.full_name || user.login} {/* Display full name if available, otherwise login */}
            </button>

            {showProfileModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog" ref={modalRef}>
                        <div className="modal-header">
                            <h3>Edit Profile</h3>
                            <button onClick={closeModal} className="modal-close-button" aria-label="Close profile modal">
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            {error && <p className="error-message form-message">{error}</p>}
                            {success && <p className="success-message form-message">{success}</p>}

                            <form onSubmit={handleSubmit} className="profile-modal-form">
                                <div className="form-group">
                                    <label htmlFor="profile_modal_full_name">Full Name:</label>
                                    <input
                                        type="text"
                                        id="profile_modal_full_name"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telegram">Telegram:</label>
                                    <input
                                        type="text"
                                        id="telegram"
                                        name="telegram" // Ensure name matches the state key
                                        value={formData.telegram}
                                        onChange={handleChange}
                                        placeholder="@telegram"
                                        disabled={loading}
                                    />
                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="profile_modal_phone">Phone:</label>
                                    <input
                                        type="text"
                                        id="profile_modal_phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                </div>
                                */}
                                <div className="form-actions modal-form-actions">
                                    <button type="submit" className="button-primary" disabled={loading}>
                                        {loading ? "Saving..." : "Save Changes"}
                                    </button>
                                    <button
                                        type="button"
                                        className="button-secondary"
                                        onClick={closeModal}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}