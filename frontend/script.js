const settings = {
  apiUrl: "http://localhost:5000/users", // API endpoint fetch user data without query parameters
  redirectUrl: "../frontend/home.html"  // The page to redirect the user to after a successful login
};

// Login DOM
const loginForm = document.getElementById("login"); //Selects the login form element.
const statusEmail = document.querySelector(".status-email"); //Displays status messages for the email field.
const statusPassword = document.querySelector(".status-password"); //Displays status messages for the password field.
const errorStatus = document.querySelector(".error-status"); // Assuming you have an element for error/success messages
const formStatus = document.querySelector(".form-status");  //Displays the overall form status.

document.addEventListener("DOMContentLoaded", () => {  // This code runs when the page is fully loaded.
  // Check if login form exists to avoid errors
  if (!loginForm) {  //If the login form is not found, an error is logged, and the code stops executing.
    console.error('Login form not found!');
    return;
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Stops the form from submitting and refreshing the page.

    //The email, password, and form status elements are made visible.
    statusEmail.style.display = "block";
    statusPassword.style.display = "block";
    formStatus.style.display = "block";

    // email and password: Retrieve the values entered by the user.
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    statusEmail.textContent = ""; // Reset error message
    statusPassword.textContent = ""; // Reset error message
    formStatus.textContent = ""; // Reset error message

    // Validate email
    if (!validateEmail(email)) {  //Checks if the email is in a valid format.
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
    //Validates the password for length, uppercase letters, numbers, and special characters.
    //Displays an error message if any condition is not met.

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
      const xhr = new XMLHttpRequest();  //Used to communicate with the API.
      xhr.open("GET", settings.apiUrl, true);  //Sends a GET request to settings.apiUrl.
      xhr.setRequestHeader("Content-Type", "application/json"); //Specifies that the data is sent in JSON format.

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {  //The request is complete.
          if (xhr.status === 200) {  //The request was successful.
            try {
              const users = JSON.parse(xhr.responseText); //Converts the response data to JSON.
              console.log(users.value)
              if (Array.isArray(users) && users.length > 0) { //Checks if the response is an array.
                //Finds the user with matching email and password.
                const loggedInUser = users.find(user => user.email === email && user.password === password);
                if (loggedInUser) {
                  // Save user data to localStorage
                  localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                  formStatus.style.color = "green";
                  formStatus.textContent = "Login successful! Redirecting...";

                  setTimeout(() => { //Redirects the user after 2 seconds.
                    window.location.href = settings.redirectUrl;
                  }, 2000);
                } else {
                  showError("Invalid email or password."); // Displays error messages in red.
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

  function validateEmail(email) { //Validates the email format using a regular expression.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(message) {
    errorStatus.style.color = "red";
    errorStatus.textContent = message;
  }
})