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
    const newUser = await userModel.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = {
  getUsers,
  addUser,
};
