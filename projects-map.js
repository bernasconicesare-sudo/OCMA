const projectPlaces = [
  {
    id: "001",
    name: "Tunis",
    subtitle: "Medina of Tunis",
    lat: 36.8065,
    lng: 10.1815,
    type: "Urban heritage / Conservation"
  }
];

const mapElement = document.getElementById("projects-map");
const countElement = document.getElementById("project-count");

if (mapElement && window.L) {
  const map = L.map("projects-map", {
    zoomControl: true,
    scrollWheelZoom: true,
    minZoom: 3,
    maxZoom: 18,
    worldCopyJump: false
  });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Mediterranean framing with Tunis as the current observed project.
  map.fitBounds([
    [29.5, -10.0],
    [47.8, 42.0]
  ], {
    padding: [20, 20]
  });

  projectPlaces.forEach((place, index) => {
    const delay = 220 + index * 220;

    const icon = L.divIcon({
      className: "ocma-map-icon",
      html: `<div class="ocma-pin" style="--pin-delay:${delay}ms"></div>`,
      iconSize: [22, 30],
      iconAnchor: [11, 27],
      popupAnchor: [0, -25]
    });

    const popup = `
      <span class="project-popup-index">${place.id}</span>
      <strong class="project-popup-title">${place.name}</strong>
      <span class="project-popup-subtitle">${place.subtitle}</span>
      <span class="project-popup-type">${place.type}</span>
    `;

    L.marker([place.lat, place.lng], {
      icon,
      keyboard: true,
      title: place.name
    })
      .addTo(map)
      .bindPopup(popup, {
        closeButton: false,
        offset: [0, -2]
      });
  });

  countElement.textContent = "00";

  window.setTimeout(() => {
    countElement.textContent = "01";
  }, 620);
}
