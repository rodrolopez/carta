const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importación de rutas
const categoriaRoutes = require('./routes/categoriaRoutes');
const productoRoutes = require('./routes/productoRoutes');
const flyerRoutes = require('./routes/flyerRoutes');
const promoRoutes = require('./routes/promoRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Definición de endpoints
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/flyers', flyerRoutes);
app.use('/api/promos', promoRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});