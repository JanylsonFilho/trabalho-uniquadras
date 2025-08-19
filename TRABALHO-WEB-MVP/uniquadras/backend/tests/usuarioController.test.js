const {
  addUser,
  login,
  getUsers,
  promoverUsuario,
  rebaixarUsuario,
} = require('../controllers/usuarioController');

const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/usuarioModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Usuario Controller', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  // --- Testes para a função addUser ---
  describe('addUser', () => {
    it('deve criar um novo usuário com sucesso e retornar status 201', async () => {
      const mockReq = { body: { nome: 'Teste', email: 'teste@unifor.br', senha: '123', telefone: '12345' } };
      const mockSave = jest.fn().mockResolvedValue(true);
      const mockToObject = jest.fn().mockReturnValue({ nome: 'Teste', email: 'teste@unifor.br' });
      Usuario.mockImplementation(() => ({ save: mockSave, toObject: mockToObject }));
      Usuario.findOne.mockResolvedValue(null);
      await addUser(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({ nome: 'Teste', email: 'teste@unifor.br' });
    });
    it('deve retornar erro 409 se o email já existir', async () => {
      const mockReq = { body: { nome: 'Teste', email: 'existente@unifor.br', senha: '123', telefone: '12345' } };
      Usuario.findOne.mockResolvedValue({ email: 'existente@unifor.br' });
      await addUser(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(409);
    });
    it('deve retornar erro 400 se faltarem campos obrigatórios', async () => {
      const mockReq = { body: { nome: 'Teste' } };
      await addUser(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  // --- Testes para a função login ---
  describe('login', () => {
    it('deve logar com sucesso com credenciais corretas', async () => {
        const mockReq = { body: { email: 'user@unifor.br', senha: 'password123' } };
        const mockUser = { _id: '123', email: 'user@unifor.br', senha: 'hashedpassword', toObject: () => ({ _id: '123', email: 'user@unifor.br' }) };
        const fakeToken = 'fake-jwt-token';
        Usuario.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue(fakeToken);
        await login(mockReq, mockRes);
        expect(mockRes.json).toHaveBeenCalledWith({ user: { _id: '123', email: 'user@unifor.br' }, token: fakeToken });
    });
    it('deve retornar erro 401 para senha incorreta', async () => {
        const mockReq = { body: { email: 'user@unifor.br', senha: 'wrongpassword' } };
        const mockUser = { email: 'user@unifor.br', senha: 'hashedpassword' };
        Usuario.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);
        await login(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });
    it('deve retornar erro 401 para um email que não existe', async () => {
        const mockReq = { body: { email: 'naoexiste@unifor.br', senha: '123' } };
        Usuario.findOne.mockResolvedValue(null);
        await login(mockReq, mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  // --- Testes para a função getUsers ---
  describe('getUsers', () => {
    it('deve retornar uma lista de usuários', async () => {
      const mockUsers = [{ nome: 'User 1' }, { nome: 'User 2' }];
      
      const mockSelect = jest.fn().mockResolvedValue(mockUsers);
      Usuario.find.mockReturnValue({
        select: mockSelect
      });

      await getUsers({}, mockRes);

      expect(Usuario.find).toHaveBeenCalled();
      expect(mockSelect).toHaveBeenCalledWith('-senha');
      expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
    });
  });
  
  // --- Testes para as funções de ADM (promover/rebaixar) ---
  describe('Admin functions', () => {
    it('promoverUsuario deve atualizar o tipo do usuário para "2"', async () => {
      const mockReq = { params: { id: 'userId123' } };
      const updatedUser = { nome: 'Usuario Promovido' };
      
      const mockSelect = jest.fn().mockResolvedValue(updatedUser);
      Usuario.findByIdAndUpdate.mockReturnValue({
        select: mockSelect
      });

      await promoverUsuario(mockReq, mockRes);

      expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { id_tipo_usuario: '2' }, { new: true });
      expect(mockSelect).toHaveBeenCalledWith('-senha');
      expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it('rebaixarUsuario deve atualizar o tipo do usuário para "1"', async () => {
        const mockReq = { params: { id: 'userId123' } };
        const updatedUser = { nome: 'Usuario Rebaixado' };
  
        const mockSelect = jest.fn().mockResolvedValue(updatedUser);
        Usuario.findByIdAndUpdate.mockReturnValue({
          select: mockSelect
        });
  
        await rebaixarUsuario(mockReq, mockRes);
  
        expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith('userId123', { id_tipo_usuario: '1' }, { new: true });
        expect(mockSelect).toHaveBeenCalledWith('-senha');
        expect(mockRes.json).toHaveBeenCalledWith(updatedUser);
    });

    it('deve retornar erro 404 se o usuário a ser promovido não for encontrado', async () => {
        const mockReq = { params: { id: 'notFoundId' } };
        
        const mockSelect = jest.fn().mockResolvedValue(null);
        Usuario.findByIdAndUpdate.mockReturnValue({
          select: mockSelect
        });
  
        await promoverUsuario(mockReq, mockRes);
  
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Usuário não encontrado' });
    });
  });
});