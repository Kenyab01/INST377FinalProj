async function backend_favorites() {
    const express = require('express');
    const bodyParser = require('body-parser');

    const app = express();
    const PORT = 3000;

    // Middleware to parse JSON data
    app.use(bodyParser.json());

    // Array to store favorite bus routes
    let favoriteRoutes = [];

    // Route to add a favorite bus route
    app.post('/api/favorite-routes', (req, res) => {
        const { routeId } = req.body;

        if (!routeId) {
            return res.status(400).json({ error: 'Route ID is required' });
        }

        // Add the route ID to the array if it doesn't already exist
        if (!favoriteRoutes.includes(routeId)) {
            favoriteRoutes.push(routeId);

            return res.status(201).json({ message: 'Route added successfully', favoriteRoutes });
        } else {
            return res.status(400).json({ error: 'Route ID already exists in favorites' });
        }
    });

    // Route to get all favorite bus routes
    app.get('/api/favorite-routes', (req, res) => {
        res.status(200).json({ favoriteRoutes });
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}