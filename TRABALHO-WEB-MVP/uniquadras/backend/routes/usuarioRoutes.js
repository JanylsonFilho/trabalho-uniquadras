const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

router.get('/', userController.getUsers);
router.post('/cadastro', userController.addUser);
router.put('/promover/:id', userController.promoverUsuario);
router.put('/rebaixar/:id', userController.rebaixarUsuario);
router.post('/login', userController.login);


module.exports = router;