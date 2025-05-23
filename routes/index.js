const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.send('Hello from the routes!');
});

router.use('/employees', require('./employees'));
router.use('/departments', require('./departments'));

module.exports = router;