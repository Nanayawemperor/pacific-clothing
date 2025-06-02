const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const departmentsController = require('../controllers/departments');

// Middleware for handling validation results
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
 *   name: departments
 *   description: API for departments management
 */

router.get('/', departmentsController.getAll);

router.get(
    '/:id',
    param('id').isMongoId().withMessage('Invalid department ID'),
    handleValidationErrors,
    departmentsController.getSingle
);

router.post(
    '/',
    body('departmentName').isString().notEmpty().withMessage('Department name is required'),
    body('manager').isString().notEmpty().withMessage('Manager is required'),
    body('totalEmployees').isInt({ min: 0 }).withMessage('Total employees must be a non-negative integer'),
    body('location').isString().notEmpty().withMessage('Location is required'),
    handleValidationErrors,
    departmentsController.createDepartment
);

router.put(
    '/:id',
    param('id').isMongoId().withMessage('Invalid department ID'),
    body('departmentName').optional().isString(),
    body('manager').optional().isString(),
    body('totalEmployees').optional().isInt({ min: 0 }),
    body('location').optional().isString(),
    handleValidationErrors,
    departmentsController.updateDepartment
);

router.delete(
    '/:id',
    param('id').isMongoId().withMessage('Invalid department ID'),
    handleValidationErrors,
    departmentsController.deleteDepartment
);

module.exports = router;

