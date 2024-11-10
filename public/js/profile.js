$(document).ready(function () {
    getUser();
  });

function getUser() {
    $.ajax({
      type: "GET",
      url: `api/users/`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (response) {
        $("#username").text(response.username);
        $("#password").text(response.password); 
        $("#email").text(response.email);
        $("#address").text(response.address);
        $("#city").text(response.city);
        $("#creditNumber").text(response.creditNumber);
        $("#date").text(response.date);
        $("#cvv").text(response.cvv);
      },
      error: function (response) {
        alert("Error loading user details: " + response.responseText);
      },
    });
}

function changeUserPopupToEdit() {
    $.ajax({
        type: "GET",
        url: "/api/users/", 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $('#usernameInput').val(response.username);
            $('#passwordInput').val(response.password); 
            $('#emailInput').val(response.email);
            $('#addressInput').val(response.address);
            $('#cityInput').val(response.city);
            $('#creditNumberInput').val(response.creditNumber);
            $('#dateInput').val(response.date);
            $('#cvvInput').val(response.cvv);
        },
        error: function (response) {
            alert("Error loading user details: " + response.responseText);
        }
    });
}

function editUser() {
    const request = {
        username: $('#usernameInput').val(),
        password: $('#passwordInput').val(),
        email: $('#emailInput').val(),
        address: $('#addressInput').val(),
        city: $('#cityInput').val(),
        creditNumber: $('#creditNumberInput').val(),
        date: $('#dateInput').val(),
        cvv: $('#cvvInput').val()
    };
    $.ajax({
        url: `/api/users/`,
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(request),
        success: function (res) {
            alert("User updated successfully!");
            location.reload(); 
        },

        error: function (res) {
            alert("Error updating user: " + res.responseText);
        },
    });
}