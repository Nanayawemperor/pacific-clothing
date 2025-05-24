const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const employeesController = require('../controllers/employees');

/**
 * Middleware to handle validation errors
 */
function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: API for managing employees
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - name
 *         - departmentId
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Employee's full name
 *         departmentId:
 *           type: string
 *           description: ID of the employee's department
 *       example:
 *         _id: 60af884f4f1a2a1a4c9e9f1a
 *         name: John Doe
 *         departmentId: 60af884f4f1a2a1a4c9e9f1b
 */

// GET all employees
router.get('/', async (req, res) => {
  try {
    const employees = await employeesController.getAll();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving employees' });
  }
});

// GET single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const employee = await employeesController.getSingle(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving employee' });
  }
});

// POST create new employee
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('departmentId').trim().notEmpty().withMessage('Department ID is required'),
  validateRequest,
  async (req, res) => {
    try {
      const newEmployee = await employeesController.createEmployee(req.body);
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error creating employee' });
    }
  }
);

// PUT update employee by ID
router.put(
  '/:id',
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('departmentId').optional().trim().notEmpty().withMessage('Department ID cannot be empty'),
  validateRequest,
  async (req, res) => {
    try {
      const updatedEmployee = await employeesController.updateEmployee(req.params.id, req.body);
      if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
      res.json(updatedEmployee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error updating employee' });
    }
  }
);

// DELETE employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await employeesController.deleteEmployee(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Employee not found' });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting employee' });
  }
});

module.exports = router;
