const {
  listar,
  obter,
  criar,
  atualizar,
  deletar,
} = require('../controllers/quadraController');
const Quadra = require('../models/quadraModel');
const Reserva = require('../models/reservaModel');

jest.mock('../models/quadraModel');
jest.mock('../models/reservaModel');

describe('Quadra Controller', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('listar', () => {
    it('deve retornar uma lista de quadras', async () => {
      const mockQuadras = [{ nome: 'Quadra 1' }, { nome: 'Quadra 2' }];
      Quadra.find.mockResolvedValue(mockQuadras);

      await listar({}, mockRes);

      expect(Quadra.find).toHaveBeenCalledWith({}, { horarios: 0 });
      expect(mockRes.json).toHaveBeenCalledWith(mockQuadras);
    });
  });

  describe('obter', () => {
    it('deve retornar uma única quadra pelo ID', async () => {
      const mockReq = { params: { id: 'quadraId1' } };
      const mockQuadra = { _id: 'quadraId1', nome: 'Quadra Teste' };
      Quadra.findById.mockResolvedValue(mockQuadra);

      await obter(mockReq, mockRes);

      expect(Quadra.findById).toHaveBeenCalledWith('quadraId1', { horarios: 0 });
      expect(mockRes.json).toHaveBeenCalledWith(mockQuadra);
    });

    it('deve retornar erro 404 se a quadra não for encontrada', async () => {
      const mockReq = { params: { id: 'notFoundId' } };
      Quadra.findById.mockResolvedValue(null);

      await obter(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Quadra não encontrada.' });
    });
  });

  describe('criar', () => {
    it('deve criar uma nova quadra com horários e retornar status 201', async () => {
      const mockReq = { body: { nome: 'Nova Quadra', tipo: 'Aberta', status: 'Ativa' } };
      
      const mockSave = jest.fn().mockResolvedValue(true);
      Quadra.mockImplementation(() => ({
        save: mockSave,
        horarios: [] // Simula a propriedade que será populada
      }));

      await criar(mockReq, mockRes);

      // Verifica se a implementação do mock foi chamada para criar a instância
      expect(Quadra).toHaveBeenCalledWith({ nome: 'Nova Quadra', tipo: 'Aberta', status: 'Ativa' });
      // Verifica se o método save foi chamado na instância
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      // Verifica se a resposta contém a propriedade horarios, mesmo que vazia
      expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
        horarios: expect.any(Array)
      }));
    });
  });

  describe('atualizar', () => {
    it('deve atualizar uma quadra e retornar os dados atualizados', async () => {
      const mockReq = { params: { id: 'quadraId1' }, body: { status: 'Inativa' } };
      const quadraAtualizada = { _id: 'quadraId1', status: 'Inativa' };
      Quadra.findByIdAndUpdate.mockResolvedValue(quadraAtualizada);

      await atualizar(mockReq, mockRes);

      expect(Quadra.findByIdAndUpdate).toHaveBeenCalledWith('quadraId1', { status: 'Inativa' }, { new: true });
      expect(mockRes.json).toHaveBeenCalledWith(quadraAtualizada);
    });
  });

  describe('deletar', () => {
    it('deve deletar uma quadra e suas reservas associadas', async () => {
      const mockReq = { params: { id: 'quadraId1' } };
      Quadra.findByIdAndDelete.mockResolvedValue({ _id: 'quadraId1' }); // Simula que encontrou e deletou
      Reserva.deleteMany.mockResolvedValue({ deletedCount: 5 }); // Simula deleção de reservas

      await deletar(mockReq, mockRes);

      expect(Reserva.deleteMany).toHaveBeenCalledWith({ id_quadra: 'quadraId1' });
      expect(Quadra.findByIdAndDelete).toHaveBeenCalledWith('quadraId1');
      expect(mockRes.json).toHaveBeenCalledWith({ message: 'Quadra e reservas associadas deletadas com sucesso.' });
    });
  });
});