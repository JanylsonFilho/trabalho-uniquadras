const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// Conecta ao banco de dados
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const quadraRoutes = require('./routes/quadraRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const horarioRoutes = require('./routes/horarioRoutes'); // Agora gerencia horários dentro das quadras

app.use('/usuarios', usuarioRoutes);
app.use('/quadras', quadraRoutes);
app.use('/reservas', reservaRoutes);
app.use('/horarios', horarioRoutes);

app.get('/', (req, res) => {
  res.send('Servidor UniQuadras com MongoDB está rodando!');
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});