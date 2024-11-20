import { simulateExchangeRequest, calculateExchangeAmount, checkMinimumSwap } from './exchange.js';
import { updateExchange } from './ui.js';

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(checkKasWareWallet, 1000); // Wait for 1 second
});

function checkKasWareWallet() {
  if (typeof window.kasware !== 'undefined') {
    document.getElementById('status').innerText = "KasWare Wallet Detected!";
    document.getElementById('connectBtn').addEventListener('click', connectWallet);
    setupWalletListeners();
  } else {
    document.getElementById('status').innerText = "Please install KasWare Wallet extension.";
  }
}

function setupWalletListeners() {
  window.kasware.on('accountsChanged', handleAccountsChanged);
  window.kasware.on('networkChanged', handleNetworkChanged);
}

async function connectWallet() {
  try {
    document.getElementById('status').innerText = "Connecting...";
    console.log('Attempting to connect wallet...');
    const accounts = await window.kasware.requestAccounts();
    if (accounts.length > 0) {
      document.getElementById('status').innerText = `Connected with account: ${accounts[0]}`;
      document.getElementById('connectBtn').disabled = true;
      document.getElementById('swapPanel').style.display = 'block';
      console.log(`Successfully connected with account: ${accounts[0]}`);
    } else {
      document.getElementById('status').innerText = "No accounts found.";
      console.log("No accounts found in wallet.");
    }
  } catch (error) {
    document.getElementById('status').innerText = "Failed to connect: " + error.message;
    console.error("Wallet connection error:", error);
  }
}

function swapTokens() {
  const fromToken = document.getElementById('fromToken').value;
  const fromAddress = fromToken === 'SNOWDN' ? SNOWDN_TOKEN_ADDRESS : KSDOG_TOKEN_ADDRESS;
  const amount = Number(document.getElementById('fromAmount').value);

  try {
    checkMinimumSwap(amount, fromToken);
    document.getElementById('status').innerText = "Exchanging...";
    document.getElementById('swapBtn').disabled = true;

    simulateExchangeRequest({
      fromToken: fromAddress,
      toToken: fromToken === 'SNOWDN' ? KSDOG_TOKEN_ADDRESS : SNOWDN_TOKEN_ADDRESS,
      amount: amount,
      walletAddress: EXCHANGE_WALLET_ADDRESS,
    })
    .then(data => {
      document.getElementById('status').innerText = "Exchange Successful";
      document.getElementById('swapResult').innerText = `Transaction ID: ${data.txid}`;
      console.log("Exchange successful. TXID:", data.txid);
    })
    .catch(error => {
      document.getElementById('status').innerText = "Exchange Failed";
      document.getElementById('swapResult').innerText = `Error: ${error.message}`;
      console.error("Exchange failed with error:", error.message);
    })
    .finally(() => {
      document.getElementById('swapBtn').disabled = false;
    });
  } catch (error) {
    document.getElementById('status').innerText = "Swap Preparation Failed";
    document.getElementById('swapResult').innerText = `Error: ${error.message}`;
    console.error("Swap preparation error:", error.message);
  }
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Wallet disconnected. No account connected.");
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('status').innerText = "No account connected.";
  } else {
    document.getElementById('status').innerText = `Account changed to: ${accounts[0]}`;
    console.log("Wallet account changed to:", accounts[0]);
  }
}

function handleNetworkChanged(network) {
  console.log("Network changed to:", network);
  document.getElementById('status').innerText = `Network changed to: ${network}`;
}
