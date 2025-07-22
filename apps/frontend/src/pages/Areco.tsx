import { useEffect, useState } from "react";
import api from "../libs/api";

interface Producto {
  id: number;
  name: string;
  price: number;
}

const Areco = () => {
  const [lista, setLista] = useState<Producto[]>([]);
  const [form, setForm] = useState<{ id: number; name: string; price: string }>({
    id: 0,
    name: "",
    price: "",
  });
  const [editando, setEditando] = useState(false);

  const cargarProductos = async () => {
    try {
      const res = await api.get("/products");
      setLista(res.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const precioNum = Number(form.price.replace(/\./g, "").replace(/,/g, ""));


    try {
      if (editando) {
        await api.put(`/products/${form.id}`, {
          id: form.id,
          name: form.name,
          price: precioNum,
        });
      } else {
        await api.post("/products", {
          name: form.name,
          price: precioNum,
        });
      }
      setForm({ id: 0, name: "", price: "" });
      setEditando(false);
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  };

  const handleEdit = (item: Producto) => {
    setForm({ id: item.id, name: item.name, price: item.price.toString() });
    setEditando(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Deseas eliminar este producto?")) {
      try {
        await api.delete(`/products/${id}`);
        cargarProductos();
      } catch (err) {
        console.error("Error al eliminar:", err);
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Estilos incrustados para quitar flechitas del input number */}
      <style>{`
        input[type="number"].no-spinner::-webkit-inner-spin-button,
        input[type="number"].no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"].no-spinner {
          -moz-appearance: textfield;
        }
      `}</style>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Gestión de productos San Juan Inge
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-6 p-4 bg-white rounded shadow max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Nombre</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Nombre del producto"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">
            Precio del producto (PYG)
          </label>
          <input
            required
            type="number"
            min="1"
            value={form.price} // input controlado con value
            onChange={(e) => setForm({ ...form, price: e.target.value })} // guardo string
            className="w-full p-2 border border-gray-300 rounded no-spinner"
            placeholder="Precio"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 p-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition"
          >
            {editando ? "Actualizar" : "Agregar"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={() => {
                setForm({ id: 0, name: "", price: "" });
                setEditando(false);
              }}
              className="flex-1 p-2 bg-gray-500 text-white font-semibold rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {lista.length === 0 ? (
        <p className="text-center text-gray-600">No hay productos</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lista.map((prod) => (
            <div key={prod.id} className="bg-white rounded shadow p-4">
              <h2 className="font-semibold text-lg text-gray-800">{prod.name}</h2>
              <p className="text-gray-600">
                Precio:{" "}
                <span className="font-medium text-gray-800">
                  {prod.price.toLocaleString()} PYG
                </span>
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(prod)}
                  className="flex-1 p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  className="flex-1 p-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Areco;
