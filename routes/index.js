const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', (req, res) => {
    //#swagger.tags=['Hello from the routes!']
  res.send('Hello from the routes!');
});

router.use('/employees', require('./employees'));
router.use('/departments', require('./departments'));


router.get('/login', passport.authenticate('github'), (req, res) => {} );

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err);}
    res.redirect('/');
  });
});

module.exports = router;

