import React, { useState, useEffect } from "react";
import Select from "react-select";
import { CrearRequerimiento } from "./CrearRequerimiento";
import { VisualizarRequerimiento } from "./VisualizarRequerimiento";
import { Requerimiento } from "../types/requerimiento";
import UserMenu from "../../ui/UserMenu";
import Button2 from "../../ui/Button2/Button2";
import { log } from "console";

// Función para formatear fechas
const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export function TablaRequerimientos() {
  const [datos, setDatos] = useState<Requerimiento[]>([]);
  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    estado: "",
    prioridad: "", // Nuevo filtro por prioridad
  });
  const [tipos, setTipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [ordenamiento, setOrdenamiento] = useState({
    columna: "fechaAlta",
    direccion: "desc",
  });
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const estadosOpciones = [
    { value: "ABIERTO", label: "Abierto" },
    { value: "CERRADO", label: "Cerrado" },
    { value: "ASIGNADO", label: "Asignado" }
  ];

  const prioridadesOpciones = [
    { value: "BAJA", label: "Baja" },
    { value: "MEDIA", label: "Media" },
    { value: "URGENTE", label: "Urgente" }
  ];

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      const userId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");
      console.log("uid " + userId + " username " + storedUserName);

      // Cargar tipos y categorías
      try {
        const [tiposRes, categoriasRes] = await Promise.all([
          fetch("http://localhost:8080/tiposRequerimientos/getAll", {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          }),
          fetch("http://localhost:8080/categRequerimientos/todas", {
            headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
          })
        ]);

        const tiposData = await tiposRes.json();
        const categoriasData = await categoriasRes.json();

        setTipos(tiposData.data.map((t: any) => ({
          value: t.codigo,
          label: t.descripcion
        })));

        setCategorias(categoriasData.data.map((c: any) => ({
          value: c.descripcion,
          label: c.descripcion,
          tipoCodigo: c.codigoTipoRequerimiento
        })));
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    const cargarRequerimientos = async () => {
      const userId = localStorage.getItem("userId");
      if (!usereId) return;

      try {
        const url = new URL(`http://localhost:8080/requerimientos/${userId}/filtrar`);

        if (filtros.tipo) url.searchParams.append("tipoRequerimiento", filtros.tipo);
        if (filtros.categoria) url.searchParams.append("categoria", filtros.categoria);
        if (filtros.estado) url.searchParams.append("estado", filtros.estado);
        if (filtros.prioridad) url.searchParams.append("prioridad", filtros.prioridad); // Nuevo filtro

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const data = await response.json();
        let requerimientos = data.data || [];
        console.log("Data:",data)
        // Ordenar por fechaAlta
        requerimientos = requerimientos.sort((a, b) => {
          const dateA = new Date(a.fechaAlta.split('-').join('/'));
          const dateB = new Date(b.fechaAlta.split('-').join('/'));

          return ordenamiento.direccion === "asc"
            ? dateA.getTime() - dateB.getTime()  // De la fecha más vieja a la más nueva
            : dateB.getTime() - dateA.getTime(); // De la más nueva a la más vieja
        });

        setDatos(requerimientos);
      } catch (error) {
        console.error("Error cargando requerimientos:", error);
        setDatos([]);
      }
    };

    cargarRequerimientos();
  }, [filtros, ordenamiento.direccion]);

  const handleTipoChange = (e: any) => {
    setFiltros(prev => ({
      ...prev,
      tipo: e?.value || "",
      categoria: ""
    }));
  };

  const handleCategoriaChange = (e: any) => {
    setFiltros(prev => ({
      ...prev,
      categoria: e?.value || ""
    }));
  };

  const handleEstadoChange = (e: any) => {
    setFiltros(prev => ({
      ...prev,
      estado: e?.value || ""
    }));
  };

  const handlePrioridadChange = (e: any) => {
    setFiltros(prev => ({
      ...prev,
      prioridad: e?.value || ""
    }));
  };

  const ordenarPor = (columna: keyof Requerimiento) => {
    if (columna !== "fechaAlta") return;

    const nuevaDireccion = ordenamiento.direccion === "asc" ? "desc" : "asc";
    setOrdenamiento({
      columna: "fechaAlta",
      direccion: nuevaDireccion
    });
  };

  const limpiarFiltros = () => setFiltros({ tipo: "", categoria: "", estado: "", prioridad: "" });

  const handleRowClick = (requerimiento: Requerimiento) => {
    setSelectedRequerimiento(requerimiento);
    setIsViewDialogOpen(true);
  };

  const handleCrearRequerimiento = (nuevoRequerimiento: Requerimiento) => {
    setDatos(prev => [nuevoRequerimiento, ...prev]); // Agrega el nuevo requerimiento al principio de la lista
  };

  const customStyles = {
    control: (provided: any) => ({
      ...provided,
      minHeight: "34px",
      height: "34px",
      borderRadius: "6px",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#9CA3AF"
      }
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      height: "34px",
      padding: "0 8px"
    }),
    input: (provided: any) => ({
      ...provided,
      margin: "0px",
      paddingBottom: "0px"
    }),
    indicatorsContainer: (provided: any) => ({
      ...provided,
      height: "34px"
    }),
    option: (provided: any) => ({
      ...provided,
      fontSize: "14px"
    })
  };

  const categoriasFiltradas = filtros.tipo
    ? categorias.filter(c => c.tipoCodigo === filtros.tipo)
    : categorias;

  return (
    <div className="min-h-screen bg-[#E5E7EB] w-screen">
      <div className="bg-[#556B2F] p-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-white">Lista de requerimientos para el usuario {localStorage.getItem("userName")}</h1>
        <div className="flex items-center gap-4">
          <Button2
            onClick={() => setIsCreateDialogOpen(true)}
            title={"Crear requerimiento"}
            className="NeutralButton"
          />
          <UserMenu userName={localStorage.getItem('userName')} />
        </div>
      </div>

      <div className="p-4 w-full">
        <div className="flex flex-wrap items-center gap-4 mb-6 w-full">
          <Select
            className="w-64 h-[34px]"
            value={tipos.find(t => t.value === filtros.tipo)}
            onChange={handleTipoChange}
            options={tipos}
            placeholder="Tipo"
            styles={customStyles}
            isClearable
          />

          <Select
            className="w-64 h-[34px]"
            value={categoriasFiltradas.find(c => c.value === filtros.categoria)}
            onChange={handleCategoriaChange}
            options={categoriasFiltradas}
            placeholder="Categoría"
            styles={customStyles}
            isClearable
            isDisabled={!filtros.tipo}
          />

          <Select
            className="w-64 h-[34px]"
            value={estadosOpciones.find(e => e.value === filtros.estado)}
            onChange={handleEstadoChange}
            options={estadosOpciones}
            placeholder="Estado"
            styles={customStyles}
            isClearable
          />

          <Select
            className="w-64 h-[34px]"
            value={prioridadesOpciones.find(p => p.value === filtros.prioridad)}
            onChange={handlePrioridadChange}
            options={prioridadesOpciones}
            placeholder="Prioridad"
            styles={customStyles}
            isClearable
          />

          <button
            className="min-w-[120px] p-2 bg-[#B8D68F] text-black rounded-md hover:bg-[#9CB674] text-sm"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto w-full">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#B8D68F]">
                {["Código", "Prioridad", "Tipo", "Categoría", "Fecha de Alta", "Estado", "Asunto", "Propietario"].map((columna) => (
                  <th
                    key={columna}
                    onClick={() => columna === "Fecha de Alta" && ordenarPor("fechaAlta")}
                    className={`p-3 font-bold text-black text-center border-b border-gray-300 ${
                      columna === "Fecha de Alta" ? "cursor-pointer hover:bg-[#9CB674]" : ""
                    }`}
                  >
                    {columna}
                    {columna === "Fecha de Alta" && (
                      <span className="ml-1">
                        {ordenamiento.direccion === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datos.map((requerimiento) => (
                <tr
                  key={requerimiento.codigo}
                  className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(requerimiento)}
                >
                  <td className="p-3 text-center">{requerimiento.codigo}</td>
                  <td className={`p-3 text-center font-semibold ${
                    requerimiento.prioridad === "URGENTE" ? "text-red-600" :
                    requerimiento.prioridad === "MEDIA" ? "text-orange-600" : "text-green-600"
                  }`}>
                    {requerimiento.prioridad}
                  </td>
                  <td className="p-3 text-center">
                    {requerimiento.tipoRequerimiento.codigo}
                  </td>
                  <td className="p-3 text-center">{requerimiento.categRequerimiento}</td>
                  <td className="p-3 text-center">{formatDate(requerimiento.fechaAlta)}</td>
                  <td className={`p-3 text-center font-semibold ${
                    requerimiento.estado === "ABIERTO" ? "text-green-600" : "text-red-600"
                  }`}>
                    {requerimiento.estado}
                  </td>
                  <td className="p-3 text-center">{requerimiento.asunto}</td>
                  <td className="p-3 text-center">{requerimiento.propietario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <VisualizarRequerimiento
        requerimiento={selectedRequerimiento}
        isOpen={isViewDialogOpen}
        onClose={() => setIsViewDialogOpen(false)}
        onCrear={setDatos}
      />

      <CrearRequerimiento
        onCrear={handleCrearRequerimiento}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        datos={datos}
      />
    </div>
  );
}