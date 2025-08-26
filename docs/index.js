import { ethers } from "./ethers-6.7.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")

// Status message elements
const walletStatus = document.getElementById("walletStatus")
const fundStatus = document.getElementById("fundStatus")
const balanceStatus = document.getElementById("balanceStatus")
const withdrawStatus = document.getElementById("withdrawStatus")
const balanceDisplay = document.getElementById("balanceDisplay")
const balanceAmount = document.getElementById("balanceAmount")

// Contract info elements
const contractAddressElement = document.getElementById("contractAddress")
const copyAddressButton = document.getElementById("copyAddressButton")
const networkBadge = document.getElementById("networkBadge")
const etherscanContractLink = document.getElementById("etherscanContractLink")

// Network configuration
const NETWORKS = {
  1: { name: "Ethereum Mainnet", etherscan: "https://etherscan.io" },
  11155111: { name: "Sepolia Testnet", etherscan: "https://sepolia.etherscan.io" },
  31337: { name: "Anvil Local", etherscan: null }
}

let currentNetwork = null

connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance
copyAddressButton.onclick = copyContractAddress

// Initialize the app
window.addEventListener('load', initializeApp)

// Initialize app on load
async function initializeApp() {
  // Display contract address
  contractAddressElement.textContent = contractAddress
  
  // Set up Etherscan contract link
  if (typeof window.ethereum !== "undefined") {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      currentNetwork = Number(network.chainId)
      updateNetworkInfo(currentNetwork)
    } catch (error) {
      console.log("Could not detect network:", error)
      // Default to Sepolia
      currentNetwork = 11155111
      updateNetworkInfo(currentNetwork)
    }
  } else {
    // Default to Sepolia if no wallet
    currentNetwork = 11155111
    updateNetworkInfo(currentNetwork)
  }
}

// Update network information display
function updateNetworkInfo(chainId) {
  const network = NETWORKS[chainId] || { name: "Unknown Network", etherscan: null }
  networkBadge.textContent = network.name
  
  if (network.etherscan) {
    etherscanContractLink.href = `${network.etherscan}/address/${contractAddress}`
    etherscanContractLink.style.display = 'inline-flex'
  } else {
    etherscanContractLink.style.display = 'none'
  }
}

