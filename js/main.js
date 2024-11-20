document.addEventListener('DOMContentLoaded', checkKasWareWallet);

function checkKasWareWallet() {
  if (typeof window.kasware !== 'undefined') {
    document.getElementById('status').innerText = "KasWare Wallet Detected!";
    document.getElementById('connectBtn').disabled = false;
    
    // Attach event listeners after checking for KasWare availability
    document.getElementById('connectBtn').addEventListener('click', connectWallet);
    document.getElementById('swapBtn').addEventListener('click', swapTokens);

    // Also set up event listeners for wallet and network changes
    window.kasware.on('accountsChanged', handleAccountsChanged);
    window.kasware.on('networkChanged', handleNetworkChanged);
  } else {
    document.getElementById('status').innerText = "Please install KasWare Wallet extension.";
  }
}

function connectWallet() {
  document.getElementById('status').innerText = "Connecting...";
  document.getElementById('connectBtn').disabled = true;
  
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
    })
    .finally(() => {
      // Keep button disabled if connected, enable if not
      document.getElementById('connectBtn').disabled = (document.getElementById('swapPanel').style.display === 'block');
    });
}

function swapTokens() {
  // ... your existing swap logic here ...
}

function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    console.log("Please connect to KasWare Wallet.");
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('status').innerText = "No account connected.";
    document.getElementById('swapPanel').style.display = 'none';
  } else {
    document.getElementById('status').innerText = `Account changed to: ${accounts[0]}`;
    console.log("Account changed:", accounts);
  }
}

function handleNetworkChanged(network) {
  console.log("Network changed:", network);
  document.getElementById('status').innerText = `Network changed to: ${network}`;
}
