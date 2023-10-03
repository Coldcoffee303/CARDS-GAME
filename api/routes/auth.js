const express = require('express');
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


// profile


router.get('/', profile_get );
router.get('/inventory', inventory_get);

module.exports = router;