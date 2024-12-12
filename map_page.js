function createMap() {
    const route_map = L.map('map').setView([38.9897, -76.9378], 13);  // Initialize the map with coordinates and zoom level
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(route_map);  // Add the tile layer to the map

    return route_map;  // Return the map object
}

function bus_stops(){
    const api_url = 'http://api.wmata.com/Bus.svc/json/jRoutes';
    const api_key = ff1282b4e3ea4a70874cf83bf6510a26;

    fetch(api_url, {
        method: 'GET',
        headers: {
            'api_key': api_key
        }
    })
    .then (response => response.json())
    .then(data => {
        console.log(data)
    }
    
    if(data.Stops){
        data.Stops.forEach(bus => {
            const stop_location = [Stops.Lat, Stops.Lon]
            bus_routes(stop_location);            
        });
    } else {
        console.error('route not found');
}
})
.catch(error)

window.onload = () => {
    createMap();  // Call the createMap function when the window finishes loading
};

