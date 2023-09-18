const mongoose = require('mongoose')
const schema = mongoose.Schema;

const natureEnum = [
    'Fire', 'Water', 'Earth', 'Lightning' 
]


const beastCardSchema = new schema({
    name: {
        type: String,
        required: true,
    },
    grade: {
        type: String,
        enum: ['Common','Uncommon','Rare','Epic','Legendary'],
        required: true,
    },
    stars: {
        type: Number,
        min: 1,
        max: 5,
        required: function(){
            return this.grade === 'Legendary'
        },
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
      }
})

const BeastCard = mongoose.model('BeastCard', beastCardSchema);

module.exports = {BeastCard}