document.addEventListener('DOMContentLoaded', checkKasWareWallet);

function checkKasWareWallet() {
  if (typeof window.kasware !== 'undefined') {
    document.getElementById('status').innerText = "KasWare Wallet Detected!";
    document.getElementById('connectBtn').addEventListener('click', connectWallet);
    document.getElementById('swapBtn').addEventListener('click', swapTokens);
  } else {
    document.getElementById('status').innerText = "Please install KasWare Wallet extension.";
  }
}

function connectWallet() {
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
    })
    .finally(() => {
      document.getElementById('connectBtn').disabled = false;
    });
}

function swapTokens() {
  const fromToken = document.getElementById('fromToken').value;
  const toToken = document.getElementById('toToken').value;
  let amount = parseFloat(document.getElementById('amount').value);

  let actualAmount = amount;
  if(fromToken === "KSDOG" && toToken === "SNOWDN") {
    actualAmount = amount / 1000; // 100,000 KSDOG to 100 SNOWDN
    if (actualAmount < 100) {
      document.getElementById('swapResult').innerText = "Minimum amount to swap is 100 SNOWDN.";
      return;
    }
  } else if (fromToken === "SNOWDN" && toToken === "KSDOG") {
    actualAmount = amount * 1000; // 100 SNOWDN to 100,000 KSDOG
    if (actualAmount < 100000) {
      document.getElementById('swapResult').innerText = "Minimum amount to swap is 100,000 KSDOG.";
      return;
    }
  } else {
    document.getElementById('swapResult').innerText = "Invalid token pair for swapping.";
    return;
  }

  const transferJsonString = JSON.stringify({
    p: "KRC-20",
    op: "transfer",
    tick: fromToken,
    amt: actualAmount,
    to: "kaspa:qpq3lm3u94cwl0x6grr3g52ljuqvkz47anpru7x359rpscu4hymgq3ruj8d94" // Your CEX liquidity pool address
  });

  window.kasware.signKRC20Transaction(transferJsonString, 4, toToken)
    .then(txid => {
      document.getElementById('status').innerText = "Swap Successful";
      document.getElementById('swapResult').innerText = `Transaction ID: ${txid}`;
    })
    .catch(error => {
      document.getElementById('status').innerText = "Swap Failed";
      document.getElementById('swapResult').innerText = `Error: ${error.message}`;
    });
}

// Event listeners
window.kasware.on('accountsChanged', function(accounts) {
  if (accounts.length === 0) {
    document.getElementById('connectBtn').disabled = false;
    document.getElementById('status').innerText = "No account connected.";
  } else {
    document.getElementById('status').innerText = `Account changed to: ${accounts[0]}`;
  }
});

window.kasware.on('networkChanged', function(network) {
  document.getElementById('status').innerText = `Network changed to: ${network}`;
});
