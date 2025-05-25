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
 *                   departmentName:
 *                     type: string
 *                   manager:
 *                     type: string
 *                   totalEmployees:
 *                     type: integer
 *                   location:
 *                     type: string
 */
router.get('/', departmentsController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
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
 *         description: Department found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 departmentName:
 *                   type: string
 *                 manager:
 *                   type: string
 *                 totalEmployees:
 *                   type: integer
 *                 location:
 *                   type: string
 *       404:
 *         description: Department not found
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
 *               - departmentName
 *               - manager
 *               - totalEmployees
 *               - location
 *             properties:
 *               departmentName:
 *                 type: string
 *               manager:
 *                 type: string
 *               totalEmployees:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 *       400:
 *         description: Invalid input
 */
router.post('/', departmentsController.createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department
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
 *               departmentName:
 *                 type: string
 *               manager:
 *                 type: string
 *               totalEmployees:
 *                 type: integer
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated
 *       404:
 *         description: Department not found
 */
router.put('/:id', departmentsController.updateDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags: [departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department deleted
 *       404:
 *         description: Department not found
 */
router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;
