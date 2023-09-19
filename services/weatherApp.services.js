const userModel = require('../models/user.model');
const axios = require('axios');

class WeatherServices {
    static async registerUser(fullname, email, phone, city, password, lat, lon) {
        const createNote = new userModel({ fullname, email, phone, city, password, lat, lon });
        return await createNote.save();
    }

    static async fetchData(lat, lon) {
        const apiKey = '71b0c0d7621562e2ab11c753477bc756'; // Replace with your actual API key
        // const lat = 51.5074; // User's latitude (captured)
        // const lon = -0.1278; // User's longitude (captured)

        const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

        axios.get(apiUrl)
            .then((response) => {
                // Handle the API response data (weather information)
                const weatherData = response.data;
                // Process and display the weather data as needed
                console.log(weatherData);
            })
            .catch((error) => {
                // Handle API request errors
                console.error(error);
            });
    }
}

module.exports = WeatherServices;