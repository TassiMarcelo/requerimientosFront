// TablaRequerimientos.tsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import { CrearRequerimiento } from "./CrearRequerimiento";
import { VisualizarRequerimiento } from "./VisualizarRequerimiento";
import { Requerimiento } from "../types/requerimiento";
import UserMenu from "../../ui/UserMenu";
import Button2 from "../../ui/Button2/Button2";

export function TablaRequerimientos() {
  const [datos, setDatos] = useState<Requerimiento[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    estado: "",
  });
  const [tipos, setTipos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [ordenamiento, setOrdenamiento] = useState({
    columna: "",
    direccion: "asc",
  });
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Opciones predefinidas para estados
  const estadosOpciones = [
    { value: "ABIERTO", label: "Abierto" },
    { value: "CERRADO", label: "Cerrado" },
    { value: "ASIGNADO", label: "Asignado" }
  ];

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      // Cargar usuario
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

  // Cargar requerimientos con filtros
  useEffect(() => {
    const cargarRequerimientos = async () => {
      const userName = localStorage.getItem("userName");
      if (!userName) return;

      try {
        const url = new URL(`http://localhost:8080/requerimientos/${userName}/filtrar`);
        
        if (filtros.tipo) url.searchParams.append("tipoRequerimiento", filtros.tipo);
        if (filtros.categoria) url.searchParams.append("categoria", filtros.categoria);
        if (filtros.estado) url.searchParams.append("estado", filtros.estado);

        const response = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        
        const data = await response.json();
        setDatos(data.data || []);
      } catch (error) {
        console.error("Error cargando requerimientos:", error);
        setDatos([]);
      }
    };

    cargarRequerimientos();
  }, [filtros]);

  // Funciones de manejo de filtros
  const handleTipoChange = (e: any) => {
    setFiltros(prev => ({
      ...prev,
      tipo: e?.value || "",
      categoria: "" // Resetear categoría al cambiar tipo
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



  // Resto de funciones
  const limpiarFiltros = () => setFiltros({ tipo: "", categoria: "", estado: "" });

  const handleRowClick = (requerimiento: Requerimiento) => {
    setSelectedRequerimiento(requerimiento);
    setIsViewDialogOpen(true);
  };


  // Estilos y configuraciones de Select
  const customStyles = { /* ... (mantener mismo estilo) */ };

  // Filtrar categorías según tipo seleccionado
  const categoriasFiltradas = filtros.tipo
    ? categorias.filter(c => c.tipoCodigo === filtros.tipo)
    : categorias;

  return (
    <div className="min-h-screen bg-[#E5E7EB] w-screen">
      <div className="bg-[#556B2F] p-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-white">Team 5</h1>
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

          <button
            className="flex-1 min-w-[200px] p-2 bg-[#B8D68F] text-black rounded-md hover:bg-[#9CB674]"
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
                    onClick={() => ordenarPor(columna.toLowerCase() as keyof Requerimiento)}
                    className="p-3 font-bold text-black cursor-pointer hover:bg-[#9CB674] text-center border-b border-gray-300"
                  >
                    {columna}
                    {ordenamiento.columna === columna.toLowerCase() && (
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
                  <td className="p-3 text-center">{requerimiento.fechaAlta}</td>
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
        onCrear={(nuevo) => setDatos(prev => [nuevo, ...prev])}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        datos={datos}
      />
    </div>
  );
}