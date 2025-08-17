// Get the form element
const form = document.getElementById('ticketForm');
const statusMessage = document.getElementById('statusMessage');

// !! IMPORTANT !!
// PASTE YOUR DISCORD WEBHOOK URL HERE
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1406714029048856656/rcCH-OCTQ8YA5sljAtwWo4cIfvfs8nky_gxK8Jow65VvQueCBZXtB2xoDRHX0NLvuFbK';

form.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const formData = new FormData(form);
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const mobile = formData.get('mobile');
    const product = formData.get('product');
    const paymentMethod = formData.get('paymentMethod');

    // Create the payload to send to Discord
    const payload = {
        username: 'Ticket Bot',
        avatar_url: 'https://i.imgur.com/4M34Hi2.png', // A simple ticket icon
        embeds: [{
            title: 'New Support Ticket Received',
            color: 5814783, // A nice blue color
            fields: [
                { name: 'Full Name', value: fullName, inline: true },
                { name: 'Email', value: email, inline: true },
                { name: 'Mobile Number', value: mobile, inline: true },
                { name: 'Product', value: product, inline: true },
                { name: 'Payment Method', value: paymentMethod, inline: true }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    // Send the data using the fetch API
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (response.ok) {
            statusMessage.textContent = '✅ Ticket submitted successfully!';
            statusMessage.style.color = 'green';
            form.reset(); // Clear the form
        } else {
            statusMessage.textContent = '❌ Failed to submit ticket. Please try again.';
            statusMessage.style.color = 'red';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = '❌ An error occurred. Please check the console.';
        statusMessage.style.color = 'red';
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Ticket';
    });
});
