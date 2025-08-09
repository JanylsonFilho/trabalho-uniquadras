const express = require('express');
const router = express.Router();
const userController = require('../controllers/usuarioController');

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints para gerenciamento de usuários
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna uma lista de todos os usuários
 *     tags: [Usuários]
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Erro no servidor
 */
router.get('/', userController.getUsers);


//router.get('/:id', userController.getUsersById);

/**
 * @swagger
 * /usuarios/cadastro:
 *   post:
 *     summary: Adiciona um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoUsuario'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 *       500:
 *         description: Erro no servidor
 */
router.post('/cadastro', userController.addUser);

/**
 * @swagger
 * /usuarios/promover/{id}:
 *   put:
 *     summary: Promove um usuário a administrador
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser promovido
 *     responses:
 *       200:
 *         description: Usuário promovido com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
*/
router.put('/promover/:id', userController.promoverUsuario);

/**
 * @swagger
 * /usuarios/rebaixar/{id}:
 *   put:
 *     summary: Rebaixa um usuário para comum
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser rebaixado
 *     responses:
 *       200:
 *         description: Usuário rebaixado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
*/
router.put('/rebaixar/:id', userController.rebaixarUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Autentica um usuário e retorna um token JWT
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email do usuário
 *               senha:
 *                 type: string
 *                 description: Senha do usuário
 *             required:
 *               - email
 *               - senha
 *     responses:
 *       200:
 *         description: Autenticação bem-sucedida, retorna token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT para autenticação
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       500:
 *         description: Erro no servidor
 */
router.post('/login', userController.login);



/**
 * @swagger
 * components:
 * schemas:
 * Usuario:
 * type: object
 * properties:
 * _id:
 * type: string
 * description: O ID gerado automaticamente do usuário.
 * nome:
 * type: string
 * description: O nome do usuário.
 * email:
 * type: string
 * description: O email do usuário.
 * telefone:
 * type: string
 * description: O telefone do usuário.
 * id_tipo_usuario:
 * type: string
 * description: '1 para Usuário, 2 para ADM'
 * enum: ['1', '2']
 * NovoUsuario:
 * type: object
 * required:
 * - nome
 * - email
 * - senha
 * - telefone
 * properties:
 * nome:
 * type: string
 * email:
 * type: string
 * senha:
 * type: string
 * telefone:
 * type: string
 */


module.exports = router;