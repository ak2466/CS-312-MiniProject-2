// Import modules
import express from "express";
import axios from "axios";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create app
const app = express();
const port = 3000;

// Define view engine and views dir
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Add middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('static'))
app.use(express.json());

// Define array for joke categories
let categories = []

// Define asynchronous block
async function initializeApp() {
    try {

        // Try to get the joke categories from axios and save them in an array
        const response = await axios.get('https://v2.jokeapi.dev/categories');
        categories = response.data.categories

        // Define get route
        app.get('/', (req, res) => {
            
            // Pass categories to view
            res.render('index.ejs', {jokeCategories: categories})
        })

        // Start the app
        app.listen(port, () => {
            console.log(`Listening on port ${port}.`)
        }) 


    }
    catch (error) {
        // Log the error
        console.log(`Error occured: ${error}`)
    }
}

initializeApp();

app.post('/submit', (req, res) => {

    // Get the category
    let category = req.body.category;
    
    // Redirect the user
    res.redirect('/');

    // Send the API request
})