const port = 9898;
const southAndCenterBorderLatitude = 31;
const centerAndNorthBorderLatitude = 32.5;
let filterFields = {};

$(document).ready(function () {
  getBranches();
  addSearchBarListener();
  activeBranchFilteringListener();
  regionFilteringListener();
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
          if (key === "phoneNumber") {
            branch[key] = stylePhoneNumber(branch[key])
          }
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
  $("#branchSearchBar").on("input", function() {
    const searchText = $(this).val().toLowerCase();
    $("#branchList").children().filter(function() {
      //displays the element if the specified text is present and hides if not
      $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
    });
  });
}

function activeBranchFilteringListener() {
  $("#filterActiveBranches").on("change", function() {
    const isChecked = $(this).prop("checked");
    isChecked ? filterFields["active"] = true : delete filterFields.active;
    getBranches();
  });
}

function regionFilteringListener() {
  $("#regionFilter").on("change", function() {
    const selectedValue = $(this).val();
    switch (selectedValue) {
      case "North":
        filterFields["location.lat"] = { $gt: centerAndNorthBorderLatitude }
        break;
      case "Center":
        filterFields["location.lat"] = { $gt: southAndCenterBorderLatitude, $lt: centerAndNorthBorderLatitude }
        break;
      case "South":
        filterFields["location.lat"] = { $lt: southAndCenterBorderLatitude }
        break;
      default:
        delete filterFields["location.lat"]
        break;
    }
    getBranches();
  });
}

function stylePhoneNumber(phoneNumber) {
  let dashPosition = phoneNumber.length === 10 ? 3 : 2;
  return phoneNumber.slice(0, dashPosition) + "-" + phoneNumber.slice(dashPosition);
}
