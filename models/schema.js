const mongoose = require('mongoose');
const { isEmail} = require('validator');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;



const natureEnum = [
    'Fire', 'Water', 'Earth', 'Lightning' 
]


const gradeMaximumCaps = {
    Common: { attack: 250, defense: 250, speed: 250 },
    Rare: { attack: 500, defense: 500, speed: 500 },
    Epic: { attack: 750, defense: 750, speed: 750 },
    Legendary: { attack: 1000, defense: 1000, speed: 1000 },
  };



const beastCardSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        enum: ['Common','Rare','Epic','Legendary'],
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        default: 1,
    },

    info: {
        type: String,
        required: true,
    },

    nature: {
        type: String,
        enum: natureEnum,
        required: true,
    },
    awakendNature :  {
        type: String,
        required: function(){
            return this.stars === 5;
        },
        default: null,
    },
    awakendAbilityActive: {
        type: Boolean,
        required: function(){
            return this.stars === 5;  
        },
        default: false,
    },
    image: {
        type: String,
        required: true,
    },
    attack: {
        type: Number,
        validate: {
            validator: function() {
                if(!this.grade){
                   return true; 
                }
                const gradeMaximumCap = gradeMaximumCaps[this.grade];
                return this.attack <= gradeMaximumCap.attack;
            },
            message: 'Attack exceeds the maximum cap for this grade.', 
        },
    },
    defense: {
        type: Number,
        validate:  {
            validator: function() {
                if(!this.grade){
                    return true;
                }
                const gradeMaximumCap = gradeMaximumCaps[this.grade];
                return this.defense <= gradeMaximumCap.defense;
            },
            message: 'Defense exceeds the maximum cap for this grade. ',
        }
    },
    speed: {
        type: Number,
        validate:  {
            validator: function() {
                if(!this.grade){
                    return true;
                }
                const gradeMaximumCap = gradeMaximumCaps[this.grade];
                return this.speed <= gradeMaximumCap.speed;
            },
            message: 'Speed exceeds the maximum cap for this grade. ',
        }
    },

})


const BeastCard = mongoose.model('BeastCard', beastCardSchema);


const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Please enter a name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter a valid email'],
        unique: true,
        lowercase: true,
        validator: [isEmail, 'Please enter a valid email'],
    },
    password: {
        type: String,
        required: true,
        minLength: [7, 'Minimum password length is 7 characters'],
    },
    astralCoins: {
        type: Number,
        default: 0,
    },
    inventory: [
        {
            cardId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'BeastCard',         
            },
            quantity: {
                type: Number,
                default: 0,
            },
        },
    ],
});



userSchema.statics.login = async function(email, password) {
    const user = await this.findOne({email});
    if(user) {
        const auth = await bcrypt.compare(password, user.password);
        if(auth) {
            return user;
        }
       throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}



userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


const User = mongoose.model('User', userSchema);




// marketplace

const listingSchema = new mongoose.Schema({
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BeastCard',
        required: true,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});
  
const Listing = mongoose.model('Listing', listingSchema);



module.exports = {BeastCard, User, Listing};
