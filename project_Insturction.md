You are an expert full-stack blockchain developer. Your task is to build a complete decentralized lending and borrowing application (dApp) from scratch.

Project Title: "DeFiLend" - A Solana-based Lending & Borrowing Platform

Core Objective: Create a full-stack dApp where users can supply SPL tokens (like USDC) to a lending pool to earn interest and borrow other SPL tokens against their supplied collateral.

Technology Stack:

Blockchain: Solana (using the Devnet for development)

Smart Contract (On-chain Program): Rust with the Anchor framework

Frontend: Next.js with TypeScript and Tailwind CSS

Web3/Wallet Integration: Solana Web3.js (@solana/web3.js) and @solana/wallet-adapter for wallet connections (Phantom, Solflare).

Backend API (Optional but Recommended): Node.js with Express.js for caching on-chain data and managing user metadata.

Database: MongoDB for storing historical transaction data and user-specific off-chain information.

Containerization: Docker and Docker Compose to orchestrate all services.

Architectural Breakdown & File Structure
1. On-Chain Program (Rust/Anchor - /program)

Create an Anchor project with the following structure and logic:

lib.rs: The main program file.

State (#[account]):

LendingPool: Stores the total supplied assets, total borrowed assets, and configuration for the interest rate model.

UserDeposit: Stores information about a user's deposit, including the amount and the token type.

Instructions (#[program]):

initialize_pool(ctx): Initializes the lending pool account.

supply(ctx, amount): Allows a user to deposit SPL tokens into the pool. This will transfer tokens from the user to a Program Derived Address (PDA) vault and update their UserDeposit account.

borrow(ctx, amount): Allows a user to borrow tokens, provided they have sufficient collateral. This will perform a health check on their collateral ratio before transferring tokens from the PDA vault to the user.

repay(ctx, amount): Allows a user to repay their borrowed amount. This transfers tokens from the user back to the PDA vault.

withdraw(ctx, amount): Allows a user to withdraw their supplied collateral, as long as it doesn't leave their loan undercollateralized.

2. Frontend (Next.js - /client)

/pages:

index.tsx: The main landing page with a "Connect Wallet" button and a summary of the lending pool stats.

dashboard.tsx: The main user interface after connecting the wallet.

/components:

Navbar.tsx: Contains the app logo and the WalletMultiButton from the wallet-adapter library.

SupplyModal.tsx: A modal form for users to input the amount they want to supply.

BorrowModal.tsx: A modal form for users to input the amount they want to borrow.

UserPositions.tsx: A component on the dashboard that displays the user's current supplied assets, borrowed assets, and health factor.

/contexts:

WalletContextProvider.tsx: Wraps the application to provide wallet state globally.

/utils:

solana.ts: Contains helper functions to interact with our on-chain program using the Anchor client.

3. Backend API (Node.js/Express - /api)

/routes:

transactions.js: An endpoint like GET /api/history/:userAddress to fetch and return a user's transaction history from MongoDB.

/services:

solanaListener.js: A service that listens to on-chain events from our program (e.g., SupplyEvent, BorrowEvent) and saves formatted data into MongoDB.

/models:

Transaction.js: Mongoose schema for storing transaction details (type, amount, user, timestamp).

4. Docker Setup (/)

docker-compose.yml: Defines three services: client (Next.js), api (Node.js), and mongo (MongoDB). It should orchestrate the networking between them.

client/Dockerfile: A multi-stage build for the Next.js application.

api/Dockerfile: To build the Node.js Express server.

Key Features (User Stories)
Wallet Connection: As a user, I want to connect my Solana wallet (Phantom/Solflare) to the dApp so I can interact with it.

Supply Assets: As a user, I want to supply my SPL tokens (e.g., Devnet USDC) to the lending pool to start earning interest. The UI should show me my current supply balance.

Borrow Assets: As a user, I want to borrow SPL tokens against my supplied collateral. The UI must show me my borrowing limit and my "health factor" to avoid liquidation.

Repay Loan: As a user, I want to repay my loan to free up my collateral and stop accruing interest.

Withdraw Assets: As a user, I want to withdraw my supplied assets from the pool.

View Dashboard: As a user, I want to see a clear dashboard with my net APY, supplied amount, borrowed amount, and overall position health.

Please generate the code step-by-step, starting with the Anchor program, then the frontend, the backend API, and finally the Docker configuration. Explain each part as you build it.
