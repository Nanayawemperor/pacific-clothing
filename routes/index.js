const router = require('express').Router();


router.get('/', (req, res) => {
    //swagger.tags-['Hello World']
    res.send('Hello World');});

router.use('/personal_info', require('./personal_info.js'));

//router.use('/employment_details', require('./employment_details.js'));

module.exports = router;

