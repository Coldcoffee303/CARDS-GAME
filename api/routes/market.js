const express = require('express');

const router = express.Router();

// GET 
router.get('/',(req,res)=>{
    res.json({message:'marketPlace Page'});
});
router.get('/sell',(req,res)=>{
    res.json({message:'Sell Page'});
});
router.get('/buy',(req,res)=>{
    res.json({message:'Buy Page'});
});
router.get('/auctions',(req,res)=>{
    res.json({message:'Auction page'});
});
router.get('/auctions/create', (req,res)=>{
    res.json({message:'Auction Create Page'});
});
router.get('/auctions/:auctionId',(req,res)=>{
    res.json({message:'Specific Auction Page'});
});

// POST
router.post('/sell',(req,res)=>{
    res.json({message:'Post Sell Page'});
});
router.post('/buy/:listId',(req,res)=>{
    res.json({message:'Post Buy Page'});
});
router.post('/cancel-listing/:listId',(req,res)=>{
    res.json({message:'Post Cancel listing Page'});
});
router.post('/auctions/create',(req,res)=>{
    res.json({message:'Post Auction Create Page'});
});
router.post('/auctions/:auctionId',(req,res)=>{
    res.json({message:'Post Specific Auction Page'});
});

module.exports = router;