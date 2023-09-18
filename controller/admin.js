const {BeastCard} = require('../model')

const newCard_get = (req,res)=>{
    console.log('admin page accessed')
    res.render('pages/newcard')
}


const newCard_post = (req, res) =>{
        const data = req.body
        const card = new BeastCard({
            name: data.name,
            grade: data.grade,
            stars: parseInt(data.stars, 10),
            info: data.info,
            nature: data.nature,
            awakendNature: data.awakendNature,
            awakendAbilityActive: data.awakendAbilityActive,
            image: data.image
        });
        card.save();
        console.log('saved successfully')
        console.log(data)

    res.redirect('/admin/cards/new')
}


module.exports = {newCard_get, newCard_post}