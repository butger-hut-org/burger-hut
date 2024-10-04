$("#register_form").submit(function (event) {
    event.preventDefault();

    const formData = {
        email: document.querySelector('input[name="email"]').value,
        username: document.querySelector('input[name="username"]').value,
        password: document.querySelector('input[name="password"]').value,
        confirmPassword: document.querySelector('input[name="confirmPassword"]').value,
        creditNumber: document.querySelector('input[name="creditNumber"]').value,
        date: document.querySelector('input[name="date"]').value,
        cvv: document.querySelector('input[name="cvv"]').value
    };

    var registerRequest = new Request('register', {
        headers: { "Content-Type": "application/json" },
        method: 'POST',
        body: JSON.stringify(formData)
    });

    fetch(registerRequest)
        .then(response => response.json())
        .then(data => {
            if (data.msg) {
                // Display the error message from the response
                document.getElementById('error-message').innerText = data.msg;
            } else {
                window.location.replace('/');
            }
        })
        .catch(err => {
            console.log(err);
            document.getElementById('error-message').innerText = 'An error occurred. Please try again.';
        });
});
