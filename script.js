/*
 * Simple trade-in value estimation script.
 * This uses mileage and condition keywords to adjust a base value.
 */

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const entriesList = document.getElementById('entriesList');
  const form = document.getElementById('tradeInForm');
  const resultDiv = document.getElementById('estimateResult');
  const userNav = document.getElementById('userNav');

  const currentUser = localStorage.getItem('loggedInUser');

  if (userNav) {
    if (currentUser) {
      userNav.innerHTML = `<span>Welcome, ${currentUser}</span> <a href="#" id="logoutLink">Logout</a>`;
    } else {
      userNav.innerHTML = '<a href="login.html">Login</a>';
    }
  }

  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', e => {
      e.preventDefault();
      localStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const user = document.getElementById('username').value.trim();
      localStorage.setItem('loggedInUser', user);
      window.location.href = 'trade-in.html';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'index.html';
    });
  }

  if (entriesList) {
    if (!currentUser) {
      entriesList.innerHTML = '<li>Please <a href="login.html">log in</a> to view saved entries.</li>';
    } else {
      const entries = JSON.parse(localStorage.getItem('entries') || '[]');
      if (entries.length === 0) {
        entriesList.innerHTML = '<li>No entries yet.</li>';
      } else {
        entries.forEach(e => {
          const li = document.createElement('li');
          li.textContent = `${e.vin} - ${e.mileage} miles (${e.condition}) - $${e.estimate}`;
          entriesList.appendChild(li);
        });
      }
    }
  }

  if (!form) return; // Only run trade-in logic on pages with the form

  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    form.innerHTML = 'Please <a href="login.html">log in</a> to submit a trade-in.';
    return;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();

    const vin = document.getElementById('vin').value.trim();
    const mileage = parseInt(document.getElementById('mileage').value, 10) || 0;
    const condition = document.getElementById('condition').value.trim();

    const estimate = estimateValue(vin, mileage, condition);

    resultDiv.textContent = `Estimated trade-in value: $${estimate.toLocaleString()}`;

    const entries = JSON.parse(localStorage.getItem('entries') || '[]');
    entries.push({ vin, mileage, condition, estimate });
    localStorage.setItem('entries', JSON.stringify(entries));
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
