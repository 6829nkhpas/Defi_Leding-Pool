import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface BorrowModalProps {
  onClose: () => void;
}

export default function BorrowModal({ onClose }: BorrowModalProps) {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');

  const handleBorrow = async () => {
    // Implement borrow logic here
    console.log('Borrowing', amount, token);
    onClose();
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
            <strong>Warning:</strong> Borrowing requires sufficient collateral. Ensure your health factor stays above 1.0 to avoid liquidation.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleBorrow}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg"
          >
            Borrow
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
