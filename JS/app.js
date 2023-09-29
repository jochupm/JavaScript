let priceData; 


// Obtain elements from the form
const nameInput = document.getElementById('name');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const servicesInput = document.getElementById('services');
const regionInput = document.getElementById('region');
const finishQuoteBtn = document.getElementById('finishQuote');
const quoteDisplay = document.getElementById('quoteDisplay');
const totalAmountElement = document.getElementById('totalAmount');

emailInput.addEventListener('blur', function () {
  const email = emailInput.value;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    alert('Por favor, ingrese una dirección de correo electrónico válida.');
  }
});

// Create an array for the quotes
let quotes = [];

// Function for saving the quotes in the local storage
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function for loading the quotes in the local storage
function loadQuotesFromLocalStorage() {
  const quotesJson = localStorage.getItem('quotes');
  if (quotesJson) {
    quotes = JSON.parse(quotesJson);
    updateQuote();
  }
}

// Function for updating quotes' visualizations
function updateQuote() {
  quoteDisplay.innerHTML = '';

  let totalAmount = 0;

  quotes.forEach(function (quote, index) {
    totalAmount += quote.pricing;

    // Obtain current date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const options = { month: 'short' };
    const monthAbbreviation = currentDate.toLocaleDateString('en-US', options);
    const year = currentDate.getFullYear();

    const formattedDate = `${day}/${monthAbbreviation}/${year}`;

    const quoteCard = document.createElement('div');
    quoteCard.className = 'quote-card';
    quoteCard.innerHTML = `
    <div class="card" style="width: 20rem;">
      <img class="card-img-top" src="./images/Background_index.jpg" alt="Card image cap" height="150px" width="128px">
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
    </div>`;

    // Obtain refresh button
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-button';
    refreshButton.innerText = 'Delete quote';

    // Add refresh button
    refreshButton.addEventListener('click', function () {
      // Call the funstion that clears the form
      clearForm();
    });

    // Function for clearing the form
    function clearForm() {
      nameInput.value = '';
      lastNameInput.value = '';
      emailInput.value = '';
      servicesInput.value = '';
      regionInput.value = '';

      // Delete quotes' previous registers
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

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Quote saved',
    showConfirmButton: false,
    timer: 1500
  })

  // Obtain values from the form
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

  // Obtain prices according to the selected services and regions
  const pricing = getPrice(services, region);

  // Create quotes' object
  const quote = {
    name, // takes the value from inut *not from JSON
    lastName, // takes the value from inut *not from JSON
    email, // takes the value from inut *not from JSON
    services,
    region,
    pricing,
  };

  // Add quote to the array
  quotes.push(quote);

  // Save quotes' array in the local storage
  saveQuotesToLocalStorage();

  // Update quotes' visual
  updateQuote();

  // Clean the form
  nameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';
  servicesInput.value = '';
  regionInput.value = '';
});

// Obtain pricing according to services and region
function getPrice(services, region) {
  if (priceData.hasOwnProperty(services) && priceData[services].hasOwnProperty(region)) {
    return priceData[services][region];
  } else {
    // Handle errors when the price is not found
    return 0; 
  }
}
// Function for loading the pricing info from the JSON file
const fetchData = async () => {
  try {
    const res = await fetch('http://localhost:5500/JSON/quotes.json'); 
    const data = await res.json();
    
    // Save JSON data in a variable called priceData
    priceData = data.precios; 

    // Then save quotes from the lcoal storage
    loadQuotesFromLocalStorage();
  } catch (error) {
    console.error('Error al obtener los datos del archivo JSON:', error);
  }
};

// Call the fetchData function to load data from the JSON file
fetchData();




