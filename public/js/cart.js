// Function to fetch a single product by ID
async function fetchProduct(id) {
    const url = `http://localhost:9898/api/products/search?productId=${encodeURIComponent(id)}`; // Replace with your actual API endpoint
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error(`Error fetching productId ${id}:`, error);
        return null;
    }
}

// Function to fetch all products by calling fetchProduct for each ID
async function fetchAllProducts() {
    const tempOrder = getTempOrder();
    const orderObj = JSON.parse(tempOrder);
    const productIds = Object.keys(orderObj);
    const fetchPromises = productIds.map(id => fetchProduct(id));
    const products = await Promise.all(fetchPromises);
    return products.filter(product => product !== null);
}

// Function to retrieve all localStorage items as a JSON string
function getTempOrder() {
    return localStorageToJson();
}

// Function to convert localStorage to a JSON string
function localStorageToJson() {
    const storageObj = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        try {
            storageObj[key] = JSON.parse(value);
        } catch (e) {
            storageObj[key] = value;
        }
    }
    return JSON.stringify(storageObj, null, 2);
}

// Fetch and display all products when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const products = await fetchAllProducts();
        renderCart(products);
    } catch (error) {
        console.error('An error occurred:', error);
    }
});

// Function to render the cart items in a list format using Bootstrap
function renderCart(products) {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (products.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        return;
    }

    const productList = products.map(product => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                <img src="${product.imageUrl}" alt="${product.name}" class="img-thumbnail me-3" style="width: 80px; height: 80px;">
                <div>
                    <h5 class="mb-1">${product.name}</h5>
                    <p class="mb-1">${product.description}</p>
                    <p class="mb-1 text-muted">Price: $${product.price}</p>
                </div>
            </div>
            <div>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product.id}')">Remove</button>
            </div>
        </li>
    `).join('');

    cartContainer.innerHTML = `<ul class="list-group">${productList}</ul>`;
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    localStorage.removeItem(productId);
    fetchAllProducts().then(products => renderCart(products));
}