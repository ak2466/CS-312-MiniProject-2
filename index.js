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
            res.render('index.ejs', {jokeCategories: categories, joke: null, error: null})
        })

        // Define post route
        app.post('/submit', async (req, res) => {
            try {

                // Get the category
                let category = req.body.category;

                const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`)
                const jokeData = response.data

                res.render('index.ejs', {jokeCategories: categories, joke: jokeData, error: null})

            }
            catch (error) {
                console.log("An error occured in the post route: ", error)
                res.render('index.ejs', {jokeCategories: categories, joke: null, error: error})
            }
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