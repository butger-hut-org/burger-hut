const port = 9898;
let filterFields = {};

$(document).ready(function () {
  getBranches();
  addSearchBarListener();
  activeBranchFilteringListener();
});

function getBranches() {
  $.ajax({
    type: "GET",
    url: `http://localhost:${port}/api/branches`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    data: filterFields,
    success: function (branches) {
      $("#branchList").empty();
      branches.forEach((branch) => {
        let branchObject = $("#branchCard").html();
        Object.keys(branch).forEach((key) => {
          branchObject = branchObject.replaceAll("{" + key + "}", branch[key]);
        });
        $("#branchList").append(branchObject);
      });
      $("#branchSearchBar").val("");
      clearMarkers();
      markBranches(branches);
    },
    failure: function (response) {
      alert(response.responseText);
      alert("Failure");
    },
    error: function (response) {
      alert("Error");
      alert(response);
    },
  });
}

function addSearchBarListener() {
  $("#branchSearchBar").on('input', function() {
    const searchText = $(this).val().toLowerCase();
    $("#branchList").children().filter(function() {
      //displays the element if the specified text is present and hides if not
      $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
    });
  });
}

function activeBranchFilteringListener() {
  $("#filterActiveBranches").on('change', function() {
    const isChecked = $(this).prop('checked');
    isChecked ? filterFields["active"] = true : delete filterFields.active;
    getBranches();
  });
}
