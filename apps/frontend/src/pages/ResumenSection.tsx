interface ResumenItem {
  id: number;
  name: string;
  total: number;
  promedio: string;
}

interface Props {
  resumen: ResumenItem[];
  filtroResumen: string;
  setFiltroResumen: (val: string) => void;
}

const ResumenSection = ({
  resumen,
  filtroResumen,
  setFiltroResumen,
}: Props) => {
  // Filtrar resumen según filtro
  const resumenFiltrado = filtroResumen
    ? resumen.filter((r) => r.name === filtroResumen)
    : resumen;

  // Ver si el filtro seleccionado no tiene productos (total 0)
  const filtroSinProductos =
    filtroResumen &&
    resumenFiltrado.length === 1 &&
    resumenFiltrado[0].total === 0;

  return (
    <section className="p-6 bg-gray-900 text-gray-200 rounded-md shadow-md">
      <h2 className="text-3xl font-semibold mb-6 border-b border-gray-700 pb-3">
        Resumen por Categoría
      </h2>

      <select
        value={filtroResumen}
        onChange={(e) => setFiltroResumen(e.target.value)}
        className="mb-6 p-3 w-full rounded-md bg-gray-800 border border-gray-700 text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        aria-label="Filtrar categorías"
      >
        <option value="">-- Mostrar todas las categorías --</option>
        {resumen.map((r) => (
          <option key={r.id} value={r.name}>
            {r.name}
          </option>
        ))}
      </select>

      <div className="overflow-x-auto rounded-md border border-gray-700 shadow-md min-h-[150px]">
        {filtroSinProductos ? (
          <p className="text-center p-8 text-gray-400 italic">
            No hay productos para la categoría seleccionada.
          </p>
        ) : (
          <table className="w-full min-w-[320px] table-auto text-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="border border-gray-700 p-3 text-left">
                  Categoría
                </th>
                <th className="border border-gray-700 p-3 text-center">
                  Cantidad
                </th>
                <th className="border border-gray-700 p-3 text-right">
                  Precio promedio (Gs.)
                </th>
              </tr>
            </thead>
            <tbody>
              {resumenFiltrado.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center p-4 text-gray-400 italic select-none"
                  >
                    No hay datos para mostrar
                  </td>
                </tr>
              ) : (
                resumenFiltrado.map((r) => (
                  <tr
                    key={r.id}
                    className="even:bg-gray-800 odd:bg-gray-900 hover:bg-blue-700 transition-colors cursor-default"
                  >
                    <td className="border border-gray-700 p-3">{r.name}</td>
                    <td className="border border-gray-700 p-3 text-center font-semibold">
                      {r.total}
                    </td>
                    <td className="border border-gray-700 p-3 text-right font-mono">
                      {r.promedio}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default ResumenSection;
