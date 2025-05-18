import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Protected({ children, adminOnly = false }) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
}