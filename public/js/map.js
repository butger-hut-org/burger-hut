const CENTER_ISRAEL_COORDINATES = [31.5461, 34.8516];
const ZOOM_LEVEL = 7;
const port1 = 9898;
const map = L.map("map").setView(CENTER_ISRAEL_COORDINATES, ZOOM_LEVEL);

$(document).ready(function () {
  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
  }).addTo(map);
});

function addMarker(lat, lon, popupText) {
  const marker = L.marker([lat, lon]).addTo(map);
  if (popupText) {
    marker.bindPopup(popupText).openPopup();
  }
}

function getRandomCoordinates() {
  const lat = (Math.random() * (33.5 - 29.5) + 29.5).toFixed(6); // Random latitude
  const lon = (Math.random() * (35.5 - 34.5) + 34.5).toFixed(6); // Random longitude
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

function markBranches(branchList) {
  branchList.map((_) => {
    let location = getRandomCoordinates();
    addMarker(location.lat, location.lon, location.name);
  });
}