// Copy contract address to clipboard
async function copyContractAddress() {
  try {
    await navigator.clipboard.writeText(contractAddress)
    copyAddressButton.textContent = 'Copied!'
    copyAddressButton.style.background = '#28a745'
    setTimeout(() => {
      copyAddressButton.textContent = 'Copy'
      copyAddressButton.style.background = '#6c757d'
    }, 2000)
  } catch (error) {
    console.log('Failed to copy:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = contractAddress
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    copyAddressButton.textContent = 'Copied!'
    setTimeout(() => {
      copyAddressButton.textContent = 'Copy'
    }, 2000)
  }
}

// Generate Etherscan transaction link
function getEtherscanTxLink(txHash) {
  const network = NETWORKS[currentNetwork]
  if (network && network.etherscan) {
    return `${network.etherscan}/tx/${txHash}`
  }
  return null
}

// Utility functions for status messages
function showStatus(element, message, type = 'loading') {
  element.className = `status-message status-${type}`
  element.style.display = 'block'
  
  if (type === 'loading') {
    element.innerHTML = `<div class="loading-spinner"></div>${message}`
  } else {
    element.innerHTML = message
  }
}

function hideStatus(element) {
  element.style.display = 'none'
}

function showSuccess(element, message) {
  showStatus(element, message, 'success')
  setTimeout(() => hideStatus(element), 8000)
}

function showSuccessWithTx(element, message, txHash) {
  const etherscanLink = getEtherscanTxLink(txHash)
  let fullMessage = message
  
  if (etherscanLink) {
    fullMessage += `<br><a href="${etherscanLink}" target="_blank" class="etherscan-link">🔗 View on Etherscan</a>`
  }
  
  showStatus(element, fullMessage, 'success')
  setTimeout(() => hideStatus(element), 10000)
}

function showError(element, message) {
  showStatus(element, message, 'error')
  setTimeout(() => hideStatus(element), 8000)
}

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      showStatus(walletStatus, "Connecting to MetaMask...")
      await ethereum.request({ method: "eth_requestAccounts" })
      
      const accounts = await ethereum.request({ method: "eth_accounts" })
      if (accounts.length > 0) {
        connectButton.innerHTML = "Connected"
        connectButton.classList.add("connected")
        
        // Update network info after connection
        try {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const network = await provider.getNetwork()
          currentNetwork = Number(network.chainId)
          updateNetworkInfo(currentNetwork)
        } catch (error) {
          console.log("Could not update network info:", error)
        }
        
        showSuccess(walletStatus, `Connected to ${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`)
        console.log("Connected accounts:", accounts)
      }
    } catch (error) {
      console.log(error)
      if (error.code === 4001) {
        showError(walletStatus, "Connection rejected by user")
      } else {
        showError(walletStatus, "Failed to connect to MetaMask")
      }
    }
  } else {
    showError(walletStatus, "Please install MetaMask to use this DApp")
    connectButton.innerHTML = "Install MetaMask"
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") {
    try {
      showStatus(withdrawStatus, "Preparing withdrawal...")
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      
      showStatus(withdrawStatus, "Sending withdrawal transaction...")
      const transactionResponse = await contract.withdraw()
      
      showStatus(withdrawStatus, "Waiting for transaction confirmation...")
      const receipt = await transactionResponse.wait(1)
      
      console.log("Withdrawal successful!", receipt)
      showSuccessWithTx(withdrawStatus, `Withdrawal successful! Transaction: ${receipt.hash.substring(0, 10)}...`, receipt.hash)
      
      // Refresh balance after successful withdrawal
      setTimeout(() => getBalance(), 2000)
      
    } catch (error) {
      console.log(error)
      if (error.code === 'CALL_EXCEPTION') {
        showError(withdrawStatus, "Only the contract owner can withdraw funds")
      } else if (error.code === 4001) {
        showError(withdrawStatus, "Transaction rejected by user")
      } else if (error.message.includes('insufficient funds')) {
        showError(withdrawStatus, "Insufficient funds for gas fees")
      } else {
        showError(withdrawStatus, `Withdrawal failed: ${error.message || 'Unknown error'}`)
      }
    }
  } else {
    showError(withdrawStatus, "Please install MetaMask to withdraw")
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  
  // Validate input
  if (!ethAmount || parseFloat(ethAmount) <= 0) {
    showError(fundStatus, "Please enter a valid ETH amount greater than 0")
    return
  }
  
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    try {
      showStatus(fundStatus, "Preparing funding transaction...")
      const provider = new ethers.BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      
      // Check user balance
      const userBalance = await provider.getBalance(await signer.getAddress())
      const requiredAmount = ethers.parseEther(ethAmount)
      
      if (userBalance < requiredAmount) {
        showError(fundStatus, "Insufficient ETH balance in your wallet")
        return
      }
      
      showStatus(fundStatus, `Sending ${ethAmount} ETH to fund the project...`)
      const transactionResponse = await contract.fund({
        value: requiredAmount,
      })
      
      showStatus(fundStatus, "Waiting for transaction confirmation...")
      const receipt = await transactionResponse.wait(1)
      
      console.log("Funding successful!", receipt)
      showSuccessWithTx(fundStatus, `Successfully funded ${ethAmount} ETH! Transaction: ${receipt.hash.substring(0, 10)}...`, receipt.hash)
      
      // Clear input and refresh balance
      document.getElementById("ethAmount").value = ""
      setTimeout(() => getBalance(), 2000)
      
    } catch (error) {
      console.log(error)
      if (error.code === 4001) {
        showError(fundStatus, "Transaction rejected by user")
      } else if (error.message.includes('insufficient funds')) {
        showError(fundStatus, "Insufficient funds for gas fees")
      } else if (error.message.includes('execution reverted')) {
        showError(fundStatus, "Transaction failed: Contract requirements not met")
      } else {
        showError(fundStatus, `Funding failed: ${error.message || 'Unknown error'}`)
      }
    }
  } else {
    showError(fundStatus, "Please install MetaMask to fund the project")
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    try {
      showStatus(balanceStatus, "Fetching contract balance...")
      const provider = new ethers.BrowserProvider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      const balanceInEth = ethers.formatEther(balance)
      
      console.log(`Contract balance: ${balanceInEth} ETH`)
      
      // Update balance display
      balanceAmount.textContent = parseFloat(balanceInEth).toFixed(4)
      balanceDisplay.style.display = 'block'
      
      hideStatus(balanceStatus)
      showSuccess(balanceStatus, "Balance updated successfully")
      
    } catch (error) {
      console.log(error)
      showError(balanceStatus, `Failed to fetch balance: ${error.message || 'Unknown error'}`)
      balanceDisplay.style.display = 'none'
    }
  } else {
    showError(balanceStatus, "Please install MetaMask to check balance")
  }
}
