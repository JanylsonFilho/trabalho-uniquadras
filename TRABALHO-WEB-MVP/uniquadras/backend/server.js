const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')
// Conecta ao banco de dados
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configuração do Swagger JSDoc
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'UniQuadras API',
      version: '1.0.0',
      description: 'API para gerenciamento de quadras esportivas e reservas',
    },
    servers:[
      {
        url: `http://localhost:3000`,
      },
    ],
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rota
};

const swaggerDocs =swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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