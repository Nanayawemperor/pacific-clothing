const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const employeesController = require('../controllers/employees');

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
 *   name: Employees
 *   description: API for employees management
 */

/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: List of employees
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Server error
 */
router.get('/', employeesController.getAll);

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Employee found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.get(
  '/:id',
  param('id').isMongoId().withMessage('Invalid employee ID'),
  handleValidationErrors,
  employeesController.getSingle
);

/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       201:
 *         description: Employee created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  body('fullName').isString().notEmpty().withMessage('Full name is required'),
  body('phoneNumber').isString().notEmpty().withMessage('Phone number is required'),
  body('hireDate').isISO8601().withMessage('Hire date must be a valid date'),
  body('department').isString().notEmpty().withMessage('Department is required'),
  body('employmentStatus').isString().notEmpty().withMessage('Employment status is required'),
  body('role').isString().notEmpty().withMessage('Role is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
  handleValidationErrors,
  employeesController.createEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID (MongoDB ObjectId)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employee'
 *     responses:
 *       200:
 *         description: Employee updated successfully or no changes made
 *       400:
 *         description: Validation error or invalid ID
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  param('id').isMongoId().withMessage('Invalid employee ID'),
  body('fullName').optional().isString(),
  body('phoneNumber').optional().isString(),
  body('hireDate').optional().isISO8601(),
  body('department').optional().isString(),
  body('employmentStatus').optional().isString(),
  body('role').optional().isString(),
  body('address').optional().isString(),
  handleValidationErrors,
  employeesController.updateEmployee
);

/**
 * @swagger
 * /employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       400:
 *         description: Invalid ID format
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Invalid employee ID'),
  handleValidationErrors,
  employeesController.deleteEmployee
);

module.exports = router;

