import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FullScreenLoader } from "./Spinner";

export default function PublicRoute() {
    const { user, isLoading } = useAuth();
    if (isLoading) return <FullScreenLoader/>
    return user ? <Navigate to="/new-note" replace /> : <Outlet />
}