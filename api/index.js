const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Connection, clusterApiUrl } = require("@solana/web3.js");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log("🚀 [API] Starting DeFiLend API server...");
console.log("🚀 [API] Environment variables:");
console.log("   - PORT:", process.env.PORT || 5000);
console.log(
  "   - MONGODB_URI:",
  process.env.MONGODB_URI || "mongodb://localhost:27017/defilend"
);

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `📥 [API] ${req.method} ${req.path} - ${new Date().toISOString()}`
  );
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📥 [API] Request body:", JSON.stringify(req.body, null, 2));
  }
  next();
});

// MongoDB connection
console.log("🔗 [API] Connecting to MongoDB...");
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/defilend", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ [API] MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("❌ [API] MongoDB connection error:", err.message);
    console.log(
      "⚠️  [API] API will continue running without database connection"
    );
  });

// Health check endpoint
app.get("/health", (req, res) => {
  console.log("🏥 [API] Health check requested");
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Solana RPC test endpoint
app.get("/api/solana/test", async (req, res) => {
  console.log("🔗 [API] Solana RPC test requested");

  try {
    // Test QuickNode RPC endpoint directly with node-fetch
    const response = await fetch(
      "https://frosty-weathered-gas.solana-devnet.quiknode.pro/f845f5a46b74dbdf6a375cdcd40685e683a806d5",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSlot",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ [API] QuickNode RPC test successful - Slot:", data.result);

    res.json({
      success: true,
      network: "QuickNode Devnet",
      slot: data.result,
      rpc: "QuickNode",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ [API] QuickNode RPC test failed:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
      network: "QuickNode Devnet",
      timestamp: new Date().toISOString(),
    });
  }
});

// Routes
app.use("/api/transactions", require("./routes/transactions"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ [API] Error:", err.stack);
  res.status(500).json({
    error: "Something broke!",
    message: err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  console.log("❌ [API] 404 - Route not found:", req.originalUrl);
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ [API] Server running on port ${PORT}`);
  console.log(`✅ [API] Health check: http://localhost:${PORT}/health`);
  console.log(
    `✅ [API] Transactions API: http://localhost:${PORT}/api/transactions`
  );
});
