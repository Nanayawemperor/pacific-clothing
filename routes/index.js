const express = require('express');
const router = express.Router();
router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Hello from the routes!']
  res.send('Hello from the routes!');
});

router.use('/employees', require('./employees'));
router.use('/departments', require('./departments'));

module.exports = router;

