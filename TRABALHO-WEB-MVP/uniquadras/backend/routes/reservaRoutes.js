const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const verificarAutenticacao = require('../middlewares/authMiddleware');

router.get('/', reservaController.listar);
router.get('/:id', reservaController.obter);
router.post('/', reservaController.criar);
router.put('/:id', reservaController.atualizar);
router.delete('/:id', reservaController.deletar);
router.post('/', verificarAutenticacao, reservaController.criar);
router.get('/usuario/:id', reservaController.listarPorUsuario);


module.exports = router;
