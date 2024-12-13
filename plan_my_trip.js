function createMap() {
    const route_map = L.map('map').setView([38.9897, -76.9378], 13);  // Initialize the map with coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(route_map);  // Add the tile layer to the map

    return route_map;  // Return the map object
}

function geocoding() {
    
}



window.onload = () => {
    createMap();  // Call the createMap function when the window finishes loading
};

