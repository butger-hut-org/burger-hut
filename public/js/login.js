$(document).ready(function () {

});

$("#login_form").submit(function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    var loginRequest = new Request('login', {
        headers: {"Content-Type": "application/json"},
        method: 'POST',
        body: JSON.stringify({username, password})
    });

    fetch(loginRequest)
        .then((response) => {
            if (response.status == 401) {
                alert("Oops, username or password are inccorect")
            } else if (response.status != 200) {
                alert("Something went wrong, please try again")
            } else {
                window.location.replace('http://localhost:9898/');
            }
        }).catch(err => {
        console.log(err)
    });
})

