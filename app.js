const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const User = require('./models/User')
const Wallet = require('./models/Wallet')
const app = express();

const dbURI = 'mongodb+srv://Bitbox-admin:Bitbox-admin@cluster0.gpzogeq.mongodb.net/Color-Trading?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/', require('./routes/auth'));


app.post('/play-game', async (req, res) => {
  const username = 'Yash'; // Replace with session data in real implementation
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
