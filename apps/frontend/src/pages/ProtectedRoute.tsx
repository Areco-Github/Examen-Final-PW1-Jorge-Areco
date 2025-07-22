import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("/api/auth/me", { withCredentials: true });
        setIsAuthenticated(true);
        localStorage.setItem("auth", "true");
      } catch (error) {
        // Ahora estamos usando el parámetro 'error'
        console.error("Error de autenticación:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("auth");
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
