const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  balance: { type: Number, default: 0 }
});

module.exports = mongoose.model('Wallet', WalletSchema);
