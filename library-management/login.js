// login.js

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    
    // Define an initial set of credentials
    let credentials = [
        { email: 'kdraksharam@yahoo.com', password: 'password1' },
        { email: 'sdraksahramyahoo.com', password: 'password2' },
        { email: 'user3@example.com', password: 'password3' },
    ];
    
    // Function to add new credentials
    function addCredentials(newCredentials) {
        credentials.push(newCredentials);
    }

    // Listen for messages from the registration page
    window.addEventListener('message', function (event) {
        if (event.origin !== window.location.origin) {
            // Ensure the message is from a trusted source
            return;
        }

        const newCredentials = event.data;
        addCredentials(newCredentials);
        console.log('New credentials added:', newCredentials);
    });

    loginButton.addEventListener('click', function () {
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const email = emailInput.value;
        const password = passwordInput.value;

        // Check if fields are empty
        if (email.trim() === '' || password.trim() === '') {
            alert('Please fill in all fields.');
            return;
        }

        // Check if email and password match any credentials
        const validCredential = credentials.find(
            (cred) => cred.email === email && cred.password === password
        );

        if (validCredential) {
            alert('Login successful');
            // You can redirect the user to a different page or perform other actions here.
        } else {
            alert('Invalid email or password. Please try again.');
        }
    });

    // Redirect to registration page when "New to Library?" button is clicked
    const newToLibraryButton = document.getElementById('signupButton');
    newToLibraryButton.addEventListener('click', function () {
        window.location.href = 'register.html';
    });
});
