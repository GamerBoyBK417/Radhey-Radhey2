const form = document.getElementById("paymentForm");
const webhookURL = "YOUR_DISCORD_WEBHOOK_LINK"; // Replace with your Discord webhook

// 24-hour submission check
const lastSubmit = localStorage.getItem("lastSubmit");
const now = new Date().getTime();

if(lastSubmit && now - lastSubmit < 24 * 60 * 60 * 1000) {
    form.innerHTML = "<h2>You can only submit once every 24 hours!</h2>";
}

// Generate random anti-bot math question
const a = Math.floor(Math.random() * 10) + 1;
const b = Math.floor(Math.random() * 10) + 1;
const correctAnswer = a + b;
document.querySelector('input[name="humanCheck"]').placeholder = `What is ${a} + ${b}?`;

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot check
    if(form.website.value.trim() !== "") {
        alert("Bot detected!");
        return;
    }

    // Anti-bot math check
    if(form.humanCheck.value.trim() !== correctAnswer.toString()) {
        alert("Anti-bot check failed!");
        return;
    }

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const mobile = form.mobile.value.trim();
    const payment = form.payment.value;

    const data = {
        content: `**New Payment Submission**\n**Name:** ${name}\n**Email:** ${email}\n**Mobile:** ${mobile}\n**Payment Method:** ${payment}`
    };

    try {
        const response = await fetch(webhookURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if(response.ok) {
            alert("Form submitted successfully!");
            localStorage.setItem("lastSubmit", new Date().getTime());
            form.reset();
            form.querySelector('button[type="submit"]').disabled = true;
            form.innerHTML = "<h2>Thank you! You can only submit once every 24 hours.</h2>";
        } else {
            alert("Error sending form data.");
        }
    } catch (error) {
        alert("Error sending form data.");
        console.error(error);
    }
});
