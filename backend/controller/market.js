const {BeastCard, User, Listing} = require('../../models/schema');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT;

const marketplace = (req, res) =>{
    res.render('pages/marketplace')
};


const sell_get = async (req, res) => {
    const currentUser = req.user;

    try {
        const user = await User.findById(currentUser).populate('inventory.cardId');
        const activeListings = await Listing.find({ sellerId: currentUser})
          .populate('cardId')
          .populate('sellerId');
        
        
        res.render('pages/sellpage', {  user,  activeListings });
      } catch (err) {

        console.error(err);
        res.status(500).send('Internal Server Error');
      }
}

const sell_post =  async (req, res) =>{
  
  const { cardToSell, sellPrice, sellDetails } = req.body;
  const currentUser = req.user;
  try { 
      const user = await User.findById(currentUser);
      if(!user) {
          return res.status(400).send('User not found');
      } else {
          const selectedCard = user.inventory.find(item => item.cardId._id.toString() === cardToSell);
          if (!selectedCard) {
            return res.status(400).send('Selected card not found in inventory');
          }
          const listing = new Listing({
            cardId: cardToSell,
            sellerId: user.id,
            price: parseInt(sellPrice),
            details: sellDetails,
          });
          
          user.inventory = user.inventory.filter(item => item.cardId._id.toString() !== cardToSell);
          await listing.save();
          await user.save();
          res.redirect('/marketplace/sell');
      }
    
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }

}

const buy_get = async (req, res) => {
  try {

    const activeListings = await Listing.find({}).populate('cardId').populate('sellerId');
    const user = await User.findById(req.user);

    res.render('pages/buypage', { user, activeListings });
  } catch (err) {

    console.error(err);
    res.status(500).send('Internal Server Error');
  }
}

const buy_post = async (req, res) => {
  const listId = req.params.listId;
  const currentUser = req.user;

  try {
    const item = await Listing.findById(listId);
    if(!item) {
      return res.status(400).send('card not found in market');
    }

    if(item.sellerId.toString() === currentUser.toString()) {
      return res.status(400).send('you cant buy something you sell');
    }
    const user = await User.findById(currentUser);
    const seller = await User.findById(item.sellerId);
    if(user.astralCoins < item.price) {
      return res.status(400).send('you dont have enough astral Coins');
    } else {
      user.astralCoins -= item.price;
      seller.astralCoins += item.price;
      user.inventory.push({ cardId: item.cardId, quantity: 1});
      await Listing.findOneAndRemove(item);
      await user.save();
      await seller.save();
      res.status(200).send('Card Purchased Successfully');
    }

  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }


}


const cancel_listing = async (req, res) => {
  const listId = req.params.listId;
  const currentUser = req.user;
  try {
    const item = await Listing.findById(listId);
    if(!item) {
      return res.status(400).send('card is not in cancel list');
    }

    if(item.sellerId.toString() !== currentUser) {
      return res.status(400).send('Permission denied');
    }

    const user = await User.findById(currentUser);
    user.inventory.push({ cardId: item.cardId, quantity: 1});
    await Listing.findOneAndRemove(item);
    user.save();
    res.redirect('/marketplace/sell');
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
} 




module.exports = {marketplace, sell_get, sell_post, buy_get, buy_post, cancel_listing};