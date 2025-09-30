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
const jokeObject = {
    categories: [],
    jokeData: null,
    error: null
}

// Define asynchronous block
async function initializeApp() {
    try {

        // Try to get the joke categories from axios and save them in an array
        const response = await axios.get('https://v2.jokeapi.dev/categories');
        jokeObject.categories = response.data.categories

        // Define get route
        app.get('/', (req, res) => {
            
            // Pass categories to view
            res.render('index.ejs')
        })

        // Define get joke route
        app.get('/get-joke', (req, res) => {

            res.render('get-joke.ejs', {jokeObject: jokeObject})

        })

        // Define post route
        app.post('/submit', async (req, res) => {
            try {

                // Get the category
                let category = req.body.category;

                // If category exists
                if (category) {

                    // Send category and get response
                    const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`)
                    jokeObject.jokeData = response.data
                }

                // Otherwise
                else {

                    // Get any joke
                    const response = await axios.get(`https://v2.jokeapi.dev/joke/Any`)
                    jokeObject.jokeData = response.data
                }

                // Log joke to server console
                console.log(jokeObject.jokeData);

                // Rerender the get-joke template with the new joke data
                res.render('get-joke.ejs', {jokeObject: jokeObject})

            }
            // catch any errors
            catch (error) {

                // Log the error to the server's console
                console.log("An error occured in the post route: ", error)
                jokeObject.error = error

                // Render the error on the client side
                res.render('get-joke.ejs', {jokeObject: jokeObject})
            }
        })

        // Start the app
        app.listen(port, () => {
            console.log(`Listening on port ${port}.`)
        }) 


    }

    // Handle errors for the asynchronous function
    catch (error) {
        // Log the error
        console.log(`Error occured: ${error}`)
    }
}

initializeApp();