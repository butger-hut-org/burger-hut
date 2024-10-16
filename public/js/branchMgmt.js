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
    success: function (response) {
        response.forEach((branch) => {
        let branchObject = $("#branchContainer").html();
        Object.keys(branch).forEach((key) => {
          branchObject = branchObject.replaceAll("{" + key + "}", branch[key]);
        });
        $("#branchList").append(branchObject);
      });
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

function editBranch(branchId) {
  $.ajax({
    type: "GET",
    url: `http://localhost:${port}/api/branches/${branchId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (branch) {
      // Populate the form with the existing branch data
      $("#addBranchPopup").modal('toggle');
      $("#branchId").val(branchId);
      $("#branchName").val(branch.name);
      $("#branchAddressFields").hide();
      $("#branchCityFields").hide();
      $("#branchPhoneNumber").val(branch.phoneNumber);
      $("#branchStatus").val(branch.active ? "true" : "false");
      $("#branchModalLabel").text("Edit Branch");
      $("#saveBranchButton").text("Save");
    },
    error: function (response) {
      alert("Error fetching branch details: " + response.responseText);
    },
  });
}

function deleteBranch(branchId) {
  if (confirm("Are you sure you want to delete this branch?")) {
    $.ajax({
      type: "DELETE",
      url: `http://localhost:${port}/api/branches/${branchId}`,
      success: function () {
        // Reload the branches list after deletion
        $("#branchList").empty();
        getBranches();
      },
      error: function (response) {
        alert("Error deleting branch: " + response.responseText);
      },
    });
  }
}

function saveBranch() {
  const branchId = $("#branchId").val();
  const commonBranchData = {
    name: $("#branchName").val(),
    phoneNumber: $("#branchPhoneNumber").val(),
    active: $("#branchStatus").val(),
  };
  if (branchId) {
    updateBranch(branchId, commonBranchData);
  } else {
    createBranch({ ...commonBranchData ,address: $("#branchAddress").val() ,city: $("#branchCity").val() });
  }
  $("#addBranchPopup").modal("toggle");
  resetForm();
}

function updateBranch(branchId, branchData) {
  $.ajax({
    type: "PUT",
    url: `http://localhost:${port}/api/branches/${branchId}`,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(branchData),
    success: function () {
      $("#branchList").empty();
      getBranches(); // Refresh the list
    },
    error: function (response) {
      alert("Error updating branch: " + response.responseText);
    },
  });
}

function createBranch(branchData) {
  $.ajax({
    type: "POST",
    url: `http://localhost:${port}/api/branches`,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(branchData),
    success: function () {
      $("#branchList").empty();
      getBranches(); // Refresh the list
    },
    error: function (response) {
      alert("Error creating branch: " + response.responseText);
    },
  });
}

function resetForm() {
  $("#branchId").val("");
  $("#branchName").val("");
  $("#branchAddress").val("");
  $("#branchAddressFields").show();
  $("#branchCity").val("");
  $("#branchCityFields").show();
  $("#branchPhoneNumber").val("");
  $("#branchStatus").val("");
  $("#branchModalLabel").text("Add New Branch");
  $("#saveBranchButton").text("Create");
}
