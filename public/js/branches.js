$(document).ready(function () {
    getBranches()
});

function getBranches() {
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/branches",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            for (let index = 0; index < response.length; index++) {
                let branch = response[index];
                let branchObject = $('#branchCard').html()
                for (const key in branch) {
                    branchObject = branchObject.replaceAll('{' + key + '}', branch[key])
                }
                $('#branch_list').append(branchObject)

            }
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function (response) {
            alert("Error");
            alert(response);
        }
    });
}