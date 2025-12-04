// Create a new router
const express = require("express")
const router = express.Router()
const request = require('request')

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
});

router.get('/about',function(req, res, next){
    res.render('about.ejs')
});

router.get('/users', (req, res) => {
    // Send a 301 (Permanent) or 302 (Temporary) redirect status.
    // 302/307 (Temporary) is generally safer unless you are certain
    // the '/users' path will never be used again.
    res.redirect(302, '/');
});

router.get('/weather', (req, res) => {
        const getFormHtml = (weatherMessage = '') => `
    <!DOCTYPE html>
  <html>
  <head>
    <title>Dynamic Weather App</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f0f4f8; /* Light blue-gray background */
        color: #333;
        margin: 40px;
        text-align: center;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 30px;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
      h2 {
        color: #007bff; /* Blue heading color */
        font-size: 2em;
        margin-bottom: 25px;
      }
      form {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 30px;
      }
      input[type="text"] {
        padding: 10px 15px;
        border: 2px solid #ccc;
        border-radius: 6px;
        font-size: 1.1em;
        width: 60%;
        transition: border-color 0.3s;
      }
      input[type="text"]:focus {
        border-color: #007bff;
        outline: none;
      }
      button {
        padding: 10px 20px;
        background-color: #28a745; /* Green button */
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 1.1em;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      button:hover {
        background-color: #1e7e34;
      }
      .weather-info {
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        background-color: #e9ecef; /* Light gray info box */
        text-align: left;
        line-height: 1.6;
        font-size: 1.1em;
      }
      .weather-info strong {
        color: #007bff;
        font-weight: 600;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Dynamic Weather Reporter</h2>
      <form method="POST" action="/weather">
        <input type="text" id="city" name="city" placeholder="Enter City Name (e.g., London)" required>
        <button type="submit">Get Weather</button>
      </form>
      
      ${weatherMessage ? `<div class="weather-info">${weatherMessage}</div>` : '<p>Enter a city name above to view current weather conditions.</p>'}
    </div>
  </body>
  </html>
    `;

    res.send(getFormHtml());
});

router.post('/weather', (req, res, next) => {
    // It's better practice to define apiKey as a const outside the route handler
    // but keeping it here for continuity.
    let apiKey = '5a44c9e82f8328b252a74f74c488f65f'; 
    const city = req.body.city;
    
    // Ensure you use the same path the form posts to.
    // NOTE: Based on your previous setup, the path should likely be just '/' 
    // if it's mounted via app.use('/weather', weatherRoutes). 
    // I will use '/weather' as you wrote it here, but verify your app.use setup.

    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
                        
    request(url, function (err, response, body) {
        if(err){
            // Pass the error to the Express error handler
            return next(err); 
        } 
        
        try {
            var weather = JSON.parse(body);
        } catch (e) {
            // Handle JSON parsing error if body is empty or invalid
            const errorMsg = 'Error: Received invalid data from the weather service.';
            return res.status(500).send(errorMsg);
        }

        if (weather.cod === '404') {
            // Handle "city not found" error from the API
            const notFoundMsg = `City **${city}** not found. Please check the spelling.`;
            return res.send(notFoundMsg);

        } else if (weather.main) {
            // SUCCESS: Construct the detailed and styled weather message
            const wmsg = `
                The current weather in **${weather.name}** is:
                <br>
                <br>**Temperature:** ${weather.main.temp}°C
                <br>**Humidity:** ${weather.main.humidity}%
                <br> **Wind Speed:** ${weather.wind.speed} m/s
                <br>**Description:** ${weather.weather[0].description.charAt(0).toUpperCase() + weather.weather[0].description.slice(1)}
            `;
            
            // Send the response using the styled HTML wrapper
            return res.send(wmsg);

        } else {
            // Handle other unexpected errors
            const unknownErrorMsg = 'An unexpected error occurred while processing weather data.';
            return res.status(500).send(unknownErrorMsg);
        }
    });
});

// Export the router object so index.js can access it
module.exports = router