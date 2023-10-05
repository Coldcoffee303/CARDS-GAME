const {User} = require('../../models/schema');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const JWT = process.env.JWT;

const maxAge= 3* 24* 60* 60;


const handleErrors = (err) =>{
    console.log(err.message, err.code);
    let errors = { email: '', password: ''};

    if(err.message === 'Incorrect Email') {
        errors.email = 'this email is not registered';
    }

    if(err.message === 'Incorrect Password') {
        errors.email = 'this password is incorrect';
    }

    if(err.code === 11000) {
        errors.email = 'this email is already registered';
        return errors;
    }

    // validation errors
    if(err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}

// JWT token creation
const createToken = (id) => {
    return jwt.sign({id}, JWT, {
        expiresIn: maxAge
    });
};


const signup_get = (req, res) => {
    res.render('pages/signup')
}

const login_get = (req, res) => {
    res.render('pages/login')
}

const signup_post = async (req, res) => {
    const {name, email, password} = req.body;
    
    try {
        const user = await User.create({ name: name, email: email, password: password, inventory: [ {
            cardId: "65093e6cdbe03fcc7bf2deba",
            quantity: 1
        }] });
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true,maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});

    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json(errors);
    }
}


const login_post = async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(200).json({user: user._id});
    } catch(err) {
        const errors = handleErrors(err);
        res.status(400).json({errors:errors});
    }
}


const profile_get = async (req, res) => {
    const profile = req.user;

    try {
        const user = await User.findById(profile).populate('inventory.cardId');
        res.render('pages/profile', {user});

    } catch(err) {
        res.status(500).send('Internal Server Error');
    }
}



const inventory_get = async (req, res) => {
    const profile = req.user;

    try {
        const user = await User.findById(profile).populate('inventory.cardId');
        res.render('pages/inventory', {inventory:user.inventory});

    } catch(err) {
        res.status(500).send('Internal Server Error');
    }
}



const phoneUpdate = (req, res)=> {
    res.send(`<form method="POST">
        <label for="mobile" >Phone Number</label>
        <input name="mobile" />
        <button type="submit">Submit</button>
    </form>`)
}


const phoneUpdate_post = async (req, res)=> {
    try{
        const user = await User.findById(req.user);
        user.mobile = parseInt(req.body.mobile);
        user.save();
        res.redirect('/user');
    } catch(error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {login_get, signup_get, login_post, signup_post, profile_get, inventory_get, phoneUpdate, phoneUpdate_post};