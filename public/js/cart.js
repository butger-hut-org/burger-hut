// Retrieve cart items from localStorage
function getCartItems() {
    const cart = localStorage.getItem('cart');
    try {
        return JSON.parse(cart) || [];
    } catch (e) {
        console.error('Error parsing cart from localStorage:', e);
        return [];
    }
}

// Function to fetch a product by ID
async function fetchProduct(id) {
    const url = `http://localhost:9898/api/products/search?productId=${encodeURIComponent(id)}`;
    try {
        const response = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        return null;
    }
}

// Fetch all products in the cart
async function fetchAllProducts() {
    const cartItems = getCartItems();
    const fetchPromises = cartItems.map(item => fetchProduct(item.productId));
    const products = await Promise.all(fetchPromises);
    return products.filter(product => product !== null);
}

// Render the cart with total price
function renderCart(products) {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    if (products.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Your cart is empty.</p>';
        return;
    }

    const cartItems = getCartItems(); // Get stored cart items with size

    let totalPrice = 0; // Initialize total price

    const productList = products.map((product, index) => {
        const cartItem = cartItems[index]; // Retrieve corresponding cart item details

        // Calculate price based on size
        let price = product.basePrice;
        if (cartItem.size === 'M') price += product.extraPrice;
        else if (cartItem.size === 'L') price += 2 * product.extraPrice;

        totalPrice += price * cartItem.quantity; // Add to total price

        return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <img src="${product.imageUrl}" alt="${product.name}" class="img-thumbnail me-3" style="width: 80px; height: 80px;">
                    <div>
                        <h5 class="mb-1">${product.name}</h5>
                        <p class="mb-1">${product.description}</p>
                        <p class="mb-1 text-muted">Size: ${cartItem.size}</p>
                        <p class="mb-1 text-muted">Price: $${price.toFixed(2)}</p>
                    </div>
                </div>
                <div>
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${product._id}')">Remove</button>
                </div>
            </li>
        `;
    }).join('');

    // Append the product list to the container
    cartContainer.innerHTML = `<ul class="list-group">${productList}</ul>`;

    // Add the total price below the product list
    renderTotalPrice(totalPrice);
}

// Render the total price
function renderTotalPrice(totalPrice) {
    let totalPriceElement = document.getElementById('total-price');

    // If the total price element doesn't exist, create it
    if (!totalPriceElement) {
        totalPriceElement = document.createElement('h3');
        totalPriceElement.id = 'total-price';
        totalPriceElement.className = 'text-end mt-3';
        document.getElementById('cart-container').appendChild(totalPriceElement); // Append below the cart
    }

    // Update the total price text
    totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
}

// Remove an item from the cart
function removeFromCart(productId) {
    const cartItems = getCartItems();
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    fetchAllProducts().then(products => renderCart(products));
}

// Place an order
async function placeOrder() {
    const cartItems = getCartItems();
    if (cartItems.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderData = {
        products: cartItems.map(item => ({ productId: item.productId, amount: item.quantity, size: item.size })),
    };

    try {
        const response = await fetch('http://localhost:9898/api/orders/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        renderCart([]);
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Failed to place the order. Please try again.');
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
    const products = await fetchAllProducts();
    renderCart(products);
});
document.getElementById('place-order-btn').addEventListener('click', placeOrder);