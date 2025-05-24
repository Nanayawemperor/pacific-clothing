const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const departmentsController = require('../controllers/departments');

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
 *   name: Departments
 *   description: API for managing departments
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Department:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier
 *         name:
 *           type: string
 *           description: Department name
 *       example:
 *         _id: 60af884f4f1a2a1a4c9e9f1a
 *         name: Sales
 */

// GET all departments
router.get('/', async (req, res) => {
  try {
    const departments = await departmentsController.getAll();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving departments' });
  }
});

// GET a single department by ID
router.get('/:id', async (req, res) => {
  try {
    const department = await departmentsController.getSingle(req.params.id);
    if (!department) return res.status(404).json({ message: 'Department not found' });
    res.json(department);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error retrieving department' });
  }
});

// POST create a new department
router.post(
  '/',
  body('name').trim().notEmpty().withMessage('Name is required'),
  validateRequest,
  async (req, res) => {
    try {
      const newDepartment = await departmentsController.createDepartment(req.body);
      res.status(201).json(newDepartment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error creating department' });
    }
  }
);

// PUT update a department by ID
router.put(
  '/:id',
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  validateRequest,
  async (req, res) => {
    try {
      const updatedDepartment = await departmentsController.updateDepartment(req.params.id, req.body);
      if (!updatedDepartment) return res.status(404).json({ message: 'Department not found' });
      res.json(updatedDepartment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error updating department' });
    }
  }
);

// DELETE a department by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await departmentsController.deleteDepartment(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Department not found' });
    res.status(204).send(); // No content for successful delete
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting department' });
  }
});

module.exports = router;
