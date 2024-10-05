$(document).ready(function () {
    $("#login_form").submit(function (event) {
        event.preventDefault();
        
        // Collect form data
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Basic validation
        if (!username || !password ) {
            document.getElementById('error-message').innerText = 'All fields are required.';
            return; // Stop the submission
        }
        // Prepare the request
        const formData = {
            username,
            password,
        };
        var loginRequest = new Request('/api/users/login', {
            headers: {"Content-Type": "application/json"},
            method: 'POST',
            body: JSON.stringify(formData)
        });

        fetch(loginRequest)
            .then((response) => {
                if (response.status == 401) {
                    alert("Oops, username or password are inccorect")
                } else if (response.status != 200) {
                    alert("Something went wrong, please try again")
                } else {
                    alert("Welcome back!")
                    window.location.replace('http://localhost:9898/main'); // change this to correct screen
                }
            }).catch(err => {
                console.log(err);
                document.getElementById('error-message').innerText = err.message || 'An error occurred. Please try again.';

        });
})
});