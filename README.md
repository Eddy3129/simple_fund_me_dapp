# FundMe DApp - Complete Project

A full-stack decentralized crowdfunding application built with Solidity smart contracts and a modern web frontend. This project demonstrates the complete development cycle of a DApp, from smart contract development with Foundry to frontend integration with Ethers.js.

*Built following the Cyfrin Solidity Course principles*

## 📋 Table of Contents

- [About](#about)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Quick Setup](#quick-setup)
- [Smart Contract](#smart-contract)
  - [Deploy Contract](#deploy-contract)
  - [Testing](#testing)
  - [Contract Verification](#contract-verification)
- [Frontend Application](#frontend-application)
  - [Setup Frontend](#setup-frontend)
  - [Configuration](#configuration)
  - [Running the DApp](#running-the-dapp)
- [Usage Guide](#usage-guide)
- [Deployment](#deployment)
- [Technologies Used](#technologies-used)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## About

FundMe DApp is a decentralized crowdfunding platform that allows users to:

- **Fund Projects**: Send ETH donations with USD-denominated minimum thresholds
- **Real-time Pricing**: Uses Chainlink price feeds for accurate ETH/USD conversion
- **Owner Management**: Contract owner can withdraw accumulated funds
- **Transparent Tracking**: All transactions are recorded on-chain with full transparency
- **Modern UI**: Clean, responsive web interface for seamless user interaction

The project consists of two main components:
1. **Smart Contract** (`foundry-fund-me-cu/`) - Solidity contracts built with Foundry
2. **Frontend** (`fund-me-frontend/`) - Web interface built with vanilla HTML/CSS/JavaScript and Ethers.js

## Project Structure

```
FundMe-DApp/
├── foundry-fund-me-cu/          # Smart contract development
│   ├── src/
│   │   ├── FundMe.sol           # Main funding contract
│   │   └── PriceConverter.sol   # Chainlink price feed integration
│   ├── script/
│   │   ├── DeployFundMe.s.sol   # Deployment scripts
│   │   └── Interactions.s.sol   # Contract interaction scripts
│   ├── test/                    # Comprehensive test suite
│   └── lib/                     # Dependencies (Chainlink, Forge-std)
└── fund-me-frontend/            # Web application
    ├── index.html               # Main application interface
    ├── index.js                 # Frontend logic and Web3 integration
    ├── constants.js             # Contract addresses and ABI
    └── ethers-6.7.esm.min.js   # Ethers.js library
```

## Features

### Smart Contract Features
- ✅ **Minimum USD Funding**: Enforces $5 minimum donation using Chainlink price feeds
- ✅ **Owner-only Withdrawals**: Secure fund management with access control
- ✅ **Funder Tracking**: Maintains records of all contributors
- ✅ **Gas Optimization**: Efficient storage patterns and function modifiers
- ✅ **Comprehensive Testing**: Unit, integration, and forked network tests

### Frontend Features
- ✅ **MetaMask Integration**: Seamless wallet connection and transaction signing
- ✅ **Real-time Feedback**: Live transaction status and error handling
- ✅ **Etherscan Links**: Direct links to view transactions on blockchain explorer
- ✅ **Balance Display**: Real-time contract balance updates
- ✅ **Responsive Design**: Mobile-friendly interface with modern styling
- ✅ **Network Detection**: Automatic network validation and switching prompts

## Getting Started

### Requirements

**For Smart Contract Development:**
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [Foundry](https://getfoundry.sh/) - `forge --version` should return version info
- [Node.js & npm](https://nodejs.org/) (for additional tooling)

**For Frontend Development:**
- Modern web browser with MetaMask extension
- Local web server (Python, Node.js, or any HTTP server)

### Quick Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd FundMe-DApp
```

2. **Setup smart contracts:**
```bash
cd foundry-fund-me-cu
make install
forge build
```

3. **Run tests:**
```bash
forge test
```

4. **Setup frontend:**
```bash
cd ../fund-me-frontend
# Serve the files using any HTTP server
python -m http.server 8000
# or
npx serve .
```

## Smart Contract

### Deploy Contract

**Local Development:**
```bash
cd foundry-fund-me-cu
forge script script/DeployFundMe.s.sol
```

**Testnet Deployment (Sepolia):**
```bash
# Set environment variables
export SEPOLIA_RPC_URL="your_rpc_url"
export PRIVATE_KEY="your_private_key"
export ETHERSCAN_API_KEY="your_etherscan_key"

# Deploy and verify
forge script script/DeployFundMe.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
```

### Testing

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testFunctionName

# Run with fork testing
forge test --fork-url $SEPOLIA_RPC_URL

# Coverage report
forge coverage
```

### Contract Verification

Contracts are automatically verified on Etherscan during deployment when using the `--verify` flag.

## Frontend Application

### Setup Frontend

1. **Update contract configuration:**
   - Edit `constants.js` with your deployed contract address
   - Ensure the ABI matches your deployed contract

2. **Serve the application:**
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Configuration

**Update `constants.js`:**
```javascript
export const contractAddress = "0xYourContractAddress";
export const abi = [ /* Your contract ABI */ ];
```

### Running the DApp

1. Start your local server
2. Open `http://localhost:8000` in your browser
3. Connect MetaMask wallet
4. Ensure you're on the correct network (Sepolia for testnet)
5. Start funding and interacting with the contract!

## Usage Guide

### For Users:
1. **Connect Wallet**: Click "Connect MetaMask" to link your wallet
2. **Fund Project**: Enter ETH amount (minimum $5 USD equivalent) and click "Fund"
3. **Check Balance**: View current contract balance
4. **View Transactions**: Click Etherscan links to see transaction details

### For Contract Owner:
1. **Withdraw Funds**: Use the "Withdraw" button (only available to contract owner)
2. **Monitor Activity**: Track all funding activities through the interface

### Using Scripts:
```bash
# Fund the contract
forge script script/Interactions.s.sol:FundFundMe --rpc-url sepolia --private-key $PRIVATE_KEY --broadcast

# Withdraw funds (owner only)
forge script script/Interactions.s.sol:WithdrawFundMe --rpc-url sepolia --private-key $PRIVATE_KEY --broadcast
```

## Deployment

### Testnet Deployment (Recommended for Testing)

1. **Get testnet ETH**: Visit [faucets.chain.link](https://faucets.chain.link/)
2. **Deploy contract**: Use the deployment commands above
3. **Update frontend**: Configure `constants.js` with new contract address
4. **Test thoroughly**: Verify all functionality before mainnet deployment

### Mainnet Deployment

⚠️ **Warning**: Mainnet deployment involves real funds. Test extensively on testnets first.

1. **Security audit**: Consider professional smart contract audit
2. **Deploy with verification**: Use verified deployment scripts
3. **Monitor closely**: Watch for any issues post-deployment

## Technologies Used

### Smart Contract Stack
- **Solidity** - Smart contract programming language
- **Foundry** - Development framework and testing suite
- **Chainlink** - Decentralized price feeds for ETH/USD conversion
- **OpenZeppelin** - Security-focused contract libraries

### Frontend Stack
- **HTML5/CSS3** - Modern web standards
- **JavaScript (ES6+)** - Frontend logic and Web3 integration
- **Ethers.js v6** - Ethereum library for blockchain interaction
- **Lekton Font** - Clean, monospace typography

### Development Tools
- **Git** - Version control
- **MetaMask** - Wallet integration and testing
- **Etherscan** - Blockchain explorer integration
- **VS Code** - Recommended development environment

## Security Considerations

### Smart Contract Security
- ✅ **Access Control**: Owner-only functions properly protected
- ✅ **Input Validation**: All user inputs validated
- ✅ **Reentrancy Protection**: Safe external calls
- ✅ **Integer Overflow**: Using Solidity 0.8+ built-in protection
- ✅ **Price Feed Security**: Chainlink oracle integration

### Frontend Security
- ✅ **Input Sanitization**: All user inputs properly validated
- ✅ **Secure Communication**: HTTPS recommended for production
- ✅ **Private Key Safety**: Never expose private keys in frontend code
- ✅ **Network Validation**: Automatic network checking

### Best Practices
- 🔒 **Never commit private keys** to version control
- 🔒 **Use environment variables** for sensitive configuration
- 🔒 **Test on testnets** before mainnet deployment
- 🔒 **Keep dependencies updated** for security patches
- 🔒 **Use hardware wallets** for mainnet deployments

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Cyfrin/Patrick Collins** - Educational foundation and best practices
- **Chainlink** - Reliable price feed infrastructure
- **OpenZeppelin** - Security-focused smart contract libraries
- **Foundry Team** - Excellent development tooling

---

**⚠️ Disclaimer**: This is an educational project. Use at your own risk and conduct thorough testing before any mainnet deployment.

**🚀 Happy Building!** If you found this project helpful, please consider giving it a star ⭐