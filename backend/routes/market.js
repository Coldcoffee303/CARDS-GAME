const {marketplace, sell_get, sell_post, buy_get, buy_post, cancel_listing} = require('../controller/market');
const express = require('express');

const router = express.Router();


router.get('/', marketplace);
router.get('/sell', sell_get);
router.get('/buy', buy_get);

router.post('/sell', sell_post);
router.post('/buy/:listId', buy_post);
router.post('/cancel-listing/:listId', cancel_listing);


module.exports = router;