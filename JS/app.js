let priceData; 


// Obtener elementos del formulario
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

// Crear un array para las cotizaciones
let quotes = [];

// Función para guardar cotizaciones en el almacenamiento local
function saveQuotesToLocalStorage() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Función para cargar cotizaciones desde el almacenamiento local
function loadQuotesFromLocalStorage() {
  const quotesJson = localStorage.getItem('quotes');
  if (quotesJson) {
    quotes = JSON.parse(quotesJson);
    updateQuote();
  }
}

// Función para actualizar la visualización de las cotizaciones
function updateQuote() {
  quoteDisplay.innerHTML = '';

  let totalAmount = 0;

  quotes.forEach(function (quote, index) {
    totalAmount += quote.pricing;

    // Obtener la fecha actual
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

    // Obtener el botón de actualización
    const refreshButton = document.createElement('button');
    refreshButton.className = 'refresh-button';
    refreshButton.innerText = 'Delete quote';

    // Agregar evento de clic al botón de actualización
    refreshButton.addEventListener('click', function () {
      // Llamar a la función para limpiar los datos del formulario
      clearForm();
    });

    // Función para limpiar el formulario
    function clearForm() {
      nameInput.value = '';
      lastNameInput.value = '';
      emailInput.value = '';
      servicesInput.value = '';
      regionInput.value = '';

      // Eliminar registros de cotizaciones
      quotes = [];
      saveQuotesToLocalStorage();

      updateQuote();
    }

    quoteCard.appendChild(refreshButton);
    quoteDisplay.appendChild(quoteCard);
  });

  totalAmountElement.innerText = totalAmount.toFixed(2);
}

// Evento para guardar la cotización
finishQuoteBtn.addEventListener('click', function (e) {
  e.preventDefault();

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Quote saved',
    showConfirmButton: false,
    timer: 1500
  })

  // Obtener los valores del formulario
  const name = nameInput.value;
  const lastName = lastNameInput.value;
  const email = emailInput.value;
  const services = servicesInput.value;
  const region = regionInput.value;

  // Validar campos vacíos
  if (!name || !lastName || !email || !services || !region) {
    alert('Por favor, complete todos los campos.');
    return;
  }

  // Obtener precios según los servicios y la región
  const pricing = getPrice(services, region);

  // Crear objeto de cotización
  const quote = {
    name, // Utilizar el valor del input en lugar del JSON
    lastName, // Utilizar el valor del input en lugar del JSON
    email, // Utilizar el valor del input en lugar del JSON
    services,
    region,
    pricing,
  };

  // Agregar cotización al array
  quotes.push(quote);

  // Guardar array de cotizaciones en el almacenamiento local
  saveQuotesToLocalStorage();

  // Actualizar la visualización de las cotizaciones
  updateQuote();

  // Limpiar el formulario
  nameInput.value = '';
  lastNameInput.value = '';
  emailInput.value = '';
  servicesInput.value = '';
  regionInput.value = '';
});

// Obtener precios según los servicios y la región
function getPrice(services, region) {
  if (priceData.hasOwnProperty(services) && priceData[services].hasOwnProperty(region)) {
    return priceData[services][region];
  } else {
    // Manejar el caso en que no se encuentre el precio
    return 0; // O cualquier valor por defecto que desees
  }
}
// Función para cargar los datos de precios desde el JSON
const fetchData = async () => {
  try {
    const res = await fetch('http://localhost:5500/JSON/quotes.json'); 
    const data = await res.json();
    
    // Almacenar los datos del archivo JSON en una variable global llamada priceData
    priceData = data.precios; 

    // Luego, cargar las cotizaciones desde el almacenamiento local
    loadQuotesFromLocalStorage();
  } catch (error) {
    console.error('Error al obtener los datos del archivo JSON:', error);
  }
};

// Llamar a la función fetchData para cargar los datos desde el JSON
fetchData();




