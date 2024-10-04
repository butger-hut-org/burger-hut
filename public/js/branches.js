$(document).ready(function () {
  initializePage();
});

function initializePage() {
  $("#newBranchForm").hide();
  $("#addBranchButton").click(function () {
    $("#saveBranchButton").text("Create");
    resetForm();
    $("#newBranchForm").toggle();
  });
  $("#cancelButton").click(function () {
    resetForm();
    $("#newBranchForm").toggle();
  });
  saveBranch();
  getBranches();
}

function getBranches() {
  $.ajax({
    type: "GET",
    url: "http://localhost:9898/api/branches",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (response) {
      for (let index = 0; index < response.length; index++) {
        let branch = response[index];
        let branchObject = $("#branchCard").html();
        for (const key in branch) {
          branchObject = branchObject.replaceAll("{" + key + "}", branch[key]);
        }
        $("#branchList").append(branchObject);
      }

      $(".editBranchButton").click(function () {
        const branchId = $(this).data("id");
        editBranch(branchId);
      });
      $(".deleteBranchButton").click(function () {
        const branchId = $(this).data("id");
        deleteBranch(branchId);
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
    url: `http://localhost:9898/api/branches/${branchId}`,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    success: function (branch) {
      // Populate the form with the existing branch data
      $("#branchId").val(branch._id);
      $("#branchName").val(branch.name);
      $("#branchAddress").val(branch.address);
      $("#branchCity").val(branch.city);
      $("#branchPhoneNumber").val(branch.phoneNumber);
      // Show the form
      $("#saveBranchButton").text("Save");
      $("#newBranchForm").show();
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
      url: `http://localhost:9898/api/branches/${branchId}`,
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
  $("#saveBranchButton").click(function () {
    const branchId = $("#branchId").val();
    const branchData = {
      name: $("#branchName").val(),
      address: $("#branchAddress").val(),
      city: $("#branchCity").val(),
      phoneNumber: $("#branchPhoneNumber").val(),
      active: true,
    };
    if (branchId) {
      updateBranch(branchId, branchData);
    } else {
      createBranch(branchData);
    }
  });
}

function updateBranch(branchId, branchData) {
  $.ajax({
    type: "PUT",
    url: `http://localhost:9898/api/branches/${branchId}`,
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(branchData),
    success: function () {
      $("#newBranchForm").hide();
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
    url: "http://localhost:9898/api/branches",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify(branchData),
    success: function () {
      $("#newBranchForm").hide();
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
  $("#branchCity").val("");
  $("#branchPhoneNumber").val("");
}
