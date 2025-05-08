async function handleLogin() {
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    const errorMessage = document.getElementById("errorMessage");

    if (!email) {
        errorMessage.textContent = "Enter your email address";
        return;
    } else if (!password) {
        errorMessage.textContent = "Enter your password";
        return;
    } else {
        errorMessage.textContent = "";
    }

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();


        if (data.Error) {
            throw new Error(data.Error || "Login failed");
        }


        const token = data.accessToken;
        const profileImg = data.profilePicture;

        localStorage.setItem("token", token);
        localStorage.setItem('profileImage', profileImg)
        window.location.href = "chat/chat.html";

    } catch (error) {
        errorMessage.textContent = error.message;
    }
}
