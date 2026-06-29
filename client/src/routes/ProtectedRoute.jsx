import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    // 1. Check if user is authenticated
    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    // 2. Check if user has authorization (if roles are specified)
    if (allowedRoles.length > 0) {
        const hasRole = user?.roles?.some(role => allowedRoles.includes(role));
        
        if (!hasRole) {
            // Redirect unauthorized users to a specific page or home
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
}