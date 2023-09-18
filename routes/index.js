const express = require('express')
const {homePage, library} = require('../controller/index')
const router = express.Router();


router.get('/', homePage);
router.get('/library', library)


module.exports = router;