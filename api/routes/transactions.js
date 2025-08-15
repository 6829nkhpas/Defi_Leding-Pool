const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// GET /api/transactions/:userAddress
router.get("/:userAddress", async (req, res) => {
  console.log(
    "📥 [Transactions] GET request for user:",
    req.params.userAddress
  );

  try {
    const { userAddress } = req.params;

    if (!userAddress) {
      console.error("❌ [Transactions] Missing userAddress parameter");
      return res.status(400).json({ error: "User address is required" });
    }

    console.log("🔍 [Transactions] Querying database for user:", userAddress);
    const transactions = await Transaction.find({ userAddress })
      .sort({ timestamp: -1 })
      .limit(50);

    console.log(
      "✅ [Transactions] Found",
      transactions.length,
      "transactions for user:",
      userAddress
    );
    res.json(transactions);
  } catch (error) {
    console.error("❌ [Transactions] Error fetching transactions:", error);
    res.status(500).json({
      error: "Failed to fetch transactions",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// POST /api/transactions
router.post("/", async (req, res) => {
  console.log("📥 [Transactions] POST request received");
  console.log(
    "📥 [Transactions] Request body:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const { userAddress, type, amount, token, txHash } = req.body;

    // Validation
    if (!userAddress) {
      console.error("❌ [Transactions] Missing userAddress");
      return res.status(400).json({ error: "User address is required" });
    }

    if (!type) {
      console.error("❌ [Transactions] Missing type");
      return res.status(400).json({ error: "Transaction type is required" });
    }

    if (!amount || isNaN(amount)) {
      console.error("❌ [Transactions] Invalid amount:", amount);
      return res.status(400).json({ error: "Valid amount is required" });
    }

    if (!token) {
      console.error("❌ [Transactions] Missing token");
      return res.status(400).json({ error: "Token is required" });
    }

    if (!txHash) {
      console.error("❌ [Transactions] Missing txHash");
      return res.status(400).json({ error: "Transaction hash is required" });
    }

    console.log("💾 [Transactions] Creating new transaction record");
    const transaction = new Transaction({
      userAddress,
      type,
      amount,
      token,
      txHash,
      timestamp: new Date(),
    });

    console.log("💾 [Transactions] Saving transaction to database");
    await transaction.save();

    console.log(
      "✅ [Transactions] Transaction saved successfully:",
      transaction._id
    );
    res.status(201).json({
      success: true,
      transaction: transaction,
      message: `${type} transaction recorded successfully`,
    });
  } catch (error) {
    console.error("❌ [Transactions] Error saving transaction:", error);
    res.status(500).json({
      error: "Failed to save transaction",
      message: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
