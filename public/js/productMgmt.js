document.addEventListener('DOMContentLoaded', () => {
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/products/list",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            const products = response.result;
            products.forEach(product => {
                // Create card column container
                const colDiv = document.createElement("div");
                colDiv.classList.add("col-md-4", "mb-4");

                // Create the card
                const cardDiv = document.createElement("div");
                cardDiv.classList.add("card", "h-100", "d-flex", "flex-column");

                // Create card body
                const cardBodyDiv = document.createElement("div");
                cardBodyDiv.classList.add("card-body");

                // Create the dropdown button
                const dropdownButton = document.createElement("button");
                dropdownButton.classList.add("btn", "btn-secondary", "dropdown-toggle", "position-absolute", "top-0", "end-0", "m-2");
                dropdownButton.setAttribute("type", "button");
                dropdownButton.setAttribute("id", "optionsMenuButton");
                dropdownButton.setAttribute("data-bs-toggle", "dropdown");
                dropdownButton.setAttribute("aria-expanded", "false");

                // Create the dropdown menu
                const dropdownMenu = document.createElement("ul");
                dropdownMenu.classList.add("dropdown-menu");
                dropdownMenu.setAttribute("aria-labelledby", "optionsMenuButton");

                // Create DELETE item in dropdown
                const deleteItem = document.createElement("li");
                const deleteLink = document.createElement("a");
                deleteLink.classList.add("dropdown-item");
                deleteLink.href = "#";
                deleteLink.textContent = "DELETE";
                deleteLink.onclick = () => deleteProduct(product._id, product.name);
                deleteItem.appendChild(deleteLink);

                // Create EDIT item in dropdown
                const editItem = document.createElement("li");
                const editLink = document.createElement("a");
                editLink.classList.add("dropdown-item");
                editLink.href = "#";
                editLink.textContent = "EDIT";
                editLink.onclick = () => {
                    changePopupToEdit(product._id);
                };
                editItem.setAttribute('data-bs-toggle', 'modal');
                editItem.setAttribute('data-bs-target', '#addProductPopup');
                editItem.appendChild(editLink);

                // Append dropdown items to dropdown menu
                dropdownMenu.appendChild(deleteItem);
                dropdownMenu.appendChild(editItem);

                // Create title, description, and other elements for the card
                const title = document.createElement("h5");
                title.classList.add("card-title");
                title.textContent = product.name;

                const description = document.createElement("p");
                description.classList.add("card-text");
                description.innerHTML = `<strong>Description:</strong> ${product.description}`;

                const basePrice = document.createElement("p");
                basePrice.classList.add("card-text");
                basePrice.innerHTML = `<strong>Base Price:</strong> ${product.basePrice.toFixed(2)} $`;

                const extraPrice = document.createElement("p");
                extraPrice.classList.add("card-text");
                extraPrice.innerHTML = `<strong>Extra Price:</strong> ${product.extraPrice.toFixed(2)} $`;

                const category = document.createElement("p");
                category.classList.add("card-text");
                category.innerHTML = `<strong>Category:</strong> ${product.category}`;

                // Optional best seller label
                if (product.bestSeller) {
                    const bestSeller = document.createElement("p");
                    bestSeller.classList.add("text-success");
                    bestSeller.innerHTML = `<strong>🌟 Best Seller 🌟</strong>`;
                    cardBodyDiv.appendChild(bestSeller);
                }

                // Append all elements to the card body
                cardBodyDiv.appendChild(dropdownButton);
                cardBodyDiv.appendChild(dropdownMenu);
                cardBodyDiv.appendChild(title);
                cardBodyDiv.appendChild(description);
                cardBodyDiv.appendChild(basePrice);
                cardBodyDiv.appendChild(extraPrice);
                cardBodyDiv.appendChild(category);

                // Append card body to card, and card to column div
                cardDiv.appendChild(cardBodyDiv);
                colDiv.appendChild(cardDiv);

                // Append the entire column div to the product list
                const productList = document.getElementById("product-list");
                productList.appendChild(colDiv);
            });
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failed loading products");
        },
        error: function (response) {
            alert("Error");
            alert(response);
        },
    });
    $("input").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#product-list").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});


function deleteProduct(productId,productName){
    const userResponse = confirm("Do you want to proceed?");
    if(!userResponse){
        return;
    }
    $.ajax({
        url: "http://localhost:9898/api/products/delete",
        type: "DELETE",
        data: {productId: productId, name: productName},
        success: function (response) {
            alert("product was deleted:)");
            location.reload();
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function () {
            alert("failed to delete product");
        },
    });
}

function createProduct(){
    const req = collectFormFields();
    if (req != null) {
        $.ajax({
            url: "http://localhost:9898/api/products/create",
            type: "POST",
            data: {
                name: req.name,
                description: req.description,
                basePrice: req.basePrice,
                extraPrice: req.extraPrice,
                category: req.category,
                bestSeller: req.bestSeller,
            },
            success: function (res) {
                alert("The product was created!");
                location.reload();
            },
            failure: function (response) {
                alert(response.responseText);
                alert("Failure");
            },
            error: function (res) {
                alert("Oops, we got an error");
                alert(res.msg.statusCode);
            },
        });
    }
}


function collectFormFields() {
    const request = {
        name: $("#productName").val(),
        description: $("#productDescription").val(),
        category: $("#productCategory").val(),
        basePrice: $("#productBasePrice").val(),
        extraPrice: $("#productExtraPrice").val(),
        bestSeller: $("#bestSeller").is(":checked") ? "true" : "false",
    };
    if (request.name == null || request.basePrice == null ||
        request.description == null || request.category == null) {
        alert("Please fill out all fields")
        return null;
    }
    if (request.category != "Standard" && request.category != "Vegan" && request.category != "Spicy") {
        alert("Category can be only Standard / Vegan / Spicy")
        return null
    }
    return request;
}

function updateProduct(productId) {
    const req = collectFormFields();
    $.ajax({
        url: "http://localhost:9898/api/products/update",
        type: "POST",
        data: {
            name: req.name,
            description: req.description,
            basePrice: req.basePrice,
            extraPrice: req.extraPrice,
            category: req.category,
            bestSeller: req.bestSeller,
            productId: productId
        },
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
            alert("Failed to update the product");
        },
    });

};

function changePopupToEdit(productId){
    $('#actionButton').text('Edit');
    $('#productModalLabel').text('Edit product');
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/products/search",
        contentType: "application/json; charset=utf-8",
        data: {
            productId: productId
        },
        success: function (response) {
            let product = response.result;
            $('#productBasePrice').val(product.basePrice);
            $('#productDescription').val(product.description);
            $('#productName').val(product.name);
            $('#productCategory').val(product.category);
            $('#bestSeller').val(product.bestSeller);
        }
    });

    const button = document.getElementById('actionButton');
    button.setAttribute( "onClick", `updateProduct('${productId}')`);
}


function changePopupToCreate(){
    $('#actionButton').text('Create');
    $('#productModalLabel').text('Create new product');
    const button = document.getElementById('actionButton');
    button.setAttribute( "onClick", `createProduct()`);
}