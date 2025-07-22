import type { FormEvent, ChangeEvent } from "react";
import axios from "../libs/api";

interface Categoria {
  id: number;
  name: string;
}

interface Producto {
  id: number;
  name: string;
  price: number;
  category_id: number | null;
}

interface Props {
  productos: Producto[];
  categorias: Categoria[];
  prodForm: { name: string; price: string; category_id: string };
  setProdForm: React.Dispatch<
    React.SetStateAction<{ name: string; price: string; category_id: string }>
  >;
  editandoProd: number | null;
  setEditandoProd: (val: number | null) => void;
  loadingGuardarProd: boolean;
  setLoadingGuardarProd: (val: boolean) => void;
  mostrarMensaje: (texto: string, tipo?: "exito" | "error") => void;
  obtenerDatos: () => Promise<void>;
}

const ProductoSection = ({
  productos,
  categorias,
  prodForm,
  setProdForm,
  editandoProd,
  setEditandoProd,
  loadingGuardarProd,
  setLoadingGuardarProd,
  mostrarMensaje,
  obtenerDatos,
}: Props) => {
  const handleProdChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProdForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const guardarProducto = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loadingGuardarProd) return;
    setLoadingGuardarProd(true);

    try {
      const precioNum = Number(prodForm.price);
      if (isNaN(precioNum) || precioNum <= 0) {
        mostrarMensaje("El precio debe ser un número positivo", "error");
        setLoadingGuardarProd(false);
        return;
      }

      const nombreNormalizado = prodForm.name.trim().toLowerCase();
      const categoriaId = prodForm.category_id
        ? Number(prodForm.category_id)
        : null;

      // Validar que no exista producto con mismo nombre y categoría, excepto si estamos editando ese mismo producto
      const productoExistente = productos.find(
        (p) =>
          p.name.trim().toLowerCase() === nombreNormalizado &&
          p.category_id === categoriaId &&
          p.id !== editandoProd
      );

      if (productoExistente) {
        mostrarMensaje(
          "Ya existe un producto con ese nombre en la misma categoría.",
          "error"
        );
        setLoadingGuardarProd(false);
        return;
      }

      const payload = {
        name: prodForm.name,
        price: precioNum,
        category_id: categoriaId,
      };

      if (editandoProd) {
        await axios.put(`/products/${editandoProd}`, payload);
        mostrarMensaje("Producto actualizado correctamente");
      } else {
        await axios.post("/products", payload);
        mostrarMensaje("Producto creado correctamente");
      }

      setProdForm({ name: "", price: "", category_id: "" });
      setEditandoProd(null);
      await obtenerDatos();
    } catch (error: unknown) {
      console.error("Error al guardar producto:", error);
      mostrarMensaje("Error al guardar producto", "error");
    } finally {
      setLoadingGuardarProd(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (window.confirm("¿Seguro quieres eliminar este producto?")) {
      try {
        await axios.delete(`/products/${id}`);
        mostrarMensaje("Producto eliminado correctamente");
        await obtenerDatos();
      } catch (error: unknown) {
        console.error("Error al eliminar producto:", error);
        mostrarMensaje("Error al eliminar producto", "error");
      }
    }
  };

  const cargarProducto = (prod: Producto) => {
    setProdForm({
      name: prod.name,
      price: prod.price.toString(),
      category_id: prod.category_id ? prod.category_id.toString() : "",
    });
    setEditandoProd(prod.id);
  };

  return (
    <>
      {/* Formulario para agregar o editar productos */}
      <form
        onSubmit={guardarProducto}
        className="mb-6 sticky top-[72px] bg-gray-800 py-5 px-6 border border-gray-700 rounded-md shadow-md z-40 grid grid-cols-1 sm:grid-cols-4 gap-4"
      >
        <h2 className="text-3xl font-semibold mb-6 col-span-4 text-gray-100">
          Gestión de Productos
        </h2>

        <input
          type="text"
          name="name"
          value={prodForm.name}
          onChange={handleProdChange}
          placeholder="Nombre del producto"
          required
          disabled={loadingGuardarProd}
          className="col-span-2 rounded-md border border-gray-600 bg-gray-900 p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <input
          type="number"
          name="price"
          value={prodForm.price}
          onChange={handleProdChange}
          placeholder="Precio (Gs.)"
          min={1}
          required
          disabled={loadingGuardarProd}
          className="rounded-md border border-gray-600 bg-gray-900 p-3 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <select
          name="category_id"
          value={prodForm.category_id}
          onChange={handleProdChange}
          required
          disabled={loadingGuardarProd}
          className="rounded-md border border-gray-600 bg-gray-900 p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        >
          <option value="" className="text-gray-500">
            -- Seleccione Categoría --
          </option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Botones */}
        <div className="col-span-4 flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loadingGuardarProd}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md py-3 transition disabled:opacity-50"
          >
            {editandoProd ? "Actualizar" : "Agregar"}
          </button>
          {editandoProd && (
            <button
              type="button"
              onClick={() => {
                setProdForm({ name: "", price: "", category_id: "" });
                setEditandoProd(null);
              }}
              disabled={loadingGuardarProd}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white rounded-md py-3 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Tabla productos */}
      <div className="overflow-x-auto rounded-md border border-gray-700 shadow-md">
        <table className="w-full min-w-[320px] table-auto text-gray-200">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 p-3 text-center">
                Categoría
              </th>
              <th className="border border-gray-600 p-3 text-center">
                Producto
              </th>
              <th className="border border-gray-600 p-3 text-center">Precio</th>
              <th className="border border-gray-600 p-3 text-center w-48">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr
                key={prod.id}
                className="hover:bg-gray-700 cursor-pointer transition"
              >
                <td className="border border-gray-600 p-3 text-center">
                  {categorias.find((c) => c.id === prod.category_id)?.name ||
                    "Sin categoría"}
                </td>
                <td className="border border-gray-600 p-3 text-center">
                  {prod.name}
                </td>
                <td className="border border-gray-600 p-3 text-center">
                  Gs. {prod.price.toLocaleString()}
                </td>
                <td className="border border-gray-600 p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => cargarProducto(prod)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
                      aria-label={`Editar producto ${prod.name}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarProducto(prod.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                      aria-label={`Eliminar producto ${prod.name}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {productos.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="text-center p-4 text-gray-400 italic select-none"
                >
                  No hay productos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductoSection;
