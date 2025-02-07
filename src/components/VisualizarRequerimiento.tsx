import React, { useState, useRef } from 'react'
import { Dialog } from '@headlessui/react'
import { User, FileText, Paperclip, Send, Download, X } from 'lucide-react'
import { CrearRequerimiento } from './CrearRequerimiento'
import { Requerimiento } from '../types/requerimiento'

interface Comentario {
  fecha: string
  hora: string
  usuario: string
  mensaje: string
  archivos: Array<{ nombre: string; tipo: string }>
}

interface VisualizarRequerimientoProps {
  requerimiento: Requerimiento | null
  isOpen: boolean
  onClose: () => void
  onCrear: (requerimiento: Requerimiento) => void
  onCerrarCaso: (requerimiento: Requerimiento) => void; 
}

export function VisualizarRequerimiento({ requerimiento, isOpen, onClose, onCrear,onCerrarCaso,}: VisualizarRequerimientoProps) {
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [comentarios, setComentarios] = useState<Comentario[]>([
    {
      fecha: '12/10/2024',
      hora: '11:10',
      usuario: 'd.ramon',
      mensaje: 'archivo reh-1-ar1 mal ingresado',
      archivos: []
    },
    {
      fecha: '12/10/2024',
      hora: '11:41',
      usuario: 'g.jorge',
      mensaje: 'corregido.',
      archivos: []
    },
    {
      fecha: '15/10/2024',
      hora: '11:10',
      usuario: 'd.ramon',
      mensaje: 'perfecto',
      archivos: []
    }
  ])
  const [archivosNuevoComentario, setArchivosNuevoComentario] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isConfirmCloseOpen, setIsConfirmCloseOpen] = useState(false) // Nuevo estado para controlar el pop-up de confirmación
  const [fechaCierre, setFechaCierre] = useState<string | null>(null) // Estado para la fecha de cierre

  const opcionesTipo = [
    { value: 'hardware', label: 'Requerimiento de Hardware', codigo: 'REH' },
    { value: 'software', label: 'Requerimiento de Software', codigo: 'RES' },
    { value: 'error', label: 'Error', codigo: 'EER' },
    { value: 'operativo', label: 'Gestión Operativa', codigo: 'GOP' },
  ]
  if (!requerimiento) return null
  
  const handleFileAction = (archivo: { nombre: string; tipo: string }) => {
    const link = document.createElement('a')
    link.href = `/api/files/${archivo.nombre}`
    link.download = archivo.nombre
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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

  const agregarComentario = () => {
    if (nuevoComentario.trim() === '') return

    const nuevoComentarioObj: Comentario = {
      fecha: new Date().toLocaleDateString('es-ES'),
      hora: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      usuario: 'g.jorge',
      mensaje: nuevoComentario,
      archivos: archivosNuevoComentario.map(file => ({ nombre: file.name, tipo: file.type }))
    }

    setComentarios([...comentarios, nuevoComentarioObj])
    setNuevoComentario('')
    setArchivosNuevoComentario([])
  }

  const handleCerrarCaso = () => {
    setIsConfirmCloseOpen(true) // Mostrar el pop-up de confirmación
  }

  const confirmarCerrarCaso = () => {
    if (requerimiento) {
      const requerimientoCerrado: Requerimiento = {
        ...requerimiento,
        estado: "Cerrado", // Cambiar el estado a "Cerrado"
      };
      const fecha = new Date();
      const fechaFormateada = fecha.toLocaleDateString('es-ES'); // Formato de fecha en español
      const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour12: false }); // Hora en formato 24 horas  
      setFechaCierre(`${fechaFormateada} ${horaFormateada}`);
      onCerrarCaso(requerimientoCerrado); // Notificar al componente padre
      onClose(); // Cerrar el diálogo
    }
    setIsConfirmCloseOpen(false); // Cerrar el pop-up de confirmación
  }

  const cancelarCerrarCaso = () => {
    setIsConfirmCloseOpen(false); // Cerrar el pop-up de confirmación
  }

  return (
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
                  <LabeledField label="Tipo" value={opcionesTipo.find(option => option.value === requerimiento.tipo)?.label || 'Tipo desconocido'} noTopLeftRounded />
                    <LabeledField label="Categoría" value={requerimiento.categoria} noTopLeftRounded />
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
                  <LabeledField label="Propietario" value={requerimiento.propietario} noTopLeftRounded />
                  <LabeledField label="Asunto" value={requerimiento.asunto} noTopLeftRounded />
                  <LabeledField label="Usuario emisor" value={requerimiento.usuarioEmisor || 'Díaz Ramón'} noTopLeftRounded/>
                  <LabeledField label="Fecha alta" value={requerimiento.fechaAlta} noTopLeftRounded />
                  <LabeledField label="Hora alta" value={requerimiento.horaAlta || '09:17 am'} noTopLeftRounded />

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
    {requerimiento.requerimientosRelacionados && requerimiento.requerimientosRelacionados.length > 0 ? (
      <ul className="list-disc pl-5">
        {requerimiento.requerimientosRelacionados.map((relatedRequerimiento, index) => (
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
                <label className="bg-[#B8D68F] text-black px-4 py-2 inline-block rounded-tl-lg rounded-tr-lg">
                  Comentarios
                </label>
                <div className="w-full border-2 rounded-lg rounded-tl-none bg-white">
                  <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                    {comentarios.map((comentario, index) => (
                      <div key={index} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-semibold">{comentario.usuario}</span>
                            <span className="text-gray-500 ml-2">
                              {comentario.fecha} {comentario.hora}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{comentario.mensaje}</p>
                        {comentario.archivos.length > 0 && (
                          <div className="mt-2">
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
                  <div className="border-t p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        placeholder="Escribir un comentario..."
                        className="flex-1 p-2 border rounded-md"
                      />
                      <button
                        onClick={agregarComentario}
                        className="bg-[#556B2F] text-white p-2 rounded-md hover:bg-[#4A5D29] transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
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
                      <label
                        htmlFor="comment-file-upload"
                        className="cursor-pointer text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Paperclip className="h-5 w-5 mr-1" />
                        Adjuntar archivos (máx. 5)
                      </label>
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

            {/* Botones de acción */}
            <div className="bg-custom-grey p-4 rounded-b-lg">
              <div className="flex justify-end gap-4">
                <button onClick={onClose} className="bg-gray-800 text-white px-8 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  Volver
                </button>
                {requerimiento.estado !== 'Cerrado' && (
                <button
                  onClick={handleCerrarCaso} // Llamamos a la función para mostrar el pop-up de confirmación
                  className="bg-gray-800 text-white px-8 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cerrar Caso
                </button>
                )}
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>


      {isConfirmCloseOpen && (
        <Dialog open={isConfirmCloseOpen} onClose={cancelarCerrarCaso} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold">¿Estás seguro de cerrar el caso?</h3>
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={confirmarCerrarCaso}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  Sí
                </button>
                <button
                  onClick={cancelarCerrarCaso}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  No
                </button>
              </div>
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

