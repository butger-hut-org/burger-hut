const ZOOM_LEVEL = 7;
const CENTER_ISRAEL_COORDINATES = [31.5461, 34.8516];
const OPENSTREETMAP_TILES_URL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const map = L.map("map").setView(CENTER_ISRAEL_COORDINATES, ZOOM_LEVEL);

$(document).ready(function () {
  L.tileLayer(OPENSTREETMAP_TILES_URL, { maxZoom: 19 }).addTo(map);
});

function addMarker(lat, lon, popupText) {
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(popupText);
}

// TODO: Remove branch when filtering
function markBranches(branchList) {
  branchList.map((branch) => {
    addMarker(branch.location.lat, branch.location.lon, branch.name);
  });
}

function clearMarkers() {
  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      map.removeLayer(layer);
    }
  });
}
