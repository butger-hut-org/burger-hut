const ZOOM_LEVEL = 7;
const CENTER_ISRAEL_COORDINATES = [31.5461, 34.8516];
const OPENSTREENMAP_TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const map = L.map("map").setView(CENTER_ISRAEL_COORDINATES, ZOOM_LEVEL);

$(document).ready(function () {
  // Add OpenStreetMap tiles
  L.tileLayer(OPENSTREENMAP_TILES_URL, { maxZoom: 19 }).addTo(map);
});

function addMarker(lat, lon, popupText) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(popupText);
}

function getRandomCoordinates() {
  const lat = (Math.random() * (33.5 - 29.5) + 29.5).toFixed(6); // Random latitude
  const lon = (Math.random() * (35.5 - 34.5) + 34.5).toFixed(6); // Random longitude
  return { lat: parseFloat(lat), lon: parseFloat(lon) };
}

function markBranches(branchList) {
  branchList.map((branch) => {
    let location = getRandomCoordinates();
    addMarker(location.lat, location.lon, branch.name);
  });
}

function clearMarkers() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}
