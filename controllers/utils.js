function getIsraelCoordinates() {
    const lat = (Math.random() * (33.5 - 29.5) + 29.5).toFixed(6); // Random latitude
    const lon = (Math.random() * (35.5 - 34.5) + 34.5).toFixed(6); // Random longitude
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

module.exports = {
    getIsraelCoordinates
};
  