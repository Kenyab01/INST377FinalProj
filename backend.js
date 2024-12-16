const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 

const app = express();
const PORT = 3000;

app.use(cors());

app.use(bodyParser.json());


let favoriteRoutes = [];


app.post('/api/favorite-routes', (req, res) => {
    const { routeId } = req.body;

    if (!routeId) {
        return res.status(400).json({ error: 'Route ID is required' });
    }


    if (!favoriteRoutes.includes(routeId)) {
        favoriteRoutes.push(routeId);
        return res.status(201).json({ 
            message: 'Route added successfully', 
            favoriteRoutes 
        });
    } else {
        return res.status(200).json({ 
            message: 'Route already exists in favorites', 
            favoriteRoutes 
        });
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
