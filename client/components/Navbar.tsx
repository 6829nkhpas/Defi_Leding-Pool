import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-cyan-500">DeFiLend</h1>
          </div>
          <WalletMultiButton className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold" />
        </div>
      </div>
    </nav>
  );
}
