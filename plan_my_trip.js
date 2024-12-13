let fromCoords = null;
let toCoords = null;

function createMap() {
    const route_map = L.map('map').setView([38.9897, -76.9378], 13);  // Initialize the map with coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(route_map);  // Add the tile layer to the map

    return route_map;  // Return the map object
}

function geocodeLocation(location, type) {
    // OpenStreetMap API for geocoding
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;

    // Fetching response from API, parsing the coordinates into a float
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                if (type === "from") {
                    fromCoords = coords;
                } else {
                    toCoords = coords;
                }

                // Once both locations are geocoded, fetch bus routes
                if (fromCoords && toCoords) {
                    getBusRoutes(fromCoords, toCoords);  // Now we can proceed to get bus routes
                }
            } else {
                alert("Location not found.");
            }
        })
        .catch(error => {
            console.error("Geocoding error:", error);
            alert("Unable to geocode location.");
        });
}

function getBusRoutes(fromCoords, toCoords) {
    const fromLat = fromCoords.lat;
    const fromLon = fromCoords.lon;
    const toLat = toCoords.lat;
    const toLon = toCoords.lon;

    // Now you can use both fromCoords and toCoords to get the bus routes.
    const url = `https://api.wmata.com/Bus.svc/json/jBusPositions?Lat=${fromLat}&Lon=${fromLon}&Radius=5000`;

    fetch(url, {
        method: 'GET',
        headers: {
            'api_key': 'ff1282b4e3ea4a70874cf83bf6510a26'  // Your API key
        }
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response (data) here
        displayBusRoutesOnMap(data);  // Pass the bus data to display on the map
    })
    .catch(error => {
        console.error('Error fetching bus routes:', error);
        alert('Unable to retrieve bus routes.');
    });
}

function displayBusRoutesOnMap(data) {
    // Clear any previous markers on the map
    routeMap.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            routeMap.removeLayer(layer);
        }
    });

    if (data.BusPositions && data.BusPositions.length > 0) {
        // Loop through the bus positions and add markers to the map
        data.BusPositions.forEach(bus => {
            const busLat = bus.Lat;
            const busLon = bus.Lon;

            // Add a marker for each bus position
            const marker = L.marker([busLat, busLon])
                .addTo(routeMap)
                .bindPopup(`<strong>Route:</strong> ${bus.RouteID}<br><strong>Distance:</strong> ${bus.Distance} meters`);

            // Optionally, center the map on the first bus location
            if (data.BusPositions[0] === bus) {
                routeMap.setView([busLat, busLon], 13);
            }
        });
    } else {
        alert('No bus positions found.');
    }
}

window.onload = () => {
    routeMap = createMap();  // Initialize the map when the window loads
};

// Form submission handling (to trigger geocoding)
document.getElementById('route_form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fromLocation = document.getElementById('from').value;
    const toLocation = document.getElementById('to').value;

    // Geocode the locations and fetch bus routes
    geocodeLocation(fromLocation, 'from');
    geocodeLocation(toLocation, 'to');
});


