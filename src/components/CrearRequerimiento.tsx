import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { PlusSquare, X } from 'lucide-react'
import Select from 'react-select'
import { Requerimiento } from '../types/requerimiento'

interface CrearRequerimientoProps {
  onCrear: (requerimiento: Requerimiento) => void
  isOpen: boolean
  onClose: () => void
  datos: Requerimiento[]
}

export function CrearRequerimiento({ onCrear, isOpen, onClose, datos }: CrearRequerimientoProps) {
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

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const obtenerOpcionesCategoria = (tipoSeleccionado: string) => {
    if (!tipoSeleccionado) {
      return opcionesCategoria;
    }
    return opcionesCategoria.filter(option => option.tipo === tipoSeleccionado);
  };
  

const obtenerTipoPorCategoria = (categoria: string, tipoActual: string) => {
  switch (categoria) {
    case 'Solicitud reparación de hardware':
    case 'Instalación de hardware':
      return 'hardware';
    case 'Solicitud reparación de software':
    case 'Instalación de software':
      return 'software';
    case 'Nueva falla':
      return 'error';
    default:
      return tipoActual; // Mantiene el tipo actual si no hay coincidencia
  }
};

const handleTipoChange = (selected: any) => {
  const tipoSeleccionado = selected?.value || '';
  setNuevoRequerimiento({ 
    ...nuevoRequerimiento, 
    tipo: tipoSeleccionado, 
    categoria: "" // Restablecer categoría al cambiar tipo
  });
};


const handleCategoriaChange = (selected: any) => {
  const nuevaCategoria = selected?.value || '';
  const nuevoTipo = obtenerTipoPorCategoria(nuevaCategoria, nuevoRequerimiento.tipo); // Obtén el tipo relacionado con la categoría
  setNuevoRequerimiento(prevState => ({
    ...prevState,
    categoria: nuevaCategoria,
    tipo: nuevoTipo,  // Actualizar el tipo automáticamente
  }));
};


  const crearRequerimiento = () => {
    const nuevoId = `REQ-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000000).toString().padStart(9, '0')}`
    const fechaActual = new Date().toLocaleDateString('es-ES')
    const nuevoReq = {
      ...nuevoRequerimiento,
      codigo: nuevoId,
      fechaAlta: fechaActual,
      archivos: archivos.map(file => ({ nombre: file.name, tipo: file.type })),
      requerimientosRelacionados: selectedOption?.map(option => option.value) || [],
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
    setSelectedOption(null);
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

  console.log(datos);
  const opciones = datos && datos.length > 0 ? datos.map((requerimiento) => ({
    value: requerimiento.codigo,
    label: requerimiento.codigo, // o usar otro campo, como requerimiento.asunto
  })) : [];
  console.log(opciones); 
  


  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);

  const handleCancel = () => {
    setShowCancelConfirmation(true); 
  };

  const handleChange = (selected: any) => {
    setSelectedOption(selected ? selected : null);  // Asegúrate de manejar null correctamente
  };

  const opcionesTipo = [
    { value: 'hardware', label: 'Requerimiento de Hardware', codigo: 'REH' },
    { value: 'software', label: 'Requerimiento de Software', codigo: 'RES' },
    { value: 'error', label: 'Error', codigo: 'EER' },
    { value: 'operativo', label: 'Gestión Operativa', codigo: 'GOP' },
  ]
  const tipoLabel = opcionesTipo.find(option => option.value === nuevoRequerimiento.tipo)?.label || 'Sin tipo';
 
  const opcionesCategoria = [
    { value: 'Solicitud reparación de hardware', label: 'Solicitud reparación de hardware',tipo:'hardware'},
    { value: 'Solicitud reparación de software', label: 'Solicitud reparación de software',tipo:'software'},
    { value: 'Instalación de software', label: 'Instalación de software',tipo: 'software'},
    { value: 'Instalación de hardware', label: 'Instalación de hardware',tipo: 'hardware'},
    { value: 'Nueva falla', label: 'Nueva falla',tipo:'error'}
  ]
  
  const opcionesPrioridad = [
    { value: 'BAJA', label: 'Baja' },
    { value: 'MEDIA', label: 'Media' },
    { value: 'URGENTE', label: 'Urgente' }
  ]

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '52px', 
      minHeight: '38px', 
 borderTopLeftRadius: '0', // Bordes superiores rectos
    borderTopRightRadius: '0', // Bordes superiores rectos
    borderBottomLeftRadius: '0.375rem', // Borde inferior redondeado (como el input)
    borderBottomRightRadius: '0.375rem', // Borde inferior redondeado (como el input)      borderColor: state.isFocused ? '#4A4A4A' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 1px #4A4A4A' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#4A4A4A' : '#d1d5db',
      },
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'white',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#4A4A4A' : state.isFocused ? '#f3f4f6' : 'white',
      color: state.isSelected ? 'white' : '#333',
      '&:hover': {
        backgroundColor: '#e2e8f0',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#000',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#333',
    }),
  };
  
   

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/90" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-6xl rounded-xl bg-white max-h-[90vh] overflow-y-auto">
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
                maxLength={50}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div>
    <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
      Tipo
    </label>
    <Select
      value={opcionesTipo.find(option => option.value === nuevoRequerimiento.tipo) || null}
      onChange={handleTipoChange}
      options={opcionesTipo}
      placeholder="Seleccionar tipo"
      styles={customStyles} 
      isClearable={true}
    />
  </div>

  <div>
    <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
      Categoría
    </label>
    <Select
      value={opcionesCategoria.find(option => option.value === nuevoRequerimiento.categoria) || null}
      onChange={handleCategoriaChange}
      options={obtenerOpcionesCategoria(nuevoRequerimiento.tipo)}  
      placeholder="Seleccionar categoría"
      styles={customStyles} 
      isClearable={true}
    />
  </div>

  <div>
    <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
      Prioridad
    </label>
    <Select
      value={opcionesPrioridad.find(option => option.value === nuevoRequerimiento.prioridad) || null}
      onChange={(selected) => setNuevoRequerimiento({ ...nuevoRequerimiento, prioridad: selected?.value || 'MEDIA' })}
      options={opcionesPrioridad}
      placeholder="Seleccionar prioridad"
      styles={customStyles} // Puedes definir tu estilo personalizado aquí
    />
  </div>

  <div>
    <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
      Estado
    </label>
    <input
      value="Abierto"
      disabled
      className="w-full bg-white border rounded-b-lg p-2 h-[52px] focus:ring-0" 
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
                maxLength={5000}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg">
                  Archivos ({archivos.length}/5)
                </label>
                <div className="border-2 rounded-lg rounded-tr-none rounded-tl-none p-4 bg-white max-h-[200px] overflow-y-auto flex flex-col justify-between" style={{ height: '150px' }}>
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
                <div className="border-2 rounded-lg rounded-tr-none rounded-tl-none p-4 bg-white" style={{ height: '150px' }}>
                {console.log(opciones)}
                  <Select
                    value={selectedOption}
                    onChange={handleChange}
                    options={opciones}
                    isMulti
                    isSearchable={true}
                    placeholder="Seleccionar requerimiento" 
                    styles={{
                      menuList: (provided) => ({
                        ...provided,
                        maxHeight: '100px',  
                        overflowY: 'auto'
                      }),
                      control: (provided, state) => ({
                        ...provided,
                        minHeight: '60px', 
                        maxHeight: '115px', 
                        overflowY: 'auto',
                        borderColor: state.isFocused ? '#4A4A4A' : provided.borderColor, // Borde gris oscuro cuando está enfocado
                        boxShadow: state.isFocused ? '0 0 0 1px #4A4A4A' : provided.boxShadow, // Sombra gris oscuro
                        '&:hover': {
                          borderColor: state.isFocused ? '#4A4A4A' : provided.borderColor,
                        },
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: '#000', // Establece el color del placeholder a negro
                      }),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={handleCancel}
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
      {showCancelConfirmation && (
  <Dialog open={showCancelConfirmation} onClose={() => setShowCancelConfirmation(false)} className="relative z-50">
    <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <Dialog.Panel className="w-full max-w-md rounded bg-white max-h-[90vh] overflow-y-auto">
        <div className="p-4 space-y-4">
          <h3 className="text-xl font-semibold">¿Está seguro de cancelar el alta del requerimiento?</h3>
          <div className="flex justify-end gap-4 mt-8">
            <button
              onClick={() => setShowCancelConfirmation(false)} // Cerrar el modal de confirmación sin hacer nada
              className="bg-gray-700 text-white px-8 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              No
            </button>
            <button
              onClick={() => {
                // Restablecer el formulario y cerrar el modal principal
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
                });
                setArchivos([]);
                setSelectedOption(null);
                setShowCancelConfirmation(false); // Cerrar el modal de confirmación
                onClose(); // Cerrar el modal principal
              }}
              className="bg-red-500 text-white px-8 py-2 rounded-md hover:bg-red-400 transition-colors"
            >
              Sí, cancelar
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </div>
  </Dialog>
)}

    </Dialog>
  )
}
