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
app.use('/payment',require('./routes/payment'))
app.use('/play-game',require('./routes/playgame'))



// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
