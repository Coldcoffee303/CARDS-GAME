const { Query } = require('mongoose');
const {BeastCard, Listing} = require('../../models/schema')



const homePage = async (req,res)=>{
  try {
    const activeListings = await Listing.find().populate('cardId sellerId').sort({ createdAt: -1 }).limit(3).exec();
    console.log(activeListings);
    res.render('pages/home', {activeListings});
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
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
    const card =  await BeastCard.findById(cardID);
    res.render('pages/card', {card})
  } catch(error) {
    console.error(error)
    res.json({message: 'error'})
  }
}




module.exports = {homePage, libraryPage, cardPage};