const port = 9898;

$(document).ready(function () {
  getBranches();
});

function getBranches() {
  $.ajax({
    type: "GET",
    url: `http://localhost:${port}/api/branches`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (branches) {
      branches.forEach((branch) => {
        let branchObject = $("#branchCard").html();
        Object.keys(branch).forEach((key) => {
          branchObject = branchObject.replaceAll("{" + key + "}", branch[key]);
        });
        $("#branchList").append(branchObject);
      });
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
