import React, { useState } from 'react'
import { CrearRequerimiento } from './CrearRequerimiento'
import { VisualizarRequerimiento } from './VisualizarRequerimiento'
import { Requerimiento } from '../types/requerimiento'

export function TablaRequerimientos() {
  const [datos, setDatos] = useState<Requerimiento[]>([
    {
      codigo: "REH-2024-000000001",
      prioridad: "MEDIA",
      tipo: "Requerimiento de Hardware",
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
      tipo: "Requerimiento de Hardware",
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
      tipo: "Requerimiento de Hardware",
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
      tipo: "Errores",
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
      tipo: "Errores",
      categoria: "Nueva falla",
      fechaAlta: "12/10/2024",
      estado: "Abierto",
      asunto: "unAsunto",
      propietario: "Gutierrez Jorge",
      archivos: [],
    },
  ])

  const [filtros, setFiltros] = useState({
    tipo: "",
    categoria: "",
    estado: "",
  })

  const [ordenamiento, setOrdenamiento] = useState({
    columna: "",
    direccion: "asc",
  })

  const [selectedRequerimiento, setSelectedRequerimiento] = useState<Requerimiento | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const tiposUnicos = Array.from(new Set(datos.map((d) => d.tipo)))
  const categoriasUnicas = Array.from(new Set(datos.map((d) => d.categoria)))
  const estadosUnicos = Array.from(new Set(datos.map((d) => d.estado)))

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
    setDatos([...datos, nuevoRequerimiento])
  }

  const handleRowClick = (requerimiento: Requerimiento) => {
    setSelectedRequerimiento(requerimiento)
    setIsViewDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#E5E7EB]">
      <div className="bg-[#556B2F] p-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Team 5</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[#2F3B1C] text-white px-4 py-2 rounded hover:bg-[#1F2912] transition-colors"
          >
            Crear requerimiento
          </button>
          <div className="flex items-center gap-2 text-white">
            <span>g.jorge</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-4 mb-6">
          <select 
            className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
            value={filtros.tipo} 
            onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
          >
            <option value="">Tipo</option>
            {tiposUnicos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          <select 
            className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
            value={filtros.categoria} 
            onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
          >
            <option value="">Categoría</option>
            {categoriasUnicas.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
            ))}
          </select>

          <select 
            className="flex-1 min-w-[200px] p-2 border border-gray-300 rounded-md bg-white cursor-pointer"
            value={filtros.estado} 
            onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
          >
            <option value="">Estado</option>
            {estadosUnicos.map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>

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
                  <td className="p-3 text-center">{requerimiento.tipo}</td>
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
      />
      <CrearRequerimiento
        onCrear={(nuevoRequerimiento) => {
          handleNuevoRequerimiento(nuevoRequerimiento);
          setIsCreateDialogOpen(false);
        }}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  )
}
