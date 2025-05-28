const Reserva = require('../models/reservaModel'); //

const reservaController = {
  async listar(req, res) { //
    try {
      let query = 'SELECT r.*, q.nome as quadra_nome, q.tipo as quadra_tipo FROM reservas r JOIN quadras q ON r.id_quadra = q.id'; //
      const params = []; //
      const conditions = []; //

      // Filtros opcionais
      if (req.query.data_reserva) { //
        conditions.push(`r.data_reserva = $${params.length + 1}`); //
        params.push(req.query.data_reserva); //
      }
      if (req.query.id_quadra) { //
        conditions.push(`r.id_quadra = $${params.length + 1}`); //
        params.push(req.query.id_quadra); //
      }
      if (req.query.id_usuario) { //
        conditions.push(`r.id_usuario = $${params.length + 1}`); //
        params.push(req.query.id_usuario); //
      }

      if (conditions.length > 0) { //
        query += ` WHERE ${conditions.join(' AND ')}`; //
      }

      const result = await Reserva.query(query, params); //
      res.json(result.rows); //
    } catch (error) {
      console.error('Erro ao listar reservas:', error); //
      res.status(500).json({ error: 'Erro ao listar reservas.' }); //
    }
  },

  async obter(req, res) { //
    try {
      const reserva = await Reserva.getById(req.params.id); //
      if (!reserva) { //
        return res.status(404).json({ error: 'Reserva não encontrada.' }); //
      }
      res.json(reserva); //
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter reserva.' }); //
    }
  },

  async criar(req, res) { //
    try {
      const { id_usuario, id_quadra, data_reserva, horario } = req.body; // Removido horario_fim aqui

      if (!id_usuario || !id_quadra || !data_reserva || !horario) {
        return res.status(400).json({ error: 'Todos os campos de reserva são obrigatórios.' });
      }

      // Checar conflito de horários (se já existe reserva para a mesma quadra, data e horário_inicio)
      const conflito = await Reserva.query(
        'SELECT * FROM reservas WHERE id_quadra = $1 AND data_reserva = $2 AND horario = $3',
        [id_quadra, data_reserva, horario]
      );

      if (conflito.rows.length > 0) {
        return res.status(409).json({ error: 'Já existe uma reserva para esta quadra e horário nesta data.' });
      }

      const novaReserva = await Reserva.create({ id_usuario, id_quadra, data_reserva, horario}); // Removido horario_fim
      res.status(201).json(novaReserva); //
    } catch (error) {
      console.error('Erro ao criar reserva:', error); //
      res.status(500).json({ error: 'Erro ao criar reserva.' }); //
    }
  },

  async atualizar(req, res) { //
    try {
      const reservaAtualizada = await Reserva.update(req.params.id, req.body); //
      if (!reservaAtualizada) { //
        return res.status(404).json({ error: 'Reserva não encontrada.' }); //
      }
      res.json(reservaAtualizada); //
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar reserva.' }); //
    }
  },

  async deletar(req, res) { //
    try {
      const reservaDeletada = await Reserva.delete(req.params.id); //
      if (!reservaDeletada) { //
        return res.status(404).json({ error: 'Reserva não encontrada.' }); //
      }
      res.json({ message: 'Reserva deletada com sucesso.' }); //
    } catch (error) {
      console.error('Erro ao deletar reserva:', error); // Adicionado log
      res.status(500).json({ error: 'Erro ao deletar reserva.' }); //
    }
  },

  async listarPorUsuario(req, res) { //
    try {
      const { id } = req.params; //
      const result = await Reserva.query('SELECT r.*, q.nome as quadra_nome FROM reservas r JOIN quadras q ON r.id_quadra = q.id WHERE r.id_usuario = $1', [id]); //
      res.json(result.rows); //
    } catch (error) {
      console.error('Erro ao listar reservas do usuário:', error); //
      res.status(500).json({ error: 'Erro ao listar reservas do usuário.' }); //
    }
  },
};

module.exports = reservaController; //