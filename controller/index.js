const {BeastCard} = require('../model')

const homePage = (req,res)=>{
    res.render('pages/home')
}

const library = async (req, res) => {
    try {
      const cards = await BeastCard.find(); 
      
      res.render('pages/library', { cards });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching card data' });
    }
}



module.exports = {homePage, library}