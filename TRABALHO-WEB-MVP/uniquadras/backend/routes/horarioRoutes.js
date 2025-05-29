const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.get('/', horarioController.listarPorQuadraEData);
router.post('/', horarioController.criar);
router.put('/:id', horarioController.atualizar);
router.patch('/:id/status', horarioController.atualizarStatus);
router.delete('/:id', horarioController.deletar);

module.exports = router;
