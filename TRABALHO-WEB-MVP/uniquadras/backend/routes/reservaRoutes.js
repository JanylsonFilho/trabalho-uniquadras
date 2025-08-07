const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

// Rotas de reservas (sem autenticação)
router.get('/', reservaController.listar);
router.get('/:id', reservaController.obter);
router.post('/', reservaController.criar);
//router.put('/:id', reservaController.atualizar);
router.delete('/:id', reservaController.deletar);
router.get('/usuario/:id', reservaController.listarPorUsuario);

module.exports = router;    