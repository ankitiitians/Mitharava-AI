import { Navigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-12 w-12 rounded-full border-2 border-gold-subtle border-t-gold animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth/login" replace />;
  return children;
}
