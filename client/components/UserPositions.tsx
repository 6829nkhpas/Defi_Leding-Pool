import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

interface Position {
  token: string;
  supplied: number;
  borrowed: number;
  apy: number;
  apr: number;
}

export default function UserPositions() {
  const { publicKey } = useWallet();
  const [positions, setPositions] = useState<Position[]>([]);

  useEffect(() => {
    // Fetch user positions from blockchain
    // This is mock data for now
    setPositions([
      { token: 'USDC', supplied: 1000, borrowed: 0, apy: 8.5, apr: 12.3 },
      { token: 'SOL', supplied: 0, borrowed: 5, apy: 6.2, apr: 9.8 },
    ]);
  }, [publicKey]);

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Your Positions</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400 border-b border-gray-700">
              <th className="pb-3">Token</th>
              <th className="pb-3">Supplied</th>
              <th className="pb-3">Borrowed</th>
              <th className="pb-3">APY</th>
              <th className="pb-3">APR</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position) => (
              <tr key={position.token} className="text-white">
                <td className="py-4">{position.token}</td>
                <td className="py-4 text-green-400">${position.supplied.toLocaleString()}</td>
                <td className="py-4 text-red-400">${position.borrowed.toLocaleString()}</td>
                <td className="py-4 text-cyan-400">{position.apy}%</td>
                <td className="py-4 text-orange-400">{position.apr}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {positions.length === 0 && (
        <p className="text-gray-400 text-center py-8">
          No positions found. Start by supplying or borrowing assets.
        </p>
      )}
    </div>
  );
}
