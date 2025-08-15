const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userAddress: { type: String, required: true },
  type: { type: String, required: true }, // e.g., 'supply', 'borrow', 'repay', 'withdraw'
  amount: { type: Number, required: true },
  token: { type: String, required: true },
  txHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);
