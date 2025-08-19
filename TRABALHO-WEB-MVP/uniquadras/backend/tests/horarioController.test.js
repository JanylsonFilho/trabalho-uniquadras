const {
  listarPorQuadraEData,
  criar,
  deletar,
} = require('../controllers/horarioController');
const Quadra = require('../models/quadraModel');

jest.mock('../models/quadraModel');

describe('Horario Controller', () => {
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('listarPorQuadraEData', () => {
    it('deve listar os horários de uma quadra em uma data específica', async () => {
      const mockReq = { query: { id_quadra: 'quadraId1', data: '2025-08-20' } };
      const mockHorarios = [
        { data: '2025-08-20', horario: '18:00 - 19:00' },
        { data: '2025-08-21', horario: '19:00 - 20:00' }, // Outra data, para ser filtrado
      ];
      Quadra.findById.mockResolvedValue({ horarios: mockHorarios });

      await listarPorQuadraEData(mockReq, mockRes);

      expect(Quadra.findById).toHaveBeenCalledWith('quadraId1');
      // Esperamos que o resultado seja apenas o horário da data correta
      expect(mockRes.json).toHaveBeenCalledWith([{ data: '2025-08-20', horario: '18:00 - 19:00' }]);
    });

    it('deve retornar erro 400 se faltar id_quadra ou data', async () => {
      const mockReq = { query: { id_quadra: 'quadraId1' } }; // Faltando a data
      await listarPorQuadraEData(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'ID da quadra e data são obrigatórios.' });
    });
  });

  describe('criar', () => {
    it('deve adicionar um novo horário a uma quadra', async () => {
      const mockReq = { body: { id_quadra: 'quadraId1', data: '2025-08-20', horario: '20:00 - 21:00' } };
      
      const mockQuadraInstance = {
        horarios: [],
        save: jest.fn().mockResolvedValue(true),
      };
      Quadra.findById.mockResolvedValue(mockQuadraInstance);

      await criar(mockReq, mockRes);

      expect(Quadra.findById).toHaveBeenCalledWith('quadraId1');
      // Verifica se o horário foi adicionado ao array
      expect(mockQuadraInstance.horarios.length).toBe(1);
      expect(mockQuadraInstance.horarios[0]).toEqual(
        expect.objectContaining({ horario: '20:00 - 21:00' })
      );
      expect(mockQuadraInstance.save).toHaveBeenCalledTimes(1);
      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });
  
  describe('deletar', () => {
    it('deve deletar um horário específico de uma quadra', async () => {
        const mockReq = { params: { id: 'horarioId123' } };
        
        // Simula o subdocumento do horário com um método 'deleteOne'
        const mockHorarioSubDoc = {
            _id: 'horarioId123',
            deleteOne: jest.fn(),
        };

        const mockQuadraInstance = {
            horarios: {
                // O método .id() do Mongoose retorna o subdocumento
                id: jest.fn().mockReturnValue(mockHorarioSubDoc),
            },
            save: jest.fn().mockResolvedValue(true),
        };
        Quadra.findOne.mockResolvedValue(mockQuadraInstance);

        await deletar(mockReq, mockRes);

        expect(Quadra.findOne).toHaveBeenCalledWith({ "horarios._id": "horarioId123" });
        expect(mockQuadraInstance.horarios.id).toHaveBeenCalledWith("horarioId123");
        expect(mockHorarioSubDoc.deleteOne).toHaveBeenCalledTimes(1);
        expect(mockQuadraInstance.save).toHaveBeenCalledTimes(1);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ message: 'Horário deletado com sucesso' });
    });
  });
});