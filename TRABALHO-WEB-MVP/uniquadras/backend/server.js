const express = require('express');
const cors = require('cors');
require('dotenv').config();
//app.use(express.static('backend'));

const app = express();
const port = process.env.PORT || 3000;
app.use(express.static('backend'));

app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const quadraRoutes = require('./routes/quadraRoutes');
const reservaRoutes = require('./routes/reservaRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/quadras', quadraRoutes);
app.use('/reservas', reservaRoutes);

app.get('/', (req, res) => {
  res.send('Servidor está rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(process.env.DATABASE_URL)
});
