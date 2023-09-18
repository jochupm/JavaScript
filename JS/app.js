
// Obtain elements from the form
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');

emailInput.addEventListener('blur', function () {
  const email = emailInput.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    alert('Please write e valid e-mail address');
  }
});
const servicesInput = document.getElementById('services');
const regionInput = document.getElementById('region');
const finishQuoteBtn = document.getElementById('finishQuote');
const quoteDisplay = document.getElementById('quoteDisplay');
const totalAmountElement = document.getElementById('totalAmount');

// Create array for quotes
let quotes = [];

// Function for saving quotes in local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function for loading quotes in Local Storage
function loadQuotesFromLocalStorage() {
  const quotesJson = localStorage.getItem('quotes');
  if (quotesJson) {
    quotes = JSON.parse(quotesJson);
    updateQuote();
  }
}

// Function for updating quotes' visual
function updateQuote() {
  quoteDisplay.innerHTML = '';

  let totalAmount = 0;

  quotes.forEach(function (quote, index) {
    totalAmount += quote.pricing;

    // get current date
    const currentDate = new Date();
    const day= currentDate.getDate();
    const options = { month: 'short' };
    const monthAbbreviation = currentDate.toLocaleDateString('en-US', options);
    const year = currentDate.getFullYear(); 

    const formattedDate = `${day}/${monthAbbreviation}/${year}`;


    const quoteCard = document.createElement('div');
    quoteCard.className = 'quote-card';
    quoteCard.innerHTML = `
    <div class="card" style="width: 20rem;" >
  <img class="card-img-top" src="./images/Background_index.jpg" alt="Card image cap" height=150px width=128px >
  <div class="card-body">
    <h3 class="card-title">Quote</h3>
    <p>Date: ${formattedDate}</p>
    <p>Name: ${quote.name}</p>
    <p>Last Name: ${quote.lastName}</p>
    <p>Email: ${quote.email}</p>
    <p>Services: ${quote.services}</p>
    <p>Region: ${quote.region}</p>
    <p>Pricing: $${quote.pricing.toFixed(2)}</p>
</div>
    `;

// Obtain Refresh button
const refreshButton = document.createElement('button');
refreshButton.className = 'refresh-button';
refreshButton.innerText = 'Refresh';

// Add click event to the refresh button
refreshButton.addEventListener('click', function () {
  // Call the function for clearing form data
  clearForm();
});

// Fuunction for clearing the form
function clearForm() {
  nameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';
  servicesInput.value = '';
  regionInput.value = '';

    // delete quotes record
    quotes = [];
    saveQuotesToLocalStorage();

    updateQuote();

}
quoteCard.appendChild(refreshButton);
quoteDisplay.appendChild(quoteCard);

  });

  totalAmountElement.innerText = totalAmount.toFixed(2);
}

// Event for saving the quote
finishQuoteBtn.addEventListener('click', function (e) {
  e.preventDefault();

  // Obtain forms' value
  const name = nameInput.value;
  const lastName = lastNameInput.value;
  const email = emailInput.value;
  const services = servicesInput.value;
  const region = regionInput.value;

  // Validate empty fields
  if (!name || !lastName || !email || !services || !region) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  // Obtain prices according to services and region
  const pricing = getPrice(services, region);

  // Create quotes object
  const quote = {
    name,
    lastName,
    email,
    services,
    region,
    pricing,
  };

  // Add Array quote
  quotes.push(quote);

  // Save array quote in local storage
  saveQuotesToLocalStorage();

  // Update quotes' visual
   updateQuote();

   // Cear the form
   nameInput.value = '';
   lastNameInput.value = '';
   emailInput.value = '';
   servicesInput.value = '';
   regionInput.value = '';
});

  // Obtain prices according to services and region
  function getPrice(services, region) {

  const priceMapping = {
    "data analysis projects": {
      "north america": 900,
      "south america": 850,
      "europe": 950,
      "oceania": 850,
      "africa": 900,
    },
    "visualization projects": {
      "north america": 700,
      "south america": 650,
      "europe": 950,
      "oceania": 850,
      "africa": 900,
    },
    "prediction models": {
      "north america": 800,
      "south america": 750,
      "europe": 850,
      "oceania": 750,
      "africa": 800,
    },
    "training and workshops": {
      "north america": 1000,
      "south america": 950,
      "europe": 1050,
      "oceania": 950,
      "africa": 1000,
    },
    "full-day training": {
      "north america": 1100,
      "south america": 1050,
      "europe": 1150,
      "oceania": 1050,
      "africa": 1100,
    },
  };

  // Obtain the price according to the fields
  return priceMapping[services][region];
}

// Upload qotes in the local storage according to the form fulfilled
loadQuotesFromLocalStorage();
