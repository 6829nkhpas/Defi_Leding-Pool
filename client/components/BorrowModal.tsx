import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface BorrowModalProps {
  onClose: () => void;
}

export default function BorrowModal({ onClose }: BorrowModalProps) {
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("USDC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBorrow = async () => {
    console.log("🔴 [BorrowModal] handleBorrow called");
    console.log("🔴 [BorrowModal] Wallet connected:", connected);
    console.log("🔴 [BorrowModal] Public key:", publicKey?.toString());
    console.log("🔴 [BorrowModal] Amount:", amount);
    console.log("🔴 [BorrowModal] Token:", token);

    if (!connected || !publicKey) {
      setError("Wallet not connected");
      console.error("❌ [BorrowModal] Wallet not connected");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      console.error("❌ [BorrowModal] Invalid amount:", amount);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Mock API call for now
      console.log("🔴 [BorrowModal] Making API call to record transaction");

      const response = await fetch("http://localhost:5000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: publicKey.toString(),
          type: "borrow",
          amount: parseFloat(amount),
          token: token,
          txHash: "mock-tx-hash-" + Date.now(),
        }),
      });

      console.log("🔴 [BorrowModal] API response status:", response.status);

      if (response.ok) {
        const result = await response.json();
        console.log("✅ [BorrowModal] Transaction recorded:", result);
        alert(`Successfully borrowed ${amount} ${token}`);
      } else {
        const errorData = await response.text();
        console.error("❌ [BorrowModal] API error:", errorData);
        setError("Failed to record transaction");
      }
    } catch (err) {
      console.error("❌ [BorrowModal] Error:", err);
      setError("Network error occurred");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Borrow Assets</h2>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Token</label>
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white rounded-lg"
          >
            <option value="USDC">USDC</option>
            <option value="SOL">SOL</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full p-3 bg-gray-800 text-white rounded-lg"
          />
        </div>

        <div className="mb-4 p-4 bg-yellow-900 bg-opacity-50 rounded-lg">
          <p className="text-yellow-200 text-sm">
            <strong>Warning:</strong> Borrowing requires sufficient collateral.
            Ensure your health factor stays above 1.0 to avoid liquidation.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 rounded-lg">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleBorrow}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? "Processing..." : "Borrow"}
          </button>
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
