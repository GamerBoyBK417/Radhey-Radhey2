document.getElementById("ticketForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const product = document.getElementById("product").value;
    const payment = document.getElementById("payment").value;

    const webhookURL = process.env.DISCORD_WEBHOOK_URL || ""; // Using .env in GitHub Pages requires a bundler; for now replace manually

    if(!webhookURL) {
        alert("Webhook URL not set!");
        return;
    }

    const payload = {
        content: `**New Ticket Submitted**\n**Name:** ${fullName}\n**Email:** ${email}\n**Mobile:** ${mobile}\n**Product:** ${product}\n**Payment:** ${payment}`
    };

    try {
        const res = await fetch(webhookURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if(res.ok){
            document.getElementById("status").innerText = "Ticket submitted successfully!";
            document.getElementById("ticketForm").reset();
        } else {
            document.getElementById("status").innerText = "Failed to send ticket.";
        }
    } catch(err){
        document.getElementById("status").innerText = "Error sending ticket.";
        console.error(err);
    }
});
