function createMap() {
    const route_map = L.map('map').setView([38.9897, -76.9378], 13);  // Initialize the map with coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(route_map);  // Add the tile layer to the map

    return route_map;  // Return the map object
}



function geocodeLocation(location, type) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;

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
                    getBusRoutes(fromCoords);
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
function getBusRoutes(fromCoords) {
    const fromLat = fromCoords.lat;
    const fromLon = fromCoords.lon;

    console.log("Fetching bus positions for coordinates:", fromLat, fromLon);

    // Construct the API URL for bus positions (using RouteID 70 as an example)
    const url = `https://api.wmata.com/Bus.svc/json/jBusPositions?RouteID=70&Lat=${fromLat}&Lon=${fromLon}&Radius=5000`;

    fetch(url, {
        method: 'GET',
        headers: {
            'api_key': 'YOUR_API_KEY'  // Replace with your actual WMATA API key
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data && data.BusPositions) {
            displayBusPositions(data.BusPositions);
        } else {
            console.log("No bus positions found.");
            alert("No buses found near the location.");
        }
    })
    .catch(error => {
        console.error('Error fetching bus positions:', error);
        alert('Unable to retrieve bus positions.');
    });
}



window.onload = () => {
    createMap();  // Call the createMap function when the window finishes loading
};

