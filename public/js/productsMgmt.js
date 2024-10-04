
document.addEventListener('DOMContentLoaded', () => {
    $().ready(function () {
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
                                    <button class="btn btn-danger position-absolute top-0 end-0 m-2" onclick="deleteProduct('${product._id}')">Delete</button>
                                    <h5 class="card-title">${product.name}</h5>
                                    <p class="card-text"><strong>Description:</strong> ${product.description}</p>
                                    <p class="card-text"><strong>Price:</strong> $${product.price.toFixed(2)}</p>
                                    <p class="card-text"><strong>Category:</strong> ${product.category}</p>
                                    <p class="card-text"><strong>Size:</strong> ${product.size}</p>
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
});


function deleteProduct(productId){
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
    console.log("im hereeeeeeeeeeeeee")
    // event.preventDefault();
    const req = collectFormFields();
    if (req != null) {
        $.ajax({
            url: "http://localhost:9898/api/products/create",
            type: "POST",
            data: {
                name: req.name,
                description: req.description,
                price: req.price,
                size: req.size,
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
        price: $("#productPrice").val(),
        size: $("#productSize").val(),
        bestSeller: $("#bestSeller").is(":checked") ? "true" : "false",
    };
    console.log(request);
    if (request.name == null || request.price == null || request.size == null || request.description == null || request.category == null) {
        alert("Please fill out all fields")
        return null;
    }
    if (request.category != "Standard" && request.category != "Vegan" && request.category != "Spicy") {
        alert("Category can be only Standard / Vegan / Spicy")
        return null
    }
    return request;
}