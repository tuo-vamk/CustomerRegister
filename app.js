let allCustomers = [];
let currentPage = 1;
const customersPerPage = 20;
let searchTerm = '';

async function fetchCustomers() {
    try {
        allCustomers = await $.get('https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/');
        displayCustomers();
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

function getFilteredCustomers() {
    if (!searchTerm) {
        return allCustomers;
    }
    return allCustomers.filter(customer => {
        const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
    });
}

function displayCustomers() {
    const customerList = $('#customerList');
    customerList.empty();
    
    const filteredCustomers = getFilteredCustomers();
    const startIndex = (currentPage - 1) * customersPerPage;
    const endIndex = startIndex + customersPerPage;
    const customersToDisplay = filteredCustomers.slice(startIndex, endIndex);
    
    customersToDisplay.forEach(customer => {
        const li = $('<li>');
        li.text(`${customer.first_name} ${customer.last_name} - ${customer.email}`);
        
        const infoButton = $('<button>');
        infoButton.text('i');
        infoButton.css({
            'margin-left': '10px',
            'width': '25px',
            'height': '25px',
            'border-radius': '50%',
            'font-weight': 'bold',
            'cursor': 'pointer'
        });
        infoButton.click(() => fetchCustomerDetails(customer.id));
        
        const deleteButton = $('<button>');
        deleteButton.text('Delete');
        deleteButton.css({
            'margin-left': '10px',
            'background-color': '#f44336',
            'color': 'white',
            'cursor': 'pointer'
        });
        deleteButton.click(() => deleteCustomer(customer.id));
        
        li.append(infoButton);
        li.append(deleteButton);
        customerList.append(li);
    });
    
    displayPagination();
}

function displayPagination() {
    // Remove existing pagination first
    $('.pagination').remove();
    
    const filteredCustomers = getFilteredCustomers();
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    let paginationHtml = '<div class="pagination">';
    
    if (currentPage > 1) {
        paginationHtml += '<button onclick="changePage(' + (currentPage - 1) + ')">Previous</button>';
    }
    
    paginationHtml += '<span> Page ' + currentPage + ' of ' + totalPages + ' </span>';
    
    if (currentPage < totalPages) {
        paginationHtml += '<button onclick="changePage(' + (currentPage + 1) + ')">Next</button>';
    }
    
    paginationHtml += '</div>';
    $('.right-column').append(paginationHtml);
}

function changePage(page) {
    currentPage = page;
    displayCustomers();
}

async function fetchCustomerDetails(customerId) {
    try {
        const customerData = (await $.get(`https://www.cc.puv.fi/~hmh/fed/fedApi/hae_asiakas/?id=${customerId}`))[0];
        
        const info = `
            Customer Details:
            Id: ${customerData.id}
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

async function deleteCustomer(customerId) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            await $.get(`https://www.cc.puv.fi/~hmh/fed/fedApi/poista_asiakas/?saltsu=Vamk6000&id=${customerId}`);
            alert('Customer deleted successfully.');
            fetchCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('Error deleting customer. Please try again.');
        }
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
    
    // Search functionality
    $('#searchInput').on('input', function() {
        searchTerm = $(this).val();
        currentPage = 1; // Reset to first page when searching
        displayCustomers();
    });
    
    $('#addCustomerForm').submit(function(event) {
        event.preventDefault();

        const formData = $(this).serialize();
        const form = this;
        $.post('https://www.cc.puv.fi/~hmh/fed/fedApi/lisaa_asiakas/', formData)
            .done(function() {
                alert('Customer added successfully.');
                fetchCustomers();
                form.reset();
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