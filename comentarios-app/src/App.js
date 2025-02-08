import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const comentarios = [
  {
    id: 1,
    emisor: "Juan Pérez",
    titulo: "Confirmación de Turno",
    fechaHora: "06/02/2025 14:30",
    detalle:
      "Estimado paciente, su turno ha sido reservado con éxito para el 10/02/2025 a las 10:00 AM. Por favor, no olvide llevar su DNI. Este turno es muy importante, así que por favor confirme su asistencia al menos 24 horas antes.",
    archivosAdjuntos: ["Comprobante_Turno.pdf", "Instrucciones_PreTurno.pdf"],
  },
  {
    id: 2,
    emisor: "Ana López",
    titulo: "Resultado de Estudio",
    fechaHora: "05/02/2025 10:15",
    detalle:
      "Su resultado de análisis está disponible. Puede retirarlo en la recepción del hospital durante nuestro horario habitual de lunes a viernes de 8:00 AM a 4:00 PM. No olvide llevar su DNI.",
    archivosAdjuntos: ["Resultado_Analisis.pdf"],
  },
];

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [comentarioSeleccionado, setComentarioSeleccionado] = useState(null);

  const mostrarDetalle = (comentario) => {
    setComentarioSeleccionado(comentario);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setComentarioSeleccionado(null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Comentarios</h2>
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
          {comentarios.map((comentario) => (
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

      {/* Modal */}
      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detalle del Comentario</h5>
                <button
                  type="button"
                  className="close"
                  onClick={cerrarModal}
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <p><strong>Emisor:</strong> {comentarioSeleccionado.emisor}</p>
                <p><strong>Título:</strong> {comentarioSeleccionado.titulo}</p>
                <p><strong>Fecha y Hora:</strong> {comentarioSeleccionado.fechaHora}</p>
                <p><strong>Detalle:</strong> {comentarioSeleccionado.detalle}</p>
                <p><strong>Archivos Adjuntos:</strong></p>
                {comentarioSeleccionado.archivosAdjuntos.map((archivo, index) => (
                  <p key={index}>
                    <a href={`descargas/${archivo}`} download className="btn btn-success btn-sm">
                      Descargar {archivo}
                    </a>
                  </p>
                ))}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
