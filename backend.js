const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const app = express();
const PORT = 3000;
//initiating CORs
app.use(cors());
app.use(bodyParser.json());
//intiating the array to add favourotes
let favoriteRoutes = [];
app.post('/api/favorite-routes', (req, res) => {
    const { routeId } = req.body;
    //if there is no id to add then it shows error
    if (!routeId) {
        return res.status(400).json({ error: 'Route ID is required' });
    }
    //adding route or displaying that it exists 
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
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://kloerfvlaiaojwromhti.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsb2VyZnZsYWlhb2p3cm9taHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMjYzMDYsImV4cCI6MjA0OTkwMjMwNn0.HtF7d90nONd8WWZyGiyNRZM-2VsM5esVvUeHm3Dxwkw";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function addFavoriteRoutes() {
  for (const routeId of favoriteRoutes) {
    const { data, error } = await supabase
      .from("favorite_routes")
      .insert([{ route_id: routeId }]);

    if (error) {
      console.error("Error inserting favorite route:", error);
    } else {
      console.log("Inserted favorite route:", data);
    }
  }
}

addFavoriteRoutes();



