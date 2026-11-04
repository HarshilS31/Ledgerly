import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenLoader } from "./Spinner";

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <FullScreenLoader />;

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;