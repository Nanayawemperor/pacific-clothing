const express = require('express');
const router = express.Router();

const departmentsController = require('../controllers/departments');

router.get('/', departmentsController.getAll);

router.get('/:id', departmentsController.getSingle);

//router.post('/', departmentsController.createDepartments);

//router.put('/:id', departmentsController.updateDepartments);

//router.delete('/:id', departmentsController.deleteDepartments);

module.exports = router;