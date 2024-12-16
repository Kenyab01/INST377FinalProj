let CurrCoords = null;
let routeMap = null;  // Declare routeMap globally

// Function to create the map
function createMap() {
    routeMap = L.map('map').setView([38.9897, -76.9378], 13);  // Initialize the map with coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(routeMap);  // Add the tile layer to the map

    return routeMap;  // Return the map object
}

// Function to geocode locations (get latitude and longitude)
function geocodeLocation(location, type) {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json`;

    // Fetching response from API, parsing the coordinates into a float
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const coords = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
                if (type === "CurrLocation") {
                    CurrCoords = coords;

                    // Once both locations are geocoded, fetch bus routes
                    if (CurrCoords) {
                        getBusRoutes(CurrCoords);  // Proceed to get bus routes
                    }
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

// Function to fetch bus routes based on the current coordinates
function getBusRoutes(CurrCoords) {
    const CurrLocLat = CurrCoords.lat;
    const CurrLocLon = CurrCoords.lon;

    // Call the WMATA API to fetch nearby bus positions
    const url = `https://api.wmata.com/Bus.svc/json/jBusPositions?Lat=${CurrLocLat}&Lon=${CurrLocLon}&Radius=5000`;

    fetch(url, {
        method: 'GET',
        headers: {
            'api_key': 'ff1282b4e3ea4a70874cf83bf6510a26'  // Replace with your WMATA API key
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

// Function to display bus routes and markers on the map
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

            // Calculate the distance from the current location to the bus
            const currentDistance = calculateDistance(busLat, busLon, CurrCoords.lat, CurrCoords.lon);
            if(CurrCoords) { 
                L.marker([CurrCoords.lat, CurrCoords.lon], { 
                    icon: L.divIcon({ 
                        className: 'leaflet-div-icon', html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%;"></div>' }) 
                    }) 
                    .addTo(routeMap) 
                    .bindPopup("Current Location"); }


            // Add a marker for each bus position
            const marker = L.marker([busLat, busLon])
                .addTo(routeMap)
                .bindPopup(`<strong>Route:</strong> ${bus.RouteID}<br><strong>Distance:</strong> ${currentDistance} meters`);

            // Optionally, center the map on the first bus location
            if (data.BusPositions[0] === bus) {
                routeMap.setView([busLat, busLon], 13);
            }
        });
    } else {
        alert('No bus positions found.');
    }
}

// Function to calculate the distance between two geographical points (in meters)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;  // Radius of Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;  // Return distance in meters
}

// Form submission handler to get location and fetch bus routes
function handleFormSubmit(event) {
    event.preventDefault();  // Prevent form from refreshing the page

    const location = document.getElementById('CurrLocation').value;
    if (location) {
        geocodeLocation(location, "CurrLocation");
    } else {
        alert("Please enter a valid location.");
    }
}

// Initialize the map and set up form submission handler when the page loads
window.onload = () => {
    routeMap = createMap();  // Initialize the map
    const routeForm = document.getElementById('route_form');
    routeForm.addEventListener('submit', handleFormSubmit);  // Attach the form submission handler
};
