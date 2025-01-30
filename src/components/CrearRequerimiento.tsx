import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { PlusSquare, X } from 'lucide-react'
import Select from 'react-select'
import { Requerimiento } from '../types/requerimiento'

interface CrearRequerimientoProps {
  onCrear: (requerimiento: Requerimiento) => void
  isOpen: boolean
  onClose: () => void
}

export function CrearRequerimiento({ onCrear, isOpen, onClose }: CrearRequerimientoProps) {
  const [nuevoRequerimiento, setNuevoRequerimiento] = useState<Requerimiento>({
    codigo: "",
    prioridad: "MEDIA",
    tipo: "",
    categoria: "",
    fechaAlta: "",
    estado: "Abierto",
    asunto: "",
    propietario: "g.jorge",
    descripcion: "",
    archivos: [],
  })
  const [archivos, setArchivos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const crearRequerimiento = () => {
    const nuevoId = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(9, '0')}`
    const fechaActual = new Date().toLocaleDateString('es-ES')
    const nuevoReq = {
      ...nuevoRequerimiento,
      codigo: nuevoId,
      fechaAlta: fechaActual,
      archivos: archivos.map(file => ({ nombre: file.name, tipo: file.type })),
    }
    onCrear(nuevoReq)
    onClose()
    setNuevoRequerimiento({
      codigo: "",
      prioridad: "MEDIA",
      tipo: "",
      categoria: "",
      fechaAlta: "",
      estado: "Abierto",
      asunto: "",
      propietario: "g.jorge",
      descripcion: "",
      archivos: [],
    })
    setArchivos([])
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      if (archivos.length + newFiles.length <= 5) {
        setArchivos(prevFiles => [...prevFiles, ...newFiles])
      } else {
        alert('Solo se pueden agregar hasta 5 archivos en total.')
      }
    }
  }

  const removeFile = (index: number) => {
    setArchivos(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const opciones = [
    { value: 'req1', label: 'REQ-2024-000000001' },
    { value: 'req2', label: 'REQ-2024-000000002' },
    { value: 'req3', label: 'RES-2024-000000003' },
    { value: 'req4', label: 'REQ-2024-000000033' },
    { value: 'req5', label: 'REQ-2024-000000053' },
    { value: 'req6', label: 'REQ-2024-000000055' },
    { value: 'req7', label: 'REQ-2024-000000303' },
    { value: 'req8', label: 'REQ-2024-000000008' },
    { value: 'req9', label: 'REQ-2024-000000007' },
    { value: 'req10',label: 'REQ-2024-000000032' },
    { value: 'req11',label: 'REQ-2024-000000013' },
    { value: 'req12',label: 'REQ-2024-000000003' },
  ];

  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (selected: any) => {
    setSelectedOption(selected);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-4xl rounded bg-white max-h-[90vh] overflow-y-auto">
          <div className="p-4 space-y-4 bg-custom-grey">
            <div className="space-y-2">
              <label htmlFor="asunto" className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                Asunto:
              </label>
              <input
                id="asunto"
                value={nuevoRequerimiento.asunto}
                onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, asunto: e.target.value })}
                className="w-full border-2 rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
                  Tipo
                </label>
                <select 
                  onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, tipo: e.target.value })}
                  className="w-full border rounded-b-lg p-2"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="hardware">Requerimiento de Hardware</option>
                  <option value="software">Requerimiento de Software</option>
                  <option value="error">Error</option>
                </select>
              </div>

              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
                  Categoria
                </label>
                <select
                  onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, categoria: e.target.value })}
                  className="w-full border rounded-b-lg p-2"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="reparacion">Solicitud reparación de hardware</option>
                  <option value="instalacion">Instalación de software</option>
                  <option value="falla">Nueva falla</option>
                </select>
              </div>

              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
                  Prioridad
                </label>
                <select
                  onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, prioridad: e.target.value as "MEDIA" | "BAJA" | "URGENTE" })}
                  className="w-full border rounded-b-lg p-2"
                >
                  <option value="">Seleccionar Prioridad</option>
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="URGENTE">Urgente</option>
                </select>
              </div>

              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
                  Estado
                </label>
                <input
                  value="Abierto"
                  disabled
                  className="w-full bg-gray-100 border rounded-b-lg p-2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="descripcion" className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                Descripción:
              </label>
              <textarea
                id="descripcion"
                value={nuevoRequerimiento.descripcion}
                onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, descripcion: e.target.value })}
                className="min-h-[200px] w-full border-2 rounded-lg p-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg">
                  Archivos ({archivos.length}/5)
                </label>
                <div className="border-2 rounded-lg rounded-tr-none rounded-tl-none p-4 bg-white max-h-[200px] overflow-y-auto flex flex-col justify-between" style={{ minHeight: '150px' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                    className="hidden"
                    id="file-upload"
                    multiple
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center justify-center mb-4"
                  >
                    <PlusSquare className="h-12 w-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Seleccionar archivo(s) (PDF o Word)</span>
                  </label>
                  <div className="space-y-2">
                    {archivos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                        <span className="text-sm truncate">{file.name}</span>
                        <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-start">
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg">
                  Requerimientos relacionados
                </label>
                <div className="border-2 rounded-lg rounded-tr-none rounded-tl-none p-4 bg-white" style={{ minHeight: '150px' }}>
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={opciones}
                    isSearchable={true}  // Activa el buscador
                    styles={{
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: 150,  // Altura máxima del menú
                        overflowY: 'auto',  // Agrega scroll cuando es necesario
                      }),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={onClose}
                className="bg-gray-700 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={crearRequerimiento}
                className="bg-gray-700 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
