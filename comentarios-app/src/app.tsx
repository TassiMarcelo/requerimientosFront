import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

interface NuevoComentario {
  titulo: string;
  detalle: string;
  archivosAdjuntos: File[];
}

interface Comentario {
  // Define the structure of your Comentario object here
}

const App: React.FC = () => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState<NuevoComentario>({
    titulo: "",
    detalle: "",
    archivosAdjuntos: [],
  });
  const [modalFormularioVisible, setModalFormularioVisible] = useState<boolean>(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState<Comentario | null>(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState<boolean>(false);
  const [modalNuevoVisible, setModalNuevoVisible] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);

  const cargarComentarios = async () => {
    setCargando(true);
    try {
      const response = await axios.get<Comentario[]>("http://localhost:5000/api/comentarios");
      setComentarios(response.data.reverse());
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarModalFormulario = () => setModalFormularioVisible(false);

  useEffect(() => {
    cargarComentarios();
  }, []);

  const agregarComentario = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", nuevoComentario.titulo);
    formData.append("detalle", nuevoComentario.detalle);
    formData.append("emisor", "Usuario Actual"); // Reemplázalo con el usuario autenticado real
    nuevoComentario.archivosAdjuntos.forEach((archivo) => {
      formData.append("archivosAdjuntos", archivo);
    });

    try {
      await axios.post("http://localhost:5000/api/comentarios", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setNuevoComentario({ titulo: "", detalle: "", archivosAdjuntos: [] });
      setModalNuevoVisible(false);
      cargarComentarios();
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const mostrarDetalle = (comentario: Comentario) => {
    setComentarioSeleccionado(comentario);
    setModalDetalleVisible(true);
  };

  const cerrarModalDetalle = () => {
    setModalDetalleVisible(false);
    setComentarioSeleccionado(null);
  };

  const manejarArchivos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivos = Array.from(e.target.files || []);
    const archivosValidos = archivos.filter(
      (archivo) => archivo.size <= 5 * 1024 * 1024 // Máximo 5 MB por archivo
    );

    if (archivosValidos.length < archivos.length) {
      alert("Algunos archivos fueron rechazados por exceder el tamaño máximo.");
    }

    setNuevoComentario({
      ...nuevoComentario,
      archivosAdjuntos: archivosValidos,
    });
  };

  const formatearFecha = (fecha: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(fecha));
  };

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNuevoComentario((prevState) => ({ ...prevState, [name]: value }));
  };

return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Comentarios</h2>
      <button
        className="btn btn-success mb-3"
        onClick={() => setModalNuevoVisible(true)}
      >
        Agregar Comentario
      </button>
      {cargando ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Cargando...</span>
          </div>
          <p>Cargando comentarios...</p>
        </div>
      ) : (
        <table className="table table-hover table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Emisor</th>
              <th>Título</th>
              <th>Fecha y Hora</th>
              <th>Detalles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((comentario: { emisor: string; titulo: string; fechaHora: string; detalle: string; }, index: number) => (
              <tr key={index}>
                <td>{comentario.emisor}</td>
                <td>{comentario.titulo}</td>
                <td>{comentario.fechaHora}</td>
                <td>{comentario.detalle}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm mr-2"
                    onClick={() => mostrarDetalle(comentario)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Modal para Ver Detalle */}
      {modalDetalleVisible && comentarioSeleccionado && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle del Comentario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={cerrarModalDetalle}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p><strong>Emisor:</strong> {comentarioSeleccionado.emisor}</p>
                <p><strong>Título:</strong> {comentarioSeleccionado.titulo}</p>
                <p><strong>Fecha y Hora:</strong> {formatearFecha(comentarioSeleccionado.fechaHora)}</p>
                <p><strong>Detalle:</strong> {comentarioSeleccionado.detalle}</p>
                <p><strong>Archivos Adjuntos:</strong></p>
                {comentarioSeleccionado.archivosAdjuntos.length > 0 ? (
                  comentarioSeleccionado.archivosAdjuntos.map((archivo: string, index: number) => (
                    <p key={index}>
                      <a
                        href={`http://localhost:5000/uploads/${archivo}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        Descargar {archivo}
                      </a>
                    </p>
                  ))
                ) : (
                  <p>No hay archivos adjuntos.</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cerrarModalDetalle}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Modal para Agregar Comentario */}
      {modalNuevoVisible && (
        <div className="modal show d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Comentario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalNuevoVisible(false)}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={agregarComentario}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Título</label>
                    <input
                      type="text"
                      className="form-control"
                      value={nuevoComentario.titulo}
                      onChange={(e) =>
                        setNuevoComentario({
                          ...nuevoComentario,
                          titulo: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Detalle</label>
                    <textarea
                      className="form-control"
                      value={nuevoComentario.detalle}
                      onChange={(e) =>
                        setNuevoComentario({
                          ...nuevoComentario,
                          detalle: e.target.value,
                        })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Seleccionar Archivos</label>
                    <input
                      type="file"
                      className="form-control"
                      multiple
                      onChange={manejarArchivos}
                    />
                    <small className="form-text text-muted">
                      Maximo 5 MB por archivo
                    </small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Agregar
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalNuevoVisible(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )};
  
  export default App;