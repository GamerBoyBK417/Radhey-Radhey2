// ** IMPORTANT SECURITY NOTICE **
// Placing the webhook URL directly in a client-side script is not secure for a production environment.
// For a real application, you should use a backend server to handle the webhook request.

const form = document.getElementById('ticketForm');
const statusMessage = document.getElementById('statusMessage');

// You must replace this with your actual Discord Webhook URL
const discordWebhookURL = 'https://discord.com/api/webhooks/1406714029048856656/rcCH-OCTQ8YA5sljAtwWo4cIfvfs8nky_gxK8Jow65VvQueCBZXtB2xoDRHX0NLvuFbK'; 

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const honeypot = document.getElementById('trap').value;
    if (honeypot.length > 0) {
        console.log("Bot detected. Form submission ignored.");
        statusMessage.textContent = 'Submission was not processed.';
        statusMessage.style.color = 'red';
        return;
    }

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const productName = document.getElementById('productName').value;
    if (!name || !email || !productName) {
        statusMessage.textContent = 'Please fill out all required fields.';
        statusMessage.style.color = 'red';
        return;
    }

    statusMessage.textContent = 'Submitting your ticket...';
    statusMessage.style.color = '#1b5e20';

    const formData = new FormData(form);
    const ticketDetails = {
        name: formData.get('name'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        productName: formData.get('productName'),
        paymentMethod: formData.get('payment')
    };

    const payload = {
        content: `**New CoRamTix Ticket!**\n- **Name:** ${ticketDetails.name}\n- **Email:** ${ticketDetails.email}\n- **Mobile:** ${ticketDetails.mobile || 'N/A'}\n- **Product Name:** ${ticketDetails.productName}\n- **Payment Method:** ${ticketDetails.paymentMethod}`
    };

    fetch(discordWebhookURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        statusMessage.textContent = 'Ticket submitted successfully!';
        statusMessage.style.color = 'green';
        form.reset();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        statusMessage.textContent = 'An error occurred. Please try again later.';
        statusMessage.style.color = 'red';
    });
});
