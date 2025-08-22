import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import UserPositions from '../components/UserPositions';
import SupplyModal from '../components/SupplyModal';
import BorrowModal from '../components/BorrowModal';
import { testRpcConnection, testWalletConnection } from '../utils/solana';

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [totalSupplied, setTotalSupplied] = useState(0);
  const [totalBorrowed, setTotalBorrowed] = useState(0);
  const [healthFactor, setHealthFactor] = useState('∞');
  const [refreshKey, setRefreshKey] = useState(0);
  const [rpcStatus, setRpcStatus] = useState<string>('Not tested');
  const [walletStatus, setWalletStatus] = useState<string>('Not tested');
  const [backendRpcStatus, setBackendRpcStatus] = useState<string>('Not tested');

  const fetchUserTotals = async () => {
    if (!publicKey) return;

    try {
      console.log("🔍 [Dashboard] Fetching user totals for:", publicKey.toString());
      
      const response = await fetch(
        `http://localhost:5000/api/transactions/${publicKey.toString()}`
      );

      if (response.ok) {
        const transactions = await response.json();
        console.log("✅ [Dashboard] Fetched transactions:", transactions);

        let supplied = 0;
        let borrowed = 0;

        transactions.forEach((tx: any) => {
          if (tx.type === 'supply') {
            supplied += tx.amount;
          } else if (tx.type === 'borrow') {
            borrowed += tx.amount;
          }
        });

        setTotalSupplied(supplied);
        setTotalBorrowed(borrowed);
        
        // Calculate health factor (simplified)
        if (borrowed > 0) {
          const ratio = supplied / borrowed;
          setHealthFactor(ratio > 1.5 ? 'Safe' : ratio > 1.0 ? 'Warning' : 'Danger');
        } else {
          setHealthFactor('∞');
        }

        console.log("✅ [Dashboard] Updated totals - Supplied:", supplied, "Borrowed:", borrowed);
      }
    } catch (error) {
      console.error("❌ [Dashboard] Error fetching totals:", error);
    }
  };

  useEffect(() => {
    fetchUserTotals();
  }, [publicKey, refreshKey]);

  const handleModalClose = () => {
    setShowSupplyModal(false);
    setShowBorrowModal(false);
    // Refresh data after modal closes
    setRefreshKey(prev => prev + 1);
  };

  const handleTestRpc = async () => {
    setRpcStatus('Testing...');
    try {
      const result = await testRpcConnection();
      if (result.success) {
        setRpcStatus(`✅ Connected - Slot: ${result.slot}, Network: ${result.network}`);
      } else {
        setRpcStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setRpcStatus('❌ Test failed');
    }
  };

  const handleTestWallet = async () => {
    if (!publicKey) {
      setWalletStatus('❌ No wallet connected');
      return;
    }
    
    setWalletStatus('Testing...');
    try {
      const result = await testWalletConnection(publicKey.toString());
      if (result.success) {
        setWalletStatus(`✅ Balance: ${result.balance} SOL, Tokens: ${result.tokenAccounts}`);
      } else {
        setWalletStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setWalletStatus('❌ Test failed');
    }
  };

  const handleTestBackendRpc = async () => {
    setBackendRpcStatus('Testing...');
    try {
      const response = await fetch('http://localhost:5000/api/solana/test');
      const result = await response.json();
      
      if (result.success) {
        setBackendRpcStatus(`✅ Slot: ${result.slot}, Network: ${result.network}`);
      } else {
        setBackendRpcStatus(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      setBackendRpcStatus('❌ Test failed');
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard - DeFiLend</title>
        <meta name="description" content="Your DeFiLend dashboard" />
      </Head>

      <div className="min-h-screen bg-black">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cyan-500 mb-2">Dashboard</h1>
            <p className="text-gray-400">
              {connected ? `Connected: ${publicKey?.toString().slice(0, 4)}...${publicKey?.toString().slice(-4)}` : 'Please connect your wallet'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Total Supplied</h3>
              <p className="text-3xl font-bold text-cyan-500">${totalSupplied.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">APY: 8.5%</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Total Borrowed</h3>
              <p className="text-3xl font-bold text-red-500">${totalBorrowed.toFixed(2)}</p>
              <p className="text-sm text-gray-400 mt-1">APR: 12.3%</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Health Factor</h3>
              <p className={`text-3xl font-bold ${
                healthFactor === '∞' ? 'text-green-500' : 
                healthFactor === 'Safe' ? 'text-green-500' : 
                healthFactor === 'Warning' ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {healthFactor}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {healthFactor === '∞' ? 'Safe' : healthFactor}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setShowSupplyModal(true)}
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-lg"
            >
              Supply Assets
            </button>
            <button
              onClick={() => setShowBorrowModal(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Borrow Assets
            </button>
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              🔄 Refresh
            </button>
          </div>

          {/* RPC Testing Section */}
          <div className="bg-gray-900 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">RPC Connection Tests</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <button
                  onClick={handleTestRpc}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg mb-2"
                >
                  🔗 Frontend RPC
                </button>
                <p className="text-sm text-gray-300">{rpcStatus}</p>
              </div>
              <div>
                <button
                  onClick={handleTestBackendRpc}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-2"
                >
                  🔗 Backend RPC
                </button>
                <p className="text-sm text-gray-300">{backendRpcStatus}</p>
              </div>
              <div>
                <button
                  onClick={handleTestWallet}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg mb-2"
                >
                  👛 Wallet Connection
                </button>
                <p className="text-sm text-gray-300">{walletStatus}</p>
              </div>
            </div>
          </div>

          <UserPositions />

          {showSupplyModal && (
            <SupplyModal onClose={handleModalClose} />
          )}
          {showBorrowModal && (
            <BorrowModal onClose={handleModalClose} />
          )}
        </main>
      </div>
    </>
  );
}
