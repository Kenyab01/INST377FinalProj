const ROUTE_API = "https://api.wmata.com/Bus.svc/json/jRoutes";

document.addEventListener("DOMContentLoaded", () => {
    const buttonContainer = document.getElementById("route-buttons");
    const routeID = document.getElementById("route-ID");
    const routeName = document.getElementById("route-name");
    const lineDescription = document.getElementById("line-description");

    // Fetch the bus routes from the WMATA API
    fetch(ROUTE_API, {
        method: 'GET',
        headers: {
            'api_key': 'ff1282b4e3ea4a70874cf83bf6510a26'  // Replace with your actual WMATA API key
        }
    })
    .then((response) => response.json())  // Parse the response as JSON
    .then((ROUTEData) => {
        // Ensure that the data contains routes
        if (ROUTEData.Routes && ROUTEData.Routes.length > 0) {
            ROUTEData.Routes.forEach((route) => {
                const button = document.createElement("button");
                button.textContent = route.Name;  // Use the Name key for button text
                button.classList.add("route-button");
                button.setAttribute("aria-label", route.Name);

                // When a button is clicked, display the route information
                button.addEventListener("click", () => displayRouteInfo(route));
                buttonContainer.appendChild(button);
            });
        } else {
            alert('No routes found.');
        }
    })
    .catch((error) => {
        console.error('Error fetching route data:', error);
        alert('Unable to retrieve routes.');
    });

    // Function to Display Route Info
    function displayRouteInfo(route) {
        routeID.textContent = route.RouteID || "No route ID available";  // Show RouteID
        routeName.textContent = route.Name || "No name available";  // Show Route name
        lineDescription.textContent = route.LineDescription || "No description available.";  // Show Line description

        // Show the route info section
        const routeInfo = document.getElementById("route-info");
        routeInfo.style.display = "block";
    }
});






