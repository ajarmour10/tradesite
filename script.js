/*
 * Simple trade-in value estimation script.
 * This uses mileage and condition keywords to adjust a base value.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('tradeInForm');
  const resultDiv = document.getElementById('estimateResult');

  form.addEventListener('submit', event => {
    event.preventDefault();

    const vin = document.getElementById('vin').value.trim();
    const mileage = parseInt(document.getElementById('mileage').value, 10) || 0;
    const condition = document.getElementById('condition').value.trim();

    const estimate = estimateValue(vin, mileage, condition);

    resultDiv.textContent = `Estimated trade-in value: $${estimate.toLocaleString()}`;
  });
});

function estimateValue(vin, mileage, conditionText) {
  // Base value could be more sophisticated. For now we use a fixed amount.
  let baseValue = 20000;

  // Mileage reduces value
  const mileageDeduction = mileage * 0.05;

  // Condition keywords adjust value
  const text = conditionText.toLowerCase();
  let conditionFactor = 1.0;
  if (text.includes('excellent')) {
    conditionFactor = 1.05;
  } else if (text.includes('good')) {
    conditionFactor = 1.0;
  } else if (text.includes('fair')) {
    conditionFactor = 0.9;
  } else if (text.includes('poor')) {
    conditionFactor = 0.8;
  }

  let value = (baseValue - mileageDeduction) * conditionFactor;
  if (value < 0) value = 0;

  return Math.round(value);
}
