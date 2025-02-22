import React, { useState, useEffect } from "react";
import Select from "react-select";
import { CrearRequerimiento } from "./CrearRequerimiento";
import { VisualizarRequerimiento } from "./VisualizarRequerimiento";
import { Requerimiento } from "../types/requerimiento";
import UserMenu from "../../ui/UserMenu";
import Button2 from "../../ui/Button2/Button2";

export function TablaRequerimientos() {
  const [userId, setUserId] = useState<number | null>(2);
  const [datos, setDatos] = useState<Requerimiento[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    estado: "",
  });
  const [ordenamiento, setOrdenamiento] = useState({
    columna: "",
    direccion: "asc",
  });
  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const storedUserName = localStorage.getItem("userName");

    if (storedUserName) {
      setUserName(storedUserName);
    } else {
      setUserName(null);
    }

    if (userId) {
      fetch("http://localhost:8080/usuarios/todos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.data) {
            const usuarioActual = data.data.find(
              (user) => user.id.toString() === userId
            );
            if (usuarioActual) {
              setUserName(usuarioActual.username);
              localStorage.setItem("userName", usuarioActual.username);
            }
          }
        })
        .catch((error) => console.error("Error obteniendo usuarios:", error));
    }
  }, []);

  useEffect(() => {
    const fetchRequerimientos = async () => {
      try {
        const url = new URL("http://localhost:8080/requerimientos/filtrar");
        if (filtros.tipo) url.searchParams.append("tipoRequerimiento", filtros.tipo);
        if (filtros.categoria) url.searchParams.append("categoria", filtros.categoria);
        if (filtros.estado) url.searchParams.append("estado", filtros.estado);

        const response = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron obtener los requerimientos`);
        }

        const data = await response.json();
        setDatos(data.data || []);
      } catch (error) {
        console.error("Error obteniendo requerimientos:", error);
        setDatos([]);
      }
    };

    fetchRequerimientos();
  }, [filtros]);

  const opcionesTipo = [
    { value: "hardware", label: "Requerimiento de Hardware", codigo: "REH" },
    { value: "software", label: "Requerimiento de Software", codigo: "RES" },
    { value: "error", label: "Error", codigo: "EER" },
    { value: "operativo", label: "Gestión Operativa", codigo: "GOP" },
  ];

  const categoriasPorTipo = [
    {
      value: "Solicitud reparación de hardware",
      label: "Solicitud reparación de hardware",
      tipo: "hardware",
    },
    {
      value: "Solicitud reparación de software",
      label: "Solicitud reparación de software",
      tipo: "software",
    },
    {
      value: "Instalación de software",
      label: "Instalación de software",
      tipo: "software",
    },
    {
      value: "Instalación de hardware",
      label: "Instalación de hardware",
      tipo: "hardware",
    },
    { value: "Nueva falla", label: "Nueva falla", tipo: "error" },
  ];

  const mapTipo = (tipo: string) => {
    switch (tipo) {
      case "hardware":
        return "Requerimiento de Hardware";
      case "software":
        return "Requerimiento de Software";
      case "error":
        return "Error";
      case "operativo":
        return "Gestión Operativa";
      default:
        return tipo;
    }
  };

  const tiposUnicos = opcionesTipo;

  const categoriasDisponibles = filtros.tipo
    ? categoriasPorTipo.filter((categoria) => categoria.tipo === filtros.tipo)
    : categoriasPorTipo;

  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e ? e.value : "";
    const tipoCorrespondiente =
      categoriasPorTipo.find(
        (categoria) => categoria.value === categoriaSeleccionada
      )?.tipo || "";
    setFiltros({
      ...filtros,
      categoria: categoriaSeleccionada,
      tipo: tipoCorrespondiente,
    });
  };

  const handleTipoChange = (e) => {
    const nuevoTipo = e ? e.value : "";
    setFiltros({ tipo: nuevoTipo, categoria: "" });
  };

  const estadosUnicos = Array.from(new Set(datos.map((d) => d.estado))).map(
    (estado) => ({
      value: estado,
      label: estado,
    })
  );

  const ordenarPor = (columna: keyof Requerimiento) => {
    setOrdenamiento((prev) => ({
      columna,
      direccion:
        prev.columna === columna && prev.direccion === "asc" ? "desc" : "asc",
    }));

    setDatos((prev) =>
      [...prev].sort((a, b) => {
        const valorA = a[columna];
        const valorB = b[columna];

        if (ordenamiento.direccion === "asc") {
          return valorA > valorB ? 1 : -1;
        } else {
          return valorA < valorB ? 1 : -1;
        }
      })
    );
  };

  const limpiarFiltros = () => {
    setFiltros({
      tipo: "",
      categoria: "",
      estado: "",
    });
  };

  const handleNuevoRequerimiento = (nuevoRequerimiento: Requerimiento) => {
    setDatos([nuevoRequerimiento, ...datos]);
  };

  const handleRowClick = (requerimiento: Requerimiento) => {
    setSelectedRequerimiento(requerimiento);
    setIsViewDialogOpen(true);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: 45,
      padding: "05px",
      borderColor: state.isFocused ? "#4A4A4A" : "#d1d5db",
      backgroundColor: "white",
      boxShadow: state.isFocused ? "0 0 0 1px #4A4A4A" : "none",
      "&:hover": {
        borderColor: "#4A4A4A",
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      height: "100%",
      display: "flex",
      alignItems: "center",
    }),
    input: (provided) => ({
      ...provided,
      height: "100%",
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      height: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#4A4A4A"
        : state.isFocused
        ? "#f3f4f6"
        : "white",
      color: state.isSelected ? "white" : "#333",
      "&:hover": {
        backgroundColor: "#e2e8f0",
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#4A4A4A",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
  };

  const handleCerrarCaso = (requerimientoCerrado: Requerimiento) => {
    setDatos((prevDatos) =>
      prevDatos.map((req) =>
        req.codigo === requerimientoCerrado.codigo ? requerimientoCerrado : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#E5E7EB] w-screen">
      <div className="bg-[#556B2F] p-4 flex justify-between items-center w-full">
        <h1 className="text-3xl font-bold text-white">Team 5</h1>
        <div className="flex items-center gap-4">
          <Button2 onClick={() => setIsCreateDialogOpen(true)} title={"Crear requerimiento"} className="NeutralButton"></Button2>
          <div className="flex items-center gap-2 text-white">
            <UserMenu userName={userName} />
          </div>
        </div>
      </div>

      <div className="p-4 w-full">
        <div className="flex flex-wrap items-center gap-4 mb-6 w-full">
          <Select
            className="w-64 h-[34px]"
            value={
              filtros.tipo
                ? tiposUnicos.find((tipo) => tipo.value === filtros.tipo)
                : null
            }
            onChange={handleTipoChange}
            options={tiposUnicos}
            placeholder="Tipo"
            styles={customStyles}
            isClearable={true}
            isSearchable={false}
          />

          <Select
            className="w-64 h-[34px]"
            value={
              filtros.categoria
                ? { value: filtros.categoria, label: filtros.categoria }
                : null
            }
            onChange={handleCategoriaChange}
            options={categoriasDisponibles}
            placeholder="Categoría"
            styles={customStyles}
            isClearable={true}
            isSearchable={false}
          />

          <Select
            className="w-64 h-[34px]"
            value={
              filtros.estado
                ? { value: filtros.estado, label: filtros.estado }
                : null
            }
            onChange={(e) =>
              setFiltros({ ...filtros, estado: e ? e.value : "" })
            }
            options={estadosUnicos}
            placeholder="Estado"
            styles={customStyles}
            isClearable={true}
            isSearchable={false}
          />

          <button
            className="flex-1 min-w-[200px] p-2 bg-[#B8D68F] text-black rounded-md hover:bg-[#9CB674] transition-colors"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto w-full">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#B8D68F]">
                {[
                  "Código",
                  "Prioridad",
                  "Tipo",
                  "Categoría",
                  "Fecha de Alta",
                  "Estado",
                  "Asunto",
                  "Propietario",
                ].map((columna) => (
                  <th
                    key={columna}
                    onClick={() =>
                      ordenarPor(columna.toLowerCase() as keyof Requerimiento)
                    }
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
                  <td
                    className={`p-3 text-center font-semibold ${
                      requerimiento.prioridad === "URGENTE"
                        ? "text-red-600"
                        : requerimiento.prioridad === "MEDIA"
                        ? "text-orange-600"
                        : "text-green-600"
                    }`}
                  >
                    {requerimiento.prioridad}
                  </td>
                  <td className="p-3 text-center">{mapTipo(requerimiento.tipo)}</td>
                  <td className="p-3 text-center">{requerimiento.categoria}</td>
                  <td className="p-3 text-center">{requerimiento.fechaAlta}</td>
                  <td
                    className={`p-3 text-center font-semibold ${
                      requerimiento.estado === "Abierto" ? "text-green-600" : "text-red-600"
                    }`}
                  >
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
        onCrear={handleNuevoRequerimiento}
        onCerrarCaso={handleCerrarCaso}
      />
      <CrearRequerimiento
        onCrear={(nuevoRequerimiento) => {
          handleNuevoRequerimiento(nuevoRequerimiento);
          setIsCreateDialogOpen(false);
        }}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        datos={datos}
      />
    </div>
  );
}