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
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '';
    customers.forEach(customer => {
        const li = document.createElement('li');
        li.textContent = `${customer.first_name} ${customer.last_name} - ${customer.email}`;
        
        const button = document.createElement('button');
        button.textContent = 'Show More Info';
        button.style.marginLeft = '10px';
        button.addEventListener('click', () => fetchCustomerDetails(customer.id));
        
        li.appendChild(button);
        customerList.appendChild(li);
    });
}

async function fetchCustomerDetails(customerId) {
    try {
        const response = await fetch(`https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/?id=${customerId}`);
        const customerData = (await response.json())[0];
        
        const info = `
            Customer Details:
            Name: ${customerData.first_name} ${customerData.last_name}
            Email: ${customerData.email}
            Phone: ${customerData.phone || 'N/A'}
            Address: ${customerData.address || 'N/A'}`.trim();
        
        alert(info);
    } catch (error) {
        console.error('Error fetching customer details:', error);
        alert('Error fetching customer details. Please try again.');
    }
}

$(document).ready(function() {
    fetchCustomers();

    //Toggle button functionality
    $('#toggleButton').click(function() {
        $('#myDiv').toggle();
    });
});