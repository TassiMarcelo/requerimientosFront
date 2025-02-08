const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = 5000;

// Configuración de CORS
app.use(cors());

// Configuración de la base de datos MySQL (ajustar a tu base de datos)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'comentarios_db',
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos');
});

// Endpoint para obtener los comentarios
app.get('/api/comentarios', (req, res) => {
  const query = 'SELECT * FROM comentarios';
  db.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Arrancar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
