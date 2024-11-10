$(document).ready(function() {
    $("#register_form").submit(function (event) {
        event.preventDefault(); // Prevent the default form submission

        // Collect form data
        const email = $('input[name="email"]').val().trim();
        const username = $('input[name="username"]').val().trim();
        const password = $('input[name="password"]').val();
        const address = $('input[name="address"]').val().trim();
        const city = $('input[name="city"]').val().trim();
        const confirmPassword = $('input[name="confirmPassword"]').val();
        const creditNumber = $('input[name="creditNumber"]').val().trim();
        const date = $('input[name="date"]').val().trim();
        const cvv = $('input[name="cvv"]').val().trim();

        // Basic validation
        if (!email || !username || !password || !address || !city ||!confirmPassword || !creditNumber || !date || !cvv) {
            document.getElementById('error-message').innerText = 'All fields are required.';
            return; // Stop the submission
        }

        if (password !== confirmPassword) {
            document.getElementById('error-message').innerText = 'Passwords do not match.';
            return; // Stop the submission
        }

        // Prepare the request
        const formData = {
            email,
            username,
            password,
            address,
            city,
            confirmPassword,
            creditNumber,
            date,
            cvv
        };

        var registerRequest = new Request('/api/users/register', {
            headers: { "Content-Type": "application/json" },
            method: 'POST',
            body: JSON.stringify(formData)
        });

        // Send the request
        fetch(registerRequest)
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        // Throw an error with the message from the error response
                        throw new Error(errorData.message || 'An error occurred');
                    });
                }
                return response.json();
            })
            .then(data => {
                alert(data.message || 'Success')
                window.location.replace('/'); // Redirect on success
            })
            .catch(err => {
                console.log(err);
                document.getElementById('error-message').innerText = err.message || 'An error occurred. Please try again.';
            });
    });
});
