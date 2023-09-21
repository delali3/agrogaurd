const userModel = require('../models/user.model');
const axios = require('axios');
const base64 = require('base-64');
require('dotenv').config();

const weatherAPIKey = process.env.weatherAPIKey;
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
const serviceId = process.env.serviceId;
const templateId = process.env.templateId;
const userId = process.env.userId;

class WeatherServices {
    static async registerUser(fullname, email, phone, city, password, lat, lon) {
        // Check if the phone number starts with '0' and is 10 characters long
        if (phone.startsWith('0') && phone.length === 10) {
            // Format the phone number with '233' country code and remove the leading '0'
            phone = `233${phone.substring(1)}`;
        }
    
        const createNote = new userModel({ fullname, email, phone, city, password, lat, lon });
        this.sendEmail(fullname, email);
        return await createNote.save();
    }    

    static async fetchWeatherForUsers() {

        try {
            // Retrieve user data from the database (assuming you have a method for this)
            const users = await userModel.find();

            // Iterate through user data
            for (const user of users) {
                const { phone, lat, lon } = user; // Get lat and lon for each user

                // Construct the API URL
                const apiUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherAPIKey}`;

                // Make an API request to fetch weather data
                const response = await axios.get(apiUrl);

                // Handle the API response data (weather information)
                const weatherData = response.data;

                // Extract and display specific weather details
                const { main, description } = weatherData.weather[0]; // Weather main and description
                const { temp, temp_min, temp_max, pressure, humidity } = weatherData.main; // Temperature, pressure, and humidity
                const { speed: windspeed } = weatherData.wind; // Wind speed

                const userWeatherData = `
                Hello ${user.fullname},\n
                WEATHER REPORT FROM AGROGUARD\n\n
                ${main}, ${description}\n
                Temperature is currently at ${temp} °C.\n
                Min Temperature is: ${temp_min}°C\n
                Max temperature is :${temp_max}°C\n
                Wind Speed is:${windspeed}\n
                Pressure is: ${pressure} hPa\n
                Humidity is: ${humidity}%\n\n
                Thank You
                `;

                console.log(`Weather details for ${user.fullname}:`);
                console.log(userWeatherData);

                // Call the sendSMS function using 'this'
                this.sendSMS(phone, userWeatherData);
            }
        } catch (error) {
            // Handle any errors that occur during database retrieval or API requests
            console.error(error);
        }
    }

    // Define sendSMS as a static function
    static async sendSMS(phone, weatherData) {
        const from = '+15412830191'; // Your Twilio phone number
        const to = `+${phone}`;
        const body = weatherData;

        const messageApi = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const auth = base64.encode(`${accountSid}:${authToken}`);

        const headers = {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        };

        const requestBody = {
            'From': from,
            'To': to,
            'Body': body,
        };

        try {
            const response = await axios.post(messageApi, null, {
                headers: headers,
                params: requestBody,
            });

            if (response.status === 201) {
                // Successful request
                const responseBody = response.data;
                const sid = responseBody.sid;
                console.log(`SMS sent successfully. SID: ${sid}`);
            } else {
                // Error in request
                console.error(`Request failed with status: ${response.status}.`);
                console.error(response.data);
            }
        } catch (error) {
            // Exception occurred
            console.error('Exception:', error);
        }
    }

    static async sendEmail(name, email) {
        const url = 'https://api.emailjs.com/api/v1.0/email/send';
    
        try {
            const response = await axios.post(url, {
                service_id: serviceId,
                template_id: templateId,
                user_id: userId,
                template_params: {
                    to_email: email,
                    from_name: 'AgroGuard Weather',
                    to_name: name,
                    reply_to: 'agroguard@gmail.com',
                    subject: 'AgroGuard Weather',
                    message: '\nREGISTRATION SUCCESSFUL\n\n Thank you for registering for our service.\n You will receive daily weather updates from us via SMS on your registered number. To unsubscribe from our service, visit our website. \n\nAgroGuard Weather',
                },
            }, {
                headers: {
                    'origin': 'http://localhost',
                    'Content-Type': 'application/json',
                },
            });
    
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    
}

module.exports = WeatherServices;