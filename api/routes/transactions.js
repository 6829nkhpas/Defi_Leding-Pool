const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

// GET /api/transactions/:userAddress
router.get('/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    const transactions = await Transaction.find({ userAddress })
      .sort({ timestamp: -1 })
      .limit(50);
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { userAddress, type, amount, token, txHash } = req.body;
    
    const transaction = new Transaction({
      userAddress,
      type,
      amount,
      token,
      txHash,
      timestamp: new Date()
    });
    
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error saving transaction:', error);
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});

module.exports = router;
