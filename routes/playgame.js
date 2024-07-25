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
    const username = req.session.user.username;
    const color = req.body.color;
    const betAmount = parseInt(req.body.betAmount);
  
    try {
      const user = await Wallet.findOne({ username: username });
      console.log(user);
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
        res.render('result', { randomColor, winnings });
      } else {
        res.status(400).send('Insufficient balance or user not found');
      }
    } catch (error) {
      res.status(500).send('Internal Server Error');
    }
  });





module.exports = router;