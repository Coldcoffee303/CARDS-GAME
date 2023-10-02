const jwt = require('jsonwebtoken');
const {User} = require('../models/schema');
require('dotenv').config()

const JWT = process.env.JWT;

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;

    if (req.path === '/login' || req.path === '/signup') {
        return next();
    }


    if(token) {
        jwt.verify( token, JWT, (err, decodedToken) =>{
            if(err) {
                req.user = null;
                console.log(err.message);
                res.redirect('/user/login');
            } else {
                req.user = decodedToken.id;
                res.locals.user = req.user;
                next();
            }
        })
    } else {
        req.user = null;
        res.redirect('/user/login');
    }
}



module.exports = {requireAuth};