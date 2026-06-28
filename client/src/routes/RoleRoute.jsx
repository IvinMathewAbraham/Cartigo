import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({
    children,
    roles
}) {

    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const allowed = user.roles.some(role =>
        roles.includes(role)
    );

    if (!allowed) {
        return <Navigate to="/" replace />;
    }

    return children;
}