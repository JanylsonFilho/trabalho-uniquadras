const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

/**
 * @swagger
 * tags:
 *   name: Horários
 *   description: Endpoints para gerenciamento de horários das quadras
 */

/**
 * @swagger
 * /horarios:
 *   get:
 *     summary: Retorna uma lista de horários disponíveis para uma quadra em uma data específica
 *     tags: [Horários]
 *     parameters:
 *       - in: query
 *         name: quadraId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da quadra
 *       - in: query
 *         name: data
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Data no formato AAAA-MM-DD
 *     responses:
 *       200:
 *         description: Lista de horários retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Parâmetros inválidos
 *       500:
 *         description: Erro no servidor
 *
 *   post:
 *     summary: Cria um novo horário para uma quadra
 *     tags: [Horários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovoHorario'
 *     responses:
 *       201:
 *         description: Horário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /horarios/{id}:
 *   put:
 *     summary: Atualiza um horário existente
 *     tags: [Horários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AtualizarHorario'
 *     responses:
 *       200:
 *         description: Horário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /horarios/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um horário (disponível ou indisponível)
 *     tags: [Horários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [disponível, indisponível]
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Status do horário atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /horarios/{id}:
 *   delete:
 *     summary: Deleta um horário pelo ID
 *     tags: [Horários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do horário a ser deletado
 *     responses:
 *       200:
 *         description: Horário deletado com sucesso
 *       404:
 *         description: Horário não encontrado
 *       500:
 *         description: Erro no servidor
 */ 
router.get('/', horarioController.listarPorQuadraEData);
router.post('/', horarioController.criar);
router.put('/:id', horarioController.atualizar);
router.patch('/:id/status', horarioController.atualizarStatus);
router.delete('/:id', horarioController.deletar);


/**
 * @swagger
 * components:
 * schemas:
 * Horario:
 * type: object
 * properties:
 * _id:
 * type: string
 * description: O ID do horário específico.
 * data:
 * type: string
 * format: date
 * description: A data do horário (YYYY-MM-DD).
 * horario:
 * type: string
 * description: O intervalo do horário (ex: "18:00 - 19:00").
 * status:
 * type: string
 * enum: ['Disponível', 'Indisponível']
 * NovoHorario:
 * type: object
 * required:
 * - id_quadra
 * - data
 * - horario
 * properties:
 * id_quadra:
 * type: string
 * description: O ID da quadra à qual o horário pertence.
 * data:
 * type: string
 * format: date
 * horario:
 * type: string
 * status:
 * type: string
 * enum: ['Disponível', 'Indisponível']
 * default: 'Disponível'
 * AtualizarHorario:
 * type: object
 * properties:
 * horario:
 * type: string
 * status:
 * type: string
 * enum: ['Disponível', 'Indisponível']
 */

module.exports = router;
