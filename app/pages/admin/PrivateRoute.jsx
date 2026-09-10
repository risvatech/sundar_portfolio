import { Navigate } from "react-router-dom";
import { useAuth } from "../admincontext/AuthContext.jsx";

export default function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // prevent flicker
  if (!user?.id) return <Navigate to="/" replace />; // redirect if not authenticated

  return children; // user is authenticated
}