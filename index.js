import { simulateExchangeRequest, calculateExchangeAmount, checkMinimumSwap } from './exchange.js';
import { updateExchange } from './ui.js';

// Assuming this function is provided by the KasWare extension
function connectWallet() {
  window.kasware.requestAccounts()
    .then(accounts => {
      if (accounts.length > 0) {
        document.getElementById('status').innerText = `Connected with account: ${accounts[0]}`;
        document.getElementById('swapPanel').style.display = 'block';
      } else {
        document.getElementById('status').innerText = "No accounts found.";
      }
    })
    .catch(error => {
      document.getElementById('status').innerText = "Failed to connect: " + error.message;
      console.error("Connection error:", error);
    });
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
    })
    .catch(error => {
      document.getElementById('status').innerText = "Exchange Failed";
      document.getElementById('swapResult').innerText = `Error: ${error.message}`;
      console.error("Exchange error:", error);
    })
    .finally(() => {
      document.getElementById('swapBtn').disabled = false;
    });
  } catch (error) {
    document.getElementById('status').innerText = "Swap Preparation Failed";
    document.getElementById('swapResult').innerText = `Error: ${error.message}`;
  }
}

document.getElementById('connectBtn').addEventListener('click', connectWallet);
