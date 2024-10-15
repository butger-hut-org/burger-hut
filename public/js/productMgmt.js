document.addEventListener('DOMContentLoaded', () => {
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/products/list",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            const products = response.result;
            products.forEach(product => {
                const productCard = `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100 d-flex flex-column">
                            <div class="card-body">
                                <button class="btn btn-secondary dropdown-toggle position-absolute top-0 end-0 m-2" type="button" id="optionsMenuButton" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                <ul class="dropdown-menu" aria-labelledby="optionsMenuButton">
                                    <li onclick="deleteProduct('${product._id}')"><a class="dropdown-item" href="#">DELETE</a></li>
                                    <li onclick="changePopupToEdit('${product._id}')" data-bs-toggle="modal" data-bs-target="#addProductPopup"><a class="dropdown-item" href="#">EDIT</a></li>
                                </ul>              
                                <h5 class="card-title">${product.name}</h5>
                                <p class="card-text"><strong>Description:</strong> ${product.description}</p>
                                <p class="card-text"><strong>basePrice:</strong> ${product.basePrice.toFixed(2)} $</p>
                                <p class="card-text"><strong>extraPrice:</strong> ${product.extraPrice.toFixed(2)} $</p>
                                <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                                ${product.bestSeller ? '<p class="text-success"><strong>🌟 Best Seller 🌟</strong></p>' : ''}
                            </div>
                        </div>
                    </div>
                `;
                const productList = document.getElementById('product-list');
                productList.insertAdjacentHTML('beforeend', productCard);
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
        $("#productTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});


function deleteProduct(productId){
    const userResponse = confirm("Do you want to proceed?");
    if(!userResponse){
        return;
    }
    $.ajax({
        url: "http://localhost:9898/api/products/delete",
        type: "POST",
        data: {productId: productId},
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