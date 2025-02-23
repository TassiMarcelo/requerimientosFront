import React, { useState, useRef, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { PlusSquare, X } from 'lucide-react'
import Select from 'react-select'
import { Requerimiento } from '../types/requerimiento'
import Swal from 'sweetalert2'
import Button2 from '../../ui/Button2/Button2'
import CloseButton from "../../ui/CloseButton";


interface CrearRequerimientoProps {
  onCrear: (requerimiento: Requerimiento) => void
  isOpen: boolean
  onClose: () => void
  datos: Requerimiento[]
}



export function CrearRequerimiento({ onCrear, isOpen, onClose, datos }: CrearRequerimientoProps) {
  const [nuevoRequerimiento, setNuevoRequerimiento] = useState<Requerimiento>({
    codigo: "",
    prioridad: "",
    tipo: "",
    codigoTipoRequerimiento: "",
    categoria: "",
    fechaAlta: "",
    requerimientosRelacionados: [],
    estado: "Abierto",
    asunto: "",
    propietario: "",
    descripcion: "",
    archivos: [],
  })

  const [tipos, setTipos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [archivos, setArchivos] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);

  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string }[]>([]);



  // Cargar tipos y categorías
  useEffect(() => {
    const cargarDatosIniciales = async () => {
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
        
        console.log(tiposData.data);

        setTipos(tiposData.data.map((t: any) => ({ // Se nombran value y label para poder ser leido por el select
          value: t.codigo,
          label: t.codigo
        })));

        setCategorias(categoriasData.data.map((c: any) => ({  // Se nombran value y label para poder ser leido por el select
          value: c.descripcion,
          label: c.descripcion
        })));
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  const sendJsonFile = async () => {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor, espera un momento.',
      allowOutsideClick: false, // Evita que el usuario cierre la alerta haciendo clic fuera
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner de carga
      },
    });
    const jsonData = {
      asunto: nuevoRequerimiento.asunto,
      descripcion: nuevoRequerimiento.descripcion,
      prioridad: nuevoRequerimiento.prioridad,
      categRequerimiento: nuevoRequerimiento.categoria,
      tipoRequerimiento: {
        codigo: nuevoRequerimiento.codigoTipoRequerimiento
      },
      emisor: {
        id: localStorage.getItem("userId")
      },
      codigoRequerimientoRelacionado: selectedOption.map(option => option.value) // Mapping all values
    };
    
  
    console.log(jsonData);
    // Crear un Blob y convertirlo en un File
    const jsonBlob = new Blob([JSON.stringify(jsonData)], { type: "application/json" });
    const jsonFile = new File([jsonBlob], "datos.json", { type: "application/json" });

    const formData = new FormData();
    for(const arch of archivos){
      formData.append("archivos", arch);
    }
    const file1 = new File([], "archivo_vacio.txt", { type: "text/plain" });
  
    // Crear FormData para enviarlo
    
    formData.append("requerimientoDTO", jsonFile); // El backend debe esperar una clave "file"
    formData.append("archivos", file1); // El backend debe esperar una clave "file"
  
    try {
      const response = await fetch("http://localhost:8080/requerimientos/agregar", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) throw new Error("Error al subir el archivo");

      const result = await response.json();
      console.log("Archivo subido con éxito:", result);
      Swal.close()
      Swal.fire("Exito","Requerimiento creado con exito");
    } catch (error) {
      console.error("Error:", error);
      Swal.close();
      Swal.fire("Error",error.toString());
    }
  };



  const obtenerOpcionesCategoria = (tipoSeleccionado: string) => {
    if (!tipoSeleccionado) {
      return categorias;
    }
    return categorias.filter(cat => cat.tipoCodigo === tipoSeleccionado);
  };
  

const handleTipoChange = (selected: any) => {
  const tipoSeleccionado = selected?.value || '';
  setNuevoRequerimiento({ 
    ...nuevoRequerimiento, 
    codigoTipoRequerimiento: tipoSeleccionado,  // codigo del tipo
    categoria: "" // Restablecer categoría al cambiar tipo
  });
};


const handleCategoriaChange = (selected: any) => {
  const nuevaCategoria = selected?.value || '';
  setNuevoRequerimiento(prevState => ({
    ...prevState,
    categoria: nuevaCategoria,
    tipo: nuevoRequerimiento.tipo,  // Actualizar el tipo automáticamente
  }));
};




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


  const opciones = datos && datos.length > 0 ? datos.map((requerimiento) => ({
    value: requerimiento.codigo,
    label: requerimiento.codigo, // o usar otro campo, como requerimiento.asunto
  })) : [];



  const handleCancel = () => {
    Swal.fire({
      title: '¿Estás seguro?', // Título de la alerta
      text: "¡No podrás revertir esta acción!", // Texto adicional (opcional)
      icon: 'warning', // Icono (warning, error, success, info, question)
      showCancelButton: true, // Mostrar botón de cancelar
      confirmButtonText: 'Sí, continuar', // Texto del botón de confirmación
      cancelButtonText: 'Cancelar', // Texto del botón de cancelar
      customClass: {
        confirmButton: 'CancelButton', // Clase personalizada para el botón de confirmación
        cancelButton: 'AcceptButton' // Clase personalizada para el botón de cancelar
      }
    }).then((result) => {
      if (result.isConfirmed) {
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
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Si el usuario hace clic en "Cancelar"
        //Swal.fire('Cancelado', 'La acción fue cancelada.', 'error');
      }
    });
    //setShowCancelConfirmation(true); 
  };

  const handleRequerimientoRelacionadoChange = (selected: any) => {
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
    
      <div className="border-b border-gray-600 bg-gray-500 relative p-5 flex justify-end">
      <div className="absolute -top-1 right-2">
          <CloseButton onClick={onClose} />
        </div>
        </div>
        <div className="p-4 space-y-4 bg-custom-grey">
        <div className="space-y-0">
  <label
    htmlFor="asunto"
    className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg"
  >
    Asunto:
  </label>
  <input
    id="asunto"
    value={nuevoRequerimiento.asunto}
    onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, asunto: e.target.value })}
    className="w-full border-2 rounded-lg rounded-tl-none p-2"
    maxLength={50}
  />
</div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <div>
    <label className="bg-[#B8D68F] text-black px-4 py-2 block rounded-t-lg text-center">
      Tipo
    </label>
    <Select
      onChange={handleTipoChange}
      options={tipos}
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
      value={categorias.find(option => option.value === nuevoRequerimiento.categoria) || null}
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
      className="w-full bg-white border rounded-b-lg rounded-t-none p-2 h-[52px] focus:ring-0"
      />
  </div>
</div>


            <div className="space-y-0">
              <label htmlFor="descripcion" className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                Descripción:
              </label>
              <textarea
                id="descripcion"
                value={nuevoRequerimiento.descripcion}
                onChange={(e) => setNuevoRequerimiento({ ...nuevoRequerimiento, descripcion: e.target.value })}
                className="min-h-[200px] w-full border-2 rounded-lg rounded-tl-none p-2"
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
                  <Select
                    value={selectedOption}
                    onChange={handleRequerimientoRelacionadoChange}
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
              <Button2 title={"Cancelar"} onClick={handleCancel} className='CancelButton'></Button2>
              <Button2 onClick={sendJsonFile} className='AcceptButton' title={"Confirmar"}></Button2>
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
