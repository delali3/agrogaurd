const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb://localhost:27017/weatherApp').on('open', ()=>{
    console.log("Database connected successfully");
}).on('error', ()=>{
    console.log("Error connecting to database");
});

module.exports = connection;