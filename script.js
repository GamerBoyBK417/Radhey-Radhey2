// Get form elements
const form = document.getElementById('ticketForm');
const statusMessage = document.getElementById('statusMessage');
const cooldownMessage = document.getElementById('cooldownMessage');
const submitBtn = document.getElementById('submitBtn');

// !! IMPORTANT !!
// PASTE YOUR DISCORD WEBHOOK URL HERE
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1406714029048856656/rcCH-OCTQ8YA5sljAtwWo4cIfvfs8nky_gxK8Jow65VvQueCBZXtB2xoDRHX0NLvuFbK';

// Cooldown period: 2 days in milliseconds
const COOLDOWN_PERIOD_MS = 2 * 24 * 60 * 60 * 1000; // 48 hours

/**
 * Disables the form inputs and button.
 */
function disableForm() {
    submitBtn.disabled = true;
    const inputs = form.getElementsByTagName('input');
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = true;
    }
}

/**
 * Checks if the user is on cooldown.
 */
function checkCooldown() {
    const lastSubmissionTime = localStorage.getItem('lastTicketSubmission');
    if (!lastSubmissionTime) {
        return; // No previous submission, so no cooldown.
    }

    const currentTime = new Date().getTime();
    const timeSinceLastSubmission = currentTime - parseInt(lastSubmissionTime, 10);

    if (timeSinceLastSubmission < COOLDOWN_PERIOD_MS) {
        const remainingTime = COOLDOWN_PERIOD_MS - timeSinceLastSubmission;
        const remainingHours = Math.ceil(remainingTime / (1000 * 60 * 60));

        cooldownMessage.textContent = `You can submit another ticket in approximately ${remainingHours} hours.`;
        cooldownMessage.style.display = 'block';
        disableForm();
    }
}

// Run the cooldown check as soon as the page loads
document.addEventListener('DOMContentLoaded', checkCooldown);


form.addEventListener('submit', function(event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // --- NEW: Anti-Spam Checks ---
    const honeypot = document.getElementById('honeypot').value;
    const isHuman = document.getElementById('isHuman').checked;

    if (honeypot) {
        console.log("Bot detected (honeypot filled).");
        return; // Silently fail for bots
    }

    if (!isHuman) {
        statusMessage.textContent = 'Please check the "I am not a robot" box.';
        statusMessage.style.color = 'red';
        return;
    }
    // --- End Anti-Spam Checks ---

    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    statusMessage.textContent = ''; // Clear previous messages

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
        avatar_url: 'https://i.imgur.com/4M34Hi2.png',
        embeds: [{
            title: 'New Support Ticket Received',
            color: 5814783,
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

            // --- NEW: Set cooldown after successful submission ---
            const currentTime = new Date().getTime();
            localStorage.setItem('lastTicketSubmission', currentTime.toString());
            checkCooldown(); // Immediately apply the cooldown UI
            // --- End Cooldown ---
        } else {
            statusMessage.textContent = '❌ Failed to submit ticket. Please try again.';
            statusMessage.style.color = 'red';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Ticket';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        statusMessage.textContent = '❌ An error occurred. Please check the console.';
        statusMessage.style.color = 'red';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Ticket';
    });
});
