const Reserva = require('../models/reservaModel');
const Quadra = require('../models/quadraModel');

// Lista reservas com base em filtros (data, quadra, usuário)
const listar = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.data) filtro.data_reserva = req.query.data;
    if (req.query.id_quadra) filtro.id_quadra = req.query.id_quadra;
    if (req.query.id_usuario) filtro.id_usuario = req.query.id_usuario;

    const reservas = await Reserva.find(filtro).populate('id_usuario', 'nome email');
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar reservas.' });
  }
};

// Lista todas as reservas de um usuário específico
const listarPorUsuario = async (req, res) => {
    try {
        const { id } = req.params; // ID do usuário
        const reservas = await Reserva.find({ id_usuario: id }).sort({ criado_em: -1 });
        res.json(reservas);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar reservas do usuário.' });
    }
};

// Obtém uma reserva específica
const obter = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }
    res.json(reserva);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter reserva.' });
  }
};

// Cria uma nova reserva
const criar = async (req, res) => {
  const { id_usuario, id_quadra, id_horario } = req.body;
  try {
    const quadra = await Quadra.findById(id_quadra);
    if (!quadra) {
      return res.status(404).json({ error: 'Quadra não encontrada.' });
    }
    const horario = quadra.horarios.id(id_horario);
    if (!horario || horario.status === 'Indisponível') {
      return res.status(409).json({ error: 'Este horário não está disponível.' });
    }

    horario.status = 'Indisponível';
    await quadra.save();

    const novaReserva = new Reserva({
      id_usuario,
      id_quadra,
      id_horario,
      data_reserva: horario.data,
      horario_reserva: horario.horario,
      nome_quadra: quadra.nome
    });
    await novaReserva.save();
    res.status(201).json(novaReserva);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar reserva.' });
  }
};

// Deleta uma reserva e libera o horário
const deletar = async (req, res) => {
  try {
    const reservaDeletada = await Reserva.findByIdAndDelete(req.params.id);
    if (!reservaDeletada) {
      return res.status(404).json({ error: 'Reserva não encontrada.' });
    }

    // Libera o horário na quadra
    const quadra = await Quadra.findById(reservaDeletada.id_quadra);
    if (quadra) {
      const horario = quadra.horarios.id(reservaDeletada.id_horario);
      if (horario) {
        horario.status = 'Disponível';
        await quadra.save();
      }
    }
    res.json({ message: 'Reserva deletada e horário liberado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar reserva.' });
  }
};

module.exports = {
  listar,
  listarPorUsuario,
  obter,
  criar,
  deletar
};