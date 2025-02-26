import React, { useState, useRef } from 'react'
import { useEffect } from "react";
import { Dialog, DialogPanel } from '@headlessui/react'
import { User, FileText, Paperclip, Send, Download, X } from 'lucide-react'
import { CrearRequerimiento } from './CrearRequerimiento'
import { Requerimiento } from '../../../types/user'
import Button2 from '../../ui/Button2/Button2'

interface Comentario {
  key:number
  username: string
  fecha: string
  hora: string
  asunto: string
  descripcion: string
  archivos: Array<{ nombre: string; tipo: string, id:number }>
}

interface VisualizarRequerimientoProps {
  requerimiento: Requerimiento | null
  isOpen: boolean
  onClose: () => void
  onCrear: (requerimiento: Requerimiento) => void
}

export function VisualizarRequerimiento({ requerimiento, isOpen, onClose, onCrear,}: VisualizarRequerimientoProps) {
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [comentarios, setComentarios] = useState<Comentario[]>([
  ])
  const [archivosNuevoComentario, setArchivosNuevoComentario] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  
  

  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [modalNuevoVisible, setModalNuevoVisible] = useState<boolean>(false);
  const [modalDescripcionVisible, setModalDescripcionVisible] = useState<boolean>(false);
  const [fechaCierre] = useState<string | null>(null) // Estado para la fecha de cierre
  const [asuntoForm, setAsuntoForm] = useState('')
  const [descripcionForm, setDescripcionForm] = useState('')

  const asuntoFormHandler = function(event){
    setAsuntoForm(event.target.value);
  }

  const descriptionFormHandler = function(event){
    setDescripcionForm(event.target.value);
  }


    {/* TODO cargar comentarios del back y llamar a la funcion agregarComentario() por cada comentario cargado (agregar parametros a esa funcion)*/}
    const cargarComentarios = async () => {
  try {
    const response = await fetch(`http://localhost:8080/comentarios/${requerimiento?.codigo}/todos`);
    if (!response.ok) {
      throw new Error("Error al obtener comentarios");
    }

    const data = await response.json(); // Convertir respuesta a JSON

    // Verifica la estructura de los datos devueltos
    console.log("Datos recibidos del backend:", data);

    // Crear objetos Comentario y agregarlos a la lista
    const nuevosComentarios = data.data.map((comentario) => ({
      key: comentario.id,
      username: comentario.username,
      fecha: comentario.fecha,
      hora: comentario.hora,
      asunto: comentario.asunto,
      descripcion: comentario.descripcion,
      archivos: comentario.archivos.map((archivo) => ({
        id: archivo.id, // Asegúrate de que el ID del archivo esté presente
        nombre: archivo.nombre || "Desconocido",
        tipo: archivo.tipo || "Desconocido",
      })),
    }));

    // Agregar los comentarios al estado
    setComentarios(nuevosComentarios);
  } catch (error) {
    console.error("Error al cargar comentarios:", error);
  }
};
  
useEffect(() => {
  if (isOpen && requerimiento) {
    cargarComentarios();
  }
}, [isOpen, requerimiento]);

  if (!requerimiento) return null
  
  const handleFileAction = async (archivo: { id: number; nombre: string; tipo: string }) => {
    try {
      const response = await fetch(`http://localhost:8080/archivos/archivo/descargar/${archivo.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}` // Si necesitas pasar un token de autenticación
        }
      });
  
      if (!response.ok) {
        throw new Error('Error al descargar el archivo');
      }
  
      const blob = await response.blob(); // Obtener el archivo como Blob
      const link = document.createElement('a'); // Crear el enlace para descarga
      const url = window.URL.createObjectURL(blob); // Crear un URL del Blob
      link.href = url;
      link.download = archivo.nombre; // Establecer el nombre del archivo
      document.body.appendChild(link);
      link.click(); // Hacer clic para iniciar la descarga
      document.body.removeChild(link); // Limpiar el DOM
  
      // Liberar el objeto URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al intentar descargar el archivo:", error);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newFiles = Array.from(files).filter(file => 
        file.type === 'application/pdf' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      )
      if (archivosNuevoComentario.length + newFiles.length <= 5) {
        setArchivosNuevoComentario(prevFiles => [...prevFiles, ...newFiles])
      } else {
        alert('Solo se pueden agregar hasta 5 archivos por comentario.')
      }
    }
  }

  const removeFile = (index: number) => {
    setArchivosNuevoComentario(prevFiles => prevFiles.filter((_, i) => i !== index))
  }

  const agregarComentario = async () => {
    const comentarioDTO = {
      asunto: asuntoForm,
      descripcion: descripcionForm,
      username: localStorage.getItem('userName') || '',
      fecha: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      hora: new Date().toISOString().split("T")[1].split(".")[0], // HH:mm:ss
      archivos: [] // No se envían aquí los archivos, van aparte en FormData
    };
  
    const formData = new FormData();
    formData.append(
      "comentarioDTO",
      new Blob([JSON.stringify(comentarioDTO)], { type: "application/json" })
    );
  
    archivosNuevoComentario.forEach((file) => {
      formData.append("archivos", file);
    });
  
    try {
      const response = await fetch(
        `http://localhost:8080/comentarios/${requerimiento?.codigo}/agregar`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
  
      // Actualizar la lista de comentarios
      const nuevoComentarioObj = {
        key: data.data.id,
        username: localStorage.getItem("userName") || "",
        fecha: new Date().toLocaleDateString("es-ES"),
        hora: new Date().toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        asunto: asuntoForm,
        descripcion: descripcionForm,
        archivos: data.data.archivos.map((archivo) => ({
          id: archivo.id, // Usar el ID devuelto por el backend
          nombre: archivo.nombre,
          tipo: archivo.tipo,
        })),
      };
  
      setComentarios([...comentarios, nuevoComentarioObj]);
      setAsuntoForm("");
      setDescripcionForm("");
      setArchivosNuevoComentario([]);
      setModalNuevoVisible(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };
  

  const mostrarDescripcion = (comentario: Comentario) => {
    setComentarioSeleccionado(comentario);
    setModalDescripcionVisible(true);
  };

  const cerrarModalDescripcion = () => {
    setModalDescripcionVisible(false);
    setComentarioSeleccionado(null);
  };

  const cerrarModalNuevo = () => {
    setModalNuevoVisible(false);
  };

  const formatHora = (hora: string) => {
    const regex = /^(\d{2}):(\d{2})(?::(\d{2}))?(?:\.(\d{3}))?$/;
    const match = hora.match(regex);
  
    if (!match) {
      console.error("Hora inválida:", hora);
      return "Hora no válida"; 
    }
  
    const hours = match[1]; 
    const minutes = match[2]; 
    return `${hours}:${minutes}`;
  };

  const formatFecha = (fecha: string) => {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = fecha.match(regex);
  
    if (!match) {
      console.error("Fecha inválida:", fecha);
      return "Fecha no válida"; 
    }
  
    const [_, year, month, day] = match; 
    return `${day}/${month}/${year}`;
  };
  
  
  
  
  
  return (
    <div>
      <>
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
          <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="w-full max-w-6xl rounded-lg bg-white my-4 max-h-[90vh] flex flex-col">
            <div className="flex-grow overflow-y-auto p-4 bg-custom-grey">

          <div className="flex justify-between items-center mt-0">
            {fechaCierre && requerimiento.estado === 'Cerrado' && (
                    <div className="mb-2 p-1 text-gray-800 rounded-lg">
          <strong>Fecha de Cierre: </strong>{fechaCierre}
        </div>
        )}
    </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna izquierda */}
                <div className="space-y-4">
                  <div className="grid gap-4">
                  <LabeledField label="Código" value={requerimiento.codigo} noTopLeftRounded />
                  <LabeledField label="Tipo" value={requerimiento.tipoRequerimiento.codigo || 'Tipo desconocido'} noTopLeftRounded />
                    <LabeledField label="Categoría" value={requerimiento.categRequerimiento} noTopLeftRounded />
                    <LabeledField label="Estado" value={requerimiento.estado} noTopLeftRounded />
                    <LabeledField label="Prioridad" value={requerimiento.prioridad} noTopLeftRounded />
                  </div>
                  <div>
                    <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                      Descripción:
                    </label>
                    <div className="w-full border-2 rounded-lg rounded-tl-none p-2 bg-white h-[120px] overflow-y-auto">
                    {requerimiento.descripcion || 'Descripción - Descripción - Descripción - Descripción'}
                    </div>
                  </div>
                </div>
                

                {/* Columna derecha */}
                <div className="space-y-4">
                  <LabeledField label="Propietario" value={requerimiento.propietario?  
                    `${requerimiento.propietario?.nombre} ${requerimiento.propietario?.apellido}` : <span className="text-gray-500">Ningún propietario asociado</span>} 
                    noTopLeftRounded />
                  <LabeledField label="Asunto" value={requerimiento.asunto} noTopLeftRounded />
                  <LabeledField label="Usuario emisor" value={`${requerimiento.emisor?.nombre} ${requerimiento.emisor?.apellido}`} noTopLeftRounded/>
                  <LabeledField label="Fecha alta" value={formatFecha(requerimiento.fechaAlta)} noTopLeftRounded />
                  <LabeledField label="Hora alta" value={formatHora(requerimiento.horaAlta ?? '09:17:00') } noTopLeftRounded />

                  <div>
                    <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                      Lista de archivos
                    </label>
                    <div className="w-full border-2 rounded-lg rounded-tl-none p-2 bg-white h-[120px] overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {requerimiento.archivos && requerimiento.archivos.length > 0 ? (
                          requerimiento.archivos.map((archivo, index) => (
                            <div key={index} className="flex items-center justify-between text-gray-600 border-b pb-2">
                              <div className="flex items-center gap-2">
                                <FileText className="h-6 w-6" />
                                <span>{archivo.nombre}</span>
                              </div>
                              <div>
                                <button
                                  onClick={() => handleFileAction(archivo)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Descargar archivo"
                                >
                                  <Download className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No hay archivos adjuntos</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg mt-4">
                  Requerimientos Relacionados
                </label>
                <div className="w-full border-2 rounded-lg rounded-tl-none p-2 bg-white h-[120px] overflow-y-auto">
                  {requerimiento.codigoRequerimientoRelacionado && requerimiento.codigoRequerimientoRelacionado.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {requerimiento.codigoRequerimientoRelacionado.map((relatedRequerimiento, index) => (
                        <li key={index} className="text-gray-700">
                          <span className="font-semibold">{relatedRequerimiento}</span> 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">No hay requerimientos relacionados.</span>
                  )}
                </div>
              </div>


  
              {/* Sección de comentarios */}
              <div className="mt-6">
                <div className="mt-6">
                  <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                    Comentarios
                  </label>
                  <div className="w-full border-2 rounded-lg rounded-tl-none bg-white">
                    {/* Encabezados de la tabla */}
                    <div className="grid grid-cols-6 gap-4 border-b pb-2 p-4">
                      <h2>Emisor</h2>
                      <h2>Fecha</h2>
                      <h2>Hora</h2>
                      <h2>Asunto</h2>
                      <h2>Descripción</h2>
                      <h2>Acciones</h2>
                    </div>
                    {/* Lista de comentarios */}
                    <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                      {comentarios.map((comentario, index) => (
                        <div key={index} className="grid grid-cols-6 gap-4 items-center border-b pb-4">
                          <div>
                            <span className="font-semibold">{comentario.username}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{formatFecha(comentario.fecha)}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{formatHora(comentario.hora)}</span>
                          </div>
                          <div>
                            <span>{comentario.asunto}</span>
                          </div>
                          <div>
                            <p className="text-gray-700">
                              {comentario.descripcion.length > 20
                                ? comentario.descripcion.substring(0, 20) + "..."
                                : comentario.descripcion}
                            </p>
                          </div>
                          <div>
                            <Button2 onClick={() => mostrarDescripcion(comentario)} className='AcceptButton' title={"Ver Detalle"}></Button2>
                          </div>
                          {comentario.archivos.length > 0 && (
                            <div className="col-span-6 mt-2">
                              <p className="text-sm font-semibold mb-1">Archivos adjuntos:</p>
                              <div className="flex flex-wrap gap-2">
                                {comentario.archivos.map((archivo, fileIndex) => (
                                  <button
                                    key={fileIndex}
                                    onClick={() => handleFileAction(archivo)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                  >
                                    <FileText className="h-4 w-4 mr-1" />
                                    {archivo.nombre}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Formulario para nuevo comentario */}
                    <div className="border-t p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Button2 onClick={() => setModalNuevoVisible(true)} className='AcceptButton' title={"Crear comentario nuevo"}></Button2>
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept=".pdf,.docx"
                          className="hidden"
                          id="comment-file-upload"
                          multiple
                        />
                      </div>
                      {archivosNuevoComentario.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {archivosNuevoComentario.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-100 p-1 rounded">
                              <span className="text-sm truncate">{file.name}</span>
                              <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/* Modal para Ver Descripcion */}
          {modalDescripcionVisible && comentarioSeleccionado && (
  <Dialog open={modalDescripcionVisible} onClose={cerrarModalDescripcion} className="relative z-50">
    <div className="fixed inset-0 flex bg-black/50" aria-hidden="true" />
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
      <Dialog.Panel className="relative w-full max-w-md rounded-lg bg-white shadow-lg p-4 overflow-visible">
        <div className="absolute -top-11 left-0 bg-[#B8D68F] text-black px-10 py-3 rounded-tl-lg rounded-tr-lg shadow z-[-1]">
          <h1 className="text-xl font-bold">{comentarioSeleccionado.username}</h1>
        </div>
        <h1 className="text-xl font-bold mt-0 pb-2 border-b">{comentarioSeleccionado.asunto}</h1>
        <p className="text-gray-500 pt-2 ">{formatFecha(comentarioSeleccionado.fecha)}</p>
        <p className="text-gray-500 pb-2 border-b">{formatHora(comentarioSeleccionado.hora)}</p>
        <p className="text-gray-700 mt-4">{comentarioSeleccionado.descripcion}</p>
        {comentarioSeleccionado.archivos.length > 0 ? (
          <div className="mt-2">
            <p className="text-sm font-semibold mb-1">Archivos adjuntos:</p>
            <div className="flex flex-wrap gap-2">
              {comentarioSeleccionado.archivos.map((archivo, fileIndex) => (
                <button
                  key={fileIndex}
                  onClick={() => handleFileAction(archivo)}
                  className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {archivo.nombre}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm mt-2">No hay archivos asociados.</p>
        )}
        <Button2 onClick={cerrarModalDescripcion} className='NeutralButton' title={"Cerrar"}></Button2>
      </Dialog.Panel>
    </div>
  </Dialog>
)}


            {/* Botones de acción */}
            <div className="bg-custom-grey p-4 rounded-b-lg">
              <div className="flex justify-end gap-4">
              <Button2 onClick={onClose} className='NeutralButton' title={"Cerrar"}></Button2>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {modalNuevoVisible && (
  <Dialog open={modalNuevoVisible} onClose={cerrarModalNuevo} className="relative z-50">
    <div className="fixed inset-0 flex bg-black/50" aria-hidden="true" />
    <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
      <Dialog.Panel className="relative w-full max-w-md rounded-lg bg-white shadow-lg p-4 overflow-visible">
        <Dialog.Title className="text-xl font-bold pb-2">Nuevo Comentario</Dialog.Title>
        <form onSubmit={(e) => {
          e.preventDefault();
          agregarComentario();
        }}>
          <div>
            <label className="block font-medium pl-1">Asunto</label>
            <input
              type="text"
              placeholder="Asunto"
              value={asuntoForm}
              onChange={asuntoFormHandler}
              className="w-full flex-1 p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block font-medium pt-2 pl-1">Descripcion</label>
            <textarea
              placeholder="Descripcion"
              onChange={descriptionFormHandler}
              value={descripcionForm}
              className="w-full h-32 p-2 border rounded-md resize-none text-left align-top"
              required
            ></textarea>
          </div>
          <div>
            <label className="block font-medium pt-2 pl-1">Seleccionar Archivos</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full flex-1 p-2 border rounded-md"
              multiple
            />
          </div>
          {archivosNuevoComentario.length > 0 && (
            <div className="mt-2 space-y-1">
              {archivosNuevoComentario.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-1 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button onClick={() => removeFile(index)} className="text-red-500 hover:text-red-700">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-end gap-4 mt-4">
            <Button2 onClick={cerrarModalNuevo} className='CancelButton' title={"Cancelar"}></Button2>
            <Button2 type="submit" className='AcceptButton' title={"Crear"}></Button2>
          </div>
        </form>
      </Dialog.Panel>
    </div>
  </Dialog>
)}

      <CrearRequerimiento
        onCrear={(nuevoRequerimiento) => {
          onCrear(nuevoRequerimiento);
          setIsCreateDialogOpen(false);
          onClose();
        }}
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
    </div>
  )
}

function LabeledField({ label, value, noTopLeftRounded }: { label: string; value: string; noTopLeftRounded?: boolean }) {
  return (
    <div>
      <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
        {label}
      </label>
      <div
        className={`w-full border-2 rounded-lg p-2 bg-white ${noTopLeftRounded ? 'rounded-tl-none' : ''}`}
        style={{ minHeight: '50px' }} > 
         {value || ''}
      </div>
    </div>
  )
}

