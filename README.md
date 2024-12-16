# TerraBus

### Description
TerraBus is a web-based bus tracker application designed to help users search for bus routes, track real-time bus locations, and save their favorite routes for easy access. The application aims to improve public transport navigation by offering a user-friendly interface and up-to-date bus position data.

### Target Browsers
The target browsers for TerraBus include individuals using both iOS and Android devices. However, for the best experience, we recommend using a laptop or computer. The application leverages real-time data, which is most effectively displayed on larger screens. The API used in the application, WMATA (Washington Metropolitan Area Transit Authority), provides bus and metro data for Washington D.C., so it is best suited for users located in or around the D.C. area.

## Developers Manual:

**How to install the application and all dependencies**

The application and dependencies can be installed after installing Node.js and npm into your terminal. The JS library used is **leaflet.js** to render interactive maps in the application. 

**How to run your application on a server**

To run TerraBus on a server, navigate to the directory containing **backend.js** and run backend.js. Next, use any static file server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to serve the front end. Alternatively, you can open the HTML files directly in your browser, but running it through a server is recommended for full API functionality. 

**How to run any tests you have written for your software**

To run ant tests for our software, use npm start within your terminal. 

**The API for our server application**

API endpoints used in our application include:
1. **WMATA API (External):**
   - https://api.wmata.com/Bus.svc/json/jRoutes
     - This fetches all available bus routes in the Washington D.C. area.
   - https://api.wmata.com/Bus.svc/json/jBusPositions?Lat={lat}&Lon={lon}&Radius=5000
     - This fetches real-time bus positions within a 5 km radius of a given latitude and longitude.
2. **Custom Backend API (Internal)**
   - /api/favorite-routes (POST)
     - This adds a bus route to the user's favorites.
   - /api/favorite-routes (GET)
     - This retrieves all saved favorite bus routes from the user's session.

**A clear set of expectations around known bugs and a road-map for future development**

Known Bugs
1. Location Geocoding: The current implementation uses the OpenStreetMap Nominatim API to geocode locations, which might occasionally fail for non-existent or misspelled locations, or if the API exceeds rate limits.
2. Real-Time Data: The WMATA API may sometimes return no data for bus positions, especially if there is an issue with the live tracking or if no buses are within the specified radius.
3. Favorites: The favorites list is stored temporarily in memory, meaning it is lost when the server is restarted. A more permanent solution, such as a database, would be ideal.

Future Development
1. Database Integration: Integrate a persistent database to store user favorites and preferences, ensuring data is saved between server restarts.
2. User Authentication: Add user authentication with session management to allow users to log in and manage their personal favorite routes.
