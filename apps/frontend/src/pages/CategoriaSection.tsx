import type { ChangeEvent, FormEvent } from "react";
import axios from "../libs/api";

interface Categoria {
  id: number;
  name: string;
}

interface Props {
  categorias: Categoria[];
  catForm: { name: string };
  setCatForm: (val: { name: string }) => void;
  editandoCat: number | null;
  setEditandoCat: (val: number | null) => void;
  loadingGuardarCat: boolean;
  setLoadingGuardarCat: (val: boolean) => void;
  mostrarMensaje: (texto: string, tipo?: "exito" | "error") => void;
  obtenerDatos: () => Promise<void>;
}

const CategoriaSection = ({
  categorias,
  catForm,
  setCatForm,
  editandoCat,
  setEditandoCat,
  loadingGuardarCat,
  setLoadingGuardarCat,
  mostrarMensaje,
  obtenerDatos,
}: Props) => {
  const handleCatChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCatForm({ name: e.target.value });
  };

  const guardarCategoria = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loadingGuardarCat) return;
    setLoadingGuardarCat(true);

    try {
      if (editandoCat) {
        await axios.put(`/categories/${editandoCat}`, catForm);
        mostrarMensaje("Categoría actualizada correctamente");
      } else {
        await axios.post("/categories", catForm);
        mostrarMensaje("Categoría creada correctamente");
      }
      setCatForm({ name: "" });
      setEditandoCat(null);
      await obtenerDatos();
    } catch (error: unknown) {
      let mensaje = "Error al guardar categoría";
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } })
          .response === "object"
      ) {
        const resp = (error as { response?: { data?: { message?: string } } })
          .response;
        if (resp?.data?.message) {
          mensaje = resp.data.message;
        }
      }
      console.error(mensaje, error);
      mostrarMensaje(mensaje, "error");
    } finally {
      setLoadingGuardarCat(false);
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (window.confirm("¿Seguro quieres eliminar esta categoría?")) {
      try {
        await axios.delete(`/categories/${id}`);
        mostrarMensaje("Categoría eliminada correctamente");
        await obtenerDatos();
      } catch (error: unknown) {
        let mensaje = "Error al eliminar categoría";
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { data?: { message?: string } } })
            .response === "object"
        ) {
          const err = error as { response?: { data?: { message?: string } } };
          if (err.response?.data?.message) {
            mensaje = err.response.data.message;
          }
        }
        console.error(mensaje, error);
        mostrarMensaje(mensaje, "error");
      }
    }
  };

  const cargarCategoria = (cat: Categoria) => {
    setCatForm({ name: cat.name });
    setEditandoCat(cat.id);
  };

  return (
    <>
      {/* Formulario para agregar o editar categorías */}
      <form
        onSubmit={guardarCategoria}
        className="mb-6 sticky top-[72px] bg-gray-800 py-4 px-6 border border-gray-700 rounded-md shadow-md z-40"
      >
        <h2 className="text-3xl font-semibold mb-5 text-gray-100">
          Gestión de Categorías
        </h2>
        <input
          type="text"
          value={catForm.name}
          onChange={handleCatChange}
          placeholder="Nombre de categoría"
          required
          disabled={loadingGuardarCat}
          className="w-full md:w-auto md:flex-grow border border-gray-600 bg-gray-900 text-gray-100 rounded-md p-3 mr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 transition"
        />
        <button
          type="submit"
          disabled={loadingGuardarCat}
          className="mt-4 md:mt-0 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md px-6 py-3 transition disabled:opacity-50"
        >
          {editandoCat ? "Actualizar" : "Agregar"}
        </button>
        {editandoCat && (
          <button
            type="button"
            onClick={() => {
              setCatForm({ name: "" });
              setEditandoCat(null);
            }}
            disabled={loadingGuardarCat}
            className="mt-3 md:mt-0 md:ml-3 w-full md:w-auto border border-gray-600 text-gray-300 hover:bg-gray-700 rounded-md px-6 py-3 transition"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* Tabla de categorías */}
      <div className="overflow-x-auto rounded-md border border-gray-700 shadow-md">
        <table className="w-full min-w-[320px] table-auto text-gray-200">
          <thead className="bg-gray-700">
            <tr>
              <th className="border border-gray-600 p-3 text-left">
                Categoría
              </th>
              <th className="border border-gray-600 p-3 text-center w-48">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((cat) => (
              <tr
                key={cat.id}
                className="hover:bg-gray-700 transition cursor-pointer"
              >
                <td className="border border-gray-600 p-3">{cat.name}</td>
                <td className="border border-gray-600 p-3 text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => cargarCategoria(cat)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition"
                      aria-label={`Editar categoria ${cat.name}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => eliminarCategoria(cat.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
                      aria-label={`Eliminar categoria ${cat.name}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {categorias.length === 0 && (
              <tr>
                <td
                  colSpan={2}
                  className="text-center p-4 text-gray-400 italic select-none"
                >
                  No hay categorías registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CategoriaSection;
