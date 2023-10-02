const { User, Listing, Auction} = require('../../models/schema');
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


// auction controllers

const createAuction_get = async (req, res)=>{
  try {
    const user = await User.findById(req.user).populate('inventory.cardId');
    if(!user){
      return res.status(400).send('User not found');
    }

    res.render('pages/createauction', {user});
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
  
};

// duration calculation
function calculateDuration(cardGrade) {
  const gradeDuration = {
    'Common': 5 * 60 * 1000,
    'Rare': 10 * 60 * 1000,
    'Epic' : 30 * 60 * 1000,
    'Legendary': 1 * 60 * 60 * 1000
  };
  return gradeDuration[cardGrade];
}



const createAuction_post = async (req, res)=> {
  const { cardToSell, sellPrice, sellDetails } = req.body;
  try {
    const user = await User.findById(req.user).populate('inventory.cardId');
    if(!user) {
      return res.status(400).send('User not found');
    }

    const selectedCard = await user.inventory.find(item => item.cardId._id.toString() === cardToSell);
    if(!selectedCard) {
      return res.status(400).send('Card not found in your inventory');
    }
    const item = new Auction({
      cardId: cardToSell,
      sellerId: user._id,
      startingPrice: sellPrice,
      currentPrice: sellPrice,
      duration: calculateDuration(selectedCard.cardId.grade)
    })
    if(item) {
      item.save()
      res.redirect('/marketplace/auctions');
    } else {
      res.status(500).send('card is not available in inventory');
    }
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }

};

const auction_get = async (req, res)=>{
  const {auctionId} = req.params;
  try {
    const item = await Auction.findById(auctionId).populate('cardId sellerId bids.bidder'); 
    if(!item) {
      return res.send('auction item not found');
    }
    res.render('pages/auctionpage', {auction: item});

  } catch(err) {
    console.log(err)
    res.status(500).send('Internal Server Error');
  }
}

const auction_post = async (req, res)=>{
  const {bidAmount} = req.body;
  const auctionId = req.params.auctionId;
  const currentUser = req.user;
  try {
    const item = await Auction.findById(auctionId);
    if(item.sellerId._id.toString() !== currentUser){
      const user = await User.findById(currentUser);
      if(user) {
        item.bids.push({
          bidder: user._id,
          bidAmount: parseInt(bidAmount),
        })
        item.currentPrice = parseInt(bidAmount);
        item.save();
      }
    }
    res.redirect('/marketplace/auctions/'+ auctionId);
  } catch(err) {
    console.log(err)
    res.status(500).send('Internal Server Error');
  }

};

const auctionsList_get = async (req, res)=>{
  try {
    const activeAuctions = await Auction.find().populate('cardId sellerId');
    res.render('pages/auctions', {activeAuctions});
  } catch(err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = {
  marketplace,
  sell_get,
  sell_post,
  buy_get, 
  buy_post,
  cancel_listing,
  auctionsList_get,
  createAuction_get,
  createAuction_post,
  auction_get,
  auction_post,
};