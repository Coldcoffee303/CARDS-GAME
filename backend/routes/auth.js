const express = require('express');
const { login_get, login_post, signup_get, signup_post, profile_get, inventory_get, phoneUpdate, phoneUpdate_post } = require('../controller/auth');
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

router.post('/logout', (req, res) => {
    const domain = req.hostname === 'localhost' ? 'localhost' : 'cards-game-nine.vercel.app';
    res.clearCookie('jwt', { path: '/', domain }).redirect('/');
});

// profile


router.get('/', profile_get );
router.get('/inventory', inventory_get);


// update mobile number
router.get('/mobile', phoneUpdate);
router.post('/mobile', phoneUpdate_post);

module.exports = router;