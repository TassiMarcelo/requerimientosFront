const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 5000;
const COMMENTS_FILE = "./comentarios.json"; // Archivo para almacenar los comentarios

app.use(express.json());
app.use(cors());

const upload = multer({ dest: "uploads/" }); // Carpeta donde se almacenarán los archivos

// Endpoint para obtener todos los comentarios
app.get("/api/comentarios", (req, res) => {
  fs.readFile(COMMENTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo de comentarios:", err);
      return res.status(500).json({ error: "Error al obtener comentarios" });
    }
    const comentarios = JSON.parse(data || "[]");
    res.json(comentarios.reverse());
  });
});

// Endpoint para agregar un comentario con archivos
app.post("/api/comentarios", upload.array("archivosAdjuntos"), (req, res) => {
  const { titulo, detalle, emisor } = req.body;

  if (!titulo || !detalle || !emisor) {
    return res.status(400).json({ error: "Faltan campos obligatorios (titulo, detalle o emisor)." });
  }

  const archivosAdjuntos = req.files.map((file) => file.filename); // Guardamos solo el nombre del archivo

  const nuevoComentario = {
    id: Date.now(),
    titulo,
    detalle,
    emisor,
    fechaHora: new Date().toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
    archivosAdjuntos,
  };

  fs.readFile(COMMENTS_FILE, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error("Error al leer el archivo de comentarios:", err);
      return res.status(500).json({ error: "Error al guardar el comentario" });
    }

    const comentarios = JSON.parse(data || "[]");
    comentarios.push(nuevoComentario);

    fs.writeFile(COMMENTS_FILE, JSON.stringify(comentarios, null, 2), (err) => {
      if (err) {
        console.error("Error al escribir en el archivo de comentarios:", err);
        return res.status(500).json({ error: "Error al guardar el comentario" });
      }
      res.status(201).json(nuevoComentario);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
