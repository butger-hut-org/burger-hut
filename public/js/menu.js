document.addEventListener('DOMContentLoaded', () => { 
    $.ajax({
        type: "GET",
        url: "http://localhost:9898/api/products/list",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            const products = response.result;
            generateMenuItems(products);
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


// Function to generate menu items dynamically
function generateMenuItems(products) {
    const menuItemsContainer = document.getElementById("menuItems");

    products.forEach(product => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.id = (product._id);

        // const img = document.createElement("img");
        // img.src = product.imgSrc;
        // img.alt = product.name;

        const title = document.createElement("h3");
        title.textContent = `${product.name} - ${product.category}`;

        const price = document.createElement("p");
        price.textContent = `$${product.basePrice.toFixed(2)}`;
        const button = document.createElement("a");
        
        button.textContent = "Add to Cart";
        button.classList.add("btn", "btn-primary");
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#addToCartModal');
        button.setAttribute('onclick', `addItemIdToModal('${product._id}')`);
       
        // Append all elements to the item div
        // itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(price);
        itemDiv.appendChild(button);

        // Append item div to the menuItems container
        menuItemsContainer.appendChild(itemDiv);
    });
}

function addItemIdToModal(id){
    const itemDiv1 = document.getElementById("productId");
    itemDiv1.innerText = id;
}

function addToTempCart(){
    const itemFields = collectFormFields();
    const productId = document.getElementById('productId').innerText;
    localStorage.setItem(productId, JSON.stringify(itemFields));
}

function collectFormFields() {
    const request = {
        size: $("#productSize").val(),
        quantity: $("#productQuantity").val()
    };
    console.log(request.size);
    console.log(request.quantity);
    if (request.size == null || request.quantity == null) {
        alert("Please fill out all fields");
        return null;
    }
    return request;
}