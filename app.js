async function fetchCustomers() {
    try {
        const customers = await $.get('https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/');
        displayCustomers(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

function displayCustomers(customers) {
    const customerList = $('#customerList');
    customerList.empty();
    customers.forEach(customer => {
        const li = $('<li>');
        li.text(`${customer.first_name} ${customer.last_name} - ${customer.email}`);
        
        const button = $('<button>');
        button.text('Show More Info');
        button.css('margin-left', '10px');
        button.click(() => fetchCustomerDetails(customer.id));
        
        li.append(button);
        customerList.append(li);
    });
}

async function fetchCustomerDetails(customerId) {
    try {
        const customerData = (await $.get(`https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/?id=${customerId}`))[0];
        
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
    buttonText();

    //Toggle button functionality
    $('#toggleButton').click(function() {
        $('#myDiv').slideToggle(400, function () {
            // This runs after the slide animation completes
            buttonText();
        });
    });

    $('#myForm').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.post('https://www.cc.puv.fi/~hmh/fed/fedApi/lisaa_asiakas/', formData)
            .done(function() {
                alert('Customer added successfully.');
                fetchCustomers();
                $(this).trigger('reset');
            })
            .fail(function() {
                alert('Error adding customer. Please try again.');
            });
    });
});

function buttonText() {
    const isVisible = $('#myDiv').is(':visible');
    if (isVisible) {
        $('#toggleButton').text('Hide Add Customer Form');
    } else {
        $('#toggleButton').text('Show Add Customer Form');
    }
}