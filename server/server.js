const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
       
dotenv.config({ path: '../.env' });

const pedidosRoutes = require('./routes/pedidos.routes');
const clientesRoutes = require('./routes/clientes.routes');
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const app = express();
app.use(cors());              
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Servidor de seguimiento de pedidos en funcionamiento' });
});

app.use('/api/pedidos', pedidosRoutes);
app.use('/api/clientes', clientesRoutes);


app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;

  return res.status(status).json({
    message: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor en ejecucion en http://localhost:${PORT}`);
});
