import { Connection, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, web3, BN } from '@project-serum/anchor';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
// Import IDL from the generated file
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IDL: any = require('../idl/defilend.json');

// TODO: Replace with actual deployed program ID
// For now, use a placeholder that won't crash the app
const PROGRAM_ID = new PublicKey('11111111111111111111111111111111');
const NETWORK = 'https://frosty-weathered-gas.solana-devnet.quiknode.pro/f845f5a46b74dbdf6a375cdcd40685e683a806d5';

export const connection = new Connection(NETWORK, 'confirmed');

// RPC Connection Test Functions
export const testRpcConnection = async () => {
  try {
    console.log('🔗 [RPC] Testing connection to:', NETWORK);
    
    // Test 1: Get slot
    const slot = await connection.getSlot();
    console.log('✅ [RPC] Current slot:', slot);
    
    // Test 2: Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    console.log('✅ [RPC] Latest blockhash:', blockhash);
    
    // Test 3: Get epoch info
    const epochInfo = await connection.getEpochInfo();
    console.log('✅ [RPC] Epoch info:', epochInfo);
    
    return {
      success: true,
      network: NETWORK,
      slot,
      blockhash,
      epochInfo
    };
  } catch (error) {
    console.error('❌ [RPC] Connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      network: NETWORK
    };
  }
};

export const testWalletConnection = async (publicKey: string) => {
  try {
    console.log('🔗 [RPC] Testing wallet connection for:', publicKey);
    
    const pubKey = new PublicKey(publicKey);
    
    // Test 1: Get account info
    const accountInfo = await connection.getAccountInfo(pubKey);
    console.log('✅ [RPC] Account info:', accountInfo ? 'Found' : 'Not found');
    
    // Test 2: Get balance
    const balance = await connection.getBalance(pubKey);
    console.log('✅ [RPC] Balance:', balance / 1e9, 'SOL');
    
    // Test 3: Get token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(pubKey, {
      programId: TOKEN_PROGRAM_ID
    });
    console.log('✅ [RPC] Token accounts:', tokenAccounts.value.length);
    
    return {
      success: true,
      publicKey,
      balance: balance / 1e9,
      tokenAccounts: tokenAccounts.value.length,
      accountInfo: accountInfo ? 'Found' : 'Not found'
    };
  } catch (error) {
    console.error('❌ [RPC] Wallet test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      publicKey
    };
  }
};

export const getProgram = (provider: AnchorProvider) => {
  return new Program(IDL, PROGRAM_ID, provider);
};

export const getLendingPoolPDA = async () => {
  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from('lending_pool')],
    PROGRAM_ID
  );
  return pda;
};

export const getUserDepositPDA = async (userPublicKey: PublicKey) => {
  const [pda] = await PublicKey.findProgramAddress(
    [Buffer.from('user_deposit'), userPublicKey.toBuffer()],
    PROGRAM_ID
  );
  return pda;
};

export const supplyTokens = async (
  program: Program,
  userPublicKey: PublicKey,
  amount: number,
  tokenMint: PublicKey
) => {
  try {
    const lendingPool = await getLendingPoolPDA();
    const userDeposit = await getUserDepositPDA(userPublicKey);

    const tx = await program.methods
      .supply(new BN(amount))
      .accounts({
        lendingPool,
        userDeposit,
        user: userPublicKey,
        tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Error supplying tokens:', error);
    throw error;
  }
};

export const borrowTokens = async (
  program: Program,
  userPublicKey: PublicKey,
  amount: number,
  tokenMint: PublicKey
) => {
  try {
    const lendingPool = await getLendingPoolPDA();
    const userDeposit = await getUserDepositPDA(userPublicKey);

    const tx = await program.methods
      .borrow(new BN(amount))
      .accounts({
        lendingPool,
        userDeposit,
        user: userPublicKey,
        tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Error borrowing tokens:', error);
    throw error;
  }
};

export const repayTokens = async (
  program: Program,
  userPublicKey: PublicKey,
  amount: number,
  tokenMint: PublicKey
) => {
  try {
    const lendingPool = await getLendingPoolPDA();
    const userDeposit = await getUserDepositPDA(userPublicKey);

    const tx = await program.methods
      .repay(new BN(amount))
      .accounts({
        lendingPool,
        userDeposit,
        user: userPublicKey,
        tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Error repaying tokens:', error);
    throw error;
  }
};

export const withdrawTokens = async (
  program: Program,
  userPublicKey: PublicKey,
  amount: number,
  tokenMint: PublicKey
) => {
  try {
    const lendingPool = await getLendingPoolPDA();
    const userDeposit = await getUserDepositPDA(userPublicKey);

    const tx = await program.methods
      .withdraw(new BN(amount))
      .accounts({
        lendingPool,
        userDeposit,
        user: userPublicKey,
        tokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    return tx;
  } catch (error) {
    console.error('Error withdrawing tokens:', error);
    throw error;
  }
};
