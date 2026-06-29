import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ children, roles = [] }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const allowed = user?.roles?.some(role => 
        roles.includes(role)
    ) ?? false;

    // --- UPDATED LOGIC ---
    if (!allowed) {
        // If the user is an Admin, send them to /admin. Everyone else goes to /
        if (user?.roles?.includes("ADMIN")) {
            return <Navigate to="/admin" replace />;
        }
        
        return <Navigate to="/" replace />;
    }

    return children;
}