const express = require('express')
const {requireAuth} = require('../../middleware/authWare');
const {homePage,libraryPage, cardPage, marketplace} = require('../controller/index')
const router = express.Router();


router.get('/', homePage);
router.get('/library', requireAuth, libraryPage);
router.get('/library/:cardID', requireAuth, cardPage);
router.get('/marketplace', requireAuth, marketplace);

module.exports = router;