/**
 * Update the exchange UI with calculated amounts.
 * @param {Event} event - The change event from the input or select.
 */
function updateExchange(event) {
  const fromToken = document.getElementById('fromToken').value;
  const fromAmount = Number(document.getElementById('fromAmount').value);
  const toToken = fromToken === 'SNOWDN' ? 'KSDOG' : 'SNOWDN';

  document.getElementById('toAmount').value = calculateExchangeAmount(fromAmount, fromToken).toFixed(6);
  document.getElementById('toToken').value = toToken;
  document.getElementById('swapBtn').disabled = isNaN(fromAmount) || fromAmount <= 0;
}

document.getElementById('fromToken').addEventListener('change', updateExchange);
document.getElementById('fromAmount').addEventListener('input', updateExchange);
document.getElementById('swapBtn').addEventListener('click', swapTokens);

export { updateExchange };
