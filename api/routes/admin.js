const express = require('express')

const router = express.Router();


router.get('/cards/new', newCard_ge);
router.post('/cards/new', newCard_post);


module.exports = router;