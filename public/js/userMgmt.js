$('.active-page-side-bar').removeClass('active-page-side-bar');
$('a[href="/userManagement"]').addClass("active-page-side-bar");

document.addEventListener('DOMContentLoaded', () => {
  
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/users/list",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            const tableBody = $('#userTable');
            for (let index = 0; index < response.length; index++) {
                const userValues = response[index];

                let userRow = $('<tr></tr>');

                $('<td></td>').text(userValues.username).appendTo(userRow);
                $('<td></td>').text(userValues.email).appendTo(userRow);
                $('<td></td>').text(userValues.admin).appendTo(userRow);

                let deleteCell = $('<td></td>');

                // SVG for the delete button
                const deleteButton = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash delete" onclick="deleteUser(this)" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                    </svg>`;

                // Append the SVG inside the deleteCell
                deleteCell.html(deleteButton);

                // Append the delete button cell to the row
                userRow.append(deleteCell);

                // Create and append the Promote button cell
                let promoteCell = $('<td></td>');
                const promoteButton = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-circle" onclick="promoteUser(this)" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                    </svg>`;
                promoteCell.html(promoteButton);
                userRow.append(promoteCell);
                
                tableBody.append(userRow);
                
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