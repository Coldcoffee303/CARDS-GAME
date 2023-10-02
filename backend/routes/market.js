const market = require('../controller/market');
const express = require('express');

const router = express.Router();

// GET 
router.get('/', market.marketplace);
router.get('/sell', market.sell_get);
router.get('/buy', market.buy_get);
router.get('/auctions', market.auctionsList_get);
router.get('/auctions/create', market.createAuction_get);
router.get('/auctions/:auctionId', market.auction_get); 

// POST
router.post('/sell', market.sell_post);
router.post('/buy/:listId', market.buy_post);
router.post('/cancel-listing/:listId', market.cancel_listing);
router.post('/auctions/create', market.createAuction_post);
router.post('/auctions/:auctionId', market.auction_post); 


module.exports = router;