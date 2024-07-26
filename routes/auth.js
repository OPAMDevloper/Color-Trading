const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
  res.render('index');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.render('index',{username: req.session.user.username});
  } else {
    res.redirect('/login');
  }
});

router.get('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error while destroying session:', err);
      return res.redirect('/dashboard');
    }
    
    // Redirect to login page or home page
    res.redirect('/');
  });
});

// Register
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;
  const newUser = new User({ username, password, email, phone });

  try {
    await newUser.save();
    const newWallet = new Wallet({ username });
    await newWallet.save();
    res.render('login');
  } catch (err) {
    res.redirect('/register');
  }
});

// Dashboard
router.get('/dashboard', async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }

  const wallet = await Wallet.findOne({ username: req.session.user.username });
  res.render('dashboard', { username: req.session.user.username, balance: wallet.balance });
});

// Add Money
router.post('/add-money', async (req, res) => {
  const { amount, password } = req.body;
  const user = await User.findOne({ username: req.session.user.username });

  if (user && await bcrypt.compare(password, user.password)) {
    const wallet = await Wallet.findOne({ username: req.session.user.username });
    wallet.balance += parseFloat(amount);
    await wallet.save();
    res.redirect('/dashboard');
  } else {
    res.redirect('/dashboard');
  }
});



module.exports = router;
