// This is server-side code and will run on Netlify's servers.

// We use the 'node-fetch' package to make HTTP requests from our function.
const fetch = require('node-fetch');

// This is the main function that Netlify will run.
exports.handler = async function(event) {
    // We only want to handle POST requests from our form.
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        // Get the secret Discord webhook URL from the environment variables.
        // This is the key to our security. The URL is never exposed to the user.
        const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
        
        // Get the form data that was sent from the browser.
        const formData = JSON.parse(event.body);

        // Create a rich, formatted message (an "embed") for Discord.
        const payload = {
            username: "Secure Form Bot",
            embeds: [{
                title: "New Order Received!",
                color: 15258703, // Gold
                fields: [
                    { name: "Full Name", value: formData.fullName },
                    { name: "Email", value: formData.email },
                    { name: "Mobile Number", value: formData.mobile },
                    { name: "Product", value: formData.product }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        // Send the data to Discord using our secret URL.
        await fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // If everything worked, send a success response back to the browser.
        return { statusCode: 200, body: JSON.stringify({ message: "Success" }) };

    } catch (error) {
        // If there's an error, log it and send an error response.
        console.error("Error:", error);
        return { statusCode: 500, body: "Internal Server Error" };
    }
};
