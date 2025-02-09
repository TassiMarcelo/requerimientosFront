import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [comentarios, setComentarios] = useState([
    {
      id: 1,
      emisor: "Juan Pérez",
      titulo: "Confirmación de Turno",
      fechaHora: "06/02/2025 14:30",
      detalle: "Estimado paciente, su turno ha sido reservado con éxito.",
      archivosAdjuntos: ["Comprobante_Turno.pdf"],
    },
  ]);

  const [nuevoComentario, setNuevoComentario] = useState({
    titulo: "",
    detalle: "",
    archivosAdjuntos: [],
  });

  const [modalFormularioVisible, setModalFormularioVisible] = useState(false);
  const [modalDetalleVisible, setModalDetalleVisible] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  const mostrarDetalle = (comentario) => {
    setComentarioSeleccionado(comentario);
    setModalDetalleVisible(true);
  };

  const cerrarModalDetalle = () => setModalDetalleVisible(false);
  const cerrarModalFormulario = () => setModalFormularioVisible(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoComentario((prevState) => ({ ...prevState, [name]: value }));
  };

  const manejarArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setNuevoComentario((prevState) => ({
        ...prevState,
        archivosAdjuntos: [archivo.name],
      }));

      // Simulación: Guardar el archivo en "public/uploads" (solo en un backend real)
      const reader = new FileReader();
      reader.readAsDataURL(archivo);
      reader.onload = () => {
        console.log("Archivo cargado:", archivo.name); // Aquí simularíamos guardarlo en el servidor
      };
    }
  };

  const agregarComentario = (e) => {
    e.preventDefault();
    const fechaHora = obtenerFechaHoraActual();
    const emisor = "Usuario Actual";
    const nuevo = {
      id: comentarios.length + 1,
      emisor,
      titulo: nuevoComentario.titulo,
      fechaHora,
      detalle: nuevoComentario.detalle,
      archivosAdjuntos: nuevoComentario.archivosAdjuntos,
    };
    setComentarios((prevComentarios) => [...prevComentarios, nuevo]);
    setNuevoComentario({ titulo: "", detalle: "", archivosAdjuntos: [] });
    cerrarModalFormulario();
  };

  const obtenerFechaHoraActual = () => {
    const ahora = new Date();
    const dia = String(ahora.getDate()).padStart(2, "0");
    const mes = String(ahora.getMonth() + 1).padStart(2, "0");
    const anio = ahora.getFullYear();
    const hora = String(ahora.getHours()).padStart(2, "0");
    const minutos = String(ahora.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Comentarios</h2>
      <button
        className="btn btn-success mb-4"
        onClick={() => setModalFormularioVisible(true)}
      >
        Agregar Comentario
      </button>

      <table className="table table-hover table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Emisor</th>
            <th>Título</th>
            <th>Fecha y Hora</th>
            <th>Detalle</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {comentarios
            .slice() // Creamos una copia del array
            .reverse() // Invertimos el orden para mostrar los más nuevos primero
            .map((comentario) => (
              <tr key={comentario.id}>
                <td>{comentario.emisor}</td>
                <td>{comentario.titulo}</td>
                <td>{comentario.fechaHora}</td>
                <td title={comentario.detalle}>
                  {comentario.detalle.length > 50
                    ? comentario.detalle.substring(0, 50) + "..."
                    : comentario.detalle}
                </td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => mostrarDetalle(comentario)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modal para ver el detalle del comentario */}
      {modalDetalleVisible && (
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
                      href={`uploads/${archivo}`} // Ruta simulada
                      download
                      className="btn btn-success btn-sm"
                    >
                      Descargar {archivo}
                    </a>
                  </p>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModalDetalle}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar un nuevo comentario */}
      {modalFormularioVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Nuevo Comentario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={cerrarModalFormulario}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <form onSubmit={agregarComentario}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Asunto (Título)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="titulo"
                      value={nuevoComentario.titulo}
                      onChange={manejarCambio}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Detalles</label>
                    <textarea
                      className="form-control"
                      name="detalle"
                      value={nuevoComentario.detalle}
                      onChange={manejarCambio}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Archivos Adjuntos</label>
                    <input
                      type="file"
                      className="form-control-file"
                      onChange={manejarArchivo}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Enviar Comentario
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarModalFormulario}
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
