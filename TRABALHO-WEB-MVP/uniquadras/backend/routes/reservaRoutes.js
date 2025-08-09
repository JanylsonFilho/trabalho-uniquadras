const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');

/**
 * @swagger
 * tags:
 *   name: Reservas
 *   description: Endpoints para gerenciamento de reservas
 */

/**
 * @swagger
 * /reservas:
 *   get:
 *     summary: Retorna uma lista de todas as reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       500:
 *         description: Erro no servidor
 */
router.get('/', reservaController.listar);

/**
 * @swagger
 * /reservas/{id}:
 *   get:
 *     summary: Retorna uma reserva pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da reserva
 *     responses:
 *       200:
 *         description: Reserva retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       404:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/:id', reservaController.obter);

/**
 * @swagger
 * /reservas:
 *   post:
 *     summary: Cria uma nova reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaReserva'
 *     responses:
 *       201:
 *         description: Reserva criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reserva'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */
router.post('/', reservaController.criar);

//router.put('/:id', reservaController.atualizar);


/** * @swagger
 * /reservas/{id}:
 *   delete:
 *     summary: Deleta uma reserva pelo ID
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da reserva a ser deletada
 *     responses:
 *       200:
 *         description: Reserva deletada com sucesso
 *       404:
 *         description: Reserva não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.delete('/:id', reservaController.deletar);

/**
 * @swagger
 * /reservas/usuario/{id}:
 *   get:
 *     summary: Retorna todas as reservas de um usuário específico
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de reservas do usuário retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reserva'
 *       500:
 *         description: Erro no servidor
 */
router.get('/usuario/:id', reservaController.listarPorUsuario);


/**
 * @swagger
 * components:
 * schemas:
 * Reserva:
 * type: object
 * properties:
 * _id:
 * type: string
 * id_usuario:
 * type: string
 * id_quadra:
 * type: string
 * id_horario:
 * type: string
 * data_reserva:
 * type: string
 * format: date
 * horario_reserva:
 * type: string
 * nome_quadra:
 * type: string
 * criado_em:
 * type: string
 * format: date-time
 * NovaReserva:
 * type: object
 * required:
 * - id_usuario
 * - id_quadra
 * - id_horario
 * properties:
 * id_usuario:
 * type: string
 * id_quadra:
 * type: string
 * id_horario:
 * type: string
 */

module.exports = router;    