const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

// Conexión a la base de datos MySQL utilizando las variables de entorno
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,  
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,  
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true' ? true : false  
});

// Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error de conexión:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta principal
app.get('/', (req, res) => {
  res.send('Servidor de seguimiento de pedidos en funcionamiento');
});

// Inicia el servidor en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});