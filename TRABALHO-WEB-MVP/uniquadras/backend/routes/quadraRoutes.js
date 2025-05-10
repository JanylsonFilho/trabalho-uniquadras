const express = require('express');
const router = express.Router();
const quadraController = require('../controllers/quadraController');

router.get('/', quadraController.listar);
router.get('/:id', quadraController.obter);
router.post('/', quadraController.criar);
router.put('/:id', quadraController.atualizar);
router.delete('/:id', quadraController.deletar);

module.exports = router;
