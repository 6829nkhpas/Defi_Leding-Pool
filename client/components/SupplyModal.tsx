import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SupplyModalProps {
  onClose: () => void;
}

export default function SupplyModal({ onClose }: SupplyModalProps) {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');

  const handleSupply = async () => {
    // Implement supply logic here
    console.log('Supplying', amount, token);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-white mb-4">Supply Assets</h2>
        
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

        <div className="flex gap-4">
          <button
            onClick={handleSupply}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg"
          >
            Supply
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
