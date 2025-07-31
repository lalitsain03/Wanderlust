// map.js

const mapContainer = document.getElementById('map');

if (mapContainer) {
    const coordinates = JSON.parse(mapContainer.dataset.coordinates);
    const title = mapContainer.dataset.title;
    const location = mapContainer.dataset.location;

    const map = L.map('map').setView([coordinates[1], coordinates[0]], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);

    L.marker([coordinates[1], coordinates[0]])
        .addTo(map)
        .bindPopup(`<b>${title}</b><br>${location}`)
        .openPopup();
}

