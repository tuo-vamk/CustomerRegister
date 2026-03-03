async function fetchCustomers() {
    try {
        const response = await fetch('https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/');
        const customers = await response.json();
        displayCustomers(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

function displayCustomers(customers) {
    const customerList = document.querySelector('ul');
    customerList.innerHTML = '';
    customers.forEach(customer => {
        const li = document.createElement('li');
        li.textContent = `${customer.first_name} ${customer.last_name} - ${customer.email}`;
        customerList.appendChild(li);
    });
}

$(document).ready(function() {
    console.log('Page ready, fetching customers...');
    fetchCustomers();

    // Lisätään tapahtumankäsittelijä napille
    $('#toggleButton').click(function() {
        // Käytetään toggle() toimintoa divin näyttämiseen/piilottamiseen
        $('#myDiv').toggle();
    });
});