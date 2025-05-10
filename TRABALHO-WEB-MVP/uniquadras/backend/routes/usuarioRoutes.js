const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

router.get('/', userController.getUsers);
router.post('/cadastro', userController.addUser);

module.exports = router;
