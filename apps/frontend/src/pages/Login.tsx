import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../libs/api";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const doLogin = async () => {
    if (!form.username || !form.password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post("/login", form, { withCredentials: true });

      // ✅ Guardamos sesión (puede ser un token si tu API lo devuelve)
      localStorage.setItem("auth", "true");

      // ✅ Redirigimos
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 text-gray-100 rounded-3xl shadow-2xl w-full max-w-sm p-8 sm:p-10 border border-gray-700">
        <h2 className="text-3xl font-bold text-center mb-8">Iniciar sesión</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            doLogin();
          }}
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium mb-1"
            >
              Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
