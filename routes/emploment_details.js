const express = require('express');
const router = express.Router();

const employment_detailsController = require('../controllers/employment_details');

router.get('/', employment_detailsController.getAll);

router.get('/:id', employment_detailsController.getSingle);

//router.post('/', employment_detailsController.createContact);

//router.put('/:id', employment_detailsController.updateContact);

//router.delete('/:id', employment_detailsController.deleteContact);



module.exports = router;