const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departments');

/**
 * @swagger
 * tags:
 *   name: departments
 *   description: API for departments management
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [departments]
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   position:
 *                     type: string
 *                   department:
 *                     type: string
 */
router.get('/', departmentsController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get an department by ID
 *     tags: [departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: department ID
 *     responses:
 *       200:
 *         description: department found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 firstName:
 *                   type: string
 *                 lastName:
 *                   type: string
 *                 position:
 *                   type: string
 *                 department:
 *                   type: string
 *       404:
 *         description: department not found
 */
router.get('/:id', departmentsController.getSingle);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - position
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: department created
 *       400:
 *         description: Invalid input
 */
router.post('/', departmentsController.createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update an department
 *     tags: [departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: department updated
 *       404:
 *         description: department not found
 */
router.put('/:id', departmentsController.updateDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete an department
 *     tags: [departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: department deleted
 *       404:
 *         description: department not found
 */
router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;

