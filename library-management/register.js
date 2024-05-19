
document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const newEmailInput = document.getElementById('newEmail');
        const newPasswordInput = document.getElementById('newPassword');
        const newEmail = newEmailInput.value;
        const newPassword = newPasswordInput.value;
        window.opener.postMessage({ email: newEmail, password: newPassword }, '*');
        window.close();
    });
});
