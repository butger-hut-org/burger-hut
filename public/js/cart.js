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
        console.log(products);
    } catch (error) {
        console.error('An error occurred:', error);
    }
});