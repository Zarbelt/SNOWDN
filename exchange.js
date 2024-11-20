// Constants for token addresses
const KSDOG_TOKEN_ADDRESS = 'kaspa:qqt8myqkfv3entxh389xgl9764fh57zphpxnchdt6fhq4tx4fdmzxwz5aeklu';
const SNOWDN_TOKEN_ADDRESS = 'kaspa:qp646t0pclp2ffm7rszk2www64pdg57tvuqc9aujl8azzg8jj28us0avyxcwf';
const EXCHANGE_WALLET_ADDRESS = 'kaspa:qpq3lm3u94cwl0x6grr3g52ljuqvkz47anpru7x359rpscu4hymgq3ruj8d94';
const MIN_SWAP_AMOUNT = { SNOWDN: 100, KSDOG: 100000 };
const EXCHANGE_RATE = { SNOWDN: 1000, KSDOG: 0.001 };

/**
 * Function to simulate an exchange request to a backend.
 * @param {Object} swapDetails - Object containing details of the swap.
 * @return {Promise} Promise that resolves with an object indicating success or failure.
 */
function simulateExchangeRequest(swapDetails) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log("Simulated exchange request with details:", swapDetails);
      if (Math.random() > 0.1) { // Simulate 90% success rate
        resolve({ success: true, txid: 'mock-txid-12345' });
      } else {
        const error = new Error('Simulated backend error');
        reject(error);
        console.error("Exchange simulation failed with error:", error.message);
      }
    }, 2000); // Simulated network delay
  });
}

/**
 * Calculate the exchange amount.
 * @param {number} amount - Amount of token to exchange.
 * @param {string} fromToken - Token being exchanged from.
 * @return {number} Calculated amount after exchange.
 */
function calculateExchangeAmount(amount, fromToken) {
  return fromToken === 'SNOWDN' 
    ? amount * EXCHANGE_RATE.SNOWDN
    : amount * EXCHANGE_RATE.KSDOG;
}

/**
 * Check if the amount meets the minimum swap requirement.
 * @param {number} amount - Amount to check.
 * @param {string} token - The token type.
 * @throws {Error} If the amount is below the minimum.
 */
function checkMinimumSwap(amount, token) {
  if (amount < MIN_SWAP_AMOUNT[token]) {
    const error = new Error(`Minimum amount not met. Need at least ${MIN_SWAP_AMOUNT[token]} ${token}.`);
    console.error(error.message);
    throw error;
  }
}

export { simulateExchangeRequest, calculateExchangeAmount, checkMinimumSwap };
