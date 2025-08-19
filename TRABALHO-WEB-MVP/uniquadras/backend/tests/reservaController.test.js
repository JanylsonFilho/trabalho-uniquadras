const {
  criar,
  deletar,
  listarPorUsuario,
} = require('../controllers/reservaController');
const Reserva = require('../models/reservaModel');
const Quadra = require('../models/quadraModel');

jest.mock('../models/reservaModel');
jest.mock('../models/quadraModel');

describe('Reserva Controller', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('criar', () => {
    it('deve criar uma reserva e marcar o horário como indisponível', async () => {
      const mockReq = { body: { id_usuario: 'userId1', id_quadra: 'quadraId1', id_horario: 'horarioId1' } };
      
      const mockHorarioSubDoc = {
        _id: 'horarioId1',
        data: '2025-08-20',
        horario: '18:00 - 19:00',
        status: 'Disponível',
      };

      const mockQuadraInstance = {
        _id: 'quadraId1',
        nome: 'Quadra Teste',
        horarios: {
          id: jest.fn().mockReturnValue(mockHorarioSubDoc),
        },
        save: jest.fn().mockResolvedValue(true),
      };
      Quadra.findById.mockResolvedValue(mockQuadraInstance);
      
      // Mock para a criação da reserva
      const mockSaveReserva = jest.fn().mockResolvedValue(true);
      Reserva.mockImplementation(() => ({
          save: mockSaveReserva
      }));

      await criar(mockReq, mockRes);

      expect(Quadra.findById).toHaveBeenCalledWith('quadraId1');
      expect(mockQuadraInstance.horarios.id).toHaveBeenCalledWith('horarioId1');
      // VERIFICAÇÃO CRÍTICA: o status do horário foi alterado
      expect(mockHorarioSubDoc.status).toBe('Indisponível');
      expect(mockQuadraInstance.save).toHaveBeenCalledTimes(1);
      expect(mockSaveReserva).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });

    it('deve retornar erro 409 se o horário já estiver indisponível', async () => {
        const mockReq = { body: { id_horario: 'horarioId1' } };
        const mockHorarioSubDoc = { _id: 'horarioId1', status: 'Indisponível' };
        const mockQuadraInstance = { horarios: { id: jest.fn().mockReturnValue(mockHorarioSubDoc) }};
        Quadra.findById.mockResolvedValue(mockQuadraInstance);
  
        await criar(mockReq, mockRes);
  
        expect(mockRes.status).toHaveBeenCalledWith(409);
        expect(mockRes.json).toHaveBeenCalledWith({ error: 'Este horário não está disponível.' });
    });
  });

  describe('deletar', () => {
    it('deve deletar uma reserva e liberar o horário', async () => {
        const mockReq = { params: { id: 'reservaId1' } };
        const mockReservaDeletada = { _id: 'reservaId1', id_quadra: 'quadraId1', id_horario: 'horarioId1' };
        Reserva.findByIdAndDelete.mockResolvedValue(mockReservaDeletada);

        const mockHorarioSubDoc = { _id: 'horarioId1', status: 'Indisponível' };
        const mockQuadraInstance = {
            horarios: { id: jest.fn().mockReturnValue(mockHorarioSubDoc) },
            save: jest.fn().mockResolvedValue(true),
        };
        Quadra.findById.mockResolvedValue(mockQuadraInstance);

        await deletar(mockReq, mockRes);

        expect(Reserva.findByIdAndDelete).toHaveBeenCalledWith('reservaId1');
        expect(Quadra.findById).toHaveBeenCalledWith('quadraId1');
        // VERIFICAÇÃO CRÍTICA: o status foi revertido para 'Disponível'
        expect(mockHorarioSubDoc.status).toBe('Disponível');
        expect(mockQuadraInstance.save).toHaveBeenCalledTimes(1);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Reserva deletada e horário liberado com sucesso.' });
    });
  });

  describe('listarPorUsuario', () => {
    it('deve retornar as reservas de um usuário específico', async () => {
      const mockReq = { params: { id: 'userId1' } };
      const mockReservas = [{ _id: 'reserva1' }, { _id: 'reserva2' }];

      const mockSort = jest.fn().mockResolvedValue(mockReservas);
      Reserva.find.mockReturnValue({
        sort: mockSort
      });

      await listarPorUsuario(mockReq, mockRes);

      expect(Reserva.find).toHaveBeenCalledWith({ id_usuario: 'userId1' });
      expect(mockSort).toHaveBeenCalledWith({ criado_em: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(mockReservas);
    });
  });
});