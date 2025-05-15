const userModel = require('../models/usuarioModel');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro no servidor');
  }
};

const addUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro no servidor');
  }
};

 // dando erro
const promoverUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const atualizado = await userModel.promoteADM(id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).send('Erro ao promover usuário');
  }
};

module.exports = {
  getUsers,
  addUser,
};