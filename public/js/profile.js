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
        $("#creditNumber").text(response.creditNumber);
        $("#date").text(response.date);
        $("#cvv").text(response.cvv);
      },
      error: function (response) {
        alert("Error loading user details: " + response.responseText);
      },
    });
}

function collectUserFormFields() {
    const request = {
        username: $("#userame").val(),
        password: $("#password").val(),
        email: $("#email").val(),
        creditNumber: $("#creditNumber").val(),
        date: $("#date").val(),
        cvv: $("#cvv").val(),
    };
    if (request.username == null || request.password == null ||
        request.email == null || request.creditNumber == null ||
        request.date == null || request.cvv == null
    ) {
        alert("Please fill out all fields")
        return null;
    }
    return request;
}

function editUser(userId) {
   const req = collectUserFormFields();
    $.ajax({
        url: `/api/users/${userId}`,
        type: "PUT",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            username: req.username,
            password: req.password,
            email: req.email,
            creditNumber: req.creditNumber,
            date: req.date,
            cvv: req.cvv
        }),
        success: function (res) {
            alert("Updated!");
            console.log(res);
            location.reload();
        },
        failure: function (res) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function (res) {
            alert(response.responseText);
            alert("Failed to update user");
        },
    });

};