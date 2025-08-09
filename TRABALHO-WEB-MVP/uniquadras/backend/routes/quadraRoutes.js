const express = require('express');
const router = express.Router();
const quadraController = require('../controllers/quadraController');

/**
 * @swagger
 * tags:
 *   name: Quadras
 *   description: Endpoints para gerenciamento de quadras esportivas
 */

/**
 * @swagger
 * /quadras:
 *   get:
 *     summary: Retorna uma lista de todas as quadras
 *     tags: [Quadras]
 *     responses:
 *       200:
 *         description: Lista de quadras retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Quadra'
 *       500:
 *         description: Erro no servidor
 *
 *   post:
 *     summary: Adiciona uma nova quadra
 *     tags: [Quadras]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaQuadra'
 *     responses:
 *       201:
 *         description: Quadra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quadra'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro no servidor
 */

/**
 * @swagger
 * /quadras/{id}:
 *   get:
 *     summary: Retorna uma quadra pelo ID
 *     tags: [Quadras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da quadra
 *     responses:
 *       200:
 *         description: Quadra retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quadra'
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro no servidor
 *   put:
 *     summary: Atualiza uma quadra pelo ID
 *     tags: [Quadras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da quadra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaQuadra'
 *     responses:
 *       200:
 *         description: Quadra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Quadra'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro no servidor
 *   delete:
 *     summary: Deleta uma quadra pelo ID
 *     tags: [Quadras]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da quadra
 *     responses:
 *       200:
 *         description: Quadra deletada com sucesso
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/', quadraController.listar);
router.get('/:id', quadraController.obter);
router.post('/', quadraController.criar);
router.put('/:id', quadraController.atualizar);
router.delete('/:id', quadraController.deletar);



/**
 * @swagger
 * components:
 * schemas:
 * Quadra:
 * type: object
 * properties:
 * _id:
 * type: string
 * nome:
 * type: string
 * tipo:
 * type: string
 * enum: ['Aberta', 'Fechada']
 * status:
 * type: string
 * enum: ['Ativa', 'Inativa']
 * NovaQuadra:
 * type: object
 * required:
 * - nome
 * - tipo
 * properties:
 * nome:
 * type: string
 * tipo:
 * type: string
 * enum: ['Aberta', 'Fechada']
 * status:
 * type: string
 * enum: ['Ativa', 'Inativa']
 * default: 'Ativa'
 */

module.exports = router;
