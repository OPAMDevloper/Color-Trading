const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const bcrypt = require('bcrypt');

// Login
router.get('/',async (req, res) => {
  const wallet = await Wallet.findOne({ username: req.session.user.username });
  res.render('playgame', {username: req.session.user.username, balance: wallet.balance} );
});


router.post('/playgame', async (req, res) => {
  const username = req.session.user.username; // Ensure you have session middleware and user is set in the session
  const { color, betAmount } = req.body;
  console.log('Bet Amount:', betAmount); // Debugging statement
  console.log(color);
  console.log(username);

  try {
      const user = await Wallet.findOne({ username: username });
      if (user && user.balance >= betAmount) {
          user.balance -= betAmount;
          const colors = ['red', 'black', 'green'];
          const randomColor = colors[Math.floor(Math.random() * colors.length)];
          let winnings = 0;

          if (color === randomColor) {
              winnings = color === 'green' ? betAmount * 10 : betAmount * 2;
          }

          user.balance += winnings;
          await user.save();

          res.json({ 
              success: true, 
              randomColor, 
              winnings, 
              newBalance: user.balance 
          });
      } else {
          res.json({ success: false, message: 'Insufficient balance or user not found' });
      }
  } catch (error) {
      res.json({ success: false, message: 'Internal Server Error' });
  }
});







module.exports = router;