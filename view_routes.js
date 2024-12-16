const ROUTE_API = "https://api.wmata.com/Bus.svc/json/jRoutes";
const BACKEND_API = "http://localhost:3000/api/favorite-routes";

document.addEventListener("DOMContentLoaded", () => {
    const routeDropdown = document.getElementById("route-dropdown");
    const routeID = document.getElementById("route-ID");
    const routeName = document.getElementById("route-name");
    const lineDescription = document.getElementById("line-description");
    const saveForm = document.getElementById("save-to-favorites-form");
    const favoritesContainer = document.getElementById("favorites-container");

    let allRoutes = [];
    let selectedRoute = null;

    // Fetch and populate WMATA routes
    fetch(ROUTE_API, {
        method: 'GET',
        headers: { 'api_key': 'ff1282b4e3ea4a70874cf83bf6510a26' }
    })
    .then((response) => response.json())
    .then((data) => {
        if (data.Routes && data.Routes.length > 0) {
            allRoutes = data.Routes;
            populateDropdown(allRoutes);
        } else {
            alert("No routes found.");
        }
    })
    .catch((error) => console.error("Error fetching routes:", error));

    // Populate dropdown with route names
    function populateDropdown(routes) {
        routes.forEach((route) => {
            const option = document.createElement("option");
            option.value = route.RouteID;
            option.textContent = route.Name;
            routeDropdown.appendChild(option);
        });
    }

    // Display route details on selection
    routeDropdown.addEventListener("change", () => {
        const selectedRouteID = routeDropdown.value;
        selectedRoute = allRoutes.find(route => route.RouteID === selectedRouteID);

        if (selectedRoute) {
            routeID.textContent = `Route ID: ${selectedRoute.RouteID}`;
            routeName.textContent = selectedRoute.Name;
            lineDescription.textContent = selectedRoute.LineDescription || "No description available.";
            document.getElementById("route-info").style.display = "block";
        }
    });

    // Save selected route to favorites via the form
    saveForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!selectedRoute) {
            alert("Please select a route first.");
            return;
        }

        fetch(BACKEND_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ routeId: selectedRoute.RouteID })
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                alert(data.error);
            } else {
                alert(`Route "${selectedRoute.Name}" added to favorites!`);
                fetchFavorites();
            }
        })
        .catch((error) => console.error("Error saving to favorites:", error));
    });

    // Fetch and display favorite routes
    function fetchFavorites() {
        fetch(BACKEND_API)
            .then((response) => response.json())
            .then((data) => {
                favoritesContainer.innerHTML = ""; // Clear current list
                if (data.favoriteRoutes.length === 0) {
                    favoritesContainer.textContent = "No favorite routes saved yet.";
                    return;
                }

                data.favoriteRoutes.forEach(routeId => {
                    const route = allRoutes.find(r => r.RouteID === routeId);
                    const favoriteItem = document.createElement("div");
                    favoriteItem.classList.add("favorite-item");
                    favoriteItem.textContent = route ? `${route.Name} (ID: ${route.RouteID})` : `Route ID: ${routeId}`;
                    favoritesContainer.appendChild(favoriteItem);
                });
            })
            .catch((error) => console.error("Error fetching favorites:", error));
    }

    // Load favorites on page load
    fetchFavorites();
    
});
