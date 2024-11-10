// const CATEGORIES = ['Standard', 'Spicy', 'Vegan'];

document.addEventListener('DOMContentLoaded', () => {
    $.ajax({
        type: "GET",
        url: "/api/products/groupBy?field=category",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (productsResponse) {
            productsResponse.forEach(category => {
                generateMenuItemsByCategory(category);
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


function generateMenuItemsByCategory(category) {
    const menuItemsContainer = document.getElementById("menuItems");

    const categoryTitle = document.createElement("h1");
    categoryTitle.textContent = `${category['_id']}`;
    categoryTitle.className = "category-title";

    menuItemsContainer.appendChild(categoryTitle);
    
    category['products'].forEach(product => {
        var cardItem = createProductCard(product);
        // Append item div to the menuItems container
        menuItemsContainer.appendChild(cardItem);
    });

}

function removeAllMenuItems(){
    document.getElementById('menuItems').innerHTML = '';
}

function createProductCard(product){
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

        if (product.bestSeller) {
            const bestSeller = document.createElement("p");
            bestSeller.classList.add("text-success");
            bestSeller.innerHTML = `<strong>🌟 Best Seller 🌟</strong>`;
            itemDiv.appendChild(bestSeller);
        }
       
        // Append all elements to the item div
        // itemDiv.appendChild(img);
        itemDiv.appendChild(title);
        itemDiv.appendChild(price);
        itemDiv.appendChild(button);
        
        return itemDiv;
}

function addItemIdToModal(id){
    $('#productSize').val('');
    $('#productQuantity').val('');
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
    alert('Added to cart!');
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

function submitFilter() {
    const category = document.getElementById("category").value;
    const bestSeller = document.getElementById("bestSeller").value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
  
    // Build the query string
    const queryString = new URLSearchParams({
        category,
        bestSeller,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined
    }).toString();
  
    $.ajax({
        url: `/api/products/searchSpecific?${queryString}`,
        method: 'GET',
        dataType: 'json',
        success: function(products) {
            removeAllMenuItems();
            generateMenuItems(products);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("Error:", textStatus, errorThrown);
        }
      });
}

function generateMenuItems(products) { // without categories
    const menuItemsContainer = document.getElementById("menuItems");
    products.forEach(product => {
        var cardItem = createProductCard(product);
        menuItemsContainer.appendChild(cardItem);
    });
}