// ** IMPORTANT SECURITY NOTICE **
// Placing the webhook URL directly in a client-side script is not secure for a production environment.
// A malicious user could find this URL and spam your Discord channel.
// This is for demonstration purposes only. For a real application, you should use a backend server
// (e.g., a service like Netlify Functions, Vercel, or a custom Node.js server) to handle the webhook request.

const form = document.getElementById('orderForm');
const statusMessage = document.getElementById('statusMessage');

// Step 1: Replace this with your actual Discord Webhook URL
const discordWebhookURL = 'YOUR_DISCORD_WEBHOOK_URL_HERE'; 

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Step 2: Antispam Antibot Check (Honeypot)
    const honeypot = document.getElementById('trap').value;
    if (honeypot.length > 0) {
        console.log("Bot detected. Form submission ignored.");
        statusMessage.textContent = 'Submission was not processed.';
        statusMessage.style.color = 'red';
        return; // Stop the function here
    }

    // Step 3: Basic Form Validation
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    if (!name || !email) {
        statusMessage.textContent = 'Please fill out all required fields.';
        statusMessage.style.color = 'red';
        return;
    }

    statusMessage.textContent = 'Placing your order...';
    statusMessage.style.color = '#2a6496';

    // Step 4: Prepare the data to be sent to Discord
    const formData = new FormData(form);
    const orderDetails = {
        name: formData.get('name'),
        email: formData.get('email'),
        mobile: formData.get('mobile'),
        payment: formData.get('payment')
    };

    const payload = {
        content: `**New CoRamTix Order!**\n- **Name:** ${orderDetails.name}\n- **Email:** ${orderDetails.email}\n- **Mobile:** ${orderDetails.mobile || 'N/A'}\n- **Payment Method:** ${orderDetails.payment}`
    };

    // Step 5: Send the data to the Discord Webhook
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
        statusMessage.textContent = 'Order successfully placed! You will receive a confirmation shortly.';
        statusMessage.style.color = 'green';
        form.reset(); // Clear the form
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        statusMessage.textContent = 'An error occurred. Please try again later.';
        statusMessage.style.color = 'red';
    });
});
