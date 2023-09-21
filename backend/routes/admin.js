const express = require('express')
const {newCard_get, newCard_post} = require('../controller/admin')
const router = express.Router();


router.get('/cards/new', newCard_get);
router.post('/cards/new', newCard_post);


module.exports = router;