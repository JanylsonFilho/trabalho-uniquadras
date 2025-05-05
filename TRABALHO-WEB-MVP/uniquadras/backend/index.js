const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Permitir requisições de outros domínios (ex: seu Vite)
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor está rodando!');
});

// Rota para buscar dados (exemplo)
app.get('/dados', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
    res.status(500).send('Erro no servidor');
  }
});

// Rota para cadastrar um usuário
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha, telefone, data_cadastro, id_tipo_usuario } = req.body;

  try {
    const novoUsuario = await pool.query(
      'INSERT INTO usuarios (nome, email, senha, telefone, data_cadastro, id_tipo_usuario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, email, senha, telefone, data_cadastro, id_tipo_usuario]
    );

    res.status(201).json(novoUsuario.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro no servidor');
  }
});


// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
