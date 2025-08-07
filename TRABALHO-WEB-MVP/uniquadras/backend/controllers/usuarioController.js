const Usuario = require('../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Lista todos os usuários (sem a senha)
const getUsers = async (req, res) => {
  try {
    const users = await Usuario.find().select('-senha');
    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).send('Erro no servidor');
  }
};

// Realiza o login do usuário
const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const user = await Usuario.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const payload = { id: user._id, email: user.email, tipo: user.id_tipo_usuario };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    const { senha: _, ...userSemSenha } = user.toObject();
    res.json({ user: userSemSenha, token });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).send('Erro no servidor');
  }
};

// Adiciona um novo usuário
const addUser = async (req, res) => {
  try {
    const { nome, email, senha, telefone } = req.body;
    if (!nome || !email || !senha || !telefone) {
      return res.status(400).json({ error: 'Nome, email, senha e telefone são obrigatórios' });
    }
    
    // Verifica se o usuário já existe
    const userExists = await Usuario.findOne({ email: email.toLowerCase() });
    if (userExists) {
        return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }

    const novoUsuario = new Usuario({ nome, email, senha, telefone });
    await novoUsuario.save();

    // Retorna o usuário sem a senha
    const { senha: _, ...userSemSenha } = novoUsuario.toObject();
    res.status(201).json(userSemSenha);

  } catch (error) {
    console.error('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro no servidor');
  }
};

// Promove um usuário para ADM
const promoverUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const atualizado = await Usuario.findByIdAndUpdate(id, { id_tipo_usuario: '2' }, { new: true }).select('-senha');
    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao promover usuário:', err);
    res.status(500).send('Erro ao promover usuário');
  }
};

// Rebaixa um usuário para Comum
const rebaixarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    const atualizado = await Usuario.findByIdAndUpdate(id, { id_tipo_usuario: '1' }, { new: true }).select('-senha');
    if (!atualizado) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(atualizado);
  } catch (err) {
    console.error('Erro ao rebaixar usuário:', err);
    res.status(500).send('Erro ao rebaixar usuário');
  }
};

module.exports = {
  getUsers,
  login,
  addUser,
  promoverUsuario,
  rebaixarUsuario,
};