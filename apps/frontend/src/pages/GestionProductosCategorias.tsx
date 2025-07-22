import { useState, useEffect } from "react";
import axios from "../libs/api";

import CategoriaSection from "./CategoriaSection";
import ProductoSection from "./ProductoSection";
import ResumenSection from "./ResumenSection";

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

type MensajeTipo = "exito" | "error";

const GestionProductosCategorias = () => {
  const [filtroResumen, setFiltroResumen] = useState<string>("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [catForm, setCatForm] = useState<{ name: string }>({ name: "" });
  const [prodForm, setProdForm] = useState<{
    name: string;
    price: string;
    category_id: string;
  }>({ name: "", price: "", category_id: "" });

  const [editandoCat, setEditandoCat] = useState<number | null>(null);
  const [editandoProd, setEditandoProd] = useState<number | null>(null);

  const [loadingDatos, setLoadingDatos] = useState<boolean>(false);
  const [loadingGuardarCat, setLoadingGuardarCat] = useState<boolean>(false);
  const [loadingGuardarProd, setLoadingGuardarProd] = useState<boolean>(false);

  const [mensaje, setMensaje] = useState<{
    tipo: MensajeTipo;
    texto: string;
  } | null>(null);

  const [seccionActiva, setSeccionActiva] = useState<
    "categorias" | "productos" | "resumen"
  >("categorias");

  const [scrollTop, setScrollTop] = useState<boolean>(true);

  // Ref para guardar el seccion que queremos cambiar, para hacer la confirmación

  const mostrarMensaje = (texto: string, tipo: MensajeTipo = "exito") => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const obtenerDatos = async (): Promise<void> => {
    if (loadingDatos) return;
    setLoadingDatos(true);
    try {
      const [catRes, prodRes] = await Promise.all([
        axios.get<Categoria[]>("/categories"),
        axios.get<Producto[]>("/products"),
      ]);
      setCategorias(catRes.data);
      setProductos(prodRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error al cargar datos", "error");
    } finally {
      setLoadingDatos(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrollTop(window.scrollY < 100);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    obtenerDatos(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleScroll = (): void => {
    if (scrollTop) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resumen = categorias.map((cat) => {
    const productosCat = productos.filter((p) => p.category_id === cat.id);
    const total = productosCat.length;
    const promedio =
      total > 0
        ? (
            productosCat.reduce((sum, p) => sum + p.price, 0) / total
          ).toLocaleString("es-PY", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          })
        : "0";

    return { ...cat, total, promedio };
  });

  // --- FUNCIONES PARA DETECTAR SI HAY CAMBIOS NO GUARDADOS ---

  const categoriaFormVacio = { name: "" };
  const productoFormVacio = { name: "", price: "", category_id: "" };

  // Detecta si el formulario de categorías tiene cambios no guardados
  const hayCambiosCategorias = (): boolean => {
    if (editandoCat !== null) return true; // Está en modo edición
    return catForm.name.trim() !== categoriaFormVacio.name;
  };

  // Detecta si el formulario de productos tiene cambios no guardados
  const hayCambiosProductos = (): boolean => {
    if (editandoProd !== null) return true; // Está en modo edición
    return (
      prodForm.name.trim() !== productoFormVacio.name ||
      prodForm.price.trim() !== productoFormVacio.price ||
      prodForm.category_id !== productoFormVacio.category_id
    );
  };

  // Función para limpiar todos los formularios y estados de edición
  const limpiarFormularios = () => {
    setCatForm(categoriaFormVacio);
    setEditandoCat(null);
    setProdForm(productoFormVacio);
    setEditandoProd(null);
  };

  // Función que se llama para cambiar de sección con chequeo de cambios no guardados
  const cambiarSeccion = (
    nuevaSeccion: "categorias" | "productos" | "resumen"
  ) => {
    const cambiosEnCat = hayCambiosCategorias();
    const cambiosEnProd = hayCambiosProductos();

    if (seccionActiva === nuevaSeccion) return; // No cambia nada

    // Si hay cambios en formularios en categorías o productos y vas a cambiar de sección:
    if (cambiosEnCat || cambiosEnProd) {
      const confirmacion = window.confirm(
        "Hay cambios sin guardar. ¿Seguro que quieres continuar y perder esos cambios?"
      );
      if (!confirmacion) {
        // El usuario canceló el cambio de sección
        return;
      }
      // Si confirma, limpiar formularios y cambiar sección
      limpiarFormularios();
    } else {
      // No hay cambios, cambiar sección normal
      limpiarFormularios();
    }

    setFiltroResumen(""); // Siempre limpia filtro resumen al cambiar sección
    setSeccionActiva(nuevaSeccion);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Contenedor centrado y con máximo ancho */}
      <div className="p-6 max-w-5xl mx-auto relative font-sans text-gray-100">
        {/* Menú de pestañas moderno */}
        <nav className="sticky top-0 bg-gray-800 z-50 flex border-b border-gray-700 shadow-md rounded-t-md overflow-hidden">
          {[
            { key: "categorias", label: "Categorías", color: "blue" },
            { key: "productos", label: "Productos", color: "green" },
            { key: "resumen", label: "Resumen", color: "purple" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() =>
                cambiarSeccion(key as "categorias" | "productos" | "resumen")
              }
              className={`
                flex-1 text-center py-3 font-semibold transition-colors
                ${
                  seccionActiva === key
                    ? `bg-${color}-600 text-white shadow-inner`
                    : `bg-gray-700 text-gray-300 hover:bg-${color}-700`
                }
                focus:outline-none focus:ring-2 focus:ring-${color}-400
              `}
              aria-current={seccionActiva === key ? "page" : undefined}
              type="button"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Mensaje de feedback */}
        {mensaje && (
          <div
            className={`sticky top-[48px] z-50 mb-4 p-3 rounded-md max-w-xl mx-auto text-center
            ${
              mensaje.tipo === "exito"
                ? "bg-green-800 text-green-200 border border-green-600"
                : "bg-red-800 text-red-200 border border-red-600"
            }`}
            role="alert"
          >
            {mensaje.texto}
          </div>
        )}

        {/* Secciones */}
        <div className="mt-6">
          {seccionActiva === "categorias" && (
            <CategoriaSection
              categorias={categorias}
              catForm={catForm}
              setCatForm={setCatForm}
              editandoCat={editandoCat}
              setEditandoCat={setEditandoCat}
              loadingGuardarCat={loadingGuardarCat}
              setLoadingGuardarCat={setLoadingGuardarCat}
              mostrarMensaje={mostrarMensaje}
              obtenerDatos={obtenerDatos}
            />
          )}

          {seccionActiva === "productos" && (
            <ProductoSection
              productos={productos}
              categorias={categorias}
              prodForm={prodForm}
              setProdForm={setProdForm}
              editandoProd={editandoProd}
              setEditandoProd={setEditandoProd}
              loadingGuardarProd={loadingGuardarProd}
              setLoadingGuardarProd={setLoadingGuardarProd}
              mostrarMensaje={mostrarMensaje}
              obtenerDatos={obtenerDatos}
            />
          )}

          {seccionActiva === "resumen" && (
            <ResumenSection
              resumen={resumen}
              filtroResumen={filtroResumen}
              setFiltroResumen={setFiltroResumen}
            />
          )}
        </div>

        {/* Botón subir / bajar scroll mejorado */}
        <button
          onClick={toggleScroll}
          aria-label={scrollTop ? "Ir al final" : "Ir arriba"}
          className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {scrollTop ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GestionProductosCategorias;
