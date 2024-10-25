// Fetch all orders from the server
async function fetchOrders() {
    try {
        const response = await fetch('/api/orders'); 
        if (!response.ok) {
            throw new Error(`Error fetching orders: ${response.statusText}`);
        }
        const { orders } = await response.json();
        return orders;
    } catch (error) {
        console.error('Error fetching orders:', error);
        return [];
    }
}

// Render orders in the table
function renderOrders(orderList) {
    const ordersTableBody = document.getElementById('ordersTableBody');
    ordersTableBody.innerHTML = ''; // Clear existing rows

    if (orderList.length === 0) {
        ordersTableBody.innerHTML = '<tr><td colspan="6" class="text-center">No orders found.</td></tr>';
        return;
    }

    orderList.forEach(order => {
        const totalAmount = order.products.reduce((total, product) => {
            // Aligning price calculation with cart logic
            const basePrice = Number(product.product.basePrice) || 0;
            const extraPrice = Number(product.product.extraPrice) || 0;
            const productPrice = calculateProductPrice(basePrice, extraPrice, product.size);

            const productTotal = productPrice * product.amount; // Calculate total for the product
            return total + productTotal; // Accumulate total amount for the order
        }, 0);

        const productDetails = order.products.map(product => {
            const basePrice = Number(product.product.basePrice) || 0;
            const extraPrice = Number(product.product.extraPrice) || 0;
            const productPrice = calculateProductPrice(basePrice, extraPrice, product.size);

            return `
                <li>${product.product.name} (x${product.amount}) - 
                    ${product.size} - $${productPrice.toFixed(2)}</li>`;
        }).join('');

        const row = `
            <tr>
                <td>${order._id}</td>
                <td>${order.user ? order.user.username : 'Unknown User'}</td>
                <td><ul>${productDetails}</ul></td>
                <td>${new Date(order.orderDate).toLocaleString()}</td>
                <td>${totalAmount.toFixed(2)} $</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteOrder('${order._id}')">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        ordersTableBody.innerHTML += row;
    });
}

// Helper function to calculate the product price based on size
function calculateProductPrice(basePrice, extraPrice, size) {
    if (size === 'M') return basePrice + extraPrice; // Medium: Base + 1x extra price
    if (size === 'L') return basePrice + 2 * extraPrice; // Large: Base + 2x extra price
    return basePrice; // Small or default size: No extra price
}

// Delete an order by ID
async function deleteOrder(orderId) {
    try {
        const response = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Error deleting order: ${response.statusText}`);
        }
        console.log(`Order ${orderId} deleted successfully`);
        refreshOrders(); 
    } catch (error) {
        console.error('Error deleting order:', error);
    }
}

// Refresh the order list by fetching and rendering the data
async function refreshOrders() {
    const orders = await fetchOrders();
    console.log('Fetched orders:', orders); 
    renderOrders(orders);
}

document.addEventListener('DOMContentLoaded', refreshOrders);