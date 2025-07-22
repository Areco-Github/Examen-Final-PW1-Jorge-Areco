import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import api from "../libs/api";

const ProtectedRoute = () => {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await api.get("/auth/me"); // endpoint actualizado
        setAuth(true);
      } catch (e) {
        console.error(e);
        setAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (auth === null) return <div>Cargando...</div>;

  return auth ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
