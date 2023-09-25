const express = require('express');
const { login_get, login_post, signup_get, signup_post } = require('../controller/auth');
const router = express.Router();


// login
router.get('/login', login_get );
router.post('/login', login_post);

// signup
router.get('/signup', signup_get);
router.post('/signup', signup_post);


// logout
router.get('/logout', (req,res)=>{
    res.render('partials/logout')
})

router.post('/logout', (req, res)=>{
    res.clearCookie('jwt', {path: '/', domain: 'localhost'}).send();
})
module.exports = router;