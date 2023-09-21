const WeatherServices = require('../services/weatherApp.services');
const express = require('express');
const app = express();

// var lon;
// var lat;

module.exports = function(app){
   //render home page
   app.get('/', function(req, res){
    res.render('register');
});

app.post('/register', async function(req, res){
    try {
        const { fullname, email, phone, city, password, lat, lon} = req.body;
        
        // Now you can use these variables to register the user
        let user = await WeatherServices.registerUser(fullname, email, phone, city, password, lat, lon);

        res.redirect('/thankyou');
    } catch (error) {
        console.log(error);
    }
});

app.get('/thankyou', function(req, res){
    res.render('thankyou');
});

app.get('/fetch', function(req, res){
    data = WeatherServices.fetchWeatherForUsers();
    res.render('register');
});

// Handling non matching request from the client
// app.use((req, res, next) => {
//     res.status(404).render(
//         '404')
// })

}

