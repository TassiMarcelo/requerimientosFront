import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios"; // Librería para manejar las solicitudes HTTP

const App = () => {
  const [comentarios, setComentarios] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState({
    titulo: "",
    detalle: "",
    archivosAdjuntos: [],
  });

  // Cargar los comentarios al inicio
  useEffect(() => {
    cargarComentarios();
  }, []);

  const cargarComentarios = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/comentarios");
      setComentarios(response.data);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoComentario({ ...nuevoComentario, [name]: value });
  };

  const agregarComentario = async (e) => {
    e.preventDefault();

    const comentario = {
      ...nuevoComentario,
      emisor: "Usuario Actual", // Esto podría venir de tu lógica de usuario autenticado
      archivosAdjuntos: Array.from(nuevoComentario.archivosAdjuntos).map((file) => file.name),
    };

    try {
      await axios.post("http://localhost:5000/api/comentarios", comentario);
      setNuevoComentario({ titulo: "", detalle: "", archivosAdjuntos: [] });
      setModalVisible(false);
      cargarComentarios(); // Actualiza la lista de comentarios
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  const abrirModal = () => setModalVisible(true);
  const cerrarModal = () => setModalVisible(false);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lista de Comentarios</h2>
      <button className="btn btn-success mb-3" onClick={abrirModal}>
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
                <a
                  href={`descargas/${comentario.archivosAdjuntos[0]}`}
                  download
                  className="btn btn-success btn-sm"
                >
                  Descargar {comentario.archivosAdjuntos[0]}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para agregar comentario */}
      {modalVisible && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nuevo Comentario</h5>
                <button type="button" className="close" onClick={cerrarModal}>
                  <span>&times;</span>
                </button>
              </div>
              <form onSubmit={agregarComentario}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Título</label>
                    <input
                      type="text"
                      className="form-control"
                      name="titulo"
                      value={nuevoComentario.titulo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Detalle</label>
                    <textarea
                      className="form-control"
                      name="detalle"
                      value={nuevoComentario.detalle}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Archivos Adjuntos (separados por comas)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="archivosAdjuntos"
                      value={nuevoComentario.archivosAdjuntos}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Guardar Comentario
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={cerrarModal}
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
