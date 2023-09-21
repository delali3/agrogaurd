const cron = require('node-cron');
const WeatherServices = require('../services/weatherApp.services');


// Schedule the function to run three times a day
// Replace '0 0 8,12,18 * * *' with the desired cron expression for your desired times
// In this example, it runs at 8 AM, 12 PM, and 6 PM every day.
cron.schedule('0 0 6,12,18 * * *', () => {
  WeatherServices.fetchWeatherForUsers();
});
