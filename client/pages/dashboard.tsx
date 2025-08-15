import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import UserPositions from '../components/UserPositions';
import SupplyModal from '../components/SupplyModal';
import BorrowModal from '../components/BorrowModal';

export default function Dashboard() {
  const { connected, publicKey } = useWallet();
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

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
              <p className="text-3xl font-bold text-cyan-500">$0.00</p>
              <p className="text-sm text-gray-400 mt-1">APY: 8.5%</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Total Borrowed</h3>
              <p className="text-3xl font-bold text-red-500">$0.00</p>
              <p className="text-sm text-gray-400 mt-1">APR: 12.3%</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Health Factor</h3>
              <p className="text-3xl font-bold text-green-500">∞</p>
              <p className="text-sm text-gray-400 mt-1">Safe</p>
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
          </div>

          <UserPositions />

          {showSupplyModal && (
            <SupplyModal onClose={() => setShowSupplyModal(false)} />
          )}
          {showBorrowModal && (
            <BorrowModal onClose={() => setShowBorrowModal(false)} />
          )}
        </main>
      </div>
    </>
  );
}
