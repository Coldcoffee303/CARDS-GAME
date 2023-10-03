const express = require('express')
const router = express.Router();


router.get('/', (req,res)=>{
    res.json({message: 'homepage'});
});
router.get('/library',(req,res)=>{
    res.json({message:'library page'});
});
router.get('/library/:cardID',(req,res)=>{
    res.json({message:'specific library page'});
});
module.exports = router;