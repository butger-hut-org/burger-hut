$('.active-page-side-bar').removeClass('active-page-side-bar');
$('a[href="/userManagement"]').addClass("active-page-side-bar");

$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/list",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (let index = 0; index < response.length; index++) {
                const userValues = response[index];

                let userRow = $("#userRow").html();

                for (const key in userValues) {
                    userRow = userRow.replaceAll(
                        "{" + key + "}",
                        userValues[key]
                    );
                }
                $("#userTable").append(userRow);
            }
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function (response) {
            alert("Error");
            console.log(response);
        },
    });
    $("input").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#userTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function deleteUser(element) {
    let userToDelete = document.getElementById('userTable').rows[element.parentNode.parentNode.rowIndex - 1].cells[0].innerText;
    $.ajax({
        url: "api/users/delete",
        type: "DELETE",
        data: {userToDelete: userToDelete},
        success: function (response) {
            alert('user was deleted');
            location.reload();
        },
        error: function () {
            alert('failed to delete user');
        }
    });
}

function promoteUser(element) {
    let userToPromote = document.getElementById('userTable').rows[element.parentNode.parentNode.rowIndex - 1].cells[0].innerText;
    $.ajax({
        url: "api/users/promote",
        type: "PUT",
        data: {userToPromote: userToPromote},
        success: function (res) {
            alert(res);
            location.reload();
        },
        error: function () {
            alert(res);
        }
    });
}