document.addEventListener('DOMContentLoaded', () => { 
    $.ajax({
        type: "GET",
        url: "/api/products/groupBy?field=category",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (productsResponse) {
            productsResponse.forEach(category => {
                generateMenuItems(category);
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
    $("#menuSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#menuItems div").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

function generateMenuItems(category) {
    const menuItemsContainer = document.getElementById("menuItems");

    const categoryTitle = document.createElement("h1");
    categoryTitle.textContent = `${category['_id']}`;
    categoryTitle.className = "category-title";

    menuItemsContainer.appendChild(categoryTitle);
    
    category['products'].forEach(product => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");
        itemDiv.id = (product._id);

        // const img = document.createElement("img");
        // img.src = product.imgSrc;
        // img.alt = product.name;

        const title = document.createElement("h3");
        title.textContent = `${product.name}`;

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
    let itemFields = collectFormFields();
    if (!itemFields){
        return;
    }
    const productId = document.getElementById('productId').innerText;
    itemFields.productId = productId;
    let currentProductsInCart = localStorage.getItem('cart');
    if (!currentProductsInCart){
        currentProductsInCart = [];
    }
    else {
        currentProductsInCart = JSON.parse(currentProductsInCart);
    }

    let existingItem = currentProductsInCart.find(
        cartItem => cartItem.productId === itemFields.productId && 
        cartItem.size === itemFields.size
    );
    if (existingItem){
        existingItem.quantity = parseInt(existingItem.quantity, 10);
        itemFields.quantity = parseInt(itemFields.quantity, 10);
        existingItem.quantity += itemFields.quantity;
    }
    else{
        currentProductsInCart.push(itemFields);
    }

    localStorage.setItem('cart', JSON.stringify(currentProductsInCart));
}

function collectFormFields() {
    const request = {
        size: $("#productSize").val(),
        quantity: $("#productQuantity").val()
    };
    if (!request.size || !request.quantity) {
        alert("Please fill out all fields");
        return null;
    }
    return request;
}