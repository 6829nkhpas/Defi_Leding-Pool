import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SupplyModalProps {
  onClose: () => void;
}

export default function SupplyModal({ onClose }: SupplyModalProps) {
  const { publicKey, connected } = useWallet();
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState('USDC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSupply = async () => {
    console.log('🔵 [SupplyModal] handleSupply called');
    console.log('🔵 [SupplyModal] Wallet connected:', connected);
    console.log('🔵 [SupplyModal] Public key:', publicKey?.toString());
    console.log('🔵 [SupplyModal] Amount:', amount);
    console.log('🔵 [SupplyModal] Token:', token);

    if (!connected || !publicKey) {
      setError('Wallet not connected');
      console.error('❌ [SupplyModal] Wallet not connected');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      console.error('❌ [SupplyModal] Invalid amount:', amount);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Mock API call for now
      console.log('🔵 [SupplyModal] Making API call to record transaction');
      
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: publicKey.toString(),
          type: 'supply',
          amount: parseFloat(amount),
          token: token,
          txHash: 'mock-tx-hash-' + Date.now()
        })
      });

      console.log('🔵 [SupplyModal] API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ [SupplyModal] Transaction recorded:', result);
        alert(`Successfully supplied ${amount} ${token}`);
      } else {
        const errorData = await response.text();
        console.error('❌ [SupplyModal] API error:', errorData);
        setError('Failed to record transaction');
      }
    } catch (err) {
      console.error('❌ [SupplyModal] Error:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
      onClose();
    }
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
