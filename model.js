const mongoose = require('mongoose')
const schema = mongoose.Schema;

const natureEnum = [
    'Fire', 'Water', 'Earth', 'Lightning' 
]


const gradeMaximumCaps = {
    Common: { attack: 250, defense: 250, speed: 250 },
    Rare: { attack: 500, defense: 500, speed: 500 },
    Epic: { attack: 750, defense: 750, speed: 750 },
    Legendary: { attack: 1000, defense: 1000, speed: 1000 },
  };



const beastCardSchema = new schema({
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

module.exports = {BeastCard}
