import Head from 'next/head';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push('/dashboard');
    }
  }, [connected, router]);

  return (
    <>
      <Head>
        <title>DeFiLend - Decentralized Lending Platform</title>
        <meta name="description" content="Supply and borrow SPL tokens on Solana" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-cyan-500 mb-4">
            DeFiLend
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Decentralized Lending & Borrowing on Solana
          </p>
          
          <div className="bg-gray-900 p-8 rounded-lg shadow-2xl">
            <h2 className="text-2xl text-white mb-4">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your Solana wallet to start lending and borrowing
            </p>
            <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 px-6 rounded-lg" />
          </div>
        </div>
      </main>
    </>
  );
}
