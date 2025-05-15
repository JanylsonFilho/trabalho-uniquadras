const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

router.get('/', userController.getUsers);
router.post('/cadastro', userController.addUser);
router.put('/promover/:id', userController.promoverUsuario);

module.exports = router;
