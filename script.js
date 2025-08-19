const proxyURL = ENV.PROXY_URL;

document.getElementById("ticketForm").addEventListener("submit", async function(e){
    e.preventDefault();

    const captchaAnswer = document.getElementById("captcha").value;
    if(captchaAnswer != "7"){ // simple math captcha
        document.getElementById("status").innerText = "Captcha incorrect!";
        return;
    }

    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const mobile = document.getElementById("mobile").value;
    const product = document.getElementById("product").value;
    const payment = document.getElementById("payment").value;

    try {
        const res = await fetch(proxyURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, mobile, product, payment })
        });

        const data = await res.json();
        if(data.success){
            document.getElementById("status").innerText = "Ticket submitted successfully!";
            document.getElementById("ticketForm").reset();
        } else {
            document.getElementById("status").innerText = data.error || "Failed to send ticket!";
        }
    } catch(err){
        document.getElementById("status").innerText = "Error sending ticket!";
        console.error(err);
    }
});
