import React, { useState } from 'react'
import Select from 'react-select';
import { CrearRequerimiento } from './CrearRequerimiento'
import { VisualizarRequerimiento } from './VisualizarRequerimiento'
import { Requerimiento } from '../types/requerimiento'
import UserMenu from './ui/UserMenu';


export function TablaRequerimientos() {
  const [datos, setDatos] = useState<Requerimiento[]>([
    {
      codigo: "REH-2024-000000001",
      prioridad: "MEDIA",
      tipo: "hardware",
      categoria: "Solicitud reparación de hardware",
      fechaAlta: "12/09/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [{ nombre: "documento1.pdf", tipo: "application/pdf" }],
    },
    {
      codigo: "REH-2024-000000002",
      prioridad: "MEDIA",
      tipo: "hardware",
      categoria: "Solicitud reparación de hardware",
      fechaAlta: "14/09/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [{ nombre: "documento2.docx", tipo: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }],
    },
    {
      codigo: "REH-2024-000000003",
      prioridad: "BAJA",
      tipo: "hardware",
      categoria: "Solicitud reparación de hardware",
      fechaAlta: "18/09/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [],
    },
    {
      codigo: "ERR-2024-000000004",
      prioridad: "URGENTE",
      tipo: "error",
      categoria: "Nueva falla",
      fechaAlta: "10/10/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [],
    },
    {
      codigo: "ERR-2024-000000005",
      prioridad: "URGENTE",
      tipo: "error",
      categoria: "Nueva falla",
      fechaAlta: "12/10/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [],
    },
  ])

  const opcionesTipo = [
    { value: 'hardware', label: 'Requerimiento de Hardware', codigo: 'REH' },
    { value: 'software', label: 'Requerimiento de Software', codigo: 'RES' },
    { value: 'error', label: 'Error', codigo: 'EER' },
    { value: 'operativo', label: 'Gestión Operativa', codigo: 'GOP' },
  ]

  const categoriasPorTipo = [
    { value: 'Solicitud reparación de hardware', label: 'Solicitud reparación de hardware',tipo:'hardware'},
    { value: 'Solicitud reparación de software', label: 'Solicitud reparación de software',tipo:'software'},
    { value: 'Instalación de software', label: 'Instalación de software',tipo: 'software'},
    { value: 'Instalación de hardware', label: 'Instalación de hardware',tipo: 'hardware'},
    { value: 'Nueva falla', label: 'Nueva falla',tipo:'error'}
  ]

  const mapTipo = (tipo) => {
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
        return tipo; // Por si aparece un tipo no esperado
    }
  };
  

  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    estado: "",
  });
  

  const [ordenamiento, setOrdenamiento] = useState({
    columna: "",
    direccion: "asc",
  })

  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const tiposUnicos = opcionesTipo;

  const categoriasUnicas = Array.from(new Set(datos.map((d) => d.categoria))).map((categoria) => ({
    value: categoria,
    label: categoria,
  }));

  const categoriasDisponibles = filtros.tipo
  ? categoriasPorTipo.filter((categoria) => categoria.tipo === filtros.tipo)
  : categoriasPorTipo;

  const handleCategoriaChange = (e) => {
    const categoriaSeleccionada = e ? e.value : "";
    const tipoCorrespondiente = categoriasPorTipo.find(categoria => categoria.value === categoriaSeleccionada)?.tipo || "";
    setFiltros({ ...filtros, categoria: categoriaSeleccionada, tipo: tipoCorrespondiente });
  }; 

  const handleTipoChange = (e) => {
    const nuevoTipo = e ? e.value : '';
    setFiltros({ tipo: nuevoTipo, categoria: '' });
  };
  
    const estadosUnicos = Array.from(new Set(datos.map((d) => d.estado))).map((estado) => ({
    value: estado,
    label: estado,
  }));

  const ordenarPor = (columna: keyof Requerimiento) => {
    setOrdenamiento((prev) => ({
      columna,
      direccion: prev.columna === columna && prev.direccion === "asc" ? "desc" : "asc",
    }))

    setDatos((prev) =>
      [...prev].sort((a, b) => {
        const valorA = a[columna]
        const valorB = b[columna]
        
        if (ordenamiento.direccion === "asc") {
          return valorA > valorB ? 1 : -1
        } else {
          return valorA < valorB ? 1 : -1
        }
      })
    )
  }

  const limpiarFiltros = () => {
    setFiltros({
      tipo: "",
      categoria: "",
      estado: "",
    })
  }

  const datosFiltrados = datos.filter((item) => {
    return (
      (!filtros.tipo || item.tipo === filtros.tipo) &&
      (!filtros.categoria || item.categoria === filtros.categoria) &&
      (!filtros.estado || item.estado === filtros.estado)
    )
  })
  

  const handleNuevoRequerimiento = (nuevoRequerimiento: Requerimiento) => {
    setDatos([nuevoRequerimiento,...datos])
  }

  const handleRowClick = (requerimiento: Requerimiento) => {
    setSelectedRequerimiento(requerimiento)
    setIsViewDialogOpen(true)
  }

  const userName = 'g.jorge'; 

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? '#4A4A4A' : '#d1d5db', // Gris oscuro cuando está enfocado, gris claro cuando no lo está
      backgroundColor: 'white', // Fondo blanco
      boxShadow: state.isFocused ? '0 0 0 1px #4A4A4A' : 'none', // Gris oscuro para el enfoque, sin sombra cuando no está enfocado
      '&:hover': {
        borderColor: '#4A4A4A', // Gris oscuro en hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white', // Fondo blanco para el menú desplegable
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4A4A4A' : state.isFocused ? '#f3f4f6' : 'white', // Gris oscuro para la opción seleccionada, gris claro para la opción enfocada
      color: state.isSelected ? 'white' : '#333', // Blanco para la opción seleccionada, negro para las demás
      '&:hover': {
        backgroundColor: '#e2e8f0', // Gris más claro cuando se pasa el mouse por encima
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#4A4A4A', // Gris oscuro para el texto del placeholder
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333', // Color del texto seleccionado
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
    <div className="min-h-screen bg-[#E5E7EB]">
      <div className="bg-[#556B2F] p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Team 5</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#2F3B1C] text-white px-4 py-2 rounded hover:bg-[#1F2912] transition-colors h-10"
          >
            Crear requerimiento
          </button>
          <div className="flex items-center gap-2 text-white">
            <UserMenu userName={userName} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-6">
  
  <Select
  className="flex-1 min-w-[200px]"
  value={filtros.tipo ? tiposUnicos.find(tipo => tipo.value === filtros.tipo) : null}
  onChange={handleTipoChange}
  options={tiposUnicos} // Usamos los tipos únicos que hemos transformado
  placeholder="Tipo"
  styles={customStyles} 
  isClearable={true}
/>


<Select
  className="flex-1 min-w-[200px]"
  value={filtros.categoria ? { value: filtros.categoria, label: filtros.categoria } : null}
  onChange={handleCategoriaChange}
  options={categoriasDisponibles}
  placeholder="Categoría"
  styles={customStyles}
  isClearable={true}
  />


<Select
  className="flex-1 min-w-[200px]"
  value={filtros.estado ? { value: filtros.estado, label: filtros.estado } : null}
  onChange={(e) => setFiltros({ ...filtros, estado: e ? e.value : "" })}
  options={estadosUnicos}
  placeholder="Estado"
  styles={customStyles}
  isClearable={true}
/>


          <button 
            className="flex-1 min-w-[200px] p-2 bg-[#B8D68F] text-black rounded-md hover:bg-[#9CB674] transition-colors"
            onClick={limpiarFiltros}
          >
            Limpiar Filtros
          </button>
        </div>

        <div className="bg-white border border-gray-300 rounded-md shadow-sm overflow-x-auto">
          <table className="w-full">
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
              {datosFiltrados.map((requerimiento) => (
                <tr 
                  key={requerimiento.codigo} 
                  className="hover:bg-gray-50 border-b border-gray-200 cursor-pointer"
                  onClick={() => handleRowClick(requerimiento)}
                >
                  <td className="p-3 text-center">{requerimiento.codigo}</td>
                  <td className={`p-3 text-center font-semibold ${
                    requerimiento.prioridad === "URGENTE" ? "text-red-600" :
                    requerimiento.prioridad === "MEDIA" ? "text-orange-600" :
                    "text-green-600"
                  }`}>
                    {requerimiento.prioridad}
                  </td>
                  <td className="p-3 text-center">{mapTipo(requerimiento.tipo)}</td>
                  <td className="p-3 text-center">{requerimiento.categoria}</td>
                  <td className="p-3 text-center">{requerimiento.fechaAlta}</td>
                  <td className={`p-3 text-center font-semibold ${
                    requerimiento.estado === "Abierto" ? "text-green-600" : "text-red-600"
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
  )
}
