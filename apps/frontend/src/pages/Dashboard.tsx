import { Link, useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-6">Bienvenido al dashboard</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Link
          to="/jonas"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-center transition-colors"
        >
          Ir a Jonas
        </Link>

        <Link
          to="/areco"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center transition-colors"
        >
          Ir a Areco
        </Link>

        <Link
          to="/final"
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-center transition-colors"
        >
          Ir a Gestión de Productos y Categorías
        </Link>
      </div>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Dashboard;
