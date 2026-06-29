import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 1. Give 'roles' a default empty array fallback []
export default function RoleRoute({ children, roles = [] }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Added optional chaining (?.) in case user.roles is ever missing
    const allowed = user?.roles?.some(role => 
        roles.includes(role)
    ) ?? false;

    if (!allowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}