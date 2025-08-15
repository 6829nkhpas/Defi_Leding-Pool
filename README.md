# DeFiLend - Decentralized Lending & Borrowing Platform

A complete decentralized lending and borrowing application (dApp) built on Solana, allowing users to supply SPL tokens to earn interest and borrow against their collateral.

## 🚀 Features

- **Supply Assets**: Deposit SPL tokens (USDC, SOL) to earn interest
- **Borrow Assets**: Borrow tokens against your supplied collateral
- **Health Monitoring**: Real-time health factor tracking to prevent liquidation
- **Wallet Integration**: Support for Phantom, Solflare, and other Solana wallets
- **Transaction History**: Complete transaction tracking and history
- **Responsive Design**: Mobile-friendly interface with black and cyan theme

## 🛠️ Technology Stack

### Blockchain
- **Solana**: High-performance blockchain for DeFi applications
- **Anchor Framework**: Rust framework for Solana program development
- **SPL Tokens**: Solana Program Library tokens (USDC, SOL)

### Frontend
- **Next.js 14**: React framework with TypeScript
- **Tailwind CSS**: Utility-first CSS framework
- **Solana Wallet Adapter**: Multi-wallet support
- **Solana Web3.js**: JavaScript SDK for Solana

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database for transaction history
- **Docker**: Containerization

## 📁 Project Structure

```
DeFiLend/
├── program/                 # Solana program (Rust/Anchor)
│   └── lib.rs              # Main program logic
├── client/                  # Next.js frontend
│   ├── pages/              # Next.js pages
│   ├── components/         # React components
│   ├── utils/              # Solana utilities
│   └── styles/             # Global styles
├── api/                    # Node.js backend
│   ├── routes/             # API routes
│   ├── models/             # MongoDB models
│   └── index.js            # Server entry point
├── docker-compose.yml      # Docker orchestration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Solana CLI
- Rust & Cargo
- Anchor CLI

### 1. Setup Environment

```bash
# Copy environment variables
cp .env.example .env

# Update .env with your values
# - PROGRAM_ID: Your deployed program ID
# - MONGODB_URI: MongoDB connection string
```

### 2. Install Dependencies

```bash
# Install client dependencies
cd client && npm install

# Install API dependencies
cd ../api && npm install

# Install program dependencies (if developing)
cd ../program && anchor build
```

### 3. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Services will be available at:
# - Frontend: http://localhost:3000
# - API: http://localhost:5000
# - MongoDB: localhost:27017
```

### 4. Manual Development Setup

```bash
# Start MongoDB
docker run -d -p 27017:27017 --name mongo mongo:7.0

# Start API
cd api && npm run dev

# Start client
cd client && npm run dev
```

## 🔧 Development

### Deploying the Program

```bash
cd program
anchor build
anchor deploy --provider.cluster devnet
# Update PROGRAM_ID in .env with the deployed program ID
```

### Adding New Tokens

1. Update token configurations in `client/utils/tokens.ts`
2. Add token mint addresses for devnet/mainnet
3. Update UI components to support new tokens

### Customizing the Theme

The application uses a black and cyan color scheme. To customize:

- Primary color: `cyan-500` (#00BFFF)
- Background: `bg-black`
- Cards: `bg-gray-900`
- Text: `text-white` / `text-gray-300`

## 📊 API Endpoints

- `GET /api/transactions/:userAddress` - Get user transaction history
- `POST /api/transactions` - Record new transaction

## 🔐 Security Considerations

- Always verify transaction signatures
- Implement proper input validation
- Use environment variables for sensitive data
- Regular security audits of smart contracts
- Monitor for unusual activity patterns

## 🐛 Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Ensure wallet is installed and unlocked
   - Check network settings (should be Devnet)
   - Refresh the page and try again

2. **Transaction Failed**
   - Check account balance for fees
   - Verify token account exists
   - Ensure sufficient collateral for borrowing

3. **Docker Issues**
   - Run `docker-compose down` then `docker-compose up -d`
   - Check port availability (3000, 5000, 27017)
   - Clear Docker cache: `docker system prune -a`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, please open an issue on GitHub or contact the development team.
