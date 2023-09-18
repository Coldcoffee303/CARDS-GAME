const {BeastCard} = require('../model')

const homePage = (req,res)=>{
    res.render('pages/home')
}

const libraryPage = async (req, res) => {
    try {
      const cards = await BeastCard.find(); 
      
      res.render('pages/library', { cards });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching card data' });
    }
}

const cardPage = async (req, res) =>{
  try {
    const {cardID} = req.params;
    const getcard =  await BeastCard.findById(cardID);
    res.json({
      name: getcard.name,
      grade: getcard.grade,
      stars: getcard.stars,
      info: getcard.info
    })
  } catch(error) {
    console.error(error)
    res.json({message: 'error'})
  }
}

module.exports = {homePage, libraryPage, cardPage}