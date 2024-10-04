// const { productList } = require('../../controllers/product');

document.addEventListener('DOMContentLoaded', () => {
    $().ready(function () {
        $.ajax({
            type: "GET",
            url: "http://localhost:9898/api/products/list",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                response.result.forEach(product => {
                    const productCard = `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 d-flex flex-column">
                                <div class="card-body">
                                    <button class="btn btn-danger position-absolute top-0 end-0 m-2">Delete</button>
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

    const productList = document.getElementById('product-list');

    
});