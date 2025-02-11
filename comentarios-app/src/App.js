import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

const App = () => {
  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState({
    titulo: "",
    detalle: "",
    archivosAdjuntos: [],
  });
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [modalNuevoVisible, setModalNuevoVisible] = useState(false);

  const cargarComentarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/comentarios");
      setComentarios(response.data.reverse()); // Invertimos para mostrar los más recientes primero
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, []);

  const agregarComentario = async (e) => {
    e.preventDefault();
    const comentario = {
      ...nuevoComentario,
      emisor: "Usuario Actual", // Aquí puedes cambiar esto por el usuario autenticado real
      fechaHora: new Date().toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Subir archivos al backend
    const formData = new FormData();
    formData.append("titulo", comentario.titulo);
    formData.append("detalle", comentario.detalle);
    formData.append("emisor", comentario.emisor);
    formData.append("fechaHora", comentario.fechaHora);
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

  const mostrarDetalle = (comentario) => {
    setComentarioSeleccionado(comentario);
    setModalDetalleVisible(true);
  };

  const cerrarModalDetalle = () => {
    setModalDetalleVisible(false);
    setComentarioSeleccionado(null);
  };

  const manejarArchivos = (e) => {
    setNuevoComentario({
      ...nuevoComentario,
      archivosAdjuntos: Array.from(e.target.files),
    });
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
      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Emisor</th>
            <th>Título</th>
            <th>Fecha y Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comentarios.map((comentario, index) => (
            <tr key={index}>
              <td>{comentario.emisor}</td>
              <td>{comentario.titulo}</td>
              <td>{comentario.fechaHora}</td>
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

      {/* Modal para Ver Detalle */}
      {modalDetalleVisible && comentarioSeleccionado && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
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
                <p><strong>Fecha y Hora:</strong> {comentarioSeleccionado.fechaHora}</p>
                <p><strong>Detalle:</strong> {comentarioSeleccionado.detalle}</p>
                <p><strong>Archivos Adjuntos:</strong></p>
                {comentarioSeleccionado.archivosAdjuntos.map((archivo, index) => (
                  <p key={index}>
                    <a
                      href={`descargas/${archivo}`}
                      download
                      className="btn btn-success btn-sm"
                    >
                      Descargar {archivo}
                    </a>
                  </p>
                ))}
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
        <div className="modal show d-block" tabIndex="-1" role="dialog">
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
                      Selecciona los archivos que deseas adjuntar.
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
  );
};

export default App;
