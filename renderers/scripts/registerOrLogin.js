document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("inside script register");
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    const response = await api.registerUser({ username, password });
    if (response.success) {
      alert("User registered successfully!");
    } else {
      alert("Error: " + response.error);
    }
  });

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const response = await api.loginUser({ username, password });
  if (response.success) {
    sessionStorage.setItem("username", response.username);
    window.location.href = "./index.html";
  } else {
    alert("Invalid credentials");
  }
});
