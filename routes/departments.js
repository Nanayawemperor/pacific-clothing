const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const departmentsController = require('../controllers/departments');

const { isAuthenticated } = require("../middleware/authenticate");

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API for departments management
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Server error
 */
router.get('/', departmentsController.getAll);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Department found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid department ID'),handleValidationErrors,
  departmentsController.getSingle
);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  body('departmentName').isString().notEmpty().withMessage('Department name is required'),
  body('manager').optional().isString().notEmpty().withMessage('Manager is required'), 
  body('totalEmployees').isNumeric().withMessage('Number is required'),
  body('location').isString().withMessage('Location is required'), handleValidationErrors,
  isAuthenticated,
  departmentsController.createDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Department'
 *     responses:
 *       200:
 *         description: Department updated successfully or no changes made
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid department ID'),
  body('name').optional().isString(),
  body('description').optional().isString(),handleValidationErrors, isAuthenticated,
  departmentsController.updateDepartment
);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Department ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Department not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid department ID'),handleValidationErrors, isAuthenticated,
  departmentsController.deleteDepartment
);

module.exports = router;


