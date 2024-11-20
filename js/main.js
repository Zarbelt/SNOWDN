document.addEventListener('DOMContentLoaded', () => {
  checkKasWareWallet();
});

function checkKasWareWallet() {
  if (typeof window.kasware !== 'undefined') {
    document.getElementById('status').innerText = "KasWare Wallet Detected!";
    document.getElementById('connectBtn').disabled = false;
    setupEventListeners();
  } else {
    document.getElementById('status').innerText = "Please install KasWare Wallet extension.";
  }
}

function setupEventListeners() {
  window.kasware.on('accountsChanged', handleAccountsChanged);
  window.kasware.on('networkChanged', handleNetworkChanged);
}

function connectWallet() {
  document.getElementById('status').innerText = "Connecting...";
  window.kasware.requestAccounts()
    .then(accounts => {
      if (accounts.length > 0) {
        document.getElementById('status').innerText = `Connected with account: ${accounts[0]}`;
        document.getElementById('connectBtn').disabled = true;
        document.getElementById('swapPanel').style.display = 'block';
        // Enable the swap button now that we are connected
        document.getElementById('swapBtn').disabled = false;
      } else {
        throw new Error("No accounts found.");
      }
    })
    .catch(error => {
      document.getElementById('status').innerText = `Failed to connect: ${error.message}`;
      console.error("Connection error:", error);
      document.getElementById('connectBtn').disabled = false;
    });
}

function swapTokens() {
  const fromToken = document.getElementById('fromToken').value;
  const toToken = document.getElementById('toToken').value;
  const amount = document.getElementById('amount').value;

  document.getElementById('status').innerText = "Swapping...";
  document.getElementById('swapBtn').disabled = true;

  const transferJsonString = JSON.stringify({
    p: "KRC-20",
    op: "transfer",
    tick: fromToken,
    amt: amount,
    to: toToken
  });

  window.kasware.signKRC20Transaction(transferJsonString, 4, toToken)
    .then(txid => {
      document.getElementById('status').innerText = "Swap Successful";
      document.getElementById('swapResult').innerText = `Transaction ID: ${txid}`;
    })
    .catch(error => {
      document.getElementById('status').innerText = "Swap Failed";
      document.getElementById('swapResult').innerText = `Error Code: ${error.code || 'UNKNOWN'} - ${error.message}`;
      console.error("Swap error:", error);
    })
    .finally(() => {
      document.getElementById('swapBtn').disabled = false;
    });
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    document.getElementById('status').innerText = "No account connected.";
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('swapPanel').style.display = 'none';
  } else {
    document.getElementById('status').innerText = `Account changed to: ${accounts[0]}`;
  }
}

function handleNetworkChanged(network) {
  document.getElementById('status').innerText = `Network changed to: ${network}`;
}
