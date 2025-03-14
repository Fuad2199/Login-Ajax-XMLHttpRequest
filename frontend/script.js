const settings = {
  apiUrl: "http://localhost:5000/users", // API endpoint without query parameters
  redirectUrl: "../../frontend/home.html"
};

// Login DOM
const loginForm = document.getElementById("login");
const statusEmail = document.querySelector(".status-email");
const statusPassword = document.querySelector(".status-password");
const errorStatus = document.querySelector(".error-status"); // Assuming you have an element for error/success messages
const formStatus = document.querySelector(".form-status");

document.addEventListener("DOMContentLoaded", () => {
  // Check if login form exists to avoid errors
  if (!loginForm) {
    console.error('Login form not found!');
    return;
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission

    statusEmail.style.display = "block";
    statusPassword.style.display = "block";
    formStatus.style.display = "block";

    // Get values from the form
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    statusEmail.textContent = ""; // Reset error message
    statusPassword.textContent = ""; // Reset error message
    formStatus.textContent = ""; // Reset error message

    // Validate email
    if (!validateEmail(email)) {
      statusEmail.style.color = "red";
      statusEmail.textContent = "Invalid email format";
    } else if (!(email.endsWith(".com") || email.endsWith(".ru"))) {
      statusEmail.style.color = "red";
      statusEmail.textContent = "Email must end with .com or .ru";
    } else {
      statusEmail.style.color = "green";
      statusEmail.textContent = "True email format";
    }

    // Validate password
    if (password.length < 6) {
      statusPassword.style.color = "red";
      statusPassword.textContent = "Password must be at least 6 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      statusPassword.style.color = "red";
      statusPassword.textContent = "Password must contain at least one uppercase letter.";
    } else if (!/[0-9]/.test(password)) {
      statusPassword.style.color = "red";
      statusPassword.textContent = "Password must contain at least one number.";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      statusPassword.style.color = "red";
      statusPassword.textContent = "Password must contain at least one special character.";
    } else {
      statusPassword.style.color = "green";
      statusPassword.textContent = "Your password format is strong!";
    }

    // If email and password are valid, proceed with AJAX request
    if (statusEmail.textContent === "True email format" && statusPassword.textContent === "Your password format is strong!") {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", settings.apiUrl, true);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            try {
              const users = JSON.parse(xhr.responseText);
              console.log(users.value)
              if (Array.isArray(users) && users.length > 0) {
                const loggedInUser = users.find(user => user.email === email && user.password === password);
                if (loggedInUser) {
                  // Save user data to localStorage
                  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                  formStatus.style.color = "green";
                  formStatus.textContent = "Login successful! Redirecting...";

                  setTimeout(() => {
                    window.location.href = settings.redirectUrl;
                  }, 2000);
                } else {
                  showError("Invalid email or password.");
                }
              } else {
                showError("No users found.");
              }
            } catch (error) {
              showError("Failed to parse response data.");
            }
          } else {
            showError("An error occurred. Please try again.");
          }
        }
      };

      // Send email and password as JSON
      const data = JSON.stringify({ email, password });
      xhr.send(data);
    } else {
      formStatus.style.color = "red"
      formStatus.textContent = "Login is not submitted!";
    }
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(message) {
    errorStatus.style.color = "red";
    errorStatus.textContent = message;
  }
})