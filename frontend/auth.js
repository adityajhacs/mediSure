document.getElementById("loginForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (response.ok) {
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    alert("Error connecting to backend.");
  }
});
