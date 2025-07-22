import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Jonas from "./pages/Jonas";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Areco from "./pages/Areco";
import GestionProductosCategorias from "./pages/GestionProductosCategorias";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    element: <ProtectedRoute />, // Agrupa rutas protegidas
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/jonas",
        element: <Jonas />,
      },
      {
        path: "/areco",
        element: <Areco />,
      },
      {
        path: "/final",
        element: <GestionProductosCategorias />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
