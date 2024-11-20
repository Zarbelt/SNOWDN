document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.kasware !== 'undefined') {
        document.getElementById('status').innerText = "KasWare Wallet Detected!";
        document.getElementById('connectBtn').disabled = false;
        window.kasware.on('accountsChanged', handleAccountsChanged);
        window.kasware.on('networkChanged', handleNetworkChanged);
        // Listen for swap confirmation from backend
        window.kasware.on('swapConfirmation', handleSwapConfirmation);
    } else {
        document.getElementById('status').innerText = "Please install KasWare Wallet extension.";
    }
});

async function connectWallet() {
    document.getElementById('status').innerText = "Connecting...";
    try {
        const accounts = await window.kasware.requestAccounts();
        if (accounts.length > 0) {
            document.getElementById('status').innerText = `Connected with account: ${accounts[0]}`;
            document.getElementById('connectBtn').disabled = true;
            document.getElementById('swapPanel').style.display = 'block';
            // Notify backend of connection
            await notifyBackendOfConnection(accounts[0]);
        } else {
            document.getElementById('status').innerText = "No accounts found.";
        }
    } catch (error) {
        document.getElementById('status').innerText = "Failed to connect: " + error.message;
        console.error("Connection error:", error);
    }
}

async function notifyBackendOfConnection(wallet) {
    try {
        await window.kasware.send('backendConnect', { wallet: wallet });
    } catch (error) {
        console.error("Failed to notify backend:", error);
    }
}

function handleSwapConfirmation(data) {
    document.getElementById('swapStatus').innerText = `Swap Confirmed. Transaction ID: ${data.txid}`;
}

function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        console.log("Please connect to KasWare Wallet.");
        document.getElementById('connectBtn').disabled = false;
        document.getElementById('status').innerText = "No account connected.";
    } else {
        document.getElementById('status').innerText = `Account changed to: ${accounts[0]}`;
        console.log("Account changed:", accounts);
    }
}

function handleNetworkChanged(network) {
    console.log("Network changed:", network);
    document.getElementById('status').innerText = `Network changed to: ${network}`;
}
