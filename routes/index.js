const express = require('express')
const {homePage,libraryPage, cardPage} = require('../controller/index')
const router = express.Router();


router.get('/', homePage);
router.get('/library', libraryPage)
router.get('/library/:cardID', cardPage)

module.exports = router;